import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { FinancialDataProvider, useFinancialData } from '../../contexts/FinancialDataContext';
import { useUser } from '../../contexts/UserContext';
import { useBalance } from '../../hooks/useBalance';

// Mock dependencies
jest.mock('../../contexts/UserContext');
jest.mock('../../hooks/useBalance');

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseBalance = useBalance as jest.MockedFunction<typeof useBalance>;

// Test component to access context
const TestComponent = () => {
  const context = useFinancialData();
  return (
    <div>
      <div data-testid="currentBalance">{context.currentBalance}</div>
      <div data-testid="loading">{context.loading.toString()}</div>
      <div data-testid="error">{context.error || 'no-error'}</div>
      <div data-testid="userName">{context.userData.name}</div>
      <div data-testid="monthlyIncome">{context.userData.monthlyIncome}</div>
    </div>
  );
};

describe('FinancialDataContext', () => {
  const mockUser = {
    id: 'test-user-id',
    name: 'Test User',
    firstName: 'Test',
    monthlyIncome: 5000,
    currentScore: 85,
    riskScore: 3,
    monthlyExpenses: 3000,
    currentSavings: 2000,
    savingsGoal: 10000,
    alerts: 2,
  };

  const mockBalanceData = {
    currentBalance: 2000,
    balanceHistory: [],
    monthlyStats: {
      id: '2024-01_test-user-id',
      userId: 'test-user-id',
      month: 1,
      year: 2024,
      totalIncome: 5000,
      totalExpenses: 3000,
      balance: 2000,
      percentages: {
        needs: 50,
        wants: 20,
        savings: 30,
        investment: 0,
      },
      variation: {
        balanceChange: 2000,
        percentageChange: 100,
        previousMonthBalance: 0,
      },
      lastUpdated: new Date(),
      createdAt: new Date(),
    },
    loading: false,
    loadCurrentBalance: jest.fn(),
    loadBalanceHistory: jest.fn(),
    loadMonthlyStats: jest.fn(),
    registerBalance: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide financial data context', async () => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      updateUser: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      loading: false,
    });

    mockUseBalance.mockReturnValue(mockBalanceData);

    const { getByTestId } = render(
      <FinancialDataProvider>
        <TestComponent />
      </FinancialDataProvider>
    );

    await waitFor(() => {
      expect(getByTestId('currentBalance')).toHaveTextContent('2000');
      expect(getByTestId('loading')).toHaveTextContent('false');
      expect(getByTestId('error')).toHaveTextContent('no-error');
      expect(getByTestId('userName')).toHaveTextContent('Test User');
      expect(getByTestId('monthlyIncome')).toHaveTextContent('5000');
    });
  });

  it('should handle loading state', async () => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      updateUser: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      loading: false,
    });

    mockUseBalance.mockReturnValue({
      ...mockBalanceData,
      loading: true,
    });

    const { getByTestId } = render(
      <FinancialDataProvider>
        <TestComponent />
      </FinancialDataProvider>
    );

    expect(getByTestId('loading')).toHaveTextContent('true');
  });

  it('should handle error state', async () => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      updateUser: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      loading: false,
    });

    mockUseBalance.mockReturnValue({
      ...mockBalanceData,
      error: 'Test error',
    });

    const { getByTestId } = render(
      <FinancialDataProvider>
        <TestComponent />
      </FinancialDataProvider>
    );

    expect(getByTestId('error')).toHaveTextContent('Test error');
  });

  it('should handle missing user data', async () => {
    mockUseUser.mockReturnValue({
      user: null,
      setUser: jest.fn(),
      updateUser: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      loading: false,
    });

    mockUseBalance.mockReturnValue({
      ...mockBalanceData,
      currentBalance: 0,
      monthlyStats: null,
    });

    const { getByTestId } = render(
      <FinancialDataProvider>
        <TestComponent />
      </FinancialDataProvider>
    );

    expect(getByTestId('userName')).toHaveTextContent('Usuario');
    expect(getByTestId('monthlyIncome')).toHaveTextContent('0');
  });

  it('should calculate financial data correctly', async () => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      updateUser: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      loading: false,
    });

    mockUseBalance.mockReturnValue(mockBalanceData);

    const TestFinancialData = () => {
      const context = useFinancialData();
      return (
        <div>
          <div data-testid="consumo-percentage">{context.financialData.consumo.percentage}</div>
          <div data-testid="necesidades-percentage">{context.financialData.necesidades.percentage}</div>
          <div data-testid="disponible-percentage">{context.financialData.disponible.percentage}</div>
          <div data-testid="invertido-percentage">{context.financialData.invertido.percentage}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <FinancialDataProvider>
        <TestFinancialData />
      </FinancialDataProvider>
    );

    await waitFor(() => {
      expect(getByTestId('consumo-percentage')).toHaveTextContent('20');
      expect(getByTestId('necesidades-percentage')).toHaveTextContent('50');
      expect(getByTestId('disponible-percentage')).toHaveTextContent('30');
      expect(getByTestId('invertido-percentage')).toHaveTextContent('0');
    });
  });

  it('should handle missing monthly stats', async () => {
    mockUseUser.mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      updateUser: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      loading: false,
    });

    mockUseBalance.mockReturnValue({
      ...mockBalanceData,
      monthlyStats: null,
    });

    const TestFinancialData = () => {
      const context = useFinancialData();
      return (
        <div>
          <div data-testid="consumo-percentage">{context.financialData.consumo.percentage}</div>
          <div data-testid="necesidades-percentage">{context.financialData.necesidades.percentage}</div>
          <div data-testid="disponible-percentage">{context.financialData.disponible.percentage}</div>
          <div data-testid="invertido-percentage">{context.financialData.invertido.percentage}</div>
        </div>
      );
    };

    const { getByTestId } = render(
      <FinancialDataProvider>
        <TestFinancialData />
      </FinancialDataProvider>
    );

    await waitFor(() => {
      expect(getByTestId('consumo-percentage')).toHaveTextContent('0');
      expect(getByTestId('necesidades-percentage')).toHaveTextContent('0');
      expect(getByTestId('disponible-percentage')).toHaveTextContent('0');
      expect(getByTestId('invertido-percentage')).toHaveTextContent('0');
    });
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFinancialData must be used within a FinancialDataProvider');

    consoleSpy.mockRestore();
  });
});
