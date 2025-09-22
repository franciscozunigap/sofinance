import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Award, BarChart3, PieChart as PieChartIcon, X, ShoppingCart, Home as HomeIcon, PiggyBank, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import WebBalanceRegistrationScreen from './WebBalanceRegistrationScreen';

interface WebAnalysisScreenProps {}

const WebAnalysisScreen: React.FC<WebAnalysisScreenProps> = () => {
  const { user } = useUser();
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [showBalanceRegistration, setShowBalanceRegistration] = useState(false);

  // Datos mock del usuario
  const userData = {
    name: user?.name || 'Usuario Demo',
    monthlyIncome: user?.monthlyIncome || 420000,
    currentScore: user?.currentScore || 52,
    riskScore: user?.riskScore || 48,
    monthlyExpenses: user?.monthlyExpenses || 318000,
    currentSavings: user?.currentSavings || 1250000,
    savingsGoal: user?.savingsGoal || 1800000,
    alerts: user?.alerts || 3,
    // Datos financieros mock
    financialData: {
      consumo: { percentage: 42, amount: 133500, previousChange: 2 },
      necesidades: { percentage: 57, amount: 181300, previousChange: -1 },
      ahorro: { percentage: 19, amount: 60000, previousChange: 3 },
      invertido: { percentage: 8, amount: 25000, previousChange: 5 }
    }
  };

  // Datos para análisis financiero - Formato JSON con montos y porcentajes
  const monthlyTrend = [
    { 
      month: 'Ene', 
      consume: { amount: 120000, percent: 20 },
      necesidades: { amount: 400000, percent: 40 },
      ahorro: { amount: 20000, percent: 2 },
      invest: { amount: 120000, percent: 10 }
    },
    { 
      month: 'Feb', 
      consume: { amount: 150000, percent: 25 },
      necesidades: { amount: 350000, percent: 35 },
      ahorro: { amount: 50000, percent: 5 },
      invest: { amount: 100000, percent: 8 }
    },
    { 
      month: 'Mar', 
      consume: { amount: 100000, percent: 15 },
      necesidades: { amount: 450000, percent: 45 },
      ahorro: { amount: 30000, percent: 3 },
      invest: { amount: 150000, percent: 12 }
    },
    { 
      month: 'Abr', 
      consume: { amount: 180000, percent: 30 },
      necesidades: { amount: 300000, percent: 30 },
      ahorro: { amount: 60000, percent: 6 },
      invest: { amount: 120000, percent: 10 }
    },
    { 
      month: 'May', 
      consume: { amount: 140000, percent: 22 },
      necesidades: { amount: 380000, percent: 38 },
      ahorro: { amount: 40000, percent: 4 },
      invest: { amount: 140000, percent: 11 }
    },
    { 
      month: 'Jun', 
      consume: { amount: 160000, percent: 26 },
      necesidades: { amount: 360000, percent: 36 },
      ahorro: { amount: 50000, percent: 5 },
      invest: { amount: 130000, percent: 10 }
    }
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

  const recommendations = [
    {
      id: 1,
      title: 'Regla del 50/30/20',
      description: 'Asigna el 50% de tus ingresos a necesidades básicas, 30% a deseos personales y 20% a ahorros e inversiones. Esta regla te ayuda a mantener un equilibrio financiero saludable y te permite disfrutar de la vida mientras construyes tu futuro financiero.',
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
                  Dashboard Financiero
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Última actualización: {new Date().toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
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
                    {userData.financialData.ahorro.percentage}%
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Montos y Análisis - Métricas Detalladas */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift border border-white/20 scale-in">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">{userData.financialData.consumo.percentage}%</p>
                  <p className="text-lg font-semibold text-gray-900">${userData.financialData.consumo.amount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Consumo</p>
              <div className={`flex items-center text-xs ${userData.financialData.consumo.previousChange >= 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {userData.financialData.consumo.previousChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {userData.financialData.consumo.previousChange >= 0 ? '+' : ''}{userData.financialData.consumo.previousChange}% vs mes anterior
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift border border-white/20 scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HomeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{userData.financialData.necesidades.percentage}%</p>
                  <p className="text-lg font-semibold text-gray-900">${userData.financialData.necesidades.amount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Necesidades</p>
              <div className={`flex items-center text-xs ${userData.financialData.necesidades.previousChange >= 0 ? 'text-blue-500' : 'text-green-500'}`}>
                {userData.financialData.necesidades.previousChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {userData.financialData.necesidades.previousChange >= 0 ? '+' : ''}{userData.financialData.necesidades.previousChange}% vs mes anterior
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover-lift border border-white/20 scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{userData.financialData.invertido.percentage}%</p>
                  <p className="text-lg font-semibold text-gray-900">${userData.financialData.invertido.amount.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-2">Invertido</p>
              <div className={`flex items-center text-xs ${userData.financialData.invertido.previousChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {userData.financialData.invertido.previousChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {userData.financialData.invertido.previousChange >= 0 ? '+' : ''}{userData.financialData.invertido.previousChange}% vs mes anterior
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
                                         name === 'ahorro' ? 'Ahorro' :
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
                  <Area type="monotone" dataKey="ahorro.percent" stackId="3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
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
