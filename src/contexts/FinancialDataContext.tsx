import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';
import { useBalance } from '../hooks/useBalance';
import { MonthlyStats, BalanceRegistration } from '../types';

interface FinancialDataContextType {
  // Datos del balance
  currentBalance: number;
  balanceHistory: BalanceRegistration[];
  monthlyStats: MonthlyStats | null;
  
  // Estados de carga
  loading: boolean;
  error: string | null;
  
  // Funciones para actualizar datos
  refreshData: () => Promise<void>;
  registerBalance: (type: 'income' | 'expense' | 'adjustment', description: string, amount: number, category: string) => Promise<boolean>;
  
  // Datos calculados para la UI
  financialData: {
    consumo: { percentage: number; amount: number; previousChange: number };
    necesidades: { percentage: number; amount: number; previousChange: number };
    disponible: { percentage: number; amount: number; previousChange: number };
    invertido: { percentage: number; amount: number; previousChange: number };
  };
  
  // Datos del usuario
  userData: {
    name: string;
    monthlyIncome: number;
    currentScore: number;
    riskScore: number;
    monthlyExpenses: number;
    currentSavings: number;
    savingsGoal: number;
    alerts: number;
  };
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

interface FinancialDataProviderProps {
  children: ReactNode;
}

export const FinancialDataProvider: React.FC<FinancialDataProviderProps> = ({ children }) => {
  const { user } = useUser();
  const { 
    currentBalance, 
    monthlyStats, 
    balanceHistory, 
    loading: balanceLoading,
    loadCurrentBalance,
    loadBalanceHistory,
    loadMonthlyStats,
    registerBalance
  } = useBalance(user?.id || 'user-id');

  const [error, setError] = useState<string | null>(null);

  // Función para refrescar todos los datos
  const refreshData = async () => {
    try {
      setError(null);
      await Promise.all([
        loadCurrentBalance(),
        loadBalanceHistory(),
        loadMonthlyStats()
      ]);
    } catch (err) {
      setError('Error al actualizar los datos');
      console.error('Error refreshing data:', err);
    }
  };

  // Datos del usuario calculados
  const userData = {
    name: user?.name || user?.firstName || 'Usuario',
    monthlyIncome: user?.monthlyIncome || user?.wallet?.monthly_income || 0,
    currentScore: user?.currentScore || 0,
    riskScore: user?.riskScore || 0,
    monthlyExpenses: monthlyStats?.totalExpenses || user?.monthlyExpenses || 0,
    currentSavings: currentBalance || user?.currentSavings || user?.wallet?.amount || 0,
    savingsGoal: user?.savingsGoal || 0,
    alerts: user?.alerts || 0,
  };

  // Datos financieros calculados basándose en monthlyStats
  const financialData = monthlyStats ? {
    consumo: { 
      percentage: monthlyStats.percentages.wants, 
      amount: monthlyStats.totalIncome * (monthlyStats.percentages.wants / 100), 
      previousChange: 0 
    },
    necesidades: { 
      percentage: monthlyStats.percentages.needs, 
      amount: monthlyStats.totalIncome * (monthlyStats.percentages.needs / 100), 
      previousChange: 0 
    },
    disponible: { 
      percentage: monthlyStats.percentages.savings, 
      amount: monthlyStats.totalIncome * (monthlyStats.percentages.savings / 100), 
      previousChange: 0 
    },
    invertido: { 
      percentage: monthlyStats.percentages.investment, 
      amount: monthlyStats.totalIncome * (monthlyStats.percentages.investment / 100), 
      previousChange: 0 
    }
  } : {
    consumo: { percentage: 0, amount: 0, previousChange: 0 },
    necesidades: { percentage: 0, amount: 0, previousChange: 0 },
    disponible: { percentage: 0, amount: 0, previousChange: 0 },
    invertido: { percentage: 0, amount: 0, previousChange: 0 }
  };

  const value: FinancialDataContextType = {
    currentBalance,
    balanceHistory,
    monthlyStats,
    loading: balanceLoading,
    error,
    refreshData,
    registerBalance,
    financialData,
    userData,
  };

  return (
    <FinancialDataContext.Provider value={value}>
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
