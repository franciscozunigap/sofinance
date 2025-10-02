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
    console.log('🔄 [FinancialDataContext] Iniciando refreshData...');
    try {
      setError(null);
      console.log('🔄 [FinancialDataContext] Cargando datos en paralelo...');
      await Promise.all([
        loadCurrentBalance(),
        loadBalanceHistory(),
        loadMonthlyStats()
      ]);
      console.log('✅ [FinancialDataContext] Datos refrescados exitosamente');
    } catch (err) {
      console.error('💥 [FinancialDataContext] Error durante refreshData:', err);
      setError('Error al actualizar los datos');
    }
  };

  // Datos del usuario calculados - usar solo monthlyStats como fuente única
  const userData = {
    name: user?.name || user?.firstName || 'Usuario',
    monthlyIncome: monthlyStats?.totalIncome || user?.monthlyIncome || 0,
    currentScore: user?.currentScore || 0,
    riskScore: user?.riskScore || 0,
    monthlyExpenses: monthlyStats?.totalExpenses || user?.monthlyExpenses || 0,
    currentSavings: currentBalance || 0,
    savingsGoal: user?.savingsGoal || 0,
    alerts: user?.alerts || 0,
  };


  // Datos financieros calculados basándose en monthlyStats
  const financialData = monthlyStats ? {
    consumo: { 
      percentage: monthlyStats.percentages.wants, 
      amount: monthlyStats.totalExpenses * (monthlyStats.percentages.wants / 100), 
      previousChange: 0 
    },
    necesidades: { 
      percentage: monthlyStats.percentages.needs, 
      amount: monthlyStats.totalExpenses * (monthlyStats.percentages.needs / 100), 
      previousChange: 0 
    },
    disponible: { 
      percentage: monthlyStats.percentages.savings, 
      amount: monthlyStats.balance, 
      previousChange: 0 
    },
    invertido: { 
      percentage: monthlyStats.percentages.investment, 
      amount: monthlyStats.totalExpenses * (monthlyStats.percentages.investment / 100), 
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
