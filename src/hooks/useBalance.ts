import { useState, useEffect } from 'react';
import { BalanceRegistrationData, BalanceRecord } from '../types';
import { BalanceService } from '../services/balanceService';

export const useBalance = (userId: string) => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<BalanceRegistrationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar balance actual
  const loadCurrentBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const balance = await BalanceService.getCurrentBalance(userId);
      setCurrentBalance(balance);
    } catch (err) {
      setError('Error al cargar el balance actual');
      console.error('Error loading current balance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial de balance
  const loadBalanceHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await BalanceService.getBalanceHistory(userId);
      setBalanceHistory(history);
    } catch (err) {
      setError('Error al cargar el historial de balance');
      console.error('Error loading balance history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar nuevo registro de balance
  const saveBalanceRegistration = async (data: BalanceRegistrationData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result = await BalanceService.saveBalanceRegistration(userId, data);
      
      if (result.success) {
        // Actualizar el balance actual
        setCurrentBalance(data.currentAmount);
        // Recargar el historial
        await loadBalanceHistory();
        return true;
      } else {
        setError(result.error || 'Error al guardar el balance');
        return false;
      }
    } catch (err) {
      setError('Error al guardar el balance');
      console.error('Error saving balance registration:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadCurrentBalance();
    loadBalanceHistory();
  }, [userId]);

  return {
    currentBalance,
    balanceHistory,
    loading,
    error,
    loadCurrentBalance,
    loadBalanceHistory,
    saveBalanceRegistration,
  };
};
