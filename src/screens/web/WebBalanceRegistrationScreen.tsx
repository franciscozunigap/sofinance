import React, { useState, useEffect } from 'react';
import { X, DollarSign, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { BalanceRecord, BalanceCategory, BalanceRegistrationData } from '../../types';
import { BalanceService } from '../../services/balanceService';
import { formatChileanPeso } from '../../utils/currencyUtils';
import { useUser } from '../../contexts/UserContext';
import { useFinancialData } from '../../contexts/FinancialDataContext';

interface WebBalanceRegistrationScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  currentBalance?: number;
}

const WebBalanceRegistrationScreen: React.FC<WebBalanceRegistrationScreenProps> = ({
  isOpen,
  onClose,
  onComplete,
  currentBalance = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentAmount, setCurrentAmount] = useState('');
  const [records, setRecords] = useState<BalanceRecord[]>([]);
  const [amountError, setAmountError] = useState<string | undefined>();
  const [recordsError, setRecordsError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [recordTitle, setRecordTitle] = useState('');
  const { user } = useUser();
  const { registerBalance } = useFinancialData();

  // Calcular la diferencia
  const currentAmountNum = parseFloat(currentAmount) || 0;
  const difference = currentAmountNum - currentBalance;

  // Categorías disponibles
  const categories: { value: BalanceCategory; label: string; color: string; icon: string }[] = [
    { value: 'Ingreso', label: 'Ingreso', color: '#10b981', icon: '💰' },
    { value: 'Consumo', label: 'Consumo', color: '#f59e0b', icon: '🛒' },
    { value: 'Necesidad', label: 'Necesidades', color: '#ef4444', icon: '🏠' },
    { value: 'Inversión', label: 'Invertido', color: '#8b5cf6', icon: '📈' },
  ];

  // Resetear el estado cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCurrentAmount('');
      setRecords([]);
      setAmountError(undefined);
      setRecordsError(undefined);
    }
  }, [isOpen]);

  const validateAmount = (): boolean => {
    const amount = parseFloat(currentAmount);
    if (!currentAmount || isNaN(amount) || amount < 0) {
      setAmountError('Ingresa un monto válido');
      return false;
    }
    setAmountError(undefined);
    return true;
  };

  const validateRecords = (): boolean => {
    const validation = BalanceService.validateRecords(records, difference);
    if (!validation.isValid) {
      setRecordsError(validation.error);
      return false;
    }
    setRecordsError(undefined);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateAmount()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateRecords()) {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Registrar cada transacción individualmente usando el hook
      for (const record of records) {
        const type = record.category === 'Ingreso' ? 'income' : 'expense';
        const success = await registerBalance(
          type,
          `Registro de ${record.category}`,
          typeof record.amount === 'string' ? parseFloat(record.amount) || 0 : record.amount,
          record.category
        );
        
        if (!success) {
          throw new Error('Error al registrar el balance');
        }
      }
      
      if (onComplete) {
        onComplete();
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar el registro:', error);
      alert('Error al guardar el registro. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const addRecord = () => {
    const newRecord: BalanceRecord = {
      id: Date.now().toString(),
      type: 'expense',
      description: '',
      amount: 0,
      category: categories[0].value,
    };
    setRecords([...records, newRecord]);
  };

  const updateRecord = (id: string, field: keyof BalanceRecord, value: any) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const removeRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Registro de Balance</h2>
            <p className="text-sm text-gray-500">
              {currentStep === 1 ? 'Paso 1 de 2: Monto actual' : 'Paso 2 de 2: Detalles del cambio'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full transition-colors p-2"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Cuál es tu balance actual?</h3>
                <p className="text-gray-600">Ingresa el monto que tienes actualmente en tu cuenta</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Balance actual
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      placeholder="0"
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none ${
                        amountError ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {amountError && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {amountError}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Balance anterior:</span>
                    <span className="font-semibold">{formatChileanPeso(currentBalance)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalla el cambio</h3>
                <p className="text-gray-600">
                  Explica cómo llegaste a este balance con registros específicos
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Registros</h4>
                  <button
                    onClick={addRecord}
                    className="flex items-center px-3 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </button>
                </div>

                {records.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay registros agregados</p>
                    <p className="text-sm">Haz clic en "Agregar" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records.map((record, index) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-gray-600">Registro {index + 1}</span>
                          <button
                            onClick={() => removeRecord(record.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Monto
                            </label>
                            <input
                              type="number"
                              value={record.amount || ''}
                              onChange={(e) => updateRecord(record.id, 'amount', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Categoría
                            </label>
                            <select
                              value={record.category}
                              onChange={(e) => {
                                updateRecord(record.id, 'category', e.target.value as BalanceCategory);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none text-sm"
                            >
                              {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                  {category.icon} {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recordsError && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {recordsError}
                  </p>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total registros:</span>
                    <span className="font-semibold">
                      {formatChileanPeso(BalanceService.calculateTotal(records))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Diferencia esperada:</span>
                    <span className="font-semibold">{formatChileanPeso(difference)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={currentStep === 1 ? onClose : () => setCurrentStep(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {currentStep === 1 ? 'Cancelar' : 'Atrás'}
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : currentStep === 1 ? (
                'Siguiente'
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Completar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebBalanceRegistrationScreen;
