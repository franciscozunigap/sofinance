export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  monthlyIncome: number;
  savingsPercentage: number;
  needsPercentage: number;
  consumptionPercentage: number;
  currentSavings: number;
  password: string;
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
  Login: undefined;
  Dashboard: undefined;
  Transactions: undefined;
  Profile: undefined;
};
