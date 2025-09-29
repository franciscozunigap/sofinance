// Tests para la visualización correcta del total de registros
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

describe('Balance Display - Total Calculation', () => {
  describe('calculateAbsoluteTotal', () => {
    it('should sum all amounts regardless of type', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Consumo'),
        createRecord(20000, 'income', 'Inversión'),
      ];
      
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      expect(absoluteTotal).toBe(100000); // 50000 + 30000 + 20000
    });

    it('should handle only income records', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'income', 'Inversión'),
      ];
      
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      expect(absoluteTotal).toBe(80000); // 50000 + 30000
    });

    it('should handle only expense records', () => {
      const records = [
        createRecord(50000, 'expense', 'Consumo'),
        createRecord(30000, 'expense', 'Necesidad'),
      ];
      
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      expect(absoluteTotal).toBe(80000); // 50000 + 30000
    });

    it('should handle empty records', () => {
      const records: BalanceRecord[] = [];
      
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      expect(absoluteTotal).toBe(0);
    });

    it('should handle decimal amounts', () => {
      const records = [
        createRecord(1000.50, 'income', 'Ingreso'),
        createRecord(250.75, 'expense', 'Consumo'),
      ];
      
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      expect(absoluteTotal).toBe(1251.25); // 1000.50 + 250.75
    });
  });

  describe('calculateTotal vs calculateAbsoluteTotal', () => {
    it('should show different results for mixed records', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Consumo'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(netTotal).toBe(20000); // 50000 - 30000 (impacto neto)
      expect(absoluteTotal).toBe(80000); // 50000 + 30000 (suma total)
    });

    it('should show same results for only income records', () => {
      const records = [
        createRecord(50000, 'income', 'Ingreso'),
        createRecord(30000, 'income', 'Inversión'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(netTotal).toBe(80000); // 50000 + 30000
      expect(absoluteTotal).toBe(80000); // 50000 + 30000
      expect(netTotal).toBe(absoluteTotal);
    });

    it('should show different results for only expense records', () => {
      const records = [
        createRecord(50000, 'expense', 'Consumo'),
        createRecord(30000, 'expense', 'Necesidad'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(netTotal).toBe(-80000); // -(50000 + 30000) (impacto neto negativo)
      expect(absoluteTotal).toBe(80000); // 50000 + 30000 (suma total positiva)
    });
  });

  describe('Real-world Display Scenarios', () => {
    it('should display correct totals for salary increase', () => {
      // Usuario recibe aumento: +100000
      const records = [
        createRecord(100000, 'income', 'Ingreso'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(netTotal).toBe(100000); // Impacto neto positivo
      expect(absoluteTotal).toBe(100000); // Total de registros
    });

    it('should display correct totals for expense', () => {
      // Usuario gasta: -50000
      const records = [
        createRecord(50000, 'expense', 'Consumo'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(netTotal).toBe(-50000); // Impacto neto negativo
      expect(absoluteTotal).toBe(50000); // Total de registros (positivo)
    });

    it('should display correct totals for mixed scenario', () => {
      // Usuario tiene: +100000 ingreso, -30000 gasto
      const records = [
        createRecord(100000, 'income', 'Ingreso'),
        createRecord(30000, 'expense', 'Consumo'),
      ];
      
      const netTotal = BalanceService.calculateTotal(records);
      const absoluteTotal = BalanceService.calculateAbsoluteTotal(records);
      
      expect(netTotal).toBe(70000); // 100000 - 30000 (impacto neto)
      expect(absoluteTotal).toBe(130000); // 100000 + 30000 (total registros)
    });
  });
});
