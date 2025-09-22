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
    ahorro: { percentage: number; amount: number; previousChange: number };
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
    savings: number;
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

// Nuevos tipos para el registro de balance
export interface BalanceRecord {
  id: string;
  amount: number;
  category: BalanceCategory;
}

export type BalanceCategory = 'Ingreso' | 'Deuda' | 'Consumo' | 'Necesidad' | 'Inversión';

export interface BalanceRegistrationData {
  currentAmount: number;
  records: BalanceRecord[];
}

export type RootStackParamList = {
  Login: { onLoginSuccess: () => void };
  Register: { onRegistrationSuccess: () => void };
  Onboarding: { onComplete: () => void };
  Dashboard: undefined;
  Transactions: undefined;
  Profile: undefined;
  BalanceRegistration: { onComplete: () => void };
};
