import { FinancialData, Transaction } from '../types';

// Simulación de servicio financiero
export class FinancialService {
  private static data: FinancialData = {
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactions: [],
  };

  static async getFinancialData(): Promise<FinancialData> {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.data };
  }

  static async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    this.data.transactions.push(newTransaction);
    this.updateCalculations();
    
    return newTransaction;
  }

  static async getTransactions(): Promise<Transaction[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.data.transactions];
  }

  private static updateCalculations(): void {
    this.data.balance = this.calculateBalance();
    this.data.monthlyIncome = this.calculateMonthlyIncome();
    this.data.monthlyExpenses = this.calculateMonthlyExpenses();
  }

  private static calculateBalance(): number {
    return this.data.transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  }

  private static calculateMonthlyIncome(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.data.transactions
      .filter(transaction => 
        transaction.type === 'income' &&
        transaction.date.getMonth() === currentMonth &&
        transaction.date.getFullYear() === currentYear
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  private static calculateMonthlyExpenses(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.data.transactions
      .filter(transaction => 
        transaction.type === 'expense' &&
        transaction.date.getMonth() === currentMonth &&
        transaction.date.getFullYear() === currentYear
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  }
}
