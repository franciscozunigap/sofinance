import AsyncStorage from '@react-native-async-storage/async-storage';
import { BalanceRegistration, MonthlyStats } from '../types';

/**
 * Servicio para manejo offline con Firebase
 */
export class OfflineService {
  private static readonly STORAGE_KEYS = {
    PENDING_OPERATIONS: 'pending_operations',
    CACHED_BALANCE: 'cached_balance',
    CACHED_HISTORY: 'cached_history',
    CACHED_STATS: 'cached_stats',
    LAST_SYNC: 'last_sync',
  } as const;

  /**
   * Operaciones pendientes que se ejecutarán cuando se recupere la conexión
   */
  interface PendingOperation {
    id: string;
    type: 'register_balance' | 'update_balance' | 'delete_balance';
    data: any;
    timestamp: Date;
    retryCount: number;
  }

  /**
   * Guarda una operación pendiente
   */
  static async savePendingOperation(operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    try {
      const pendingOps = await this.getPendingOperations();
      const newOperation: PendingOperation = {
        ...operation,
        id: Date.now().toString(),
        timestamp: new Date(),
        retryCount: 0,
      };

      pendingOps.push(newOperation);
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.PENDING_OPERATIONS,
        JSON.stringify(pendingOps)
      );
    } catch (error) {
    }
  }

  /**
   * Obtiene operaciones pendientes
   */
  static async getPendingOperations(): Promise<PendingOperation[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEYS.PENDING_OPERATIONS);
      if (data) {
        const operations = JSON.parse(data);
        return operations.map((op: any) => ({
          ...op,
          timestamp: new Date(op.timestamp),
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Elimina una operación pendiente
   */
  static async removePendingOperation(operationId: string): Promise<void> {
    try {
      const pendingOps = await this.getPendingOperations();
      const filteredOps = pendingOps.filter(op => op.id !== operationId);
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.PENDING_OPERATIONS,
        JSON.stringify(filteredOps)
      );
    } catch (error) {
    }
  }

  /**
   * Limpia todas las operaciones pendientes
   */
  static async clearPendingOperations(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.PENDING_OPERATIONS);
    } catch (error) {
    }
  }

  /**
   * Guarda datos en caché
   */
  static async cacheData<T>(key: string, data: T): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
    }
  }

  /**
   * Obtiene datos del caché
   */
  static async getCachedData<T>(key: string, maxAgeMinutes: number = 30): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const cacheData = JSON.parse(data);
        const cacheTime = new Date(cacheData.timestamp);
        const now = new Date();
        const ageMinutes = (now.getTime() - cacheTime.getTime()) / (1000 * 60);

        if (ageMinutes <= maxAgeMinutes) {
          return cacheData.data;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Guarda balance en caché
   */
  static async cacheBalance(balance: number): Promise<void> {
    await this.cacheData(this.STORAGE_KEYS.CACHED_BALANCE, balance);
  }

  /**
   * Obtiene balance del caché
   */
  static async getCachedBalance(): Promise<number | null> {
    return await this.getCachedData<number>(this.STORAGE_KEYS.CACHED_BALANCE);
  }

  /**
   * Guarda historial en caché
   */
  static async cacheHistory(history: BalanceRegistration[]): Promise<void> {
    await this.cacheData(this.STORAGE_KEYS.CACHED_HISTORY, history);
  }

  /**
   * Obtiene historial del caché
   */
  static async getCachedHistory(): Promise<BalanceRegistration[] | null> {
    return await this.getCachedData<BalanceRegistration[]>(this.STORAGE_KEYS.CACHED_HISTORY);
  }

  /**
   * Guarda estadísticas en caché
   */
  static async cacheStats(stats: MonthlyStats): Promise<void> {
    await this.cacheData(this.STORAGE_KEYS.CACHED_STATS, stats);
  }

  /**
   * Obtiene estadísticas del caché
   */
  static async getCachedStats(): Promise<MonthlyStats | null> {
    return await this.getCachedData<MonthlyStats>(this.STORAGE_KEYS.CACHED_STATS);
  }

  /**
   * Actualiza timestamp de última sincronización
   */
  static async updateLastSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
    } catch (error) {
    }
  }

  /**
   * Obtiene timestamp de última sincronización
   */
  static async getLastSync(): Promise<Date | null> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEYS.LAST_SYNC);
      if (data) {
        return new Date(data);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica si los datos están desactualizados
   */
  static async isDataStale(maxAgeMinutes: number = 30): Promise<boolean> {
    const lastSync = await this.getLastSync();
    if (!lastSync) return true;

    const now = new Date();
    const ageMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60);
    return ageMinutes > maxAgeMinutes;
  }

  /**
   * Obtiene datos offline completos
   */
  static async getOfflineData(): Promise<{
    balance: number | null;
    history: BalanceRegistration[] | null;
    stats: MonthlyStats | null;
    pendingOperations: PendingOperation[];
    lastSync: Date | null;
  }> {
    const [balance, history, stats, pendingOps, lastSync] = await Promise.all([
      this.getCachedBalance(),
      this.getCachedHistory(),
      this.getCachedStats(),
      this.getPendingOperations(),
      this.getLastSync(),
    ]);

    return {
      balance,
      history,
      stats,
      pendingOperations: pendingOps,
      lastSync,
    };
  }

  /**
   * Limpia todos los datos de caché
   */
  static async clearAllCache(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(this.STORAGE_KEYS.CACHED_BALANCE),
        AsyncStorage.removeItem(this.STORAGE_KEYS.CACHED_HISTORY),
        AsyncStorage.removeItem(this.STORAGE_KEYS.CACHED_STATS),
        AsyncStorage.removeItem(this.STORAGE_KEYS.LAST_SYNC),
      ]);
    } catch (error) {
    }
  }

  /**
   * Obtiene estadísticas de uso offline
   */
  static async getOfflineStats(): Promise<{
    pendingOperationsCount: number;
    lastSyncTime: Date | null;
    isDataStale: boolean;
    cacheSize: number;
  }> {
    const [pendingOps, lastSync, isStale] = await Promise.all([
      this.getPendingOperations(),
      this.getLastSync(),
      this.isDataStale(),
    ]);

    // Calcular tamaño aproximado del caché
    let cacheSize = 0;
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        Object.values(this.STORAGE_KEYS).includes(key as any)
      );
      
      for (const key of cacheKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          cacheSize += data.length;
        }
      }
    } catch (error) {
    }

    return {
      pendingOperationsCount: pendingOps.length,
      lastSyncTime: lastSync,
      isDataStale: isStale,
      cacheSize,
    };
  }
}

/**
 * Hook para manejo offline
 */
export const useOfflineService = () => {
  const savePendingOperation = async (operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>) => {
    return await OfflineService.savePendingOperation(operation);
  };

  const getPendingOperations = async () => {
    return await OfflineService.getPendingOperations();
  };

  const clearPendingOperations = async () => {
    return await OfflineService.clearPendingOperations();
  };

  const cacheData = async <T>(key: string, data: T) => {
    return await OfflineService.cacheData(key, data);
  };

  const getCachedData = async <T>(key: string, maxAgeMinutes?: number) => {
    return await OfflineService.getCachedData<T>(key, maxAgeMinutes);
  };

  const getOfflineData = async () => {
    return await OfflineService.getOfflineData();
  };

  const getOfflineStats = async () => {
    return await OfflineService.getOfflineStats();
  };

  const clearAllCache = async () => {
    return await OfflineService.clearAllCache();
  };

  return {
    savePendingOperation,
    getPendingOperations,
    clearPendingOperations,
    cacheData,
    getCachedData,
    getOfflineData,
    getOfflineStats,
    clearAllCache,
  };
};
