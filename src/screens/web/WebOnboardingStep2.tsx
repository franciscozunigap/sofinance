import React, { useState } from 'react';
import { ShoppingCart, Home as HomeIcon, PiggyBank, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { OnboardingData } from '../../types';

interface WebOnboardingStep2Props {
  data: Partial<OnboardingData>;
  onNext: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
}

const WebOnboardingStep2: React.FC<WebOnboardingStep2Props> = ({ data, onNext, onBack }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(data.monthlyIncome?.toString() || '');
  const [savingsPercentage, setSavingsPercentage] = useState(data.savingsPercentage?.toString() || '10');
  const [needsPercentage, setNeedsPercentage] = useState(data.needsPercentage?.toString() || '50');
  const [consumptionPercentage, setConsumptionPercentage] = useState(data.consumptionPercentage?.toString() || '30');
  const [investmentPercentage, setInvestmentPercentage] = useState(data.investmentPercentage?.toString() || '10');
  const [currentSavings, setCurrentSavings] = useState(data.currentSavings?.toString() || '');
  
  const [errors, setErrors] = useState<{ 
    monthlyIncome?: string; 
    savingsPercentage?: string; 
    needsPercentage?: string; 
    consumptionPercentage?: string; 
    investmentPercentage?: string;
    currentSavings?: string;
    percentages?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: { 
      monthlyIncome?: string; 
      savingsPercentage?: string; 
      needsPercentage?: string; 
      consumptionPercentage?: string; 
      investmentPercentage?: string;
      currentSavings?: string;
      percentages?: string;
    } = {};

    // Validar ingreso mensual
    if (!monthlyIncome.trim()) {
      newErrors.monthlyIncome = 'El ingreso mensual es requerido';
    } else {
      const income = parseFloat(monthlyIncome);
      if (isNaN(income) || income <= 0) {
        newErrors.monthlyIncome = 'Ingresa un monto válido';
      }
    }

    // Validar porcentajes
    const savings = parseFloat(savingsPercentage);
    const needs = parseFloat(needsPercentage);
    const consumption = parseFloat(consumptionPercentage);
    const investment = parseFloat(investmentPercentage);
    
    if (isNaN(savings) || savings < 0 || savings > 100) {
      newErrors.savingsPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(needs) || needs < 0 || needs > 100) {
      newErrors.needsPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(consumption) || consumption < 0 || consumption > 100) {
      newErrors.consumptionPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(investment) || investment < 0 || investment > 100) {
      newErrors.investmentPercentage = 'Porcentaje inválido (0-100)';
    }

    // Validar que los porcentajes sumen 100%
    const totalPercentage = savings + needs + consumption + investment;
    if (Math.abs(totalPercentage - 100) > 0.1) {
      newErrors.percentages = 'Los porcentajes deben sumar exactamente 100%';
    }

    // Validar monto actual
    if (!currentSavings.trim()) {
      newErrors.currentSavings = 'El monto actual es requerido';
    } else {
      const savings = parseFloat(currentSavings);
      if (isNaN(savings) || savings < 0) {
        newErrors.currentSavings = 'Ingresa un monto válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    onNext({
      monthlyIncome: parseFloat(monthlyIncome),
      savingsPercentage: parseFloat(savingsPercentage),
      needsPercentage: parseFloat(needsPercentage),
      consumptionPercentage: parseFloat(consumptionPercentage),
      investmentPercentage: parseFloat(investmentPercentage),
      currentSavings: parseFloat(currentSavings),
    });
  };

  const applyRecommendedPercentages = () => {
    setSavingsPercentage('10');
    setNeedsPercentage('50');
    setConsumptionPercentage('30');
    setInvestmentPercentage('10');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full space-y-8">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 border-2 border-blue-500">
              <span className="text-2xl font-bold text-blue-500">2</span>
            </div>
            <p className="text-gray-600">
              Ayúdanos a entender tu situación financiera actual
            </p>
          </div>

          {/* Form - Layout de 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda - Montos y Perfil */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                
                {/* Monto actual */}
                <div>
                  <label htmlFor="currentSavings" className="block text-sm font-medium text-gray-700 mb-2">
                    Monto actual (CLP)
                  </label>
                  <input
                    id="currentSavings"
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.currentSavings ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 500000"
                  />
                  {errors.currentSavings && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentSavings}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Columna Derecha - Sliders de Distribución */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribución de Gastos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ingresa tu total de ingreso y ajusta los porcentajes según tus prioridades financieras
                </p>
                
                {/* Ingreso mensual */}
                <div className="mb-6">
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
                    Total de ingreso mensual (CLP)
                  </label>
                  <input
                    id="monthlyIncome"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 800000"
                  />
                  {errors.monthlyIncome && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthlyIncome}</p>
                  )}
                </div>
                
                <button
                  onClick={applyRecommendedPercentages}
                  className="mb-4 bg-blue-100 text-blue-700 py-1 px-3 rounded-lg font-medium hover:bg-blue-200 transition-colors border border-blue-200 w-full text-[8px]"
                  style={{ width: '100%', minWidth: '120px' , bottom: '5px'}}
                >
                  Restablecer
                </button>

                <div className="space-y-8">
                  {/* Ahorro */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          <PiggyBank className="h-4 w-4 text-purple-600" />
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                          Ahorro
                        </label>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-purple-600">
                          {savingsPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(savingsPercentage) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={savingsPercentage}
                      onChange={(e) => setSavingsPercentage(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${savingsPercentage}%, #e5e7eb ${savingsPercentage}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Necesidades */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <HomeIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                          Necesidades
                        </label>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          {needsPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(needsPercentage) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={needsPercentage}
                      onChange={(e) => setNeedsPercentage(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${needsPercentage}%, #e5e7eb ${needsPercentage}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Consumo */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-orange-600" />
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                          Consumo
                        </label>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-orange-600">
                          {consumptionPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(consumptionPercentage) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={consumptionPercentage}
                      onChange={(e) => setConsumptionPercentage(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-orange"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${consumptionPercentage}%, #e5e7eb ${consumptionPercentage}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Inversión */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUpIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <label className="text-sm font-medium text-gray-700">
                          Inversión
                        </label>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {investmentPercentage}%
                        </div>
                        <div className="text-xs text-gray-500">
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(investmentPercentage) / 100).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={investmentPercentage}
                      onChange={(e) => setInvestmentPercentage(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${investmentPercentage}%, #e5e7eb ${investmentPercentage}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Indicador del total */}
                <div className="mt-6 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total:</span>
                    <span className={`text-lg font-bold ${
                      Math.abs(parseFloat(savingsPercentage) + parseFloat(needsPercentage) + parseFloat(consumptionPercentage) + parseFloat(investmentPercentage) - 100) < 0.1 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {Math.round(parseFloat(savingsPercentage) + parseFloat(needsPercentage) + parseFloat(consumptionPercentage) + parseFloat(investmentPercentage))}%
                    </span>
                  </div>
                </div>

                {errors.percentages && (
                  <p className="mt-2 text-sm text-red-600 text-center">{errors.percentages}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-8">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Atrás
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebOnboardingStep2;

// Estilos CSS para los sliders
const sliderStyles = `
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-purple::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-blue::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-orange::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-orange::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-green::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-green::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
`;

// Inyectar estilos en el head del documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}
