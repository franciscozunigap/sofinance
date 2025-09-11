import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number;
  currentScore: number;
  riskScore: number;
  monthlyExpenses: number;
  currentSavings: number;
  savingsGoal: number;
  alerts: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Datos de ejemplo del usuario
  const defaultUser: User = {
    id: '1',
    name: 'María',
    email: 'maria@example.com',
    monthlyIncome: 4200,
    currentScore: 52,
    riskScore: 48,
    monthlyExpenses: 3180,
    currentSavings: 12500,
    savingsGoal: 18000,
    alerts: 3
  };

  useEffect(() => {
    // Simular carga de datos del usuario
    setUser(defaultUser);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value: UserContextType = {
    user,
    setUser,
    updateUser,
    logout,
    isAuthenticated
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
