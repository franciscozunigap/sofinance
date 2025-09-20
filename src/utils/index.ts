// Re-exportar utilidades desde archivos específicos
export * from './validation';
export * from './financialUtils';

import { Transaction } from '../types';

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, transaction) => {
    return transaction.type === 'income' 
      ? balance + transaction.amount 
      : balance - transaction.amount;
  }, 0);
};

export const calculateMonthlyIncome = (transactions: Transaction[]): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter(transaction => 
      transaction.type === 'income' &&
      transaction.date.getMonth() === currentMonth &&
      transaction.date.getFullYear() === currentYear
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter(transaction => 
      transaction.type === 'expense' &&
      transaction.date.getMonth() === currentMonth &&
      transaction.date.getFullYear() === currentYear
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
};
