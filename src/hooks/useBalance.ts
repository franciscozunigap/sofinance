import { useState, useEffect } from 'react';
import { BalanceRegistration, MonthlyStats } from '../types';
import { BalanceService } from '../services/balanceService';

export const useBalance = (userId: string) => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<BalanceRegistration[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar balance actual
  const loadCurrentBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const balance = await BalanceService.getCurrentBalance(userId);
      console.log('=== DEBUG USE BALANCE ===');
      console.log('userId:', userId);
      console.log('balance obtenido de BalanceService:', balance);
      console.log('========================');
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

  // Cargar estadísticas del mes actual
  const loadMonthlyStats = async () => {
    try {
      console.log('loadMonthlyStats llamado para userId:', userId);
      setLoading(true);
      setError(null);
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      
      console.log('Obteniendo estadísticas para mes:', month, 'año:', year);
      const stats = await BalanceService.getMonthlyStats(userId, month, year);
      console.log('Estadísticas obtenidas:', stats);
      setMonthlyStats(stats);
    } catch (err) {
      setError('Error al cargar las estadísticas mensuales');
      console.error('Error loading monthly stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo balance
  const registerBalance = async (
    type: 'income' | 'expense' | 'adjustment',
    description: string,
    amount: number,
    category: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result = await BalanceService.registerBalance(userId, type, description, amount, category);
      
      if (result.success) {
        // Recargar todos los datos
        await Promise.all([
          loadCurrentBalance(),
          loadBalanceHistory(),
          loadMonthlyStats()
        ]);
        return true;
      } else {
        setError(result.error || 'Error al registrar el balance');
        return false;
      }
    } catch (err) {
      setError('Error al registrar el balance');
      console.error('Error registering balance:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales solo si el userId es válido
  useEffect(() => {
    if (userId && userId !== 'user-id') {
      loadCurrentBalance();
      loadBalanceHistory();
      loadMonthlyStats();
    }
  }, [userId]);

  return {
    currentBalance,
    balanceHistory,
    monthlyStats,
    loading,
    error,
    loadCurrentBalance,
    loadBalanceHistory,
    loadMonthlyStats,
    registerBalance,
  };
};
