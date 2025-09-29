import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { BalanceRegistration, MonthlyStats, BalanceData, BalanceRecord } from '../types';

export class BalanceService {
  /**
   * Genera un ID único
   */
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Registra un nuevo balance
   */
  static async registerBalance(
    userId: string,
    type: 'income' | 'expense' | 'adjustment',
    description: string,
    amount: number,
    category: string
  ): Promise<{ success: boolean; error?: string; balanceRegistration?: BalanceRegistration }> {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      // Obtener balance actual
      const currentBalance = await this.getCurrentBalance(userId);
      
      // Calcular nuevo balance
      const balanceAfter = type === 'income' 
        ? currentBalance + amount 
        : currentBalance - amount;

      // Crear registro de balance
      const balanceRegistration: BalanceRegistration = {
        id: this.generateId(),
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

      // Guardar registro
      const registrationRef = doc(db, 'balance_registrations', balanceRegistration.id);
      await setDoc(registrationRef, balanceRegistration);
      console.log('Registro guardado en Firestore:', balanceRegistration);

      // Actualizar balance actual
      await this.updateCurrentBalance(userId, balanceAfter);

      // Actualizar estadísticas mensuales
      await this.updateMonthlyStats(userId, month, year, balanceRegistration);

      console.log('Balance registrado exitosamente para userId:', userId);
      return { success: true, balanceRegistration };
    } catch (error) {
      console.error('Error al registrar balance:', error);
      return { success: false, error: 'Error al registrar el balance' };
    }
  }

  /**
   * Obtiene el balance actual del usuario
   */
  static async getCurrentBalance(userId: string): Promise<number> {
    try {
      const balanceDocRef = doc(db, 'balances', userId);
      const balanceDocSnap = await getDoc(balanceDocRef);
      
      if (balanceDocSnap.exists()) {
        const balanceData = balanceDocSnap.data() as BalanceData;
        return balanceData.currentBalance;
      } else {
        // Crear balance inicial
        await this.createInitialBalance(userId);
        return 0;
      }
    } catch (error) {
      console.error('Error al obtener balance actual:', error);
      return 0;
    }
  }

  /**
   * Crea el balance inicial del usuario
   */
  static async createInitialBalance(userId: string): Promise<void> {
    try {
      const initialBalance: BalanceData = {
        userId,
        currentBalance: 0,
        lastUpdated: new Date()
      };

      const balanceDocRef = doc(db, 'balances', userId);
      await setDoc(balanceDocRef, initialBalance);
      console.log('Balance inicial creado para el usuario:', userId);
    } catch (error) {
      console.error('Error al crear balance inicial:', error);
      throw error;
    }
  }

  /**
   * Actualiza el balance actual del usuario
   */
  static async updateCurrentBalance(userId: string, newBalance: number): Promise<void> {
    try {
      const balanceDocRef = doc(db, 'balances', userId);
      await updateDoc(balanceDocRef, {
        currentBalance: newBalance,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error al actualizar balance actual:', error);
      throw error;
    }
  }

  /**
   * Actualiza las estadísticas mensuales
   */
  static async updateMonthlyStats(
    userId: string, 
    month: number, 
    year: number, 
    newRegistration: BalanceRegistration
  ): Promise<void> {
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      const statsDocRef = doc(db, 'monthly_stats', statsId);
      const statsDocSnap = await getDoc(statsDocRef);

      let monthlyStats: MonthlyStats;

      if (statsDocSnap.exists()) {
        // Actualizar estadísticas existentes
        const existingStats = statsDocSnap.data() as MonthlyStats;
        
        if (newRegistration.type === 'income') {
          monthlyStats = {
            ...existingStats,
            totalIncome: existingStats.totalIncome + newRegistration.amount,
            balance: newRegistration.balanceAfter,
            lastUpdated: new Date()
          };
        } else {
          monthlyStats = {
            ...existingStats,
            totalExpenses: existingStats.totalExpenses + newRegistration.amount,
            balance: newRegistration.balanceAfter,
            lastUpdated: new Date()
          };
        }
      } else {
        // Crear nuevas estadísticas mensuales
        const previousMonth = month === 1 ? 12 : month - 1;
        const previousYear = month === 1 ? year - 1 : year;
        const previousMonthBalance = await this.getPreviousMonthBalance(userId, previousMonth, previousYear);

        monthlyStats = {
          id: statsId,
          userId,
          month,
          year,
          totalIncome: newRegistration.type === 'income' ? newRegistration.amount : 0,
          totalExpenses: newRegistration.type === 'expense' ? newRegistration.amount : 0,
          balance: newRegistration.balanceAfter,
          percentages: {
            needs: 0,
            wants: 0,
            savings: 0,
            investment: 0
          },
          variation: {
            balanceChange: newRegistration.balanceAfter - previousMonthBalance,
            percentageChange: previousMonthBalance !== 0 
              ? ((newRegistration.balanceAfter - previousMonthBalance) / previousMonthBalance) * 100 
              : 0,
            previousMonthBalance
          },
          lastUpdated: new Date(),
          createdAt: new Date()
        };
      }

      // Calcular porcentajes basándose en los registros reales del mes
      monthlyStats.percentages = await this.calculateMonthlyPercentages(userId, month, year);

      await setDoc(statsDocRef, monthlyStats);
    } catch (error) {
      console.error('Error al actualizar estadísticas mensuales:', error);
      throw error;
    }
  }

  /**
   * Calcula los porcentajes basados en los registros reales del mes
   * Todos los porcentajes son respecto al ingreso mensual total
   */
  static async calculateMonthlyPercentages(userId: string, month: number, year: number): Promise<{
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

      // Calcular disponible como el dinero restante del mes
      const totalExpenses = totalNeeds + totalWants + totalInvestment;
      const actualSavings = Math.max(0, totalIncome - totalExpenses);

      // Calcular porcentajes respecto al ingreso mensual total
      const needs = (totalNeeds / totalIncome) * 100;
      const wants = (totalWants / totalIncome) * 100;
      const savings = (actualSavings / totalIncome) * 100;
      const investment = (totalInvestment / totalIncome) * 100;

      return {
        needs: Math.round(needs * 100) / 100,
        wants: Math.round(wants * 100) / 100,
        savings: Math.round(savings * 100) / 100,
        investment: Math.round(investment * 100) / 100
      };
    } catch (error) {
      console.error('Error al calcular porcentajes mensuales:', error);
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
      needs: Math.round(needs * 100) / 100,
      wants: Math.round(wants * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      investment: Math.round(investment * 100) / 100
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
      console.error('Error al obtener balance del mes anterior:', error);
      return 0;
    }
  }

  /**
   * Obtiene los registros de balance del mes actual
   */
  static async getCurrentMonthRegistrations(userId: string): Promise<BalanceRegistration[]> {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const registrationsRef = collection(db, 'balance_registrations');
      const q = query(
        registrationsRef,
        where('userId', '==', userId),
        where('month', '==', month),
        where('year', '==', year),
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate()
      })) as BalanceRegistration[];
    } catch (error) {
      console.error('Error al obtener registros del mes actual:', error);
      return [];
    }
  }

  /**
   * Obtiene las estadísticas de un mes específico
   */
  static async getMonthlyStats(userId: string, month: number, year: number): Promise<MonthlyStats | null> {
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      const statsDocRef = doc(db, 'monthly_stats', statsId);
      const statsDocSnap = await getDoc(statsDocRef);
      
      if (statsDocSnap.exists()) {
        const data = statsDocSnap.data();
        return {
          ...data,
          lastUpdated: data.lastUpdated.toDate(),
          createdAt: data.createdAt.toDate()
        } as MonthlyStats;
      }
      
      // Si no existen estadísticas, crearlas
      console.log('Creando estadísticas mensuales iniciales para:', userId, month, year);
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
      console.error('Error al obtener estadísticas mensuales:', error);
      return null;
    }
  }

  /**
   * Obtiene el historial de registros de balance (compatibilidad)
   */
  static async getBalanceHistory(userId: string): Promise<BalanceRegistration[]> {
    try {
      console.log('Obteniendo historial de balance para userId:', userId);
      const registrationsRef = collection(db, 'balance_registrations');
      const q = query(
        registrationsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const registrations = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate()
      })) as BalanceRegistration[];
      
      console.log('Registros encontrados:', registrations.length);
      console.log('Primeros registros:', registrations.slice(0, 3));
      
      return registrations;
    } catch (error) {
      console.error('Error al obtener historial de balance:', error);
      return [];
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
      console.log('Estadísticas mensuales iniciales creadas para el usuario:', userId, 'con porcentajes:', percentages);
    } catch (error) {
      console.error('Error al crear estadísticas mensuales iniciales:', error);
      throw error;
    }
  }
}
