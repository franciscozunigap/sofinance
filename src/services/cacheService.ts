import AsyncStorage from '@react-native-async-storage/async-storage';
import { BalanceRegistration, MonthlyStats } from '../types';

/**
 * Servicio de caché optimizado para Firebase
 */
export class CacheService {
  private static readonly CACHE_KEYS = {
    BALANCE: 'cache_balance',
    HISTORY: 'cache_history',
    MONTHLY_STATS: 'cache_monthly_stats',
    USER_DATA: 'cache_user_data',
    SUMMARY_STATS: 'cache_summary_stats',
  } as const;

  private static readonly CACHE_DURATION = {
    BALANCE: 5 * 60 * 1000, // 5 minutos
    HISTORY: 10 * 60 * 1000, // 10 minutos
    MONTHLY_STATS: 30 * 60 * 1000, // 30 minutos
    USER_DATA: 60 * 60 * 1000, // 1 hora
    SUMMARY_STATS: 15 * 60 * 1000, // 15 minutos
  } as const;

  interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
    version: string;
  }

  /**
   * Guarda datos en caché con expiración
   */
  static async set<T>(
    key: string,
    data: T,
    duration?: number,
    version: string = '1.0'
  ): Promise<void> {
    try {
      const now = Date.now();
      const expiresAt = now + (duration || this.CACHE_DURATION.BALANCE);
      
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: now,
        expiresAt,
        version,
      };

      await AsyncStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error(`Error guardando en caché ${key}:`, error);
    }
  }

  /**
   * Obtiene datos del caché si no han expirado
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const cacheEntry: CacheEntry<T> = JSON.parse(data);
      const now = Date.now();

      // Verificar si ha expirado
      if (now > cacheEntry.expiresAt) {
        await this.remove(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.error(`Error obteniendo del caché ${key}:`, error);
      return null;
    }
  }

  /**
   * Verifica si existe un dato en caché y no ha expirado
   */
  static async has(key: string): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return false;

      const cacheEntry: CacheEntry<any> = JSON.parse(data);
      const now = Date.now();

      return now <= cacheEntry.expiresAt;
    } catch (error) {
      console.error(`Error verificando caché ${key}:`, error);
      return false;
    }
  }

  /**
   * Elimina un dato del caché
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando del caché ${key}:`, error);
    }
  }

  /**
   * Limpia todo el caché
   */
  static async clear(): Promise<void> {
    try {
      const keys = Object.values(this.CACHE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error limpiando caché:', error);
    }
  }

  /**
   * Limpia caché expirado
   */
  static async clearExpired(): Promise<void> {
    try {
      const keys = Object.values(this.CACHE_KEYS);
      const items = await AsyncStorage.multiGet(keys);
      
      const expiredKeys: string[] = [];
      const now = Date.now();

      items.forEach(([key, value]) => {
        if (value) {
          try {
            const cacheEntry: CacheEntry<any> = JSON.parse(value);
            if (now > cacheEntry.expiresAt) {
              expiredKeys.push(key);
            }
          } catch (error) {
            // Si no se puede parsear, eliminar
            expiredKeys.push(key);
          }
        }
      });

      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
      }
    } catch (error) {
      console.error('Error limpiando caché expirado:', error);
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  static async getStats(): Promise<{
    totalKeys: number;
    expiredKeys: number;
    totalSize: number;
    keys: Array<{
      key: string;
      size: number;
      isExpired: boolean;
      age: number;
    }>;
  }> {
    try {
      const keys = Object.values(this.CACHE_KEYS);
      const items = await AsyncStorage.multiGet(keys);
      
      let totalSize = 0;
      let expiredKeys = 0;
      const now = Date.now();
      const keyStats: Array<{
        key: string;
        size: number;
        isExpired: boolean;
        age: number;
      }> = [];

      items.forEach(([key, value]) => {
        if (value) {
          const size = value.length;
          totalSize += size;
          
          try {
            const cacheEntry: CacheEntry<any> = JSON.parse(value);
            const isExpired = now > cacheEntry.expiresAt;
            const age = now - cacheEntry.timestamp;
            
            if (isExpired) {
              expiredKeys++;
            }
            
            keyStats.push({
              key,
              size,
              isExpired,
              age,
            });
          } catch (error) {
            // Si no se puede parsear, considerarlo expirado
            expiredKeys++;
            keyStats.push({
              key,
              size,
              isExpired: true,
              age: 0,
            });
          }
        }
      });

      return {
        totalKeys: keys.length,
        expiredKeys,
        totalSize,
        keys: keyStats,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas del caché:', error);
      return {
        totalKeys: 0,
        expiredKeys: 0,
        totalSize: 0,
        keys: [],
      };
    }
  }

  // Métodos específicos para cada tipo de dato

  /**
   * Guarda balance en caché
   */
  static async setBalance(balance: number): Promise<void> {
    await this.set(this.CACHE_KEYS.BALANCE, balance, this.CACHE_DURATION.BALANCE);
  }

  /**
   * Obtiene balance del caché
   */
  static async getBalance(): Promise<number | null> {
    return await this.get<number>(this.CACHE_KEYS.BALANCE);
  }

  /**
   * Guarda historial en caché
   */
  static async setHistory(history: BalanceRegistration[]): Promise<void> {
    await this.set(this.CACHE_KEYS.HISTORY, history, this.CACHE_DURATION.HISTORY);
  }

  /**
   * Obtiene historial del caché
   */
  static async getHistory(): Promise<BalanceRegistration[] | null> {
    return await this.get<BalanceRegistration[]>(this.CACHE_KEYS.HISTORY);
  }

  /**
   * Guarda estadísticas mensuales en caché
   */
  static async setMonthlyStats(stats: MonthlyStats): Promise<void> {
    await this.set(this.CACHE_KEYS.MONTHLY_STATS, stats, this.CACHE_DURATION.MONTHLY_STATS);
  }

  /**
   * Obtiene estadísticas mensuales del caché
   */
  static async getMonthlyStats(): Promise<MonthlyStats | null> {
    return await this.get<MonthlyStats>(this.CACHE_KEYS.MONTHLY_STATS);
  }

  /**
   * Guarda datos de usuario en caché
   */
  static async setUserData(userData: any): Promise<void> {
    await this.set(this.CACHE_KEYS.USER_DATA, userData, this.CACHE_DURATION.USER_DATA);
  }

  /**
   * Obtiene datos de usuario del caché
   */
  static async getUserData(): Promise<any | null> {
    return await this.get<any>(this.CACHE_KEYS.USER_DATA);
  }

  /**
   * Guarda estadísticas de resumen en caché
   */
  static async setSummaryStats(stats: any): Promise<void> {
    await this.set(this.CACHE_KEYS.SUMMARY_STATS, stats, this.CACHE_DURATION.SUMMARY_STATS);
  }

  /**
   * Obtiene estadísticas de resumen del caché
   */
  static async getSummaryStats(): Promise<any | null> {
    return await this.get<any>(this.CACHE_KEYS.SUMMARY_STATS);
  }

  /**
   * Invalida caché específico
   */
  static async invalidate(key: string): Promise<void> {
    await this.remove(key);
  }

  /**
   * Invalida todos los cachés relacionados con balance
   */
  static async invalidateBalance(): Promise<void> {
    await Promise.all([
      this.remove(this.CACHE_KEYS.BALANCE),
      this.remove(this.CACHE_KEYS.HISTORY),
      this.remove(this.CACHE_KEYS.MONTHLY_STATS),
      this.remove(this.CACHE_KEYS.SUMMARY_STATS),
    ]);
  }

  /**
   * Invalida todos los cachés relacionados con usuario
   */
  static async invalidateUser(): Promise<void> {
    await Promise.all([
      this.remove(this.CACHE_KEYS.USER_DATA),
      this.invalidateBalance(),
    ]);
  }
}

/**
 * Hook para manejo de caché
 */
export const useCacheService = () => {
  const set = async <T>(key: string, data: T, duration?: number, version?: string) => {
    return await CacheService.set(key, data, duration, version);
  };

  const get = async <T>(key: string) => {
    return await CacheService.get<T>(key);
  };

  const has = async (key: string) => {
    return await CacheService.has(key);
  };

  const remove = async (key: string) => {
    return await CacheService.remove(key);
  };

  const clear = async () => {
    return await CacheService.clear();
  };

  const clearExpired = async () => {
    return await CacheService.clearExpired();
  };

  const getStats = async () => {
    return await CacheService.getStats();
  };

  const invalidate = async (key: string) => {
    return await CacheService.invalidate(key);
  };

  const invalidateBalance = async () => {
    return await CacheService.invalidateBalance();
  };

  const invalidateUser = async () => {
    return await CacheService.invalidateUser();
  };

  return {
    set,
    get,
    has,
    remove,
    clear,
    clearExpired,
    getStats,
    invalidate,
    invalidateBalance,
    invalidateUser,
  };
};
