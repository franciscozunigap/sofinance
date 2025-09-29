import { useState, useEffect, useCallback, useRef } from 'react';
import { BalanceRegistration, MonthlyStats } from '../types';
import { ImprovedBalanceService } from '../services/improvedBalanceService';

interface UseImprovedBalanceReturn {
  // Estados
  currentBalance: number;
  balanceHistory: BalanceRegistration[];
  monthlyStats: MonthlyStats | null;
  loading: boolean;
  error: string | null;
  
  // Funciones
  loadCurrentBalance: () => Promise<void>;
  loadBalanceHistory: (limit?: number) => Promise<void>;
  loadMonthlyStats: (month?: number, year?: number) => Promise<void>;
  registerBalance: (
    type: 'income' | 'expense' | 'adjustment',
    description: string,
    amount: number,
    category: string
  ) => Promise<boolean>;
  refreshData: () => Promise<void>;
  
  // Estadísticas
  summaryStats: {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    transactionCount: number;
  };
  
  // Suscripciones en tiempo real
  isSubscribed: boolean;
  subscribeToChanges: () => void;
  unsubscribeFromChanges: () => void;
}

/**
 * Hook mejorado para manejo de balance con:
 * - Transacciones atómicas
 * - Suscripciones en tiempo real
 * - Mejor manejo de errores
 * - Caché local
 * - Validaciones
 */
export const useImprovedBalance = (userId: string): UseImprovedBalanceReturn => {
  // Estados
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<BalanceRegistration[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryStats, setSummaryStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    transactionCount: 0,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Referencias para suscripciones
  const balanceUnsubscribeRef = useRef<(() => void) | null>(null);
  const historyUnsubscribeRef = useRef<(() => void) | null>(null);

  // Cargar balance actual
  const loadCurrentBalance = useCallback(async () => {
    if (!userId || userId === 'user-id') return;

    try {
      setLoading(true);
      setError(null);
      const balance = await ImprovedBalanceService.getCurrentBalance(userId);
      setCurrentBalance(balance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el balance actual';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar historial de balance
  const loadBalanceHistory = useCallback(async (limit: number = 50) => {
    if (!userId || userId === 'user-id') return;

    try {
      setLoading(true);
      setError(null);
      const history = await ImprovedBalanceService.getBalanceHistory(userId, limit);
      setBalanceHistory(history);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el historial de balance';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar estadísticas mensuales
  const loadMonthlyStats = useCallback(async (month?: number, year?: number) => {
    if (!userId || userId === 'user-id') return;

    try {
      setLoading(true);
      setError(null);
      
      const currentDate = new Date();
      const targetMonth = month || currentDate.getMonth() + 1;
      const targetYear = year || currentDate.getFullYear();
      
      const stats = await ImprovedBalanceService.getMonthlyStats(userId, targetMonth, targetYear);
      setMonthlyStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las estadísticas mensuales';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Registrar nuevo balance
  const registerBalance = useCallback(async (
    type: 'income' | 'expense' | 'adjustment',
    description: string,
    amount: number,
    category: string
  ): Promise<boolean> => {
    if (!userId || userId === 'user-id') return false;

    try {
      setLoading(true);
      setError(null);
      
      const result = await ImprovedBalanceService.registerBalance(
        userId,
        type,
        description,
        amount,
        category
      );
      
      if (result.success) {
        // Recargar datos después del registro exitoso
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
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar el balance';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadCurrentBalance, loadBalanceHistory, loadMonthlyStats]);

  // Refrescar todos los datos
  const refreshData = useCallback(async () => {
    if (!userId || userId === 'user-id') return;

    try {
      setError(null);
      await Promise.all([
        loadCurrentBalance(),
        loadBalanceHistory(),
        loadMonthlyStats()
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar los datos';
      setError(errorMessage);
    }
  }, [loadCurrentBalance, loadBalanceHistory, loadMonthlyStats]);

  // Cargar estadísticas de resumen
  const loadSummaryStats = useCallback(async () => {
    if (!userId || userId === 'user-id') return;

    try {
      const stats = await ImprovedBalanceService.getSummaryStats(userId);
      setSummaryStats(stats);
    } catch (err) {
    }
  }, [userId]);

  // Suscribirse a cambios en tiempo real
  const subscribeToChanges = useCallback(() => {
    if (!userId || userId === 'user-id' || isSubscribed) return;

    try {
      // Suscribirse a cambios en el balance
      const balanceUnsubscribe = ImprovedBalanceService.subscribeToBalanceChanges(
        userId,
        (balance) => {
          setCurrentBalance(balance);
        }
      );

      // Suscribirse a cambios en el historial
      const historyUnsubscribe = ImprovedBalanceService.subscribeToBalanceHistory(
        userId,
        (history) => {
          setBalanceHistory(history);
        }
      );

      balanceUnsubscribeRef.current = balanceUnsubscribe;
      historyUnsubscribeRef.current = historyUnsubscribe;
      setIsSubscribed(true);
    } catch (err) {
    }
  }, [userId, isSubscribed]);

  // Desuscribirse de cambios
  const unsubscribeFromChanges = useCallback(() => {
    if (balanceUnsubscribeRef.current) {
      balanceUnsubscribeRef.current();
      balanceUnsubscribeRef.current = null;
    }
    
    if (historyUnsubscribeRef.current) {
      historyUnsubscribeRef.current();
      historyUnsubscribeRef.current = null;
    }
    
    setIsSubscribed(false);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (userId && userId !== 'user-id') {
      loadCurrentBalance();
      loadBalanceHistory();
      loadMonthlyStats();
      loadSummaryStats();
    }
  }, [userId, loadCurrentBalance, loadBalanceHistory, loadMonthlyStats, loadSummaryStats]);

  // Limpiar suscripciones al desmontar
  useEffect(() => {
    return () => {
      unsubscribeFromChanges();
    };
  }, [unsubscribeFromChanges]);

  // Auto-suscribirse después de cargar datos iniciales
  useEffect(() => {
    if (userId && userId !== 'user-id' && !isSubscribed) {
      const timer = setTimeout(() => {
        subscribeToChanges();
      }, 1000); // Esperar 1 segundo para que se carguen los datos iniciales

      return () => clearTimeout(timer);
    }
  }, [userId, isSubscribed, subscribeToChanges]);

  return {
    // Estados
    currentBalance,
    balanceHistory,
    monthlyStats,
    loading,
    error,
    summaryStats,
    isSubscribed,
    
    // Funciones
    loadCurrentBalance,
    loadBalanceHistory,
    loadMonthlyStats,
    registerBalance,
    refreshData,
    
    // Suscripciones
    subscribeToChanges,
    unsubscribeFromChanges,
  };
};
