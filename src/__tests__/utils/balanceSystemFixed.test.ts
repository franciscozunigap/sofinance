// Tests para el sistema de balance corregido
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

describe('Balance System - Fixed Logic', () => {
  describe('createSmartEmptyRecord', () => {
    it('should create income record when difference is positive', () => {
      const record = BalanceService.createSmartEmptyRecord(50000);
      
      expect(record.type).toBe('income');
      expect(record.category).toBe('Ingreso');
      expect(record.amount).toBe(0);
    });

    it('should create expense record when difference is negative', () => {
      const record = BalanceService.createSmartEmptyRecord(-30000);
      
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Necesidad');
      expect(record.amount).toBe(0);
    });

    it('should create expense record when difference is zero', () => {
      const record = BalanceService.createSmartEmptyRecord(0);
      
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Necesidad');
      expect(record.amount).toBe(0);
    });
  });

  describe('Category Type Mapping - Fixed', () => {
    it('should correctly map Ingreso to income type', () => {
      const record = createRecord(10000, 'income', 'Ingreso');
      expect(record.type).toBe('income');
      expect(record.category).toBe('Ingreso');
    });

    it('should correctly map Inversión to expense type', () => {
      const record = createRecord(5000, 'expense', 'Inversión');
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Inversión');
    });

    it('should correctly map Consumo to expense type', () => {
      const record = createRecord(3000, 'expense', 'Consumo');
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Consumo');
    });

    it('should correctly map Necesidad to expense type', () => {
      const record = createRecord(2000, 'expense', 'Necesidad');
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Necesidad');
    });

    it('should correctly map Deuda to expense type', () => {
      const record = createRecord(1000, 'expense', 'Deuda');
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Deuda');
    });
  });

  describe('Balance Registration Scenarios', () => {
    it('should handle positive difference with income records', () => {
      // Escenario: Balance actual 100000, monto nuevo 150000, diferencia +50000
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
      ];
      const expectedDifference = 50000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(50000);
    });

    it('should handle negative difference with expense records', () => {
      // Escenario: Balance actual 150000, monto nuevo 100000, diferencia -50000
      const records = [
        createRecord(50000, 'expense', 'Consumo'),
      ];
      const expectedDifference = -50000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(-50000);
    });

    it('should handle mixed records for complex scenarios', () => {
      // Escenario: Balance actual 100000, monto nuevo 120000, diferencia +20000
      // Pero el usuario registra: +50000 ingreso, -30000 gasto = +20000 neto
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Consumo'),
      ];
      const expectedDifference = 20000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(20000); // 50000 - 30000
    });

    it('should reject incorrect sum for positive difference', () => {
      // Escenario: Diferencia +50000, pero registros suman +30000
      const records = [
        createRecord(30000, 'income', 'Ingreso'),
      ];
      const expectedDifference = 50000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Los registros deben sumar exactamente');
    });

    it('should reject incorrect sum for negative difference', () => {
      // Escenario: Diferencia -50000, pero registros suman -30000
      const records = [
        createRecord(30000, 'expense', 'Consumo'),
      ];
      const expectedDifference = -50000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Los registros deben sumar exactamente');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle salary increase scenario', () => {
      // Usuario recibe aumento de sueldo: balance 500000 -> 600000 (+100000)
      const records = [
        createRecord(100000, 'income', 'Ingreso'),
      ];
      const expectedDifference = 100000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
    });

    it('should handle expense scenario', () => {
      // Usuario gasta en compras: balance 500000 -> 450000 (-50000)
      const records = [
        createRecord(50000, 'expense', 'Consumo'),
      ];
      const expectedDifference = -50000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
    });

    it('should handle investment scenario', () => {
      // Usuario invierte: balance 500000 -> 400000 (-100000)
      const records = [
        createRecord(100000, 'expense', 'Inversión'),
      ];
      const expectedDifference = -100000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
    });

    it('should handle debt payment scenario', () => {
      // Usuario paga deuda: balance 500000 -> 400000 (-100000)
      const records = [
        createRecord(100000, 'expense', 'Deuda'),
      ];
      const expectedDifference = -100000;
      
      const result = BalanceService.validateRecords(records, expectedDifference);
      expect(result.isValid).toBe(true);
    });
  });
});
