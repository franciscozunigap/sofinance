import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Award, BarChart3, PieChart as PieChartIcon, X, ShoppingCart, Home as HomeIcon, PiggyBank, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useFinancialData } from '../../contexts/FinancialDataContext';
import { formatChileanPeso } from '../../utils/currencyUtils';
import AnalysisSkeleton from '../../components/AnalysisSkeleton';
import WebBalanceRegistrationScreen from './WebBalanceRegistrationScreen';

interface WebAnalysisScreenProps {}

const WebAnalysisScreen: React.FC<WebAnalysisScreenProps> = () => {
  const { user } = useUser();
  const { currentBalance, monthlyStats, balanceHistory, loading: balanceLoading, financialData, userData, refreshData } = useFinancialData();
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [showBalanceRegistration, setShowBalanceRegistration] = useState(false);

  // Mostrar skeleton mientras se cargan los datos
  if (balanceLoading) {
    return <AnalysisSkeleton />;
  }

  // Los datos del usuario y financieros ahora vienen del contexto centralizado

  // Datos para análisis financiero - Formato JSON con montos y porcentajes (usar datos reales si están disponibles)
  const monthlyTrend = monthlyStats ? [
    { 
      month: 'Ene', 
      consume: { amount: monthlyStats.totalExpenses * 0.4, percent: monthlyStats.percentages.wants },
      necesidades: { amount: monthlyStats.totalExpenses * 0.6, percent: monthlyStats.percentages.needs },
      disponible: { amount: monthlyStats.balance * 0.7, percent: monthlyStats.percentages.savings },
      invest: { amount: monthlyStats.balance * 0.3, percent: monthlyStats.percentages.investment }
    },
    { 
      month: 'Feb', 
      consume: { amount: monthlyStats.totalExpenses * 0.4, percent: monthlyStats.percentages.wants },
      necesidades: { amount: monthlyStats.totalExpenses * 0.6, percent: monthlyStats.percentages.needs },
      disponible: { amount: monthlyStats.balance * 0.7, percent: monthlyStats.percentages.savings },
      invest: { amount: monthlyStats.balance * 0.3, percent: monthlyStats.percentages.investment }
    },
    { 
      month: 'Mar', 
      consume: { amount: monthlyStats.totalExpenses * 0.4, percent: monthlyStats.percentages.wants },
      necesidades: { amount: monthlyStats.totalExpenses * 0.6, percent: monthlyStats.percentages.needs },
      disponible: { amount: monthlyStats.balance * 0.7, percent: monthlyStats.percentages.savings },
      invest: { amount: monthlyStats.balance * 0.3, percent: monthlyStats.percentages.investment }
    },
    { 
      month: 'Abr', 
      consume: { amount: monthlyStats.totalExpenses * 0.4, percent: monthlyStats.percentages.wants },
      necesidades: { amount: monthlyStats.totalExpenses * 0.6, percent: monthlyStats.percentages.needs },
      disponible: { amount: monthlyStats.balance * 0.7, percent: monthlyStats.percentages.savings },
      invest: { amount: monthlyStats.balance * 0.3, percent: monthlyStats.percentages.investment }
    },
    { 
      month: 'May', 
      consume: { amount: monthlyStats.totalExpenses * 0.4, percent: monthlyStats.percentages.wants },
      necesidades: { amount: monthlyStats.totalExpenses * 0.6, percent: monthlyStats.percentages.needs },
      disponible: { amount: monthlyStats.balance * 0.7, percent: monthlyStats.percentages.savings },
      invest: { amount: monthlyStats.balance * 0.3, percent: monthlyStats.percentages.investment }
    },
    { 
      month: 'Jun', 
      consume: { amount: monthlyStats.totalExpenses * 0.4, percent: monthlyStats.percentages.wants },
      necesidades: { amount: monthlyStats.totalExpenses * 0.6, percent: monthlyStats.percentages.needs },
      disponible: { amount: monthlyStats.balance * 0.7, percent: monthlyStats.percentages.savings },
      invest: { amount: monthlyStats.balance * 0.3, percent: monthlyStats.percentages.investment }
    }
  ] : [
    { 
      month: 'Ene', 
      consume: { amount: 0, percent: 0 },
      necesidades: { amount: 0, percent: 0 },
      disponible: { amount: 0, percent: 0 },
      invest: { amount: 0, percent: 0 }
    },
    { 
      month: 'Feb', 
      consume: { amount: 0, percent: 0 },
      necesidades: { amount: 0, percent: 0 },
      disponible: { amount: 0, percent: 0 },
      invest: { amount: 0, percent: 0 }
    },
    { 
      month: 'Mar', 
      consume: { amount: 0, percent: 0 },
      necesidades: { amount: 0, percent: 0 },
      disponible: { amount: 0, percent: 0 },
      invest: { amount: 0, percent: 0 }
    },
    { 
      month: 'Abr', 
      consume: { amount: 0, percent: 0 },
      necesidades: { amount: 0, percent: 0 },
      disponible: { amount: 0, percent: 0 },
      invest: { amount: 0, percent: 0 }
    },
    { 
      month: 'May', 
      consume: { amount: 0, percent: 0 },
      necesidades: { amount: 0, percent: 0 },
      disponible: { amount: 0, percent: 0 },
      invest: { amount: 0, percent: 0 }
    },
    { 
      month: 'Jun', 
      consume: { amount: 0, percent: 0 },
      necesidades: { amount: 0, percent: 0 },
      disponible: { amount: 0, percent: 0 },
      invest: { amount: 0, percent: 0 }
    }
  ];

  const categoryAnalysis = monthlyStats ? [
    { name: 'Necesidades', amount: monthlyStats.totalExpenses * (monthlyStats.percentages.needs / 100), percentage: monthlyStats.percentages.needs, trend: 'stable' as const, color: '#ef4444' },
    { name: 'Consumo', amount: monthlyStats.totalExpenses * (monthlyStats.percentages.wants / 100), percentage: monthlyStats.percentages.wants, trend: 'stable' as const, color: '#f97316' },
    { name: 'Ahorro', amount: monthlyStats.balance * (monthlyStats.percentages.savings / 100), percentage: monthlyStats.percentages.savings, trend: 'up' as const, color: '#eab308' },
    { name: 'Inversión', amount: monthlyStats.balance * (monthlyStats.percentages.investment / 100), percentage: monthlyStats.percentages.investment, trend: 'up' as const, color: '#8b5cf6' }
  ] : [
    { name: 'Necesidades', amount: 0, percentage: 0, trend: 'stable' as const, color: '#ef4444' },
    { name: 'Consumo', amount: 0, percentage: 0, trend: 'stable' as const, color: '#f97316' },
    { name: 'Ahorro', amount: 0, percentage: 0, trend: 'stable' as const, color: '#eab308' },
    { name: 'Inversión', amount: 0, percentage: 0, trend: 'stable' as const, color: '#8b5cf6' }
  ];

  // Calcular gastos semanales basados en el historial real
  const calculateWeeklySpending = () => {
    if (!balanceHistory || balanceHistory.length === 0) {
      return [
        { day: 'Lun', amount: 0 },
        { day: 'Mar', amount: 0 },
        { day: 'Mié', amount: 0 },
        { day: 'Jue', amount: 0 },
        { day: 'Vie', amount: 0 },
        { day: 'Sáb', amount: 0 },
        { day: 'Dom', amount: 0 }
      ];
    }

    // Obtener gastos de la última semana
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyExpenses = balanceHistory
      .filter(record => 
        record.type === 'expense' && 
        record.date >= weekAgo && 
        record.date <= now
      )
      .reduce((acc, record) => {
        const dayOfWeek = record.date.getDay();
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const dayName = dayNames[dayOfWeek];
        
        if (!acc[dayName]) {
          acc[dayName] = 0;
        }
        acc[dayName] += record.amount;
        return acc;
      }, {} as Record<string, number>);

    return [
      { day: 'Lun', amount: weeklyExpenses['Lun'] || 0 },
      { day: 'Mar', amount: weeklyExpenses['Mar'] || 0 },
      { day: 'Mié', amount: weeklyExpenses['Mié'] || 0 },
      { day: 'Jue', amount: weeklyExpenses['Jue'] || 0 },
      { day: 'Vie', amount: weeklyExpenses['Vie'] || 0 },
      { day: 'Sáb', amount: weeklyExpenses['Sáb'] || 0 },
      { day: 'Dom', amount: weeklyExpenses['Dom'] || 0 }
    ];
  };

  const weeklySpending = calculateWeeklySpending();


  const financialGoals = user?.savingsGoal ? [
    { 
      name: 'Meta de Ahorro', 
      target: user.savingsGoal, 
      current: currentBalance || 0, 
      deadline: 'Dic 2024', 
      priority: 'high' as const 
    },
    { 
      name: 'Fondo de Emergencia', 
      target: (user.monthlyIncome || 0) * 6, // 6 meses de ingresos
      current: (currentBalance || 0) * 0.3, // 30% del disponible actual
      deadline: '2025', 
      priority: 'high' as const 
    }
  ] : [
    { name: 'Fondo de Emergencia', target: 0, current: 0, deadline: 'Dic 2024', priority: 'high' as const },
    { name: 'Meta de Ahorro', target: 0, current: 0, deadline: '2025', priority: 'medium' as const }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Regla del 50/30/20',
      description: 'Asigna el 50% de tus ingresos a necesidades básicas, 30% a deseos personales y 20% a disponibles e inversiones. Esta regla te ayuda a mantener un equilibrio financiero saludable y te permite disfrutar de la vida mientras construyes tu futuro financiero.',
      icon: Target,
      type: 'info'
    },
    {
      id: 2,
      title: 'Fondo de Emergencia',
      description: 'Mantén un fondo de emergencia equivalente a 3-6 meses de gastos. Este dinero debe estar en una cuenta de fácil acceso y te protegerá ante imprevistos como pérdida de empleo, gastos médicos inesperados o reparaciones urgentes en tu hogar.',
      icon: AlertTriangle,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Presupuesto Mensual',
      description: 'Crea y sigue un presupuesto mensual detallado. Registra todos tus ingresos y gastos, categorízalos y revisa tu progreso semanalmente. Un presupuesto bien estructurado es la base de una buena salud financiera.',
      icon: Award,
      type: 'success'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 pb-32">
      {/* Header Mejorado con Métricas Dinámicas */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Primera fila: Título y Botón + */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 slide-in-left">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-gray-700 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { 
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            {/* Botón + en la esquina superior derecha */}
            <div className="slide-in-right">
              <button
                onClick={() => setShowBalanceRegistration(true)}
                className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
                title="Agregar movimiento"
              >
                <span className="text-xl font-bold">+</span>
              </button>
            </div>
          </div>
          
          {/* Segunda fila: Métricas Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-3 border border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-primary-700 mb-1">Saldo Actual</p>
                  <p className="text-lg font-bold text-primary-800">
                    ${userData.currentSavings.toLocaleString()}
                  </p>
                </div>
                <PiggyBank className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-purple-700 mb-1">Ahorro Mensual</p>
                  <p className="text-lg font-bold text-purple-800">
                    {financialData.disponible.percentage}%
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Montos y Dashboard - Métricas Detalladas */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift border border-white/20 scale-in">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{financialData.consumo.percentage}%</p>
                  <p className="text-lg font-semibold text-gray-900">${financialData.consumo.amount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Consumo</p>
              <div className={`flex items-center text-xs ${financialData.consumo.previousChange >= 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {financialData.consumo.previousChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {financialData.consumo.previousChange >= 0 ? '+' : ''}{financialData.consumo.previousChange}% vs mes anterior
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift border border-white/20 scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HomeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{financialData.necesidades.percentage}%</p>
                  <p className="text-lg font-semibold text-gray-900">${financialData.necesidades.amount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Necesidades</p>
              <div className={`flex items-center text-xs ${financialData.necesidades.previousChange >= 0 ? 'text-blue-500' : 'text-green-500'}`}>
                {financialData.necesidades.previousChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {financialData.necesidades.previousChange >= 0 ? '+' : ''}{financialData.necesidades.previousChange}% vs mes anterior
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift border border-white/20 scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{financialData.invertido.percentage}%</p>
                  <p className="text-lg font-semibold text-gray-900">${financialData.invertido.amount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Invertido</p>
              <div className={`flex items-center text-xs ${financialData.invertido.previousChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {financialData.invertido.previousChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {financialData.invertido.previousChange >= 0 ? '+' : ''}{financialData.invertido.previousChange}% vs mes anterior
              </div>
            </div>
          </div>
        </div>


        {/* Tendencias Últimos 6 Meses */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Tendencias Últimos 6 Meses</h3>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Tendencias Mensuales */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Categorías Financieras</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      const categoryName = name === 'consume' ? 'Consumo' :
                                         name === 'necesidades' ? 'Necesidades' :
                                         name === 'disponible' ? 'Ahorro' :
                                         name === 'invest' ? 'Inversión' : name;
                      
                      // Obtener el monto correspondiente
                      const amount = props.payload[`${name}.amount`];
                      
                      // Verificar que amount existe antes de formatear
                      const amountText = amount ? `$${amount.toLocaleString()}` : 'N/A';
                      
                      return [
                        `${value}% (${amountText})`, 
                        categoryName
                      ];
                    }}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Area type="monotone" dataKey="consume.percent" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="necesidades.percent" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="disponible.percent" stackId="3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="invest.percent" stackId="4" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recomendaciones Generales */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recomendaciones Generales</h3>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation.id} className={`border-l-4 p-4 rounded-r-lg ${
                recommendation.type === 'warning' ? 'border-red-500 bg-red-50' :
                recommendation.type === 'success' ? 'border-green-500 bg-green-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start">
                  <recommendation.icon className={`h-5 w-5 mt-0.5 mr-3 ${
                    recommendation.type === 'warning' ? 'text-red-500' :
                    recommendation.type === 'success' ? 'text-green-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recommendation.description.substring(0, 100)}...</p>
                    <button 
                      onClick={() => setSelectedRecommendation(recommendation)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
                    >
                      Ver detalle →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ventana Emergente de Recomendación */}
        {selectedRecommendation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <selectedRecommendation.icon className={`h-6 w-6 mr-3 ${
                      selectedRecommendation.type === 'warning' ? 'text-red-500' :
                      selectedRecommendation.type === 'success' ? 'text-green-500' :
                      'text-blue-500'
                    }`} />
                    <h3 className="text-xl font-bold text-gray-900">{selectedRecommendation.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedRecommendation(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedRecommendation.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedRecommendation(null)}
                    className="px-6 py-2 bg-primary-400 hover:bg-primary-500 text-white rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Registro de Balance */}
        <WebBalanceRegistrationScreen
          isOpen={showBalanceRegistration}
          onClose={() => setShowBalanceRegistration(false)}
          onComplete={() => {
            // Aquí podrías actualizar el estado o refrescar los datos
            console.log('Registro de balance completado');
          }}
          currentBalance={userData.currentSavings}
        />
      </div>
    </div>
  );
};

export default WebAnalysisScreen;
