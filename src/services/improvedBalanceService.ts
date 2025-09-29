import { FirebaseService } from './firebaseService';
import { BalanceRegistration, MonthlyStats, BalanceData } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio mejorado de balance con transacciones atómicas y mejor manejo de errores
 */
export class ImprovedBalanceService {
  private static readonly COLLECTIONS = {
    BALANCE_REGISTRATIONS: 'balance_registrations',
    MONTHLY_STATS: 'monthly_stats',
    BALANCES: 'balances',
  } as const;

  /**
   * Registra un balance con transacción atómica
   */
  static async registerBalance(
    userId: string,
    type: 'income' | 'expense' | 'adjustment',
    description: string,
    amount: number,
    category: string
  ): Promise<{ success: boolean; error?: string; balanceRegistration?: BalanceRegistration }> {
    try {
      // Validar datos de entrada
      const validation = this.validateBalanceInput(type, description, amount, category);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const result = await FirebaseService.runTransaction(async (transaction) => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // 1. Obtener balance actual
        const currentBalance = await this.getCurrentBalanceFromTransaction(transaction, userId);
        
        // 2. Calcular nuevo balance
        const balanceAfter = type === 'income' 
          ? currentBalance + amount 
          : currentBalance - amount;

        // 3. Crear registro de balance
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

        // 4. Guardar registro
        const registrationRef = doc(db, this.COLLECTIONS.BALANCE_REGISTRATIONS, balanceRegistration.id);
        transaction.set(registrationRef, balanceRegistration);

        // 5. Actualizar estadísticas mensuales
        await this.updateMonthlyStatsInTransaction(transaction, userId, month, year, balanceRegistration);

        // 6. Actualizar balance actual
        await this.updateCurrentBalanceInTransaction(transaction, userId, balanceAfter);

        return { success: true, balanceRegistration };
      });

      return result;
    } catch (error) {
      console.error('Error al registrar balance:', error);
      return { 
        success: false, 
        error: `Error al registrar el balance: ${error instanceof Error ? error.message : 'Error desconocido'}` 
      };
    }
  }

  /**
   * Obtiene el balance actual del usuario
   */
  static async getCurrentBalance(userId: string): Promise<number> {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      // Obtener balance del mes actual desde monthlyStats
      const monthlyStats = await FirebaseService.getDocument<MonthlyStats>(
        this.COLLECTIONS.MONTHLY_STATS,
        `${year}-${month.toString().padStart(2, '0')}_${userId}`
      );

      if (monthlyStats) {
        // Sincronizar con balance actual
        await this.syncCurrentBalanceWithMonthlyStats(userId, monthlyStats.balance);
        return monthlyStats.balance;
      }

      // Si no hay estadísticas del mes actual, crear balance inicial
      await this.createInitialBalance(userId);
      return 0;
    } catch (error) {
      console.error('Error al obtener balance actual:', error);
      return 0;
    }
  }

  /**
   * Obtiene el historial de balance con paginación
   */
  static async getBalanceHistory(
    userId: string,
    limitCount: number = 50,
    startAfter?: string
  ): Promise<BalanceRegistration[]> {
    try {
      const constraints = [
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      ];

      return await FirebaseService.queryDocuments<BalanceRegistration>(
        this.COLLECTIONS.BALANCE_REGISTRATIONS,
        constraints
      );
    } catch (error) {
      console.error('Error al obtener historial de balance:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas mensuales
   */
  static async getMonthlyStats(userId: string, month: number, year: number): Promise<MonthlyStats | null> {
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      return await FirebaseService.getDocument<MonthlyStats>(
        this.COLLECTIONS.MONTHLY_STATS,
        statsId
      );
    } catch (error) {
      console.error('Error al obtener estadísticas mensuales:', error);
      return null;
    }
  }

  /**
   * Crea balance inicial del usuario
   */
  static async createInitialBalance(userId: string, initialAmount: number = 0): Promise<void> {
    try {
      const initialBalance: BalanceData = {
        userId,
        currentBalance: initialAmount,
        lastUpdated: new Date()
      };

      await FirebaseService.setDocument(
        this.COLLECTIONS.BALANCES,
        userId,
        initialBalance
      );
    } catch (error) {
      console.error('Error al crear balance inicial:', error);
      throw error;
    }
  }

  /**
   * Sincroniza balance actual con estadísticas mensuales
   */
  static async syncCurrentBalanceWithMonthlyStats(userId: string, monthlyBalance: number): Promise<void> {
    try {
      const balanceExists = await FirebaseService.documentExists(
        this.COLLECTIONS.BALANCES,
        userId
      );

      if (balanceExists) {
        await FirebaseService.updateDocument(
          this.COLLECTIONS.BALANCES,
          userId,
          {
            currentBalance: monthlyBalance,
            lastUpdated: new Date()
          }
        );
      } else {
        await this.createInitialBalance(userId, monthlyBalance);
      }
    } catch (error) {
      console.error('Error al sincronizar balance actual:', error);
      throw error;
    }
  }

  /**
   * Escucha cambios en el balance en tiempo real
   */
  static subscribeToBalanceChanges(
    userId: string,
    callback: (balance: number) => void
  ): () => void {
    return FirebaseService.subscribeToDocument<BalanceData>(
      this.COLLECTIONS.BALANCES,
      userId,
      (data) => {
        if (data) {
          callback(data.currentBalance);
        }
      }
    );
  }

  /**
   * Escucha cambios en el historial de balance
   */
  static subscribeToBalanceHistory(
    userId: string,
    callback: (history: BalanceRegistration[]) => void,
    limitCount: number = 50
  ): () => void {
    const constraints = [
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    ];

    return FirebaseService.subscribeToQuery<BalanceRegistration>(
      this.COLLECTIONS.BALANCE_REGISTRATIONS,
      constraints,
      callback
    );
  }

  /**
   * Obtiene balance actual desde transacción
   */
  private static async getCurrentBalanceFromTransaction(
    transaction: any,
    userId: string
  ): Promise<number> {
    try {
      const balanceRef = doc(db, this.COLLECTIONS.BALANCES, userId);
      const balanceSnap = await transaction.get(balanceRef);
      
      if (balanceSnap.exists()) {
        return balanceSnap.data().currentBalance || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Error obteniendo balance desde transacción:', error);
      return 0;
    }
  }

  /**
   * Actualiza estadísticas mensuales en transacción
   */
  private static async updateMonthlyStatsInTransaction(
    transaction: any,
    userId: string,
    month: number,
    year: number,
    newRegistration: BalanceRegistration
  ): Promise<void> {
    try {
      const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;
      const statsRef = doc(db, this.COLLECTIONS.MONTHLY_STATS, statsId);
      const statsSnap = await transaction.get(statsRef);

      let monthlyStats: MonthlyStats;

      if (statsSnap.exists()) {
        // Actualizar estadísticas existentes
        const existingStats = statsSnap.data() as MonthlyStats;
        
        monthlyStats = {
          ...existingStats,
          totalIncome: newRegistration.type === 'income' 
            ? existingStats.totalIncome + newRegistration.amount 
            : existingStats.totalIncome,
          totalExpenses: newRegistration.type === 'expense' 
            ? existingStats.totalExpenses + newRegistration.amount 
            : existingStats.totalExpenses,
          balance: newRegistration.balanceAfter,
          lastUpdated: new Date()
        };
      } else {
        // Crear nuevas estadísticas mensuales
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
            balanceChange: newRegistration.balanceAfter,
            percentageChange: 0,
            previousMonthBalance: 0
          },
          lastUpdated: new Date(),
          createdAt: new Date()
        };
      }

      // Calcular porcentajes
      monthlyStats.percentages = this.calculatePercentages(
        monthlyStats.totalIncome,
        monthlyStats.totalExpenses,
        monthlyStats.balance
      );

      transaction.set(statsRef, monthlyStats);
    } catch (error) {
      console.error('Error actualizando estadísticas mensuales en transacción:', error);
      throw error;
    }
  }

  /**
   * Actualiza balance actual en transacción
   */
  private static async updateCurrentBalanceInTransaction(
    transaction: any,
    userId: string,
    newBalance: number
  ): Promise<void> {
    try {
      const balanceRef = doc(db, this.COLLECTIONS.BALANCES, userId);
      transaction.update(balanceRef, {
        currentBalance: newBalance,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error actualizando balance actual en transacción:', error);
      throw error;
    }
  }

  /**
   * Calcula porcentajes financieros
   */
  private static calculatePercentages(
    totalIncome: number,
    totalExpenses: number,
    currentBalance: number
  ): { needs: number; wants: number; savings: number; investment: number } {
    if (totalIncome === 0) {
      return { needs: 0, wants: 0, savings: 0, investment: 0 };
    }

    const needs = (totalExpenses * 0.6) / totalIncome * 100;
    const wants = (totalExpenses * 0.4) / totalIncome * 100;
    const savings = (currentBalance / totalIncome) * 100;
    const investment = 0; // Por ahora 0%

    return {
      needs: Math.round(needs * 10) / 10,
      wants: Math.round(wants * 10) / 10,
      savings: Math.round(savings * 10) / 10,
      investment: Math.round(investment * 10) / 10
    };
  }

  /**
   * Valida datos de entrada para registro de balance
   */
  private static validateBalanceInput(
    type: string,
    description: string,
    amount: number,
    category: string
  ): { isValid: boolean; error?: string } {
    if (!type || !['income', 'expense', 'adjustment'].includes(type)) {
      return { isValid: false, error: 'Tipo de transacción inválido' };
    }

    if (!description || description.trim().length === 0) {
      return { isValid: false, error: 'La descripción es requerida' };
    }

    if (!amount || amount <= 0) {
      return { isValid: false, error: 'El monto debe ser mayor a 0' };
    }

    if (!category || category.trim().length === 0) {
      return { isValid: false, error: 'La categoría es requerida' };
    }

    if (amount > 10000000) { // Límite de 10 millones
      return { isValid: false, error: 'El monto excede el límite permitido' };
    }

    return { isValid: true };
  }

  /**
   * Genera ID único
   */
  private static generateId(): string {
    return uuidv4();
  }

  /**
   * Obtiene estadísticas de resumen
   */
  static async getSummaryStats(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    transactionCount: number;
  }> {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const monthlyStats = await this.getMonthlyStats(userId, month, year);
      const transactionCount = await FirebaseService.countDocuments(
        this.COLLECTIONS.BALANCE_REGISTRATIONS,
        [where('userId', '==', userId)]
      );

      return {
        totalIncome: monthlyStats?.totalIncome || 0,
        totalExpenses: monthlyStats?.totalExpenses || 0,
        currentBalance: monthlyStats?.balance || 0,
        transactionCount
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de resumen:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        currentBalance: 0,
        transactionCount: 0
      };
    }
  }
}
