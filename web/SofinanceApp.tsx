import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Bell, User as UserIcon, MessageCircle, TrendingUp, DollarSign, Target, AlertTriangle, Award, Mic, Send, ArrowLeft, ChevronRight, Home, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';
import WebAppNavigator from '../src/navigation/WebAppNavigator';
import { AuthService } from '../src/services/authService';
import { User } from '../src/types';
import { UserProvider, useUser } from '../src/contexts/UserContext';
import { FinancialDataProvider, useFinancialData } from '../src/contexts/FinancialDataContext';
import { formatChileanPeso } from '../src/utils/currencyUtils';
import FloatingNavigationPanel from '../src/components/FloatingNavigationPanel';
import WebAnalysisScreen from '../src/screens/web/WebAnalysisScreen';
import SettingsMenu from '../src/components/SettingsMenu';
import AllTransactionsModal from '../src/components/AllTransactionsModal';
import BalanceChart from '../src/components/BalanceChart';
import AppSkeleton from '../src/components/AppSkeleton';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';

const SofinanceAppContent = () => {
  const [currentView, setCurrentView] = useState('finance');
  const [scrollY, setScrollY] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false);
  const { user, isAuthenticated, loading: userLoading, setUser, logout } = useUser();
  const { currentBalance, monthlyStats, balanceHistory, loading: balanceLoading, financialData, userData, refreshData } = useFinancialData();
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'sofia',
      text: '¡Hola! 👋 Veo que tu score financiero está mejorando. ¿Te gustaría revisar algunas recomendaciones para este mes?',
      timestamp: '10:30 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Todos los hooks deben estar antes de cualquier return condicional
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mostrar skeleton mientras se cargan los datos del usuario
  if (userLoading) {
    return <AppSkeleton />;
  }

  // Los datos del usuario y financieros ahora vienen del contexto centralizado

  // ✅ Dashboard - Comportamiento por categorías (Necesidades, Consumo, Inversión)
  const currentMonth = new Date().toLocaleDateString('es-CL', { month: 'long' });
  
  const generateCategorySpendingData = () => {
    if (balanceHistory.length === 0) {
      return [
        { category: 'Necesidades', amount: 0 },
        { category: 'Consumo', amount: 0 },
        { category: 'Inversión', amount: 0 },
        { category: 'Ahorro', amount: 0 }
      ];
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Filtrar transacciones del mes actual
    const currentMonthTransactions = balanceHistory.filter(t => 
      t.month === currentMonth && t.year === currentYear
    );
    
    // Calcular totales por categoría
    const necesidades = currentMonthTransactions
      .filter(t => t.category === 'Necesidad' && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const consumo = currentMonthTransactions
      .filter(t => t.category === 'Consumo' && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const inversion = currentMonthTransactions
      .filter(t => t.category === 'Inversión' && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const ingresos = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const gastos = necesidades + consumo + inversion;
    const ahorro = Math.max(0, ingresos - gastos);
    
    return [
      { category: 'Necesidades', amount: necesidades },
      { category: 'Consumo', amount: consumo },
      { category: 'Inversión', amount: inversion },
      { category: 'Ahorro', amount: ahorro }
    ].filter(item => item.amount > 0); // Solo mostrar categorías con datos
  };

  const categorySpendingData = generateCategorySpendingData();

  // ✅ Gráfico Principal - Últimos 5 días con transacciones reales
  const generateBalanceData = () => {
    if (balanceHistory && balanceHistory.length > 0) {
      const last5Days = [];
      const today = new Date();
      
      // Ordenar transacciones por fecha descendente
      const sortedTransactions = [...balanceHistory].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Tomar las últimas 5 transacciones únicas por día
      const transactionsByDay = new Map();
      
      sortedTransactions.forEach(transaction => {
        const dateKey = new Date(transaction.date).toDateString();
        if (!transactionsByDay.has(dateKey)) {
          transactionsByDay.set(dateKey, transaction);
        }
      });
      
      // Convertir a array y tomar las últimas 5
      const last5Transactions = Array.from(transactionsByDay.values())
        .slice(0, 5)
        .reverse(); // Ordenar cronológicamente
      
      last5Transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const dateStr = date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
        
        last5Days.push({
          date: dateStr,
          amount: transaction.balanceAfter,
          upper_amount: transaction.balanceAfter * 1.2,
          lower_amount: transaction.balanceAfter * 0.8,
        });
      });
      
      return last5Days;
    }

    // Si no hay datos, mostrar solo el balance actual
    const currentBalance = monthlyStats?.balance || 0;
    if (currentBalance > 0) {
      return [
        { 
          date: 'Hoy', 
          amount: currentBalance, 
          upper_amount: currentBalance * 1.2, 
          lower_amount: currentBalance * 0.8 
        },
      ];
    }

    return [
      { date: 'Hoy', amount: 0, upper_amount: 0, lower_amount: 0 },
    ];
  };

  const balanceData = generateBalanceData();

  // ✅ Gastos por categoría mes a mes (últimos 6 meses)
  const generateMonthlyCategoryData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const months = [];
    
    // Generar los últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthName = date.toLocaleDateString('es-CL', { month: 'short' });
      
      // Calcular por categoría
      const monthTransactions = balanceHistory.filter(t => t.month === month && t.year === year);
      
      const necesidades = monthTransactions
        .filter(t => t.category === 'Necesidad' && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const consumo = monthTransactions
        .filter(t => t.category === 'Consumo' && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const inversion = monthTransactions
        .filter(t => t.category === 'Inversión' && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const ingresos = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        necesidades,
        consumo,
        inversion,
        ahorro: Math.max(0, ingresos - (necesidades + consumo + inversion))
      });
    }
    
    return months;
  };

  const monthlyCategoryData = generateMonthlyCategoryData();

  // ✅ Categorías de gastos del mes actual con datos reales
  const expenseCategories = categorySpendingData.map(item => {
    const colors = {
      'Necesidades': '#ea580c',
      'Consumo': '#fb923c',
      'Inversión': '#8b5cf6',
      'Ahorro': '#10b981'
    };
    
    return {
      name: item.category,
      value: item.amount,
      color: colors[item.category] || '#6b7280'
    };
  });

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

  // Importar las transacciones desde mockData
  // Convertir el historial de balance a formato de transacciones recientes
  const recentTransactions = balanceHistory.length > 0 ? 
    balanceHistory.slice(0, 10).map(registration => ({
      id: registration.id,
      description: registration.description,
      amount: registration.type === 'income' ? registration.amount : -registration.amount,
      category: registration.category,
      date: registration.date,
      time: registration.date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    })) : [];

  // Lista completa de transacciones para el modal
  const allTransactions = recentTransactions;

  const achievements = [
    { id: 1, title: 'Consistencia Semanal', description: 'Registraste tus gastos 7 días seguidos', icon: '🎯', unlocked: true },
    { id: 2, title: 'Consumo Consciente', description: 'Redujiste gastos de consumo esta semana', icon: '🏆', unlocked: true },
    { id: 3, title: 'Meta del Mes', description: 'Cumple tu meta de disponible mensual', icon: '💎', unlocked: false }
  ];

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleRegistrationSuccess = (registeredUser: User) => {
    setUser(registeredUser);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('finance');
    setIsSettingsOpen(false);
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
    if (score >= 40) return { text: 'Bien, mantén el ritmo', color: 'text-primary-400', emoji: '💪' };
    return { text: 'Necesitas mejorar', color: 'text-danger', emoji: '⚠️' };
  };

  const scoreStatus = getScoreStatus(userData.currentScore);

  // Loading state ya manejado arriba

  // Si no está autenticado, mostrar WebAppNavigator
  if (!isAuthenticated) {
    return (
      <WebAppNavigator
        isLoggedIn={isAuthenticated}
        onLoginSuccess={handleLoginSuccess}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    );
  }

  // Vista de Análisis
  if (currentView === 'analysis') {
    return (
      <div className="min-h-screen bg-gray-50">
        <WebAnalysisScreen />
        <FloatingNavigationPanel 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        <SettingsMenu 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
          user={user}
        />
      </div>
    );
  }

  // Vista de Chat (SofIA)
  if (currentView === 'sofia') {
    return (
      <div className="min-h-screen bg-light flex flex-col pb-20">
        {/* Header del Chat */}
        <div className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-light rounded-full shadow-sm overflow-hidden">
              <img 
                src={avatar} 
                alt="Sofía Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-dark">Sofía</h3>
              <p className="text-sm text-green-500">En línea</p>
            </div>
          </div>
        </div>

        {/* Chat Messages - Área que se expande */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                {message.sender === 'sofia' && (
                  <div className="w-8 h-8 flex-shrink-0 bg-light rounded-full shadow-sm overflow-hidden">
                    <img 
                      src={avatar} 
                      alt="Sofía Avatar" 
                      className="w-full h-full object-cover"
                    />
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

        {/* Chat Input - Siempre abajo */}
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

        <FloatingNavigationPanel 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        <SettingsMenu 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
          user={user}
        />
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
      <div className="relative w-full h-64 lg:h-80 overflow-hidden">
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
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/30"
            title="Configuración"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        {/* Avatar con efecto parallax mejorado */}
        <div 
          className="relative w-full h-full transition-all duration-500 ease-out"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.2, 20)}px) scale(${Math.max(1 - scrollY * 0.0008, 0.95)})`,
          }}
        >
          <img 
            src={avatar} 
            alt="Avatar" 
            className="w-full h-full object-cover object-top"
          />
          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

      </div>

      {/* Main Content con superposición */}
      <main className="relative z-10 bg-white rounded-t-3xl -mt-2 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Bienvenida */}
        <div className="mb-2">
          <p className="text-sm text-gray-600">¡Hola {userData.name}!</p>
        </div>

        {/* Título y descripción principal */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">¡Qué bien lo estás haciendo!</h1>
          <p className="text-sm text-gray-600">
            Hoy mantuviste tus gastos bajo control. Cada vez que tus ingresos superan tus gastos, estás construyendo una base más fuerte para tu libertad financiera. ¡Un gran paso!
          </p>
        </div>
          
        {/* Gráfico de Balance Diario con Rangos de Seguridad */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-2 border border-white/20 mb-4">
          <BalanceChart data={balanceData} height={300} />
        </div>

        {/* Disponible en pesos chilenos */}
        <div className="bg-gradient-to-r from-primary-400 to-primaryIntense rounded-2xl shadow-xl p-6 mb-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Disponible</h3>
          <div className="text-4xl font-bold text-white">
            {formatChileanPeso(monthlyStats?.balance || 0)}
          </div>
        </div>

        {/* Grid de Porcentajes - 3 columnas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="text-3xl font-bold text-warning mb-1">{financialData.consumo.percentage.toFixed(1)}%</div>
            <p className="text-sm font-medium text-dark">Consumo</p>
            <p className="text-xs text-gray-500 mt-1">{formatChileanPeso(financialData.consumo.amount)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="text-3xl font-bold text-primaryIntense mb-1">{financialData.necesidades.percentage.toFixed(1)}%</div>
            <p className="text-sm font-medium text-dark">Necesidades</p>
            <p className="text-xs text-gray-500 mt-1">{formatChileanPeso(financialData.necesidades.amount)}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="text-3xl font-bold text-success mb-1">{financialData.invertido.percentage.toFixed(1)}%</div>
            <p className="text-sm font-medium text-dark">Invertido</p>
            <p className="text-xs text-gray-500 mt-1">{formatChileanPeso(financialData.invertido.amount)}</p>
          </div>
        </div>

        {/* Lista de Registros Mejorada */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-dark">Registros Recientes</h3>
            <button 
              onClick={() => setIsAllTransactionsModalOpen(true)}
              className="text-primary-400 hover:text-primaryIntense text-sm font-medium flex items-center transition-colors"
            >
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
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Panel de Navegación Flotante */}
      <FloatingNavigationPanel 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      {/* Menú de Configuración */}
      <SettingsMenu 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      {/* Modal de Todas las Transacciones */}
      <AllTransactionsModal
        isOpen={isAllTransactionsModalOpen}
        onClose={() => setIsAllTransactionsModalOpen(false)}
        transactions={allTransactions}
      />
    </div>
  );
};

const SofinanceApp = () => {
  return (
    <UserProvider>
      <FinancialDataProvider>
        <SofinanceAppContent />
      </FinancialDataProvider>
    </UserProvider>
  );
};

export default SofinanceApp;