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
    console.log('🏦 [BalanceService] Iniciando registerBalance...');
    console.log('📊 [BalanceService] Parámetros:', { userId, type, description, amount, category });
    
    // Verificar autenticación
    console.log('🔐 [BalanceService] Verificando autenticación...');
    const { auth } = await import('../firebase/config');
    console.log('🔐 [BalanceService] Usuario autenticado:', auth.currentUser?.uid);
    console.log('🔐 [BalanceService] Email del usuario:', auth.currentUser?.email);
    
    if (!auth.currentUser) {
      console.error('❌ [BalanceService] Usuario no autenticado');
      return { 
        success: false, 
        error: 'Usuario no autenticado. Por favor, inicia sesión nuevamente.' 
      };
    }
    
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      console.log('📅 [BalanceService] Fecha actual:', { now, month, year });

      // Obtener balance actual
      console.log('💰 [BalanceService] Obteniendo balance actual...');
      const currentBalance = await this.getCurrentBalance(userId);
      console.log('💰 [BalanceService] Balance actual obtenido:', currentBalance);
      
      // Calcular nuevo balance
      const balanceAfter = type === 'income' 
        ? currentBalance + amount 
        : currentBalance - amount;
      console.log('🧮 [BalanceService] Cálculo de balance:', { 
        currentBalance, 
        amount, 
        type, 
        balanceAfter 
      });

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
      console.log('📝 [BalanceService] Registro creado:', balanceRegistration);

      // Guardar registro
      console.log('💾 [BalanceService] Guardando registro en Firestore...');
      const registrationRef = doc(db, 'balance_registrations', balanceRegistration.id);
      await setDoc(registrationRef, balanceRegistration);
      console.log('✅ [BalanceService] Registro guardado exitosamente');

      // Actualizar estadísticas mensuales primero
      console.log('📊 [BalanceService] Actualizando estadísticas mensuales...');
      await this.updateMonthlyStats(userId, month, year, balanceRegistration);
      console.log('✅ [BalanceService] Estadísticas mensuales actualizadas');

      // Actualizar balance actual para que siempre refleje monthlyStats.balance
      console.log('💰 [BalanceService] Actualizando balance actual...');
      await this.updateCurrentBalance(userId, balanceAfter);
      console.log('✅ [BalanceService] Balance actual actualizado');

      // Verificar y manejar cambio de mes automáticamente
      console.log('📅 [BalanceService] Verificando cambio de mes...');
      await this.handleMonthChange(userId);
      console.log('✅ [BalanceService] Verificación de mes completada');

      console.log('🎉 [BalanceService] Registro completado exitosamente');
      return { success: true, balanceRegistration };
    } catch (error) {
      console.error('💥 [BalanceService] Error durante registerBalance:', error);
      console.error('💥 [BalanceService] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      return { 
        success: false, 
        error: `Error al registrar el balance: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      };
    }
  }

  /**
   * Obtiene el balance actual del usuario
   * Siempre devuelve el balance del mes actual (monthlyStats.balance)
   */
  static async getCurrentBalance(userId: string): Promise<number> {
    console.log('💰 [BalanceService.getCurrentBalance] Iniciando...');
    console.log('👤 [BalanceService.getCurrentBalance] userId:', userId);
    
    try {
      // Obtener el balance del mes actual desde monthlyStats
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      console.log('📅 [BalanceService.getCurrentBalance] Fecha:', { currentDate, month, year });
      
      const currentMonthBalance = await this.getCurrentMonthBalance(userId, month, year);
      console.log('💰 [BalanceService.getCurrentBalance] Balance del mes obtenido:', currentMonthBalance);
      
      // Sincronizar el balance actual con el balance del mes actual
      console.log('🔄 [BalanceService.getCurrentBalance] Sincronizando balance actual...');
      await this.syncCurrentBalanceWithMonthlyStats(userId, currentMonthBalance);
      console.log('✅ [BalanceService.getCurrentBalance] Sincronización completada');
      
      console.log('💰 [BalanceService.getCurrentBalance] Retornando balance:', currentMonthBalance);
      return currentMonthBalance;
    } catch (error) {
      console.error('💥 [BalanceService.getCurrentBalance] Error:', error);
      return 0;
    }
  }

  /**
   * Obtiene el balance del mes actual desde monthlyStats
   */
  static async getCurrentMonthBalance(userId: string, month: number, year: number): Promise<number> {
    console.log('📊 [BalanceService.getCurrentMonthBalance] Iniciando...');
    console.log('📊 [BalanceService.getCurrentMonthBalance] Parámetros:', { userId, month, year });
    
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      console.log('🔍 [BalanceService.getCurrentMonthBalance] statsId:', statsId);
      
      const statsDocRef = doc(db, 'monthly_stats', statsId);
      console.log('📄 [BalanceService.getCurrentMonthBalance] Consultando documento...');
      
      const statsDocSnap = await getDoc(statsDocRef);
      console.log('📄 [BalanceService.getCurrentMonthBalance] Documento existe:', statsDocSnap.exists());
      
      if (statsDocSnap.exists()) {
        const stats = statsDocSnap.data() as MonthlyStats;
        console.log('📊 [BalanceService.getCurrentMonthBalance] Datos encontrados:', stats);
        console.log('💰 [BalanceService.getCurrentMonthBalance] Balance retornado:', stats.balance);
        return stats.balance;
      }
      
      console.log('❌ [BalanceService.getCurrentMonthBalance] No se encontraron estadísticas, retornando 0');
      return 0;
    } catch (error) {
      console.error('💥 [BalanceService.getCurrentMonthBalance] Error:', error);
      return 0;
    }
  }

  /**
   * Sincroniza el balance actual con el balance del mes actual
   */
  static async syncCurrentBalanceWithMonthlyStats(userId: string, monthlyBalance: number): Promise<void> {
    try {
      const balanceDocRef = doc(db, 'balances', userId);
      const balanceDocSnap = await getDoc(balanceDocRef);
      
      if (balanceDocSnap.exists()) {
        // Actualizar el balance actual para que coincida con monthlyStats
        await updateDoc(balanceDocRef, {
          currentBalance: monthlyBalance,
          lastUpdated: new Date()
        });
      } else {
        // Crear balance inicial con el valor del mes actual
        await this.createInitialBalance(userId, monthlyBalance);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crea el balance inicial del usuario
   */
  static async createInitialBalance(userId: string, initialAmount: number = 0): Promise<void> {
    try {
      const initialBalance: BalanceData = {
        userId,
        currentBalance: initialAmount,
        lastUpdated: new Date()
      };

      const balanceDocRef = doc(db, 'balances', userId);
      await setDoc(balanceDocRef, initialBalance);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza el balance actual del usuario
   */
  static async updateCurrentBalance(userId: string, newBalance: number): Promise<void> {
    console.log('💰 [BalanceService.updateCurrentBalance] Iniciando...');
    console.log('💰 [BalanceService.updateCurrentBalance] Parámetros:', { userId, newBalance });
    
    try {
      const balanceDocRef = doc(db, 'balances', userId);
      console.log('📄 [BalanceService.updateCurrentBalance] Referencia del documento:', balanceDocRef.path);
      
      const updateData = {
        currentBalance: newBalance,
        lastUpdated: new Date()
      };
      console.log('📝 [BalanceService.updateCurrentBalance] Datos a actualizar:', updateData);
      
      await updateDoc(balanceDocRef, updateData);
      console.log('✅ [BalanceService.updateCurrentBalance] Balance actualizado exitosamente');
    } catch (error) {
      console.error('💥 [BalanceService.updateCurrentBalance] Error:', error);
      console.error('💥 [BalanceService.updateCurrentBalance] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      throw error;
    }
  }

  /**
   * Verifica y maneja el cambio de mes automáticamente
   * Asegura que el balance actual siempre refleje el balance del mes actual
   */
  static async handleMonthChange(userId: string): Promise<void> {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      // Obtener el balance del mes actual
      const currentMonthBalance = await this.getCurrentMonthBalance(userId, month, year);
      
      // Sincronizar el balance actual con el balance del mes actual
      await this.syncCurrentBalanceWithMonthlyStats(userId, currentMonthBalance);
      
    } catch (error) {
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
    console.log('📊 [BalanceService.updateMonthlyStats] Iniciando...');
    console.log('📊 [BalanceService.updateMonthlyStats] Parámetros:', { userId, month, year });
    console.log('📝 [BalanceService.updateMonthlyStats] Nuevo registro:', newRegistration);
    
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      console.log('🔍 [BalanceService.updateMonthlyStats] statsId:', statsId);
      
      const statsDocRef = doc(db, 'monthly_stats', statsId);
      console.log('📄 [BalanceService.updateMonthlyStats] Consultando documento existente...');
      
      const statsDocSnap = await getDoc(statsDocRef);
      console.log('📄 [BalanceService.updateMonthlyStats] Documento existe:', statsDocSnap.exists());

      let monthlyStats: MonthlyStats;

      if (statsDocSnap.exists()) {
        console.log('📊 [BalanceService.updateMonthlyStats] Actualizando estadísticas existentes...');
        // Actualizar estadísticas existentes
        const existingStats = statsDocSnap.data() as MonthlyStats;
        console.log('📊 [BalanceService.updateMonthlyStats] Estadísticas existentes:', existingStats);
        
        if (newRegistration.type === 'income') {
          monthlyStats = {
            ...existingStats,
            totalIncome: existingStats.totalIncome + newRegistration.amount,
            balance: newRegistration.balanceAfter,
            lastUpdated: new Date()
          };
          console.log('💰 [BalanceService.updateMonthlyStats] Actualizando ingreso:', {
            totalIncomeAnterior: existingStats.totalIncome,
            montoNuevo: newRegistration.amount,
            totalIncomeNuevo: monthlyStats.totalIncome
          });
        } else {
          monthlyStats = {
            ...existingStats,
            totalExpenses: existingStats.totalExpenses + newRegistration.amount,
            balance: newRegistration.balanceAfter,
            lastUpdated: new Date()
          };
          console.log('💸 [BalanceService.updateMonthlyStats] Actualizando gasto:', {
            totalExpensesAnterior: existingStats.totalExpenses,
            montoNuevo: newRegistration.amount,
            totalExpensesNuevo: monthlyStats.totalExpenses
          });
        }
      } else {
        console.log('📊 [BalanceService.updateMonthlyStats] Creando nuevas estadísticas mensuales...');
        // Crear nuevas estadísticas mensuales
        const previousMonth = month === 1 ? 12 : month - 1;
        const previousYear = month === 1 ? year - 1 : year;
        console.log('📅 [BalanceService.updateMonthlyStats] Mes anterior:', { previousMonth, previousYear });
        
        const previousMonthBalance = await this.getPreviousMonthBalance(userId, previousMonth, previousYear);
        console.log('💰 [BalanceService.updateMonthlyStats] Balance del mes anterior:', previousMonthBalance);

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
      console.log('📊 [BalanceService.updateMonthlyStats] Calculando porcentajes...');
      monthlyStats.percentages = await this.calculateMonthlyPercentages(userId, month, year, monthlyStats.balance, monthlyStats.totalIncome);
      console.log('📊 [BalanceService.updateMonthlyStats] Porcentajes calculados:', monthlyStats.percentages);

      console.log('💾 [BalanceService.updateMonthlyStats] Guardando estadísticas en Firestore...');
      console.log('📊 [BalanceService.updateMonthlyStats] Datos finales a guardar:', monthlyStats);
      await setDoc(statsDocRef, monthlyStats);
      console.log('✅ [BalanceService.updateMonthlyStats] Estadísticas guardadas exitosamente');
    } catch (error) {
      console.error('💥 [BalanceService.updateMonthlyStats] Error:', error);
      console.error('💥 [BalanceService.updateMonthlyStats] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      throw error;
    }
  }

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
      return null;
    }
  }

  /**
   * Obtiene el historial de registros de balance (compatibilidad)
   */
  static async getBalanceHistory(userId: string): Promise<BalanceRegistration[]> {
    try {
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
      
      
      return registrations;
    } catch (error) {
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
    } catch (error) {
      throw error;
    }
  }
}
