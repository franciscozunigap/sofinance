import { useState, useEffect, useCallback, useRef } from 'react';
import { BalanceRegistration, MonthlyStats } from '../types';
import { ImprovedBalanceService } from '../services/improvedBalanceService';
import { CacheService } from '../services/cacheService';
import { ErrorHandler } from '../services/errorHandler';
import { OfflineService } from '../services/offlineService';

interface UseOptimizedBalanceReturn {
  // Estados
  currentBalance: number;
  balanceHistory: BalanceRegistration[];
  monthlyStats: MonthlyStats | null;
  loading: boolean;
  error: string | null;
  
  // Funciones
  loadCurrentBalance: (forceRefresh?: boolean) => Promise<void>;
  loadBalanceHistory: (limit?: number, forceRefresh?: boolean) => Promise<void>;
  loadMonthlyStats: (month?: number, year?: number, forceRefresh?: boolean) => Promise<void>;
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
  
  // Caché y offline
  isOffline: boolean;
  lastSync: Date | null;
  pendingOperations: number;
  cacheStats: any;
}

/**
 * Hook optimizado para manejo de balance con:
 * - Caché inteligente
 * - Soporte offline
 * - Manejo de errores robusto
 * - Suscripciones en tiempo real
 * - Validaciones
 * - Retry automático
 */
export const useOptimizedBalance = (userId: string): UseOptimizedBalanceReturn => {
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
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingOperations, setPendingOperations] = useState(0);
  const [cacheStats, setCacheStats] = useState<any>(null);

  // Referencias para suscripciones
  const balanceUnsubscribeRef = useRef<(() => void) | null>(null);
  const historyUnsubscribeRef = useRef<(() => void) | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar estado offline
  const checkOfflineStatus = useCallback(async () => {
    try {
      const offlineData = await OfflineService.getOfflineData();
      setIsOffline(offlineData.pendingOperations.length > 0);
      setLastSync(offlineData.lastSync);
      setPendingOperations(offlineData.pendingOperations.length);
    } catch (error) {
      console.error('Error verificando estado offline:', error);
    }
  }, []);

  // Cargar balance actual con caché
  const loadCurrentBalance = useCallback(async (forceRefresh: boolean = false) => {
    if (!userId || userId === 'user-id') return;

    try {
      setLoading(true);
      setError(null);

      // Intentar obtener del caché primero
      if (!forceRefresh) {
        const cachedBalance = await CacheService.getBalance();
        if (cachedBalance !== null) {
          setCurrentBalance(cachedBalance);
          setLoading(false);
          return;
        }
      }

      // Cargar desde Firebase
      const balance = await ImprovedBalanceService.getCurrentBalance(userId);
      setCurrentBalance(balance);
      
      // Guardar en caché
      await CacheService.setBalance(balance);
      
      // Actualizar última sincronización
      await OfflineService.updateLastSync();
      
    } catch (err) {
      const errorInfo = ErrorHandler.handleError(err, 'loadCurrentBalance', userId);
      setError(errorInfo.userMessage);
      
      // Intentar obtener del caché offline
      const offlineData = await OfflineService.getOfflineData();
      if (offlineData.balance !== null) {
        setCurrentBalance(offlineData.balance);
      }
      
      console.error('Error loading current balance:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar historial con caché
  const loadBalanceHistory = useCallback(async (limit: number = 50, forceRefresh: boolean = false) => {
    if (!userId || userId === 'user-id') return;

    try {
      setLoading(true);
      setError(null);

      // Intentar obtener del caché primero
      if (!forceRefresh) {
        const cachedHistory = await CacheService.getHistory();
        if (cachedHistory !== null) {
          setBalanceHistory(cachedHistory);
          setLoading(false);
          return;
        }
      }

      // Cargar desde Firebase
      const history = await ImprovedBalanceService.getBalanceHistory(userId, limit);
      setBalanceHistory(history);
      
      // Guardar en caché
      await CacheService.setHistory(history);
      
    } catch (err) {
      const errorInfo = ErrorHandler.handleError(err, 'loadBalanceHistory', userId);
      setError(errorInfo.userMessage);
      
      // Intentar obtener del caché offline
      const offlineData = await OfflineService.getOfflineData();
      if (offlineData.history !== null) {
        setBalanceHistory(offlineData.history);
      }
      
      console.error('Error loading balance history:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar estadísticas mensuales con caché
  const loadMonthlyStats = useCallback(async (month?: number, year?: number, forceRefresh: boolean = false) => {
    if (!userId || userId === 'user-id') return;

    try {
      setLoading(true);
      setError(null);

      // Intentar obtener del caché primero
      if (!forceRefresh) {
        const cachedStats = await CacheService.getMonthlyStats();
        if (cachedStats !== null) {
          setMonthlyStats(cachedStats);
          setLoading(false);
          return;
        }
      }

      // Cargar desde Firebase
      const currentDate = new Date();
      const targetMonth = month || currentDate.getMonth() + 1;
      const targetYear = year || currentDate.getFullYear();
      
      const stats = await ImprovedBalanceService.getMonthlyStats(userId, targetMonth, targetYear);
      setMonthlyStats(stats);
      
      // Guardar en caché si existe
      if (stats) {
        await CacheService.setMonthlyStats(stats);
      }
      
    } catch (err) {
      const errorInfo = ErrorHandler.handleError(err, 'loadMonthlyStats', userId);
      setError(errorInfo.userMessage);
      
      // Intentar obtener del caché offline
      const offlineData = await OfflineService.getOfflineData();
      if (offlineData.stats !== null) {
        setMonthlyStats(offlineData.stats);
      }
      
      console.error('Error loading monthly stats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Registrar balance con manejo offline
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
        // Invalidar caché
        await CacheService.invalidateBalance();
        
        // Recargar datos
        await Promise.all([
          loadCurrentBalance(true),
          loadBalanceHistory(50, true),
          loadMonthlyStats(undefined, undefined, true)
        ]);
        
        // Actualizar última sincronización
        await OfflineService.updateLastSync();
        
        return true;
      } else {
        setError(result.error || 'Error al registrar el balance');
        return false;
      }
    } catch (err) {
      const errorInfo = ErrorHandler.handleError(err, 'registerBalance', userId);
      setError(errorInfo.userMessage);
      
      // Si es un error recuperable, guardar como operación pendiente
      if (errorInfo.shouldRetry) {
        await OfflineService.savePendingOperation({
          type: 'register_balance',
          data: { type, description, amount, category }
        });
        
        // Actualizar estado offline
        await checkOfflineStatus();
      }
      
      console.error('Error registering balance:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, loadCurrentBalance, loadBalanceHistory, loadMonthlyStats, checkOfflineStatus]);

  // Refrescar todos los datos
  const refreshData = useCallback(async () => {
    if (!userId || userId === 'user-id') return;

    try {
      setError(null);
      await Promise.all([
        loadCurrentBalance(true),
        loadBalanceHistory(50, true),
        loadMonthlyStats(undefined, undefined, true)
      ]);
      
      // Actualizar estadísticas de caché
      const stats = await CacheService.getStats();
      setCacheStats(stats);
      
    } catch (err) {
      const errorInfo = ErrorHandler.handleError(err, 'refreshData', userId);
      setError(errorInfo.userMessage);
      console.error('Error refreshing data:', err);
    }
  }, [loadCurrentBalance, loadBalanceHistory, loadMonthlyStats]);

  // Cargar estadísticas de resumen
  const loadSummaryStats = useCallback(async () => {
    if (!userId || userId === 'user-id') return;

    try {
      const stats = await ImprovedBalanceService.getSummaryStats(userId);
      setSummaryStats(stats);
      
      // Guardar en caché
      await CacheService.setSummaryStats(stats);
    } catch (err) {
      console.error('Error loading summary stats:', err);
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
          // Actualizar caché
          CacheService.setBalance(balance);
        }
      );

      // Suscribirse a cambios en el historial
      const historyUnsubscribe = ImprovedBalanceService.subscribeToBalanceHistory(
        userId,
        (history) => {
          setBalanceHistory(history);
          // Actualizar caché
          CacheService.setHistory(history);
        }
      );

      balanceUnsubscribeRef.current = balanceUnsubscribe;
      historyUnsubscribeRef.current = historyUnsubscribe;
      setIsSubscribed(true);
    } catch (err) {
      console.error('Error subscribing to changes:', err);
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

  // Procesar operaciones pendientes
  const processPendingOperations = useCallback(async () => {
    try {
      const pendingOps = await OfflineService.getPendingOperations();
      
      for (const operation of pendingOps) {
        try {
          if (operation.type === 'register_balance') {
            const result = await ImprovedBalanceService.registerBalance(
              userId,
              operation.data.type,
              operation.data.description,
              operation.data.amount,
              operation.data.category
            );
            
            if (result.success) {
              await OfflineService.removePendingOperation(operation.id);
            }
          }
        } catch (error) {
          console.error(`Error procesando operación pendiente ${operation.id}:`, error);
        }
      }
      
      // Actualizar estado offline
      await checkOfflineStatus();
    } catch (error) {
      console.error('Error procesando operaciones pendientes:', error);
    }
  }, [userId, checkOfflineStatus]);

  // Cargar datos iniciales
  useEffect(() => {
    if (userId && userId !== 'user-id') {
      loadCurrentBalance();
      loadBalanceHistory();
      loadMonthlyStats();
      loadSummaryStats();
      checkOfflineStatus();
    }
  }, [userId, loadCurrentBalance, loadBalanceHistory, loadMonthlyStats, loadSummaryStats, checkOfflineStatus]);

  // Limpiar suscripciones al desmontar
  useEffect(() => {
    return () => {
      unsubscribeFromChanges();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [unsubscribeFromChanges]);

  // Auto-suscribirse después de cargar datos iniciales
  useEffect(() => {
    if (userId && userId !== 'user-id' && !isSubscribed) {
      const timer = setTimeout(() => {
        subscribeToChanges();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [userId, isSubscribed, subscribeToChanges]);

  // Procesar operaciones pendientes periódicamente
  useEffect(() => {
    if (userId && userId !== 'user-id') {
      const interval = setInterval(() => {
        processPendingOperations();
      }, 30000); // Cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [userId, processPendingOperations]);

  // Actualizar estadísticas de caché periódicamente
  useEffect(() => {
    const updateCacheStats = async () => {
      const stats = await CacheService.getStats();
      setCacheStats(stats);
    };

    updateCacheStats();
    const interval = setInterval(updateCacheStats, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  return {
    // Estados
    currentBalance,
    balanceHistory,
    monthlyStats,
    loading,
    error,
    summaryStats,
    isSubscribed,
    isOffline,
    lastSync,
    pendingOperations,
    cacheStats,
    
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
