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

describe('Balance Validation', () => {
  describe('validateRecords', () => {

    it('should validate correct sum of records', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Gasto'),
      ];
      const difference = 20000;
      
      const result = BalanceService.validateRecords(records, difference);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject incorrect sum of records', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(20000, 'expense', 'Gasto'),
      ];
      const difference = 20000;
      
      const result = BalanceService.validateRecords(records, difference);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Los registros deben sumar exactamente');
    });

    it('should reject empty records', () => {
      const records: BalanceRecord[] = [];
      const difference = 20000;
      
      const result = BalanceService.validateRecords(records, difference);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Debes agregar al menos un registro');
    });

    it('should handle zero difference', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(50000, 'expense', 'Gasto'),
      ];
      const difference = 0;
      
      const result = BalanceService.validateRecords(records, difference);
      expect(result.isValid).toBe(true);
    });

    it('should handle negative difference', () => {
      const records = [
        createRecord(30000, 'expense', 'Gasto'),
        createRecord(20000, 'expense', 'Gasto'),
      ];
      const difference = -50000;
      
      const result = BalanceService.validateRecords(records, difference);
      expect(result.isValid).toBe(true);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Gasto'),
        createRecord(20000, 'income', 'Ingreso'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(40000); // 50000 + 20000 - 30000
    });

    it('should handle empty records', () => {
      const records: BalanceRecord[] = [];
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(0);
    });

    it('should handle only expenses', () => {
      const records = [
        createRecord(30000, 'expense', 'Gasto'),
        createRecord(20000, 'expense', 'Gasto'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(-50000);
    });

    it('should handle only income', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'income', 'Ingreso'),
      ];
      
      const total = BalanceService.calculateTotal(records);
      expect(total).toBe(80000);
    });
  });

  describe('createEmptyRecord', () => {
    it('should create empty record with valid structure', () => {
      const record = BalanceService.createEmptyRecord();
      
      expect(record).toHaveProperty('id');
      expect(record).toHaveProperty('amount');
      expect(record).toHaveProperty('type');
      expect(record).toHaveProperty('category');
      expect(record).toHaveProperty('description');
      expect(record.amount).toBe(0);
      expect(record.type).toBe('expense');
      expect(record.category).toBe('Necesidad');
      expect(record.description).toBe('');
    });

    it('should create unique IDs', () => {
      const record1 = BalanceService.createEmptyRecord();
      const record2 = BalanceService.createEmptyRecord();
      
      expect(record1.id).not.toBe(record2.id);
    });
  });
});
