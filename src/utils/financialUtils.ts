// Utilidades para cálculos financieros

export interface ScoreStatus {
  text: string;
  color: string;
  emoji: string;
  level: 'excellent' | 'good' | 'needs_improvement';
}

export const getScoreStatus = (score: number): ScoreStatus => {
  if (score >= 60) {
    return {
      text: '¡Excelente! Estás en zona óptima',
      color: '#16a34a',
      emoji: '🚀',
      level: 'excellent'
    };
  }
  
  if (score >= 40) {
    return {
      text: 'Bien, mantén el ritmo',
      color: '#ea580c',
      emoji: '💪',
      level: 'good'
    };
  }
  
  return {
    text: 'Necesitas mejorar',
    color: '#dc2626',
    emoji: '⚠️',
    level: 'needs_improvement'
  };
};

export const calculateFinancialHealth = (data: {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  savingsGoal: number;
}): number => {
  const { monthlyIncome, monthlyExpenses, currentSavings, savingsGoal } = data;
  
  // Calcular ratio de gastos vs ingresos (40% del score)
  const expenseRatio = monthlyExpenses / monthlyIncome;
  const expenseScore = Math.max(0, 40 - (expenseRatio - 0.5) * 80);
  
  // Calcular ratio de disponibles vs meta (30% del score)
  const savingsRatio = currentSavings / savingsGoal;
  const savingsScore = Math.min(30, savingsRatio * 30);
  
  // Calcular estabilidad financiera (30% del score)
  const stabilityScore = Math.min(30, (monthlyIncome - monthlyExpenses) * 0.01);
  
  return Math.round(expenseScore + savingsScore + stabilityScore);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

export const calculateExpensePercentages = (expenses: {
  needs: number;
  wants: number;
  savings: number;
}): {
  needs: number;
  wants: number;
  savings: number;
} => {
  const total = expenses.needs + expenses.wants + expenses.savings;
  
  if (total === 0) {
    return { needs: 0, wants: 0, savings: 0 };
  }
  
  return {
    needs: Math.round((expenses.needs / total) * 100),
    wants: Math.round((expenses.wants / total) * 100),
    savings: Math.round((expenses.savings / total) * 100),
  };
};

export const getFinancialAdvice = (score: number): string[] => {
  const advice: string[] = [];
  
  if (score < 40) {
    advice.push('Reduce tus gastos no esenciales');
    advice.push('Crea un presupuesto mensual detallado');
    advice.push('Establece una meta de disponible realista');
  } else if (score < 60) {
    advice.push('Mantén el control de tus gastos');
    advice.push('Considera aumentar tu porcentaje de disponible');
    advice.push('Revisa tus gastos recurrentes');
  } else {
    advice.push('¡Excelente trabajo! Mantén esta disciplina');
    advice.push('Considera invertir parte de tus disponibles');
    advice.push('Evalúa oportunidades de crecimiento');
  }
  
  return advice;
};
