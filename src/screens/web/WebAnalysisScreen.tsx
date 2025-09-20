import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Award, BarChart3, PieChart as PieChartIcon, Settings } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface WebAnalysisScreenProps {
  onSettingsClick?: () => void;
}

const WebAnalysisScreen: React.FC<WebAnalysisScreenProps> = ({ onSettingsClick }) => {
  const { user } = useUser();

  // Datos del usuario
  const userData = user || {
    name: 'Usuario',
    monthlyIncome: 4200,
    currentScore: 52,
    riskScore: 48,
    monthlyExpenses: 3180,
    currentSavings: 12500,
    savingsGoal: 18000,
    alerts: 3
  };

  // Datos para análisis financiero
  const monthlyTrend = [
    { month: 'Ene', income: 4200, expenses: 3500, savings: 700 },
    { month: 'Feb', income: 4200, expenses: 3200, savings: 1000 },
    { month: 'Mar', income: 4200, expenses: 3800, savings: 400 },
    { month: 'Abr', income: 4200, expenses: 3100, savings: 1100 },
    { month: 'May', income: 4200, expenses: 3300, savings: 900 },
    { month: 'Jun', income: 4200, expenses: 3180, savings: 1020 }
  ];

  const categoryAnalysis = [
    { name: 'Vivienda', amount: 1200, percentage: 38, trend: 'up', color: '#ef4444' },
    { name: 'Alimentación', amount: 600, percentage: 19, trend: 'down', color: '#f97316' },
    { name: 'Transporte', amount: 400, percentage: 13, trend: 'stable', color: '#eab308' },
    { name: 'Entretenimiento', amount: 300, percentage: 9, trend: 'up', color: '#8b5cf6' },
    { name: 'Salud', amount: 200, percentage: 6, trend: 'stable', color: '#06b6d4' },
    { name: 'Otros', amount: 480, percentage: 15, trend: 'down', color: '#10b981' }
  ];

  const weeklySpending = [
    { day: 'Lun', amount: 120 },
    { day: 'Mar', amount: 85 },
    { day: 'Mié', amount: 200 },
    { day: 'Jue', amount: 150 },
    { day: 'Vie', amount: 300 },
    { day: 'Sáb', amount: 450 },
    { day: 'Dom', amount: 180 }
  ];

  const financialGoals = [
    { name: 'Fondo de Emergencia', target: 10000, current: 8000, deadline: 'Dic 2024', priority: 'high' },
    { name: 'Vacaciones', target: 3000, current: 1200, deadline: 'Ago 2024', priority: 'medium' },
    { name: 'Casa Propia', target: 50000, current: 12500, deadline: '2026', priority: 'high' }
  ];

  const insights = [
    {
      type: 'warning',
      title: 'Gasto Alto en Entretenimiento',
      description: 'Has gastado 15% más en entretenimiento este mes. Considera reducir actividades costosas.',
      icon: AlertTriangle,
      action: 'Ver detalles'
    },
    {
      type: 'success',
      title: 'Excelente Control de Alimentación',
      description: 'Redujiste 8% tus gastos en alimentación manteniendo una dieta saludable.',
      icon: Award,
      action: 'Ver estrategias'
    },
    {
      type: 'info',
      title: 'Oportunidad de Ahorro',
      description: 'Podrías ahorrar $200 extra si optimizas tus gastos de transporte.',
      icon: Target,
      action: 'Crear plan'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Análisis Financiero</h1>
              <p className="text-sm text-gray-600 mt-1">Insights detallados sobre tu comportamiento financiero</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Score Actual</p>
                <p className="text-lg font-bold text-blue-600">{userData.currentScore}/100</p>
              </div>
              {onSettingsClick && (
                <button
                  onClick={onSettingsClick}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                  title="Configuración"
                >
                  <Settings className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Ahorro Mensual</p>
                <p className="text-lg font-bold text-green-600">$1,020</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs mes anterior
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Gastos Promedio</p>
                <p className="text-lg font-bold text-red-600">$3,180</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5% vs mes anterior
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Eficiencia</p>
                <p className="text-lg font-bold text-blue-600">76%</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% vs mes anterior
                </p>
              </div>
              <Target className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Meta Ahorro</p>
                <p className="text-lg font-bold text-purple-600">69%</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  $5,500 restantes
                </p>
              </div>
              <Award className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Gráficos Principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tendencias Mensuales */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tendencias de los Últimos 6 Meses</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                <Area type="monotone" dataKey="savings" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Gastos por Categoría */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Distribución de Gastos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryAnalysis}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {categoryAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryAnalysis.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">${category.amount}</span>
                    {getTrendIcon(category.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análisis Semanal */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Patrones de Gasto Semanal</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metas Financieras */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Metas Financieras</h3>
          <div className="space-y-4">
            {financialGoals.map((goal, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progreso: ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Meta: {goal.deadline}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights y Recomendaciones */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Insights y Recomendaciones</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                insight.type === 'warning' ? 'border-red-500 bg-red-50' :
                insight.type === 'success' ? 'border-green-500 bg-green-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start">
                  <insight.icon className={`h-5 w-5 mt-0.5 mr-3 ${
                    insight.type === 'warning' ? 'text-red-500' :
                    insight.type === 'success' ? 'text-green-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2">
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebAnalysisScreen;
