// Tests específicos para el sistema de balance y categorías
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

describe('Balance System - Category Logic', () => {
  describe('calculateTotal - Income vs Expense Logic', () => {
    it('should add income records to total', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'income', 'Inversión'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(80000); // 50000 + 30000
    });

    it('should subtract expense records from total', () => {
      const records = [
        createRecord(20000, 'expense', 'Consumo'),
        createRecord(15000, 'expense', 'Necesidad'),
        createRecord(10000, 'expense', 'Deuda'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(-45000); // -(20000 + 15000 + 10000)
    });

    it('should handle mixed income and expense records correctly', () => {
      const records = [
        createRecord(100000, 'income', 'Ingreso'),    // +100000
        createRecord(30000, 'expense', 'Consumo'),    // -30000
        createRecord(20000, 'expense', 'Necesidad'),  // -20000
        createRecord(15000, 'income', 'Inversión'),   // +15000
        createRecord(5000, 'expense', 'Deuda'),       // -5000
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(60000); // 100000 - 30000 - 20000 + 15000 - 5000
    });

    it('should handle zero amounts correctly', () => {
      const records = [
        createRecord(0, 'income', 'Ingreso'),
        createRecord(0, 'expense', 'Consumo'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(0);
    });

    it('should handle decimal amounts correctly', () => {
      const records = [
        createRecord(1000.50, 'income', 'Ingreso'),
        createRecord(250.75, 'expense', 'Consumo'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(749.75); // 1000.50 - 250.75
    });
  });

  describe('validateRecords - Balance Validation', () => {
    it('should validate when records sum equals expected difference', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Consumo'),
      ];
      const expectedDifference = 20000; // 50000 - 30000
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject when records sum does not equal expected difference', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(20000, 'expense', 'Consumo'),
      ];
      const expectedDifference = 20000; // Esperamos 20000, pero tenemos 30000
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Los registros deben sumar exactamente');
    });

    it('should handle negative expected difference correctly', () => {
      const records = [
        createRecord(20000, 'expense', 'Consumo'),
        createRecord(10000, 'expense', 'Necesidad'),
      ];
      const expectedDifference = -30000; // -20000 - 10000
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
    });

    it('should handle zero expected difference correctly', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(50000, 'expense', 'Consumo'),
      ];
      const expectedDifference = 0; // 50000 - 50000
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
    });

    it('should reject empty records', () => {
      const records: BalanceRecord[] = [];
      const expectedDifference = 20000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Debes agregar al menos un registro');
    });
  });

  describe('Category Type Mapping', () => {
    it('should correctly identify income categories', () => {
      const incomeRecords = [
        createRecord(10000, 'income', 'Ingreso'),
        createRecord(5000, 'income', 'Inversión'),
      ];
      
      const total = BalanceService.calculateTotal(incomeRecords);
      expect(total).toBe(15000); // Ambos suman
    });

    it('should correctly identify expense categories', () => {
      const expenseRecords = [
        createRecord(10000, 'expense', 'Consumo'),
        createRecord(5000, 'expense', 'Necesidad'),
        createRecord(3000, 'expense', 'Deuda'),
      ];
      
      const total = BalanceService.calculateTotal(expenseRecords);
      expect(total).toBe(-18000); // Todos restan
    });

    it('should handle all valid categories correctly', () => {
      const allCategories = [
        createRecord(10000, 'income', 'Ingreso'),     // +10000
        createRecord(5000, 'income', 'Inversión'),    // +5000
        createRecord(3000, 'expense', 'Consumo'),     // -3000
        createRecord(2000, 'expense', 'Necesidad'),   // -2000
        createRecord(1000, 'expense', 'Deuda'),       // -1000
      ];
      
      const total = BalanceService.calculateTotal(allCategories);
      expect(total).toBe(9000); // 10000 + 5000 - 3000 - 2000 - 1000
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle string amounts correctly', () => {
      const records = [
        { ...createRecord(1000, 'income', 'Ingreso'), amount: '1000.50' as any },
        { ...createRecord(500, 'expense', 'Consumo'), amount: '500.25' as any },
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(500.25); // 1000.50 - 500.25
    });

    it('should handle invalid string amounts', () => {
      const records = [
        { ...createRecord(1000, 'income', 'Ingreso'), amount: 'invalid' as any },
        { ...createRecord(500, 'expense', 'Consumo'), amount: '500' as any },
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(isNaN(total)).toBe(true); // Invalid string results in NaN
    });

    it('should handle very large amounts', () => {
      const records = [
        createRecord(1000000, 'income', 'Ingreso'),
        createRecord(500000, 'expense', 'Consumo'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(500000);
    });

    it('should handle very small amounts', () => {
      const records = [
        createRecord(0.01, 'income', 'Ingreso'),
        createRecord(0.005, 'expense', 'Consumo'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(0.005); // 0.01 - 0.005
    });
  });
});
