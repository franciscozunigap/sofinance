// Datos mock centralizados para toda la aplicación
export const MOCK_USER_DATA = {
  name: 'María',
  monthlyIncome: 4200000, // 4.200.000 pesos
  currentScore: 52,
  riskScore: 48,
  monthlyExpenses: 3180000, // 3.180.000 pesos
  currentSavings: 12500000, // 12.500.000 pesos
  savingsGoal: 18000000, // 18.000.000 pesos
  alerts: 3
};

export const DAILY_SCORE_DATA = [
  { day: 'Lun', score: 45 },
  { day: 'Mar', score: 48 },
  { day: 'Mié', score: 44 },
  { day: 'Jue', score: 52 },
  { day: 'Vie', score: 49 },
  { day: 'Sáb', score: 47 },
  { day: 'Dom', score: 50 }
];

export const MONTHLY_SCORE_DATA = [
  { week: 'Semana 1', score: 45 },
  { week: 'Semana 2', score: 48 },
  { week: 'Semana 3', score: 44 },
  { week: 'Semana 4', score: 52 }
];

export const EXPENSE_CATEGORIES = [
  { name: 'Necesidades', value: 1800000, color: '#ea580c' }, // 1.800.000 pesos
  { name: 'Consumo', value: 780000, color: '#fb923c' }, // 780.000 pesos
  { name: 'Ahorro', value: 600000, color: '#fed7aa' } // 600.000 pesos
];

export const WEEKLY_TREND = [
  { week: 'S1', gastos: 720000 }, // 720.000 pesos
  { week: 'S2', gastos: 890000 }, // 890.000 pesos
  { week: 'S3', gastos: 650000 }, // 650.000 pesos
  { week: 'S4', gastos: 920000 } // 920.000 pesos
];

export const RECENT_TRANSACTIONS = [
  { id: 1, description: 'Supermercado Jumbo', amount: -85000, category: 'Necesidades', date: '08 Sep', time: '14:30' }, // 85.000 pesos
  { id: 2, description: 'Cena en restaurante', amount: -45000, category: 'Consumo', date: '08 Sep', time: '21:15' }, // 45.000 pesos
  { id: 3, description: 'Netflix', amount: -10000, category: 'Consumo', date: '07 Sep', time: '16:45' }, // 10.000 pesos
  { id: 4, description: 'Transferencia Ahorro', amount: -150000, category: 'Ahorro', date: '07 Sep', time: '08:00' }, // 150.000 pesos
  { id: 5, description: 'Salario', amount: 4200000, category: 'Ingresos', date: '05 Sep', time: '09:00' }, // 4.200.000 pesos
  { id: 6, description: 'Compra en tienda', amount: -120000, category: 'Consumo', date: '06 Sep', time: '15:20' }, // 120.000 pesos
  { id: 7, description: 'Gasolina', amount: -35000, category: 'Necesidades', date: '06 Sep', time: '08:45' }, // 35.000 pesos
  { id: 8, description: 'Farmacia', amount: -25000, category: 'Necesidades', date: '05 Sep', time: '19:30' }, // 25.000 pesos
  { id: 9, description: 'Café', amount: -15000, category: 'Consumo', date: '05 Sep', time: '10:15' }, // 15.000 pesos
  { id: 10, description: 'Uber', amount: -18000, category: 'Necesidades', date: '04 Sep', time: '22:00' } // 18.000 pesos
];

export const ACHIEVEMENTS = [
  { id: 1, title: 'Consistencia Semanal', description: 'Registraste tus gastos 7 días seguidos', icon: '🎯', unlocked: true },
  { id: 2, title: 'Consumo Consciente', description: 'Redujiste gastos de consumo esta semana', icon: '🏆', unlocked: true },
  { id: 3, title: 'Meta del Mes', description: 'Cumple tu meta de disponible mensual', icon: '💎', unlocked: false }
];

export const CHAT_RESPONSES = [
  '¡Perfecto! Te ayudo a optimizar tus gastos. Veo que puedes reducir 15% en entretenimiento 📊',
  'Basándome en tu historial, te recomiendo ahorrar $300 este mes para alcanzar tu meta 💪',
  'Tu score está mejorando. ¿Te interesa ver estrategias para llegar a 60 puntos? 📈',
  'Detecté que gastas más los fines de semana. ¿Quieres un plan para controlarlo? 💡'
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 1,
    sender: 'sofia' as const,
    text: '¡Hola! 👋 Veo que tu score financiero está mejorando. ¿Te gustaría revisar algunas recomendaciones para este mes?',
    timestamp: '10:30 AM'
  }
];

// Configuración de gráficos
export const CHART_CONFIG = {
  lineChart: {
    color: '#858BF2',
    strokeWidth: 3,
    dotRadius: 6,
    activeDotRadius: 8
  },
  backgroundColor: '#f0f2ff',
  backgroundGradientFrom: '#f0f2ff',
  backgroundGradientTo: '#f0f2ff'
};

// Configuración de porcentajes
export const PERCENTAGE_DATA = [
  { label: 'Consumo', value: 42, color: '#ea580c', amount: 780000 }, // 780.000 pesos
  { label: 'Necesidades', value: 57, color: '#dc2626', amount: 1800000 }, // 1.800.000 pesos
  { label: 'Ahorro', value: 19, color: '#16a34a', amount: 600000 }, // 600.000 pesos
  { label: 'Deuda', value: 8, color: '#7c3aed', amount: 250000 } // 250.000 pesos
];
