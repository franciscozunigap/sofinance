import { BalanceService } from '../../services/balanceService';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { BalanceRegistration, MonthlyStats } from '../../types';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

// Mock Firebase config
jest.mock('../../firebase/config', () => ({
  db: {},
}));

describe('BalanceService', () => {
  const mockUserId = 'test-user-id';
  const mockDocRef = { id: 'test-doc-id' };
  const mockDocSnap = {
    exists: jest.fn(),
    data: jest.fn(),
  };
  const mockQuerySnapshot = {
    docs: [],
    forEach: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = BalanceService.generateId();
      const id2 = BalanceService.generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });
  });

  describe('registerBalance', () => {
    const mockRegistrationData = {
      type: 'income' as const,
      description: 'Test income',
      amount: 1000,
      category: 'Test Category',
    };

    beforeEach(() => {
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      (updateDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it('should register income successfully', async () => {
      // Mock getCurrentBalance
      jest.spyOn(BalanceService, 'getCurrentBalance').mockResolvedValue(5000);
      // Mock updateMonthlyStats
      jest.spyOn(BalanceService, 'updateMonthlyStats').mockResolvedValue(undefined);
      // Mock updateCurrentBalance
      jest.spyOn(BalanceService, 'updateCurrentBalance').mockResolvedValue(undefined);
      // Mock handleMonthChange
      jest.spyOn(BalanceService, 'handleMonthChange').mockResolvedValue(undefined);

      const result = await BalanceService.registerBalance(
        mockUserId,
        mockRegistrationData.type,
        mockRegistrationData.description,
        mockRegistrationData.amount,
        mockRegistrationData.category
      );

      expect(result.success).toBe(true);
      expect(result.balanceRegistration).toBeDefined();
      expect(result.balanceRegistration?.amount).toBe(1000);
      expect(result.balanceRegistration?.balanceAfter).toBe(6000);
      expect(setDoc).toHaveBeenCalled();
    });

    it('should register expense successfully', async () => {
      const expenseData = { ...mockRegistrationData, type: 'expense' as const, amount: 500 };
      
      jest.spyOn(BalanceService, 'getCurrentBalance').mockResolvedValue(5000);
      jest.spyOn(BalanceService, 'updateMonthlyStats').mockResolvedValue(undefined);
      jest.spyOn(BalanceService, 'updateCurrentBalance').mockResolvedValue(undefined);
      jest.spyOn(BalanceService, 'handleMonthChange').mockResolvedValue(undefined);

      const result = await BalanceService.registerBalance(
        mockUserId,
        expenseData.type,
        expenseData.description,
        expenseData.amount,
        expenseData.category
      );

      expect(result.success).toBe(true);
      expect(result.balanceRegistration?.amount).toBe(500);
      expect(result.balanceRegistration?.balanceAfter).toBe(4500);
    });

    it('should handle errors during registration', async () => {
      const mockError = new Error('Firebase error');
      jest.spyOn(BalanceService, 'getCurrentBalance').mockRejectedValue(mockError);

      const result = await BalanceService.registerBalance(
        mockUserId,
        mockRegistrationData.type,
        mockRegistrationData.description,
        mockRegistrationData.amount,
        mockRegistrationData.category
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al registrar el balance');
    });
  });

  describe('getCurrentBalance', () => {
    it('should return current month balance from monthlyStats', async () => {
      const mockStats = {
        balance: 5000,
        totalIncome: 10000,
        totalExpenses: 5000,
        percentages: { needs: 50, wants: 20, savings: 30, investment: 0 },
      };

      mockDocSnap.exists.mockReturnValue(true);
      mockDocSnap.data.mockReturnValue(mockStats);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      // Mock getCurrentMonthBalance
      jest.spyOn(BalanceService, 'getCurrentMonthBalance').mockResolvedValue(5000);
      // Mock syncCurrentBalanceWithMonthlyStats
      jest.spyOn(BalanceService, 'syncCurrentBalanceWithMonthlyStats').mockResolvedValue(undefined);

      const result = await BalanceService.getCurrentBalance(mockUserId);

      expect(result).toBe(5000);
    });

    it('should return 0 when no monthly stats exist', async () => {
      mockDocSnap.exists.mockReturnValue(false);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      jest.spyOn(BalanceService, 'getCurrentMonthBalance').mockResolvedValue(0);
      jest.spyOn(BalanceService, 'syncCurrentBalanceWithMonthlyStats').mockResolvedValue(undefined);

      const result = await BalanceService.getCurrentBalance(mockUserId);

      expect(result).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      const mockError = new Error('Firebase error');
      jest.spyOn(BalanceService, 'getCurrentMonthBalance').mockRejectedValue(mockError);

      const result = await BalanceService.getCurrentBalance(mockUserId);

      expect(result).toBe(0);
    });
  });

  describe('getCurrentMonthBalance', () => {
    it('should return balance from monthly stats', async () => {
      const mockStats = { balance: 5000 };
      mockDocSnap.exists.mockReturnValue(true);
      mockDocSnap.data.mockReturnValue(mockStats);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await BalanceService.getCurrentMonthBalance(mockUserId, 1, 2024);

      expect(result).toBe(5000);
    });

    it('should return 0 when stats do not exist', async () => {
      mockDocSnap.exists.mockReturnValue(false);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await BalanceService.getCurrentMonthBalance(mockUserId, 1, 2024);

      expect(result).toBe(0);
    });
  });

  describe('createInitialBalance', () => {
    it('should create initial balance document', async () => {
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      await BalanceService.createInitialBalance(mockUserId, 1000);

      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          userId: mockUserId,
          currentBalance: 1000,
        })
      );
    });

    it('should handle creation errors', async () => {
      const mockError = new Error('Creation failed');
      (setDoc as jest.Mock).mockRejectedValue(mockError);

      await expect(BalanceService.createInitialBalance(mockUserId, 1000)).rejects.toThrow('Creation failed');
    });
  });

  describe('updateCurrentBalance', () => {
    it('should update current balance', async () => {
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await BalanceService.updateCurrentBalance(mockUserId, 5000);

      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          currentBalance: 5000,
        })
      );
    });
  });

  describe('getBalanceHistory', () => {
    it('should return balance history', async () => {
      const mockRegistrations = [
        {
          id: '1',
          userId: mockUserId,
          amount: 1000,
          type: 'income',
          description: 'Test',
          category: 'Test',
          date: new Date(),
          createdAt: new Date(),
          balanceAfter: 1000,
          month: 1,
          year: 2024,
        },
      ];

      mockQuerySnapshot.forEach.mockImplementation((callback) => {
        mockRegistrations.forEach((reg, index) => ({
          data: () => reg,
        }));
      });
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await BalanceService.getBalanceHistory(mockUserId);

      expect(result).toBeDefined();
    });

    it('should return empty array on error', async () => {
      const mockError = new Error('Query failed');
      (getDocs as jest.Mock).mockRejectedValue(mockError);

      const result = await BalanceService.getBalanceHistory(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('calculatePercentages', () => {
    it('should calculate percentages correctly', () => {
      const result = BalanceService.calculatePercentages(10000, 6000);

      expect(result.needs).toBe(36); // (6000 * 0.6) / 10000 * 100
      expect(result.wants).toBe(24); // (6000 * 0.4) / 10000 * 100
      expect(result.savings).toBe(40); // (10000 - 6000) / 10000 * 100
      expect(result.investment).toBe(0);
    });

    it('should handle zero income', () => {
      const result = BalanceService.calculatePercentages(0, 1000);

      expect(result.needs).toBe(0);
      expect(result.wants).toBe(0);
      expect(result.savings).toBe(0);
      expect(result.investment).toBe(0);
    });
  });

  describe('validateRecords', () => {
    it('should validate records correctly', () => {
      const records = [
        { id: '1', type: 'income', amount: 1000, category: 'Ingreso' },
        { id: '2', type: 'expense', amount: 500, category: 'Necesidad' },
      ];

      const result = BalanceService.validateRecords(records, 500);

      expect(result.isValid).toBe(true);
    });

    it('should reject invalid records', () => {
      const records = [
        { id: '1', type: 'income', amount: 1000, category: 'Ingreso' },
        { id: '2', type: 'expense', amount: 600, category: 'Necesidad' },
      ];

      const result = BalanceService.validateRecords(records, 500);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('deben sumar exactamente');
    });

    it('should reject empty records', () => {
      const result = BalanceService.validateRecords([], 500);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Debes agregar al menos un registro');
    });
  });

  describe('createEmptyRecord', () => {
    it('should create empty record with correct structure', () => {
      const record = BalanceService.createEmptyRecord();

      expect(record.id).toBeDefined();
      expect(record.type).toBe('expense');
      expect(record.amount).toBe(0);
      expect(record.category).toBe('Necesidad');
      expect(record.description).toBe('');
    });
  });

  describe('createSmartEmptyRecord', () => {
    it('should create income record for positive difference', () => {
      const record = BalanceService.createSmartEmptyRecord(1000);

      expect(record.type).toBe('income');
      expect(record.category).toBe('Ingreso');
    });

    it('should create expense record for negative difference', () => {
      const record = BalanceService.createSmartEmptyRecord(-1000);

      expect(record.type).toBe('expense');
      expect(record.category).toBe('Necesidad');
    });
  });
});
