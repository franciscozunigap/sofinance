import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Bell, User, MessageCircle, TrendingUp, DollarSign, Target, AlertTriangle, Award, Mic, Send, ArrowLeft, ChevronRight, Home, BarChart3, Settings, HelpCircle, LogOut, ShoppingCart, Home as HomeIcon, PiggyBank, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useFinancialData } from '../../contexts/FinancialDataContext';
import { formatChileanPeso } from '../../utils/currencyUtils';
import WebAppSkeleton from './WebAppSkeleton';
import avatar from '../../../assets/avatar.png';

const WebDashboardScreen = () => {
  const { user } = useUser();
  const { currentBalance, monthlyStats, balanceHistory, loading: balanceLoading, financialData, userData, refreshData } = useFinancialData();
  const [currentView, setCurrentView] = useState('dashboard');


  // Mostrar skeleton mientras se cargan los datos
  if (balanceLoading) {
    return <WebAppSkeleton />;
  }
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'sofia',
      text: '¡Hola! 👋 Veo que tu score financiero está mejorando. ¿Te gustaría revisar algunas recomendaciones para este mes?',
      timestamp: '10:30 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Los datos del usuario y financieros ahora vienen del contexto centralizado

  // Gráfico de salud financiera - 7 días usando datos reales de Firebase
  const currentMonth = new Date().toLocaleDateString('es-CL', { month: 'long' });
  
  const generateDailyScoreData = () => {
    if (balanceHistory.length === 0) {
      return [
        { day: 'Lun', score: 45 },
        { day: 'Mar', score: 48 },
        { day: 'Mié', score: 44 },
        { day: 'Jue', score: 46 },
        { day: 'Vie', score: 50 },
        { day: 'Sáb', score: 48 },
        { day: 'Dom', score: 52 }
      ];
    }

    // Generar los últimos 7 días
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayStr = date.toLocaleDateString('es-CL', { weekday: 'short' });
      
      // Buscar si hay datos para este día
      const dayData = balanceHistory.find(registration => {
        const regDate = new Date(registration.date);
        return regDate.toDateString() === date.toDateString();
      });
      
      if (dayData) {
        // Si hay datos para este día, calcular score basado en balance
        const score = Math.min(100, Math.max(0, 50 + (dayData.balanceAfter / 100000) * 10));
        last7Days.push({
          day: dayStr,
          score: score
        });
      } else {
        // Si no hay datos para este día, crear entrada sin punto
        last7Days.push({
          day: dayStr,
          score: undefined // Sin punto en el gráfico
        });
      }
    }
    
    return last7Days;
  };

  const dailyScoreData = generateDailyScoreData();

  // Generar datos de ingresos mensuales
  const generateMonthlyIncomeData = () => {
    const currentDate = new Date();
    const months = [];
    
    
    // Generar los últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('es-CL', { month: 'short' });
      
      // Si es el mes actual y tenemos monthlyStats, usar totalIncome
      if (i === 0 && monthlyStats && monthlyStats.totalIncome > 0) {
        months.push({
          month: monthName,
          income: monthlyStats.totalIncome
        });
      } else {
        // Buscar datos del mes en balanceHistory
        const monthData = balanceHistory.filter(registration => {
          const regDate = new Date(registration.date);
          return regDate.getFullYear() === date.getFullYear() && 
                 regDate.getMonth() === date.getMonth() &&
                 registration.type === 'income';
        });
        
        const totalIncome = monthData.reduce((sum, reg) => sum + reg.amount, 0);
        
        // Si no hay datos reales, usar datos mock basados en el totalIncome actual o un valor por defecto
        let mockIncome = 0;
        if (monthlyStats && monthlyStats.totalIncome > 0) {
          // Usar el totalIncome actual como base para generar datos históricos con variación fija
          const variation = [0.8, 0.9, 0.85, 0.95, 0.75][i - 1] || 0.85; // Variación fija para cada mes
          mockIncome = monthlyStats.totalIncome * variation;
        } else if (userData && userData.monthlyIncome > 0) {
          const variation = [0.8, 0.9, 0.85, 0.95, 0.75][i - 1] || 0.85;
          mockIncome = userData.monthlyIncome * variation;
        } else {
          // Valor por defecto si no hay datos
          const variation = [0.8, 0.9, 0.85, 0.95, 0.75][i - 1] || 0.85;
          mockIncome = 800000 * variation;
        }
        
        
        months.push({
          month: monthName,
          income: totalIncome || mockIncome
        });
      }
    }
    
    return months;
  };

  const monthlyIncomeData = generateMonthlyIncomeData();
  
  // Asegurar que siempre tengamos datos válidos para mostrar
  const validMonthlyData = monthlyIncomeData.filter(item => item.income > 0);
  
  // Si no hay datos válidos, usar los datos generados directamente
  const displayData = validMonthlyData.length > 0 ? validMonthlyData : monthlyIncomeData;
  

  // Generar datos de categorías de ingresos por mes
  const generateIncomeCategoriesData = () => {
    const currentDate = new Date();
    const months = [];
    
    // Generar los últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('es-CL', { month: 'short' });
      
      // Si es el mes actual y tenemos monthlyStats, usar esos datos
      if (i === 0 && monthlyStats) {
        months.push({
          month: monthName,
          'Salario': monthlyStats.totalIncome * 0.7, // 70% del ingreso total
          'Freelance': monthlyStats.totalIncome * 0.2, // 20% del ingreso total
          'Inversiones': monthlyStats.totalIncome * 0.05, // 5% del ingreso total
          'Otros': monthlyStats.totalIncome * 0.05 // 5% del ingreso total
        });
      } else {
        // Para otros meses, usar datos del balanceHistory o datos mock
        const monthData = balanceHistory.filter(registration => {
          const regDate = new Date(registration.date);
          return regDate.getFullYear() === date.getFullYear() && 
                 regDate.getMonth() === date.getMonth() &&
                 registration.type === 'income';
        });
        
        if (monthData.length > 0) {
          const totalIncome = monthData.reduce((sum, reg) => sum + reg.amount, 0);
          months.push({
            month: monthName,
            'Salario': totalIncome * 0.7,
            'Freelance': totalIncome * 0.2,
            'Inversiones': totalIncome * 0.05,
            'Otros': totalIncome * 0.05
          });
        } else {
          // Datos mock para meses sin datos
          const mockIncome = 800000; // Ingreso mock
          months.push({
            month: monthName,
            'Salario': mockIncome * 0.7,
            'Freelance': mockIncome * 0.2,
            'Inversiones': mockIncome * 0.05,
            'Otros': mockIncome * 0.05
          });
        }
      }
    }
    
    return months;
  };

  const incomeCategoriesData = generateIncomeCategoriesData();

  // Categorías de gastos (en pesos chilenos) - usando totalIncome * percentages/100
  const expenseCategories = monthlyStats ? [
    { name: 'Necesidades', value: monthlyStats.totalIncome * (monthlyStats.percentages.needs / 100), color: '#ea580c' },
    { name: 'Consumo', value: monthlyStats.totalIncome * (monthlyStats.percentages.wants / 100), color: '#fb923c' },
    { name: 'Ahorro', value: monthlyStats.totalIncome * (monthlyStats.percentages.savings / 100), color: '#fed7aa' },
    { name: 'Inversión', value: monthlyStats.totalIncome * (monthlyStats.percentages.investment / 100), color: '#8b5cf6' }
  ] : [
    { name: 'Necesidades', value: 1800000, color: '#ea580c' }, // 1.800.000 pesos
    { name: 'Consumo', value: 780000, color: '#fb923c' }, // 780.000 pesos
    { name: 'Ahorro', value: 600000, color: '#fed7aa' }, // 600.000 pesos
    { name: 'Inversión', value: 200000, color: '#8b5cf6' } // 200.000 pesos
  ];

  const weeklyTrend = balanceHistory.length > 0 ? 
    balanceHistory.slice(0, 4).map((registration, index) => ({
      week: `S${index + 1}`,
      gastos: Math.abs(registration.amount)
    })) : [
      { week: 'S1', gastos: 720000 }, // 720.000 pesos
      { week: 'S2', gastos: 890000 }, // 890.000 pesos
      { week: 'S3', gastos: 650000 }, // 650.000 pesos
      { week: 'S4', gastos: 920000 } // 920.000 pesos
    ];

  // Convertir el historial de balance a formato de transacciones recientes
  const recentTransactions = balanceHistory.length > 0 ? 
    balanceHistory.slice(0, 5).map(registration => ({
      id: registration.id,
      description: registration.description,
      amount: registration.type === 'income' ? registration.amount : -registration.amount,
      type: registration.type,
      category: registration.category,
      date: registration.date,
    })) : [];

  const achievements = [
    { id: 1, title: 'Consistencia Semanal', description: 'Registraste tus gastos 7 días seguidos', icon: '🎯', unlocked: true },
    { id: 2, title: 'Consumo Consciente', description: 'Redujiste gastos de consumo esta semana', icon: '🏆', unlocked: true },
    { id: 3, title: 'Meta del Mes', description: 'Cumple tu meta de disponible mensual', icon: '💎', unlocked: false }
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        text: chatInput,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');
      
      // Respuesta automática de Sofía
      setTimeout(() => {
        const responses = [
          '¡Perfecto! Te ayudo a optimizar tus gastos. Veo que puedes reducir 15% en entretenimiento 📊',
          'Basándome en tu historial, te recomiendo ahorrar $300 este mes para alcanzar tu meta 💪',
          'Tu score está mejorando. ¿Te interesa ver estrategias para llegar a 60 puntos? 📈',
          'Detecté que gastas más los fines de semana. ¿Quieres un plan para controlarlo? 💡'
        ];
        
        const sofiaResponse = {
          id: chatMessages.length + 2,
          sender: 'sofia',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        setChatMessages(prev => [...prev, sofiaResponse]);
      }, 1500);
    }
  };

  const getScoreStatus = (score: number) => {
    if (score >= 60) return { text: '¡Excelente! Estás en zona óptima', color: 'text-green-600', emoji: '🚀' };
    if (score >= 40) return { text: 'Bien, mantén el ritmo', color: 'text-orange-600', emoji: '💪' };
    return { text: 'Necesitas mejorar', color: 'text-red-600', emoji: '⚠️' };
  };

  const scoreStatus = getScoreStatus(userData.currentScore || 0);

  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-light">
        {/* Header del Chat */}
        <div className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Sofía</h3>
                  <p className="text-sm text-green-500">En línea</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                {message.sender === 'sofia' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">S</span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary-400 text-white rounded-br-md'
                        : 'bg-white border rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pregúntame sobre tus finanzas..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button className="p-1 hover:bg-gray-200 rounded-full">
                <Mic className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              className="bg-primary-400 hover:bg-primary-500 text-white p-2 rounded-full"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 overflow-x-hidden pb-20" 
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none'
      }}
    >
      {/* Header Mejorado con Gradiente */}
      <div className="relative w-full h-64 lg:h-80 overflow-hidden" style={{ 
        minHeight: '256px', 
        maxHeight: '320px'
      }}>
        {/* Gradiente de fondo alineado con el tema */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primaryIntense"></div>
        
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Botón de configuración mejorado */}
        <div className="absolute top-4 right-4 z-10">
          <button
            className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30"
            title="Configuración"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        {/* Avatar con efecto parallax mejorado y tamaño fijo */}
        <div 
          className="relative w-full h-full transition-all duration-500 ease-out overflow-hidden"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.2, 20)}px) scale(${Math.max(1 - scrollY * 0.0008, 0.95)})`,
            background: 'linear-gradient(135deg, #6B73FF 0%, #8B5CF6 50%, #A855F7 100%)',
            width: '100%',
            height: '100%',
            position: 'relative',
            minHeight: '256px',
            maxHeight: '320px',
            // Asegurar que el contenedor no se redimensione
            flexShrink: 0,
            flexGrow: 0,
            // Centrar el contenido para pantallas muy horizontales
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Contenedor del avatar con tamaño fijo para evitar zoom */}
          <div 
            className="relative"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              maxWidth: '1200px', // Tamaño máximo fijo
              maxHeight: '320px',
              // Centrar el contenido
              margin: '0 auto',
              // Permitir que la escala funcione correctamente
              overflow: 'visible'
            }}
          >
            <img 
              src={avatar} 
              alt="Avatar" 
              className="absolute"
              style={{
                filter: 'brightness(1.2) contrast(1.1) saturate(1.1)',
                mixBlendMode: 'multiply',
                opacity: 0.9,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                // Mejoras para calidad de imagen
                imageRendering: 'auto',
                backfaceVisibility: 'hidden',
                // Centrar y escalar la imagen
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.7)',
                willChange: 'transform',
                // Asegurar que no se haga zoom
                transformOrigin: 'center center',
                // Prevenir distorsión y mantener calidad
                aspectRatio: 'auto'
              }}
            />
            {/* Overlay para integrar mejor con el fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 via-transparent to-primaryIntense/20"></div>
          </div>
        </div>

        {/* Saldo actual en el header */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center">
            <p className="text-white/90 text-sm mb-2">Saldo Actual</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              {(() => {
                // Usar monthlyStats.balance si currentBalance es 0
                const balanceToShow = currentBalance || monthlyStats?.balance || 0;
                return formatChileanPeso(balanceToShow);
              })()}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content mejorado */}
      <main className="relative z-10 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Score Card Principal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-end mb-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${scoreStatus.color} bg-opacity-10`}>
              {scoreStatus.emoji} {scoreStatus.text}
            </div>
          </div>
          
          {/* Gráfica de Zona Saludable Mejorada */}
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 relative overflow-hidden">
            {/* Zona Saludable con mejor diseño */}
            <div className="absolute inset-x-6 top-12 bottom-20 bg-gradient-to-r from-green-200/40 to-emerald-200/40 rounded-xl border-2 border-dashed border-green-300/60">
              <div className="absolute top-3 left-3 text-xs font-semibold text-green-700 bg-white/80 px-2 py-1 rounded-full">
                Zona Saludable (40-80 pts)
              </div>
            </div>
            
            {/* Línea de Progreso Mejorada */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyScoreData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis domain={[30, 70]} hide />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#858BF2" 
                  strokeWidth={4}
                  dot={{ fill: '#858BF2', r: 8, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 10, fill: '#6366F1', stroke: '#fff', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grid de Métricas - Solo Porcentajes con Iconos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="h-6 w-6 text-warning" />
            </div>
            <div className="text-3xl font-bold text-warning mb-1">{financialData.consumo.percentage}%</div>
            <p className="text-sm font-medium text-dark">Consumo</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="w-12 h-12 bg-primaryIntense/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <HomeIcon className="h-6 w-6 text-primaryIntense" />
            </div>
            <div className="text-3xl font-bold text-primaryIntense mb-1">{financialData.necesidades.percentage}%</div>
            <p className="text-sm font-medium text-dark">Necesidades</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <PiggyBank className="h-6 w-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-success mb-1">{financialData.disponible.percentage}%</div>
            <p className="text-sm font-medium text-dark">Ahorro</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="w-12 h-12 bg-primary-400/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUpIcon className="h-6 w-6 text-primary-400" />
            </div>
            <div className="text-3xl font-bold text-primary-400 mb-1">{financialData.invertido.percentage}%</div>
            <p className="text-sm font-medium text-dark">Invertido</p>
          </div>
        </div>

        {/* Gráfico de Ingresos Mensuales */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-dark">Ingresos Mensuales</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [formatChileanPeso(typeof value === 'number' ? value : 0, true), 'Ingresos']}
                labelFormatter={(label) => `Mes: ${label}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Categorías de Ingresos por Mes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-dark">Categorías de Ingresos por Mes</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeCategoriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [formatChileanPeso(typeof value === 'number' ? value : 0, true), name]}
                labelFormatter={(label) => `Mes: ${label}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="Salario" stackId="a" fill="#3b82f6" name="Salario" />
              <Bar dataKey="Freelance" stackId="a" fill="#10b981" name="Freelance" />
              <Bar dataKey="Inversiones" stackId="a" fill="#f59e0b" name="Inversiones" />
              <Bar dataKey="Otros" stackId="a" fill="#8b5cf6" name="Otros" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de Registros Mejorada */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-dark">Registros Recientes</h3>
            <button className="text-primary-400 hover:text-primaryIntense text-sm font-medium flex items-center">
              Ver todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.slice(0, 5).map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all duration-200 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  } group-hover:scale-110 transition-transform duration-200`}>
                    <DollarSign className={`h-6 w-6 ${
                      transaction.amount > 0 ? 'text-success' : 'text-danger'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category} • {transaction.date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.amount > 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatChileanPeso(Math.abs(transaction.amount))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebDashboardScreen;
