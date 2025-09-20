// Datos mock centralizados para toda la aplicación
export const MOCK_USER_DATA = {
  name: 'María',
  monthlyIncome: 4200,
  currentScore: 52,
  riskScore: 48,
  monthlyExpenses: 3180,
  currentSavings: 12500,
  savingsGoal: 18000,
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
  { name: 'Necesidades', value: 1800, color: '#ea580c' },
  { name: 'Consumo', value: 780, color: '#fb923c' },
  { name: 'Ahorro', value: 600, color: '#fed7aa' }
];

export const WEEKLY_TREND = [
  { week: 'S1', gastos: 720 },
  { week: 'S2', gastos: 890 },
  { week: 'S3', gastos: 650 },
  { week: 'S4', gastos: 920 }
];

export const RECENT_TRANSACTIONS = [
  { id: 1, description: 'Supermercado Jumbo', amount: -85.50, category: 'Necesidades', date: '08 Sep', time: '14:30' },
  { id: 2, description: 'Cena en restaurante', amount: -45.00, category: 'Consumo', date: '08 Sep', time: '21:15' },
  { id: 3, description: 'Netflix', amount: -9.99, category: 'Consumo', date: '07 Sep', time: '16:45' },
  { id: 4, description: 'Transferencia Ahorro', amount: -150.00, category: 'Ahorro', date: '07 Sep', time: '08:00' },
  { id: 5, description: 'Salario', amount: 4200.00, category: 'Ingresos', date: '05 Sep', time: '09:00' }
];

export const ACHIEVEMENTS = [
  { id: 1, title: 'Consistencia Semanal', description: 'Registraste tus gastos 7 días seguidos', icon: '🎯', unlocked: true },
  { id: 2, title: 'Consumo Consciente', description: 'Redujiste gastos de consumo esta semana', icon: '🏆', unlocked: true },
  { id: 3, title: 'Meta del Mes', description: 'Cumple tu meta de ahorro mensual', icon: '💎', unlocked: false }
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
  { label: 'Consumo', value: 42, color: '#ea580c', amount: 780 },
  { label: 'Necesidades', value: 57, color: '#dc2626', amount: 1800 },
  { label: 'Ahorro', value: 19, color: '#16a34a', amount: 600 },
  { label: 'Deuda', value: 8, color: '#7c3aed', amount: 250 }
];
