import { AuthService } from '../../services/authService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createUserData, fetchUserData } from '../../services/userService';
import { BalanceService } from '../../services/balanceService';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock User Service
jest.mock('../../services/userService', () => ({
  createUserData: jest.fn(),
  fetchUserData: jest.fn(),
}));

// Mock Balance Service
jest.mock('../../services/balanceService', () => ({
  BalanceService: {
    createInitialBalance: jest.fn(),
    registerBalance: jest.fn(),
    createInitialMonthlyStats: jest.fn(),
  },
}));

// Mock Firebase Auth instance
const mockAuth = {
  currentUser: null,
};

jest.mock('../../firebase/config', () => ({
  auth: mockAuth,
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
      (fetchUserData as jest.Mock).mockResolvedValue({
        id: 'test-uid',
        email: 'test@example.com',
        name: 'Test User',
      });

      const result = await AuthService.login(mockCredentials);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, mockCredentials.email, mockCredentials.password);
      expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid credentials', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'wrongpassword' };
      const mockError = new Error('Invalid credentials');
      
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login(mockCredentials)).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      const mockError = new Error('Network error');
      
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login(mockCredentials)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    const mockOnboardingData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      age: 25,
      monthlyIncome: 5000,
      savingsPercentage: 20,
      needsPercentage: 50,
      consumptionPercentage: 20,
      investmentPercentage: 10,
      currentSavings: 1000,
      password: 'password123',
      financialProfile: ['conservador'],
    };

    it('should register user successfully with complete data', async () => {
      const mockUser = { uid: 'test-uid', email: 'john@example.com' };
      
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
      (createUserData as jest.Mock).mockResolvedValue(undefined);
      (BalanceService.createInitialBalance as jest.Mock).mockResolvedValue(undefined);
      (BalanceService.registerBalance as jest.Mock).mockResolvedValue({ success: true });
      (BalanceService.createInitialMonthlyStats as jest.Mock).mockResolvedValue(undefined);

      const result = await AuthService.register(mockOnboardingData);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, mockOnboardingData.email, mockOnboardingData.password);
      expect(createUserData).toHaveBeenCalledWith(mockUser.uid, expect.objectContaining({
        name: mockOnboardingData.firstName,
        last_name: mockOnboardingData.lastName,
        email: mockOnboardingData.email,
        age: mockOnboardingData.age,
      }));
      expect(result).toEqual(mockUser);
    });

    it('should throw error for missing required fields', async () => {
      const incompleteData = {
        ...mockOnboardingData,
        firstName: '',
      };

      await expect(AuthService.register(incompleteData)).rejects.toThrow('Todos los campos son requeridos');
    });

    it('should handle email already in use error', async () => {
      const mockError = { code: 'auth/email-already-in-use' };
      
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(mockOnboardingData)).rejects.toThrow('Este correo electrónico ya está registrado. Por favor, usa otro email o inicia sesión.');
    });

    it('should handle other Firebase errors', async () => {
      const mockError = { code: 'auth/weak-password', message: 'Password is too weak' };
      
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(mockOnboardingData)).rejects.toThrow(mockError);
    });

    it('should handle user data creation failure', async () => {
      const mockUser = { uid: 'test-uid', email: 'john@example.com' };
      const mockError = new Error('Failed to create user data');
      
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
      (createUserData as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(mockOnboardingData)).rejects.toThrow('Failed to create user data');
    });

    it('should handle balance service failures gracefully', async () => {
      const mockUser = { uid: 'test-uid', email: 'john@example.com' };
      
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
      (createUserData as jest.Mock).mockResolvedValue(undefined);
      (BalanceService.createInitialBalance as jest.Mock).mockRejectedValue(new Error('Balance service error'));

      // Should still succeed even if balance services fail
      const result = await AuthService.register(mockOnboardingData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      await AuthService.logout();

      expect(signOut).toHaveBeenCalledWith(mockAuth);
    });

    it('should handle logout errors', async () => {
      const mockError = new Error('Logout failed');
      (signOut as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      mockAuth.currentUser = mockUser;

      const result = AuthService.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it('should return null when not authenticated', () => {
      mockAuth.currentUser = null;

      const result = AuthService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      mockAuth.currentUser = { uid: 'test-uid' };

      const result = AuthService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      mockAuth.currentUser = null;

      const result = AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});