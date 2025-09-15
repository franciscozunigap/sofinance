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
  currentSavings: number;
  password: string;
  financialProfile?: string;
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

export type RootStackParamList = {
  Login: { onLoginSuccess: () => void };
  Register: { onRegistrationSuccess: () => void };
  Onboarding: { onComplete: () => void };
  Dashboard: undefined;
  Transactions: undefined;
  Profile: undefined;
};
