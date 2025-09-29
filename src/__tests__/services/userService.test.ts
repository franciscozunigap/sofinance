import { fetchUserData, createUserData, checkEmailExists } from '../../services/userService';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock Firebase config
jest.mock('../../firebase/config', () => ({
  db: {},
}));

describe('UserService', () => {
  const mockUserId = 'test-user-id';
  const mockDocRef = { id: 'test-doc-id' };
  const mockDocSnap = {
    exists: jest.fn(),
    data: jest.fn(),
  };
  const mockQuerySnapshot = {
    empty: false,
    docs: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('fetchUserData', () => {
    it('should fetch and map user data correctly', async () => {
      const mockUserData = {
        email: 'test@example.com',
        name: 'John',
        last_name: 'Doe',
        age: 25,
        wallet: {
          monthly_income: 5000,
          amount: 1000,
        },
        preferences: {
          needs_percent: 50,
          saving_percent: 20,
          wants_percent: 20,
        },
        financial_profile: 'conservador',
        savings_goal: 10000,
      };

      mockDocSnap.exists.mockReturnValue(true);
      mockDocSnap.data.mockReturnValue(mockUserData);
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await fetchUserData(mockUserId);

      expect(result).toEqual({
        id: mockUserId,
        email: 'test@example.com',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        monthlyIncome: 5000,
        currentSavings: 0, // Should be 0 as per the service logic
        preferences: {
          needs_percent: 50,
          saving_percent: 20,
          wants_percent: 20,
        },
        wallet: {
          monthly_income: 5000,
          amount: 1000,
        },
        financialProfile: 'conservador',
        currentScore: 0,
        riskScore: 0,
        monthlyExpenses: 0,
        savingsGoal: 10000,
        alerts: 0,
      });
    });

    it('should handle missing user document', async () => {
      mockDocSnap.exists.mockReturnValue(false);
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await fetchUserData(mockUserId);

      expect(result).toBeNull();
    });

    it('should handle partial user data with defaults', async () => {
      const partialUserData = {
        email: 'test@example.com',
        name: 'John',
        // Missing last_name, age, wallet, etc.
      };

      mockDocSnap.exists.mockReturnValue(true);
      mockDocSnap.data.mockReturnValue(partialUserData);
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await fetchUserData(mockUserId);

      expect(result).toEqual({
        id: mockUserId,
        email: 'test@example.com',
        name: 'John',
        firstName: 'John',
        lastName: '',
        age: 0,
        monthlyIncome: 0,
        currentSavings: 0,
        preferences: {
          needs_percent: 0,
          saving_percent: 0,
          wants_percent: 0,
        },
        wallet: {
          monthly_income: 0,
          amount: 0,
        },
        financialProfile: '',
        currentScore: 0,
        riskScore: 0,
        monthlyExpenses: 0,
        savingsGoal: 0,
        alerts: 0,
      });
    });

    it('should handle Firebase errors', async () => {
      const mockError = new Error('Firebase error');
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockRejectedValue(mockError);

      const result = await fetchUserData(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('createUserData', () => {
    it('should create user data successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'John',
        last_name: 'Doe',
        age: 25,
      };

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      await createUserData(mockUserId, userData);

      expect(setDoc).toHaveBeenCalledWith(mockDocRef, userData);
    });

    it('should handle creation errors', async () => {
      const userData = { email: 'test@example.com' };
      const mockError = new Error('Creation failed');

      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (setDoc as jest.Mock).mockRejectedValue(mockError);

      await expect(createUserData(mockUserId, userData)).rejects.toThrow('Creation failed');
    });
  });

  describe('checkEmailExists', () => {
    it('should return true when email exists', async () => {
      mockQuerySnapshot.empty = false;
      (collection as jest.Mock).mockReturnValue({});
      (query as jest.Mock).mockReturnValue({});
      (where as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await checkEmailExists('test@example.com');

      expect(result).toBe(true);
    });

    it('should return false when email does not exist', async () => {
      mockQuerySnapshot.empty = true;
      (collection as jest.Mock).mockReturnValue({});
      (query as jest.Mock).mockReturnValue({});
      (where as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await checkEmailExists('nonexistent@example.com');

      expect(result).toBe(false);
    });

    it('should handle query errors', async () => {
      const mockError = new Error('Query failed');
      (collection as jest.Mock).mockReturnValue({});
      (query as jest.Mock).mockReturnValue({});
      (where as jest.Mock).mockReturnValue({});
      (getDocs as jest.Mock).mockRejectedValue(mockError);

      await expect(checkEmailExists('test@example.com')).rejects.toThrow('Query failed');
    });
  });
});
