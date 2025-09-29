import { renderHook, act } from '@testing-library/react-native';
import { useBalance } from '../../hooks/useBalance';
import { BalanceService } from '../../services/balanceService';

// Mock BalanceService
jest.mock('../../services/balanceService', () => ({
  BalanceService: {
    getCurrentBalance: jest.fn(),
    getBalanceHistory: jest.fn(),
    getMonthlyStats: jest.fn(),
    registerBalance: jest.fn(),
  },
}));

describe('useBalance', () => {
  const mockUserId = 'test-user-id';
  const mockBalanceRegistration = {
    id: '1',
    userId: mockUserId,
    date: new Date(),
    type: 'income' as const,
    description: 'Test income',
    amount: 1000,
    category: 'Test',
    balanceAfter: 1000,
    month: 1,
    year: 2024,
    createdAt: new Date(),
  };
  const mockMonthlyStats = {
    id: '2024-01_test-user-id',
    userId: mockUserId,
    month: 1,
    year: 2024,
    totalIncome: 1000,
    totalExpenses: 500,
    balance: 500,
    percentages: {
      needs: 30,
      wants: 20,
      savings: 50,
      investment: 0,
    },
    variation: {
      balanceChange: 500,
      percentageChange: 100,
      previousMonthBalance: 0,
    },
    lastUpdated: new Date(),
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useBalance(mockUserId));

      expect(result.current.currentBalance).toBe(0);
      expect(result.current.balanceHistory).toEqual([]);
      expect(result.current.monthlyStats).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('loadCurrentBalance', () => {
    it('should load current balance successfully', async () => {
      (BalanceService.getCurrentBalance as jest.Mock).mockResolvedValue(5000);

      const { result } = renderHook(() => useBalance(mockUserId));

      await act(async () => {
        await result.current.loadCurrentBalance();
      });

      expect(result.current.currentBalance).toBe(5000);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading errors', async () => {
      const mockError = new Error('Failed to load balance');
      (BalanceService.getCurrentBalance as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBalance(mockUserId));

      await act(async () => {
        await result.current.loadCurrentBalance();
      });

      expect(result.current.currentBalance).toBe(0);
      expect(result.current.error).toBe('Error al cargar el balance actual');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('loadBalanceHistory', () => {
    it('should load balance history successfully', async () => {
      const mockHistory = [mockBalanceRegistration];
      (BalanceService.getBalanceHistory as jest.Mock).mockResolvedValue(mockHistory);

      const { result } = renderHook(() => useBalance(mockUserId));

      await act(async () => {
        await result.current.loadBalanceHistory();
      });

      expect(result.current.balanceHistory).toEqual(mockHistory);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading errors', async () => {
      const mockError = new Error('Failed to load history');
      (BalanceService.getBalanceHistory as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBalance(mockUserId));

      await act(async () => {
        await result.current.loadBalanceHistory();
      });

      expect(result.current.balanceHistory).toEqual([]);
      expect(result.current.error).toBe('Error al cargar el historial de balance');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('loadMonthlyStats', () => {
    it('should load monthly stats successfully', async () => {
      (BalanceService.getMonthlyStats as jest.Mock).mockResolvedValue(mockMonthlyStats);

      const { result } = renderHook(() => useBalance(mockUserId));

      await act(async () => {
        await result.current.loadMonthlyStats();
      });

      expect(result.current.monthlyStats).toEqual(mockMonthlyStats);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading errors', async () => {
      const mockError = new Error('Failed to load stats');
      (BalanceService.getMonthlyStats as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBalance(mockUserId));

      await act(async () => {
        await result.current.loadMonthlyStats();
      });

      expect(result.current.monthlyStats).toBeNull();
      expect(result.current.error).toBe('Error al cargar las estadísticas mensuales');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('registerBalance', () => {
    it('should register balance successfully', async () => {
      (BalanceService.registerBalance as jest.Mock).mockResolvedValue({
        success: true,
        balanceRegistration: mockBalanceRegistration,
      });
      (BalanceService.getCurrentBalance as jest.Mock).mockResolvedValue(1000);
      (BalanceService.getBalanceHistory as jest.Mock).mockResolvedValue([mockBalanceRegistration]);
      (BalanceService.getMonthlyStats as jest.Mock).mockResolvedValue(mockMonthlyStats);

      const { result } = renderHook(() => useBalance(mockUserId));

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.registerBalance(
          'income',
          'Test income',
          1000,
          'Test'
        );
      });

      expect(registerResult!).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle registration errors', async () => {
      (BalanceService.registerBalance as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Registration failed',
      });

      const { result } = renderHook(() => useBalance(mockUserId));

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.registerBalance(
          'income',
          'Test income',
          1000,
          'Test'
        );
      });

      expect(registerResult!).toBe(false);
      expect(result.current.error).toBe('Registration failed');
      expect(result.current.loading).toBe(false);
    });

    it('should handle service errors', async () => {
      const mockError = new Error('Service error');
      (BalanceService.registerBalance as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBalance(mockUserId));

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.registerBalance(
          'income',
          'Test income',
          1000,
          'Test'
        );
      });

      expect(registerResult!).toBe(false);
      expect(result.current.error).toBe('Error al registrar el balance');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useEffect initialization', () => {
    it('should load data on mount with valid userId', async () => {
      (BalanceService.getCurrentBalance as jest.Mock).mockResolvedValue(5000);
      (BalanceService.getBalanceHistory as jest.Mock).mockResolvedValue([]);
      (BalanceService.getMonthlyStats as jest.Mock).mockResolvedValue(mockMonthlyStats);

      renderHook(() => useBalance(mockUserId));

      // Wait for async operations
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(BalanceService.getCurrentBalance).toHaveBeenCalledWith(mockUserId);
      expect(BalanceService.getBalanceHistory).toHaveBeenCalledWith(mockUserId);
      expect(BalanceService.getMonthlyStats).toHaveBeenCalled();
    });

    it('should not load data with invalid userId', () => {
      renderHook(() => useBalance('user-id'));

      expect(BalanceService.getCurrentBalance).not.toHaveBeenCalled();
      expect(BalanceService.getBalanceHistory).not.toHaveBeenCalled();
      expect(BalanceService.getMonthlyStats).not.toHaveBeenCalled();
    });

    it('should not load data with empty userId', () => {
      renderHook(() => useBalance(''));

      expect(BalanceService.getCurrentBalance).not.toHaveBeenCalled();
      expect(BalanceService.getBalanceHistory).not.toHaveBeenCalled();
      expect(BalanceService.getMonthlyStats).not.toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should set loading to true during operations', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      (BalanceService.getCurrentBalance as jest.Mock).mockReturnValue(promise);

      const { result } = renderHook(() => useBalance(mockUserId));

      await act(async () => {
        result.current.loadCurrentBalance();
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolvePromise!(5000);
      });

      expect(result.current.loading).toBe(false);
    });
  });
});
