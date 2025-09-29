// Test específico para verificar que los ingresos se muestran correctamente
import { BalanceService } from '../../services/balanceService';
import { BalanceRecord, BalanceCategory } from '../../types';

// Helper function para crear registros de prueba
const createRecord = (amount: number, type: 'income' | 'expense', category: BalanceCategory): BalanceRecord => ({
  id: 'test-id',
  amount,
  type,
  category,
  description: 'Test description',
});

describe('Balance Income Fix - Specific Test', () => {
  describe('Income Registration Scenario', () => {
    it('should show positive total for income record', () => {
      // Escenario: Usuario ingresa $50,000 como ingreso
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      // El impacto neto debe ser positivo (suma al balance)
      expect(netTotal).toBe(50000);
      
      // El total absoluto debe ser positivo (suma de todos los montos)
      expect(absoluteTotal).toBe(50000);
      
      // Ambos deben ser iguales para un ingreso
      expect(netTotal).toBe(absoluteTotal);
    });

    it('should validate positive difference with income', () => {
      // Escenario: Balance actual 100000, nuevo balance 150000, diferencia +50000
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
      ];
      const expectedDifference = 50000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should show correct totals for investment', () => {
      // Escenario: Usuario invierte $30,000
      const records = [
        createRecord(30000, 'income', 'Inversión'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(netTotal).toBe(30000);
      expect(absoluteTotal).toBe(30000);
    });

    it('should handle mixed income and expense correctly', () => {
      // Escenario: +100000 ingreso, -30000 gasto = +70000 neto
      const records = [
        createRecord(100000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Consumo'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      // Impacto neto: 100000 - 30000 = 70000
      expect(netTotal).toBe(70000);
      
      // Total absoluto: 100000 + 30000 = 130000
      expect(absoluteTotal).toBe(130000);
    });
  });

  describe('Category Type Consistency', () => {
    it('should maintain correct type for Ingreso category', () => {
      const record = createRecord(50000, 'income', 'Ingreso');
      
      expect(record.type).toBe('income');
      expect(record.category).toBe('Ingreso');
      
      // Verificar que el cálculo sea correcto
      const netTotal = BalanceService.calculateTotal([record]);
      expect(netTotal).toBe(50000); // Debe sumar
    });

    it('should maintain correct type for Inversión category', () => {
      const record = createRecord(30000, 'income', 'Inversión');
      
      expect(record.type).toBe('income');
      expect(record.category).toBe('Inversión');
      
      // Verificar que el cálculo sea correcto
      const netTotal = BalanceService.calculateTotal([record]);
      expect(netTotal).toBe(30000); // Debe sumar
    });

    it('should maintain correct type for Consumo category', () => {
      const record = createRecord(20000, 'expense', 'Consumo');
      
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Consumo');
      
      // Verificar que el cálculo sea correcto
      const netTotal = BalanceService.calculateTotal([record]);
      expect(netTotal).toBe(-20000); // Debe restar
    });
  });

  describe('Real User Scenario', () => {
    it('should handle user scenario: balance 100000 -> 150000 with 50000 income', () => {
      // Usuario tiene balance actual de 100000
      const currentBalance = 100000;
      
      // Usuario ingresa nuevo balance de 150000
      const newBalance = 150000;
      const difference = newBalance - currentBalance; // +50000
      
      // Usuario registra un ingreso de 50000
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
      ];
      
      // Verificar cálculos
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(difference).toBe(50000); // Diferencia esperada
      expect(netTotal).toBe(50000); // Impacto neto del ingreso
      expect(absoluteTotal).toBe(50000); // Total de registros
      
      // Verificar validación
      const validation = BalanceService.validateRecords(records, difference);
      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });
  });
});
