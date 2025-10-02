import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, runTransaction, startAfter } from 'firebase/firestore';
import { BalanceRegistration, MonthlyStats, BalanceRecord } from '../types';
import { CacheService } from './cacheService';

export class BalanceService {
  /**
   * Genera un ID único usando Firestore
   */
  static generateId(): string {
    return doc(collection(db, 'balance_registrations')).id;
  }

  /**
   * Registra un nuevo balance con transacción atómica
   * ✅ OPTIMIZADO: Usa transacciones para garantizar consistencia
   * ✅ OPTIMIZADO: Elimina escritura redundante en colección 'balances'
   */
  static async registerBalance(
    userId: string,
    type: 'income' | 'expense' | 'adjustment',
    description: string,
    amount: number,
    category: string
  ): Promise<{ success: boolean; error?: string; balanceRegistration?: BalanceRegistration }> {
    console.log('🏦 [BalanceService] Iniciando registerBalance...');
    console.log('📊 [BalanceService] Parámetros:', { userId, type, description, amount, category });
    
    // Verificar autenticación
    const { auth } = await import('../firebase/config');
    if (!auth.currentUser) {
      console.error('❌ [BalanceService] Usuario no autenticado');
      return { 
        success: false, 
        error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' 
      };
    }
    
    try {
      let balanceRegistration: BalanceRegistration | undefined;

      // ✅ TRANSACCIÓN ATÓMICA: Todo o nada
      await runTransaction(db, async (transaction) => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;

        // 1. Leer estadísticas actuales
        const statsRef = doc(db, 'monthly_stats', statsId);
        const statsDoc = await transaction.get(statsRef);
        
        let currentBalance = 0;
        let currentStats: MonthlyStats | null = null;

        if (statsDoc.exists()) {
          currentStats = statsDoc.data() as MonthlyStats;
          currentBalance = currentStats.balance;
        } else {
          // Si no existen stats del mes, obtener del mes anterior
          const previousMonth = month === 1 ? 12 : month - 1;
          const previousYear = month === 1 ? year - 1 : year;
          const previousStatsId = `${previousYear}-${previousMonth.toString().padStart(2, '0')}_${userId}`;
          const previousStatsDoc = await transaction.get(doc(db, 'monthly_stats', previousStatsId));
          
          if (previousStatsDoc.exists()) {
            currentBalance = (previousStatsDoc.data() as MonthlyStats).balance;
          }
        }

        // 2. Calcular nuevo balance
        const balanceAfter = type === 'income' 
          ? currentBalance + amount 
          : currentBalance - amount;

        // 3. Crear registro de balance
        const registrationRef = doc(collection(db, 'balance_registrations'));
        balanceRegistration = {
          id: registrationRef.id,
          userId,
          date: now,
          type,
          description,
          amount,
          category,
          balanceAfter,
          month,
          year,
          createdAt: now
        };

        // 4. Actualizar o crear estadísticas mensuales
        let updatedStats: MonthlyStats;

        if (currentStats) {
          // Actualizar stats existentes
          updatedStats = {
            ...currentStats,
            totalIncome: type === 'income' ? currentStats.totalIncome + amount : currentStats.totalIncome,
            totalExpenses: type === 'expense' ? currentStats.totalExpenses + amount : currentStats.totalExpenses,
            balance: balanceAfter,
            lastUpdated: now
          };
        } else {
          // Crear nuevas stats
          updatedStats = {
            id: statsId,
            userId,
            month,
            year,
            totalIncome: type === 'income' ? amount : 0,
            totalExpenses: type === 'expense' ? amount : 0,
            balance: balanceAfter,
            percentages: {
              needs: 0,
              wants: 0,
              savings: 0,
              investment: 0
            },
            variation: {
              balanceChange: balanceAfter - currentBalance,
              percentageChange: currentBalance !== 0 
                ? ((balanceAfter - currentBalance) / currentBalance) * 100 
                : 0,
              previousMonthBalance: currentBalance
            },
            lastUpdated: now,
            createdAt: now
          };
        }

        // 5. Escribir todo atómicamente (2 escrituras en vez de 3)
        transaction.set(registrationRef, balanceRegistration);
        transaction.set(statsRef, updatedStats);
      });

      // ✅ Invalidar cache después de la transacción exitosa
      await CacheService.invalidateBalance();

      console.log('✅ [BalanceService] Transacción completada exitosamente');
      return { success: true, balanceRegistration };
    } catch (error) {
      console.error('💥 [BalanceService] Error durante registerBalance:', error);
      return { 
        success: false, 
        error: `Error al registrar el balance: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      };
    }
  }

  /**
   * Obtiene el balance actual del usuario
   * ✅ OPTIMIZADO: Usa cache para reducir lecturas de Firestore
   * ✅ OPTIMIZADO: Solo consulta monthly_stats (eliminada colección balances redundante)
   */
  static async getCurrentBalance(userId: string): Promise<number> {
    console.log('💰 [BalanceService.getCurrentBalance] Iniciando...');
    
    try {
      // 1. ✅ Intentar obtener del cache primero
      const cachedBalance = await CacheService.getBalance();
      if (cachedBalance !== null) {
        console.log('✅ [BalanceService.getCurrentBalance] Balance obtenido del cache:', cachedBalance);
        return cachedBalance;
      }

      // 2. Si no está en cache, consultar Firestore
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      
      const statsDocRef = doc(db, 'monthly_stats', statsId);
      const statsDocSnap = await getDoc(statsDocRef);
      
      let balance = 0;
      if (statsDocSnap.exists()) {
        balance = (statsDocSnap.data() as MonthlyStats).balance;
      }

      // 3. ✅ Guardar en cache
      await CacheService.setBalance(balance);
      
      console.log('💾 [BalanceService.getCurrentBalance] Balance obtenido de Firestore y cacheado:', balance);
      return balance;
    } catch (error) {
      console.error('💥 [BalanceService.getCurrentBalance] Error:', error);
      return 0;
    }
  }

  /**
   * ✅ ELIMINADO: createInitialBalance - Ya no se usa colección 'balances'
   * ✅ ELIMINADO: updateCurrentBalance - Ya no se usa colección 'balances'
   * ✅ ELIMINADO: syncCurrentBalanceWithMonthlyStats - Ya no es necesario
   * ✅ ELIMINADO: handleMonthChange - Ya no es necesario
   * ✅ ELIMINADO: updateMonthlyStats - Ahora se hace en la transacción
   * ✅ ELIMINADO: getCurrentMonthBalance - Funcionalidad integrada en getCurrentBalance
   */

  /**
   * Calcula los porcentajes basados en los registros reales del mes
   * Todos los porcentajes son respecto al ingreso mensual total
   */
  static async calculateMonthlyPercentages(userId: string, month: number, year: number, currentBalance?: number, totalIncome?: number): Promise<{
    needs: number;
    wants: number;
    savings: number;
    investment: number;
  }> {
    try {
      // Obtener todos los registros del mes
      const registrationsRef = collection(db, 'balance_registrations');
      const q = query(
        registrationsRef,
        where('userId', '==', userId),
        where('month', '==', month),
        where('year', '==', year)
      );
      const querySnapshot = await getDocs(q);

      let totalIncome = 0;
      let totalNeeds = 0;
      let totalWants = 0;
      let totalSavings = 0;
      let totalInvestment = 0;

      querySnapshot.forEach((doc) => {
        const registration = doc.data() as BalanceRegistration;
        
        if (registration.type === 'income') {
          totalIncome += registration.amount;
        } else {
          // Clasificar gastos por categoría (excluyendo disponible e inversión)
          switch (registration.category) {
            case 'Necesidad':
              totalNeeds += registration.amount;
              break;
            case 'Consumo':
              totalWants += registration.amount;
              break;
            case 'Inversión':
              totalInvestment += registration.amount;
              break;
            default:
              // Si no tiene categoría específica, clasificar como necesidades
              totalNeeds += registration.amount;
          }
        }
      });

      if (totalIncome === 0) {
        return { needs: 0, wants: 0, savings: 0, investment: 0 };
      }

      // Calcular gastos totales
      const totalExpenses = totalNeeds + totalWants + totalInvestment;

      // Calcular porcentajes respecto al ingreso mensual total
      const needs = (totalNeeds / totalIncome) * 100;
      const wants = (totalWants / totalIncome) * 100;
      const investment = (totalInvestment / totalIncome) * 100;
      
      // El savings se calcula como el porcentaje del balance actual respecto al ingreso total
      // Si se proporciona el balance actual, usarlo; si no, calcular como el restante
      let savings = 0;
      if (currentBalance !== undefined && totalIncome !== undefined && totalIncome > 0) {
        savings = (currentBalance / totalIncome) * 100;
      } else if (totalIncome > 0) {
        // Fallback: calcular como el dinero restante del mes
        const actualSavings = Math.max(0, totalIncome - totalExpenses);
        savings = (actualSavings / totalIncome) * 100;
      }

      return {
        needs: Math.round(needs * 10) / 10, // Truncar a un decimal
        wants: Math.round(wants * 10) / 10, // Truncar a un decimal
        savings: Math.round(savings * 10) / 10, // Truncar a un decimal
        investment: Math.round(investment * 10) / 10 // Truncar a un decimal
      };
    } catch (error) {
      return { needs: 0, wants: 0, savings: 0, investment: 0 };
    }
  }

  /**
   * Calcula los porcentajes basados en ingresos y gastos (método legacy)
   * Todos los porcentajes son respecto al ingreso mensual total
   */
  static calculatePercentages(totalIncome: number, totalExpenses: number): {
    needs: number;
    wants: number;
    savings: number;
    investment: number;
  } {
    if (totalIncome === 0) {
      return { needs: 0, wants: 0, savings: 0, investment: 0 };
    }

    // Calcular porcentajes respecto al ingreso mensual total
    const needs = (totalExpenses * 0.6) / totalIncome * 100; // 60% de gastos son necesidades
    const wants = (totalExpenses * 0.4) / totalIncome * 100; // 40% de gastos son consumo
    const savings = (totalIncome - totalExpenses) / totalIncome * 100; // % del ingreso que no se gastó (disponible)
    const investment = 0; // Por ahora 0%, se puede configurar después

    return {
      needs: Math.round(needs * 10) / 10, // Truncar a un decimal
      wants: Math.round(wants * 10) / 10, // Truncar a un decimal
      savings: Math.round(savings * 10) / 10, // Truncar a un decimal
      investment: Math.round(investment * 10) / 10 // Truncar a un decimal
    };
  }

  /**
   * Obtiene el balance del mes anterior
   */
  static async getPreviousMonthBalance(userId: string, month: number, year: number): Promise<number> {
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      const statsDocRef = doc(db, 'monthly_stats', statsId);
      const statsDocSnap = await getDoc(statsDocRef);
      
      if (statsDocSnap.exists()) {
        const stats = statsDocSnap.data() as MonthlyStats;
        return stats.balance;
      }
      
      return 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Obtiene los registros de balance del mes actual
   * ✅ OPTIMIZADO: Usa cache y límite de resultados
   */
  static async getCurrentMonthRegistrations(
    userId: string,
    limitCount: number = 100
  ): Promise<BalanceRegistration[]> {
    try {
      // 1. ✅ Intentar obtener del cache primero
      const cachedHistory = await CacheService.getHistory();
      if (cachedHistory !== null && cachedHistory.length > 0) {
        console.log('✅ [BalanceService] Historial obtenido del cache');
        return cachedHistory;
      }

      // 2. Si no está en cache, consultar Firestore
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const registrationsRef = collection(db, 'balance_registrations');
      const q = query(
        registrationsRef,
        where('userId', '==', userId),
        where('month', '==', month),
        where('year', '==', year),
        orderBy('date', 'desc'),
        limit(limitCount)  // ✅ Límite agregado
      );

      const querySnapshot = await getDocs(q);
      const registrations = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate()
      })) as BalanceRegistration[];

      // 3. ✅ Guardar en cache
      await CacheService.setHistory(registrations);

      console.log('💾 [BalanceService] Historial obtenido de Firestore y cacheado');
      return registrations;
    } catch (error) {
      console.error('Error obteniendo registros del mes:', error);
      return [];
    }
  }

  /**
   * Obtiene las estadísticas de un mes específico
   * ✅ OPTIMIZADO: Usa cache para estadísticas mensuales
   */
  static async getMonthlyStats(userId: string, month: number, year: number): Promise<MonthlyStats | null> {
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;

      // 1. ✅ Verificar si es el mes actual y hay cache
      const now = new Date();
      const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
      
      if (isCurrentMonth) {
        const cachedStats = await CacheService.getMonthlyStats();
        if (cachedStats !== null) {
          console.log('✅ [BalanceService] Stats mensuales del cache');
          return cachedStats;
        }
      }

      // 2. Consultar Firestore
      const statsDocRef = doc(db, 'monthly_stats', statsId);
      const statsDocSnap = await getDoc(statsDocRef);
      
      if (statsDocSnap.exists()) {
        const data = statsDocSnap.data();
        const stats = {
          ...data,
          lastUpdated: data.lastUpdated.toDate(),
          createdAt: data.createdAt.toDate()
        } as MonthlyStats;

        // 3. ✅ Cachear si es el mes actual
        if (isCurrentMonth) {
          await CacheService.setMonthlyStats(stats);
        }

        return stats;
      }
      
      // Si no existen estadísticas, crearlas
      await this.createInitialMonthlyStats(userId);
      
      // Intentar obtener las estadísticas nuevamente
      const newStatsDocSnap = await getDoc(statsDocRef);
      if (newStatsDocSnap.exists()) {
        const data = newStatsDocSnap.data();
        return {
          ...data,
          lastUpdated: data.lastUpdated.toDate(),
          createdAt: data.createdAt.toDate()
        } as MonthlyStats;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo stats mensuales:', error);
      return null;
    }
  }

  /**
   * Obtiene el historial de registros de balance
   * ✅ OPTIMIZADO: Paginación para grandes volúmenes de datos
   */
  static async getBalanceHistory(
    userId: string,
    limitCount: number = 50,
    lastDocId?: string
  ): Promise<{ data: BalanceRegistration[]; hasMore: boolean; lastDocId?: string }> {
    try {
      const registrationsRef = collection(db, 'balance_registrations');
      
      let q = query(
        registrationsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount + 1)  // +1 para saber si hay más
      );

      // Si hay lastDocId, continuar desde ahí
      if (lastDocId) {
        const lastDocRef = doc(db, 'balance_registrations', lastDocId);
        const lastDocSnap = await getDoc(lastDocRef);
        if (lastDocSnap.exists()) {
          q = query(q, startAfter(lastDocSnap));
        }
      }

      const querySnapshot = await getDocs(q);
      const hasMore = querySnapshot.docs.length > limitCount;
      
      const registrations = querySnapshot.docs
        .slice(0, limitCount)
        .map(doc => ({
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt.toDate()
        })) as BalanceRegistration[];
      
      const newLastDocId = registrations.length > 0 
        ? registrations[registrations.length - 1].id 
        : undefined;
      
      return {
        data: registrations,
        hasMore,
        lastDocId: newLastDocId
      };
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return { data: [], hasMore: false };
    }
  }

  /**
   * Calcula el total de los registros según las categorías
   * Solo la categoría 'Ingreso' suma, el resto resta del balance
   */
  static calculateTotal(records: BalanceRecord[]): number {
    return records.reduce((total, record) => {
      const amount = typeof record.amount === 'string' ? parseFloat(record.amount) : record.amount;
      // Solo la categoría 'Ingreso' suma, el resto resta
      return record.category === 'Ingreso' ? total + amount : total - amount;
    }, 0);
  }

  /**
   * Calcula el total absoluto de todos los registros (para mostrar en UI)
   * Suma todos los montos independientemente del tipo
   */
  static calculateAbsoluteTotal(records: BalanceRecord[]): number {
    return records.reduce((total, record) => {
      const amount = typeof record.amount === 'string' ? parseFloat(record.amount) : record.amount;
      return total + amount;
    }, 0);
  }

  /**
   * Valida que los registros sumen la diferencia exacta
   */
  static validateRecords(records: BalanceRecord[], expectedDifference: number): { isValid: boolean; error?: string } {
    if (records.length === 0) {
      return { isValid: false, error: 'Debes agregar al menos un registro' };
    }

    const total = this.calculateTotal(records);
    const tolerance = 0.01; // Tolerancia de 1 centavo para errores de redondeo

    if (Math.abs(total - expectedDifference) > tolerance) {
      return { 
        isValid: false, 
        error: `Los registros deben sumar exactamente ${expectedDifference.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}. Suma actual: ${total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}` 
      };
    }

    return { isValid: true };
  }

  /**
   * Crea un registro vacío
   */
  static createEmptyRecord(): BalanceRecord {
    return {
      id: this.generateId(),
      type: 'expense',
      description: '',
      amount: 0,
      category: 'Necesidad'
    };
  }

  /**
   * Crea un registro vacío inteligente basado en la diferencia esperada
   */
  static createSmartEmptyRecord(expectedDifference: number): BalanceRecord {
    // Si la diferencia es positiva, sugerir un ingreso
    if (expectedDifference > 0) {
      return {
        id: this.generateId(),
        type: 'income',
        description: '',
        amount: 0,
        category: 'Ingreso'
      };
    } else {
      // Si la diferencia es negativa, sugerir un gasto
      return {
        id: this.generateId(),
        type: 'expense',
        description: '',
        amount: 0,
        category: 'Necesidad'
      };
    }
  }

  /**
   * Crea estadísticas mensuales iniciales para el usuario
   */
  static async createInitialMonthlyStats(userId: string): Promise<void> {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;

      // Obtener datos reales del mes para calcular porcentajes correctos
      const registrationsRef = collection(db, 'balance_registrations');
      const q = query(
        registrationsRef,
        where('userId', '==', userId),
        where('month', '==', month),
        where('year', '==', year)
      );
      const querySnapshot = await getDocs(q);

      let totalIncome = 0;
      let totalNeeds = 0;
      let totalWants = 0;
      let totalSavings = 0;
      let totalInvestment = 0;

      querySnapshot.forEach((doc) => {
        const registration = doc.data() as BalanceRegistration;
        
        if (registration.type === 'income') {
          totalIncome += registration.amount;
        } else {
          // Clasificar gastos por categoría (excluyendo disponible e inversión)
          switch (registration.category) {
            case 'Necesidad':
              totalNeeds += registration.amount;
              break;
            case 'Consumo':
              totalWants += registration.amount;
              break;
            case 'Inversión':
              totalInvestment += registration.amount;
              break;
            default:
              // Si no tiene categoría específica, clasificar como necesidades
              totalNeeds += registration.amount;
          }
        }
      });

      // Calcular disponible como el dinero restante del mes
      const totalExpenses = totalNeeds + totalWants + totalInvestment;
      const actualSavings = Math.max(0, totalIncome - totalExpenses);

      // Calcular porcentajes basándose en datos reales
      const percentages = totalIncome === 0 ? {
        needs: 0,
        wants: 0,
        savings: 0,
        investment: 0
      } : {
        needs: Math.round((totalNeeds / totalIncome) * 10000) / 100,
        wants: Math.round((totalWants / totalIncome) * 10000) / 100,
        savings: Math.round((actualSavings / totalIncome) * 10000) / 100,
        investment: Math.round((totalInvestment / totalIncome) * 10000) / 100
      };

      const initialStats: MonthlyStats = {
        id: statsId,
        userId,
        month,
        year,
        totalIncome,
        totalExpenses: totalNeeds + totalWants + totalInvestment,
        balance: totalIncome - (totalNeeds + totalWants + totalInvestment),
        percentages,
        variation: {
          balanceChange: 0,
          percentageChange: 0,
          previousMonthBalance: 0
        },
        lastUpdated: now,
        createdAt: now
      };

      const statsDocRef = doc(db, 'monthly_stats', statsId);
      await setDoc(statsDocRef, initialStats);
    } catch (error) {
      throw error;
    }
  }
}
