import { AuthService } from '../../services/authService';
import { LoginCredentials, OnboardingData } from '../../types';

// Mock de Firebase Auth
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,
}));

// Mock de servicios
const mockCreateUserData = jest.fn();
const mockCheckEmailExists = jest.fn();

jest.mock('../../services/userService', () => ({
  createUserData: mockCreateUserData,
  checkEmailExists: mockCheckEmailExists,
}));

// Mock de BalanceService
const mockCreateInitialBalance = jest.fn();
const mockCreateInitialMonthlyStats = jest.fn();

jest.mock('../../services/balanceService', () => ({
  BalanceService: {
    createInitialBalance: mockCreateInitialBalance,
    createInitialMonthlyStats: mockCreateInitialMonthlyStats,
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      mockSignInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

      const result = await AuthService.login(credentials);

      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        credentials.email,
        credentials.password
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const error = new Error('Invalid credentials');
      mockSignInWithEmailAndPassword.mockRejectedValue(error);

      await expect(AuthService.login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const error = new Error('Network error');
      mockSignInWithEmailAndPassword.mockRejectedValue(error);

      await expect(AuthService.login(credentials)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    const validOnboardingData: OnboardingData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'test@example.com',
      age: 25,
      password: 'password123',
      monthlyIncome: 500000,
      savingsPercentage: 10,
      needsPercentage: 50,
      consumptionPercentage: 30,
      investmentPercentage: 10,
      currentSavings: 100000,
      financialProfile: ['ahorro', 'inversion']
    };

    it('should register successfully with valid data', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      mockCreateUserData.mockResolvedValue(undefined);
      mockCreateInitialBalance.mockResolvedValue(undefined);
      mockCreateInitialMonthlyStats.mockResolvedValue(undefined);

      const result = await AuthService.register(validOnboardingData);

      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        validOnboardingData.email,
        validOnboardingData.password
      );
      expect(mockCreateUserData).toHaveBeenCalledWith(mockUser.uid, expect.objectContaining({
        name: validOnboardingData.firstName,
        last_name: validOnboardingData.lastName,
        email: validOnboardingData.email,
        age: validOnboardingData.age,
      }));
      expect(result).toEqual(mockUser);
    });

    it('should throw error for email already in use', async () => {
      const error = new Error('auth/email-already-in-use');
      error.code = 'auth/email-already-in-use';
      mockCreateUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(AuthService.register(validOnboardingData)).rejects.toThrow(
        'Este correo electrónico ya está registrado. Por favor, usa otro email o inicia sesión.'
      );
    });

    it('should throw error for missing required fields', async () => {
      const invalidData = {
        ...validOnboardingData,
        firstName: '',
        email: ''
      };

      await expect(AuthService.register(invalidData)).rejects.toThrow(
        'Todos los campos son requeridos'
      );
    });

    it('should handle Firebase errors', async () => {
      const error = new Error('Firebase error');
      mockCreateUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(AuthService.register(validOnboardingData)).rejects.toThrow('Firebase error');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockSignOut.mockResolvedValue(undefined);

      await AuthService.logout();

      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should handle logout errors', async () => {
      const error = new Error('Logout failed');
      mockSignOut.mockRejectedValue(error);

      await expect(AuthService.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('onAuthStateChanged', () => {
    it('should return unsubscribe function', () => {
      const mockUnsubscribe = jest.fn();
      mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe);

      const unsubscribe = AuthService.onAuthStateChanged(() => {});

      expect(mockOnAuthStateChanged).toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
