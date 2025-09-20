import { BalanceRegistrationData, BalanceRecord, BalanceCategory } from '../types';

export class BalanceService {
  /**
   * Calcula el total de los registros según sus categorías
   * Ingreso: suma al total
   * Deuda, Consumo, Necesidad, Inversión: restan del total
   */
  static calculateTotal(records: BalanceRecord[]): number {
    return records.reduce((total, record) => {
      if (record.category === 'Ingreso') {
        return total + record.amount;
      } else {
        return total - record.amount;
      }
    }, 0);
  }

  /**
   * Valida que los registros sumen exactamente la diferencia requerida
   */
  static validateRecords(records: BalanceRecord[], requiredDifference: number): {
    isValid: boolean;
    error?: string;
  } {
    if (records.length === 0) {
      return {
        isValid: false,
        error: 'Debes agregar al menos un registro'
      };
    }

    // Verificar que todos los registros tengan monto y categoría válidos
    const invalidRecords = records.some(record => 
      !record.amount || record.amount <= 0 || !record.category
    );

    if (invalidRecords) {
      return {
        isValid: false,
        error: 'Todos los registros deben tener un monto y categoría válidos'
      };
    }

    const total = this.calculateTotal(records);
    const difference = Math.abs(total - requiredDifference);

    if (difference > 0.01) {
      return {
        isValid: false,
        error: `Los montos deben sumar exactamente $${requiredDifference.toFixed(2)}`
      };
    }

    return { isValid: true };
  }

  /**
   * Genera un ID único para un registro
   */
  static generateRecordId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Crea un nuevo registro vacío
   */
  static createEmptyRecord(): BalanceRecord {
    return {
      id: this.generateRecordId(),
      amount: 0,
      category: 'Ingreso',
    };
  }

  /**
   * Obtiene el balance actual del usuario desde la base de datos
   * En una implementación real, esto haría una llamada a la API
   */
  static async getCurrentBalance(userId: string): Promise<number> {
    // Simulación de llamada a la API
    // En una implementación real, harías algo como:
    // const response = await fetch(`/api/users/${userId}/balance`);
    // const data = await response.json();
    // return data.balance;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular un balance de ejemplo
        resolve(12500);
      }, 500);
    });
  }

  /**
   * Guarda el registro de balance en la base de datos
   * En una implementación real, esto haría una llamada a la API
   */
  static async saveBalanceRegistration(
    userId: string, 
    data: BalanceRegistrationData
  ): Promise<{ success: boolean; error?: string }> {
    // Simulación de llamada a la API
    // En una implementación real, harías algo como:
    // const response = await fetch(`/api/users/${userId}/balance`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular éxito
        console.log('Guardando balance:', data);
        resolve({ success: true });
      }, 1000);
    });
  }

  /**
   * Obtiene el historial de registros de balance del usuario
   */
  static async getBalanceHistory(userId: string): Promise<BalanceRegistrationData[]> {
    // Simulación de llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular datos de ejemplo
        resolve([
          {
            currentAmount: 15000,
            records: [
              { id: '1', amount: 2000, category: 'Ingreso' },
              { id: '2', amount: 500, category: 'Consumo' },
              { id: '3', amount: 1000, category: 'Inversión' },
            ]
          }
        ]);
      }, 500);
    });
  }
}
