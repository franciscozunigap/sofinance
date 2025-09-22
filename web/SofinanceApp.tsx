import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Bell, User as UserIcon, MessageCircle, TrendingUp, DollarSign, Target, AlertTriangle, Award, Mic, Send, ArrowLeft, ChevronRight, Home, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';
import WebAppNavigator from '../src/navigation/WebAppNavigator';
import { AuthService } from '../src/services/authService';
import { User } from '../src/types';
import { UserProvider, useUser } from '../src/contexts/UserContext';
import FloatingNavigationPanel from '../src/components/FloatingNavigationPanel';
import WebAnalysisScreen from '../src/screens/web/WebAnalysisScreen';
import SettingsMenu from '../src/components/SettingsMenu';
import { RECENT_TRANSACTIONS } from '../src/data/mockData';
import AllTransactionsModal from '../src/components/AllTransactionsModal';
import BalanceChart from '../src/components/BalanceChart';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';

const SofinanceAppContent = () => {
  const [currentView, setCurrentView] = useState('finance');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAllTransactionsModalOpen, setIsAllTransactionsModalOpen] = useState(false);
  const { user, setUser } = useUser();
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
    const unsubscribe = AuthService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Usar datos mock del usuario desde UserContext
        setUser(firebaseUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Datos del usuario desde el contexto (en pesos chilenos)
  const userData = user ? {
    name: user.name || 'Usuario',
    monthlyIncome: user.monthlyIncome || 420000,
    currentScore: user.currentScore || 52,
    riskScore: user.riskScore || 48,
    monthlyExpenses: user.monthlyExpenses || 318000,
    currentSavings: user.currentSavings || 1250000,
    savingsGoal: user.savingsGoal || 1800000,
    alerts: user.alerts || 3,
    // Nuevos datos financieros
    financialData: {
      consumo: { percentage: 42, amount: 133500, previousChange: 2 },
      necesidades: { percentage: 57, amount: 181300, previousChange: -1 },
      ahorro: { percentage: 19, amount: 60000, previousChange: 3 },
      invertido: { percentage: 8, amount: 25000, previousChange: 5 }
    }
  } : {
    name: 'Usuario',
    monthlyIncome: 420000,
    currentScore: 52,
    riskScore: 48,
    monthlyExpenses: 318000,
    currentSavings: 1250000,
    savingsGoal: 1800000,
    alerts: 3,
    // Nuevos datos financieros
    financialData: {
      consumo: { percentage: 42, amount: 133500, previousChange: 2 },
      necesidades: { percentage: 57, amount: 181300, previousChange: -1 },
      ahorro: { percentage: 19, amount: 60000, previousChange: 3 },
      invertido: { percentage: 8, amount: 25000, previousChange: 5 }
    }
  };

  // Gráfico de salud financiera - 7 días
  const currentMonth = "Septiembre";
  const dailyScoreData = [
    { day: 'Lun', score: 45 },
    { day: 'Mar', score: 48 },
    { day: 'Mié', score: 44 },
    { day: 'Jue', score: 46 },
    { day: 'Vie', score: 50 },
    { day: 'Sáb', score: 48 },
    { day: 'Dom', score: 52 }
  ];

  // Datos de balance diario para los últimos 7 días (en pesos chilenos)
  const balanceData = [
    // Lunes - Verde (dentro del rango seguro)
    { date: '2024-01-15', amount: 1250000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Martes - Verde (dentro del rango seguro)
    { date: '2024-01-16', amount: 1280000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Miércoles - Amarillo (por debajo del rango inferior)
    { date: '2024-01-17', amount: 980000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Jueves - Verde (dentro del rango seguro)
    { date: '2024-01-18', amount: 1350000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Viernes - Rojo (por encima del rango superior)
    { date: '2024-01-19', amount: 1520000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Sábado - Sin datos
    { date: '2024-01-20', amount: undefined, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Domingo - Verde (dentro del rango seguro)
    { date: '2024-01-21', amount: 1270000, upper_amount: 1500000, lower_amount: 1000000 },
  ];

  // Categorías de gastos
  const expenseCategories = [
    { name: 'Necesidades', value: 1800, color: '#ea580c' },
    { name: 'Consumo', value: 780, color: '#fb923c' },
    { name: 'Ahorro', value: 600, color: '#fed7aa' }
  ];

  const weeklyTrend = [
    { week: 'S1', gastos: 720 },
    { week: 'S2', gastos: 890 },
    { week: 'S3', gastos: 650 },
    { week: 'S4', gastos: 920 }
  ];

  // Importar las transacciones desde mockData
  const recentTransactions = RECENT_TRANSACTIONS;

  // Lista completa de transacciones para el modal
  const allTransactions = RECENT_TRANSACTIONS;

  const achievements = [
    { id: 1, title: 'Consistencia Semanal', description: 'Registraste tus gastos 7 días seguidos', icon: '🎯', unlocked: true },
    { id: 2, title: 'Consumo Consciente', description: 'Redujiste gastos de consumo esta semana', icon: '🏆', unlocked: true },
    { id: 3, title: 'Meta del Mes', description: 'Cumple tu meta de ahorro mensual', icon: '💎', unlocked: false }
  ];

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const handleRegistrationSuccess = (registeredUser: User) => {
    setUser(registeredUser);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
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

  if (isLoading) {
    return (
        <div className="min-h-screen bg-light flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400"></div>
        </div>
    );
  }

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
        {/* Gradiente de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600"></div>
        
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
        <div className="mb-6">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-2 border border-white/20 mb-2">
          <BalanceChart data={balanceData} height={300} />
        </div>

        {/* Grid de Métricas - Solo Porcentajes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="text-3xl font-bold text-orange-600 mb-1">{userData.financialData.consumo.percentage}%</div>
            <p className="text-sm font-medium text-gray-600">Consumo</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-1">{userData.financialData.necesidades.percentage}%</div>
            <p className="text-sm font-medium text-gray-600">Necesidades</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-1">{userData.financialData.ahorro.percentage}%</div>
            <p className="text-sm font-medium text-gray-600">Ahorro</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20">
            <div className="text-3xl font-bold text-green-600 mb-1">{userData.financialData.invertido.percentage}%</div>
            <p className="text-sm font-medium text-gray-600">Invertido</p>
          </div>
        </div>

        {/* Lista de Registros Mejorada */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Registros Recientes</h3>
            <button 
              onClick={() => setIsAllTransactionsModalOpen(true)}
              className="text-primary-400 hover:text-primary-500 text-sm font-medium flex items-center transition-colors"
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
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category} • {transaction.date} {transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
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
      <SofinanceAppContent />
    </UserProvider>
  );
};

export default SofinanceApp;