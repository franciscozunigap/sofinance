export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  // Financial data
  monthlyIncome?: number;
  currentScore?: number;
  riskScore?: number;
  monthlyExpenses?: number;
  currentSavings?: number;
  savingsGoal?: number;
  alerts?: number;
  // Financial data structure
  financialData?: {
    consumo: { percentage: number; amount: number; previousChange: number };
    necesidades: { percentage: number; amount: number; previousChange: number };
    disponible: { percentage: number; amount: number; previousChange: number };
    invertido: { percentage: number; amount: number; previousChange: number };
  };
  // Preferences
  preferences?: {
    needs_percent: number;
    saving_percent: number;
    wants_percent: number;
  };
  // Wallet
  wallet?: {
    monthly_income: number;
    amount: number;
  };
  // Financial Profile
  financialProfile?: string;
}

export interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  monthlyIncome: number;
  savingsPercentage: number;
  needsPercentage: number;
  consumptionPercentage: number;
  investmentPercentage: number;
  currentSavings: number;
  password: string;
  financialProfile: string[];
}

export interface FinancialProfileTag {
  id: string;
  label: string;
  category: 'gastos' | 'ingresos' | 'activos' | 'responsabilidades';
  icon: string;
}

export interface FinancialData {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  date: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipos para la estructura unificada de balance
export interface BalanceTransaction {
  id: string;
  amount: number;
  category: BalanceCategory;
  description: string;
  date: Date;
  type: 'income' | 'expense' | 'investment';
}

export type BalanceCategory = 'Ingreso' | 'Deuda' | 'Consumo' | 'Necesidad' | 'Inversión';

// Estructura simplificada para registros de balance
export interface BalanceRegistration {
  id: string;
  userId: string;
  date: Date;
  type: 'income' | 'expense' | 'adjustment';
  description: string;
  amount: number;
  category: string;
  balanceAfter: number; // Balance después de esta transacción
  month: number;
  year: number;
  createdAt: Date;
}

// Estadísticas mensuales
export interface MonthlyStats {
  id: string; // formato: "2024-01_userId"
  userId: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  percentages: {
    needs: number;
    wants: number;
    savings: number;
    investment: number;
  };
  variation: {
    balanceChange: number;
    percentageChange: number;
    previousMonthBalance: number;
  };
  lastUpdated: Date;
  createdAt: Date;
}

// Balance actual simple
export interface BalanceData {
  userId: string;
  currentBalance: number;
  lastUpdated: Date;
}

// Mantener compatibilidad con el código existente
export interface BalanceRecord {
  id: string;
  type?: 'income' | 'expense';
  description?: string;
  amount: string | number;
  category: BalanceCategory;
}

export interface BalanceRegistrationData {
  currentAmount: number;
  records: BalanceRecord[];
}

// ✅ ELIMINADO: BalanceData - Ya no se usa colección 'balances'
// La información del balance actual ahora viene de monthly_stats

export type RootStackParamList = {
  Login: { onLoginSuccess: () => void };
  Register: { onRegistrationSuccess: () => void };
  Onboarding: { onComplete: () => void };
  Dashboard: undefined;
  Transactions: undefined;
  Profile: undefined;
  BalanceRegistration: { onComplete: () => void };
};
