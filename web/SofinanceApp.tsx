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
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.svg';

const SofinanceAppContent = () => {
  const [currentView, setCurrentView] = useState('finance');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  // Datos del usuario desde el contexto
  const userData = user ? {
    name: user.name || 'Usuario',
    monthlyIncome: user.monthlyIncome || 4200,
    currentScore: user.currentScore || 52,
    riskScore: user.riskScore || 48,
    monthlyExpenses: user.monthlyExpenses || 3180,
    currentSavings: user.currentSavings || 12500,
    savingsGoal: user.savingsGoal || 18000,
    alerts: user.alerts || 3
  } : {
    name: 'Usuario',
    monthlyIncome: 4200,
    currentScore: 52,
    riskScore: 48,
    monthlyExpenses: 3180,
    currentSavings: 12500,
    savingsGoal: 18000,
    alerts: 3
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

  const recentTransactions = [
    { id: 1, description: 'Supermercado Jumbo', amount: -85.50, category: 'Necesidades', date: '08 Sep', time: '14:30' },
    { id: 2, description: 'Cena en restaurante', amount: -45.00, category: 'Consumo', date: '08 Sep', time: '21:15' },
    { id: 3, description: 'Netflix', amount: -9.99, category: 'Consumo', date: '07 Sep', time: '16:45' },
    { id: 4, description: 'Transferencia Ahorro', amount: -150.00, category: 'Ahorro', date: '07 Sep', time: '08:00' },
    { id: 5, description: 'Salario', amount: 4200.00, category: 'Ingresos', date: '05 Sep', time: '09:00' }
  ];

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
      className="min-h-screen bg-light overflow-x-hidden pb-20" 
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none'
      }}
    >
      {/* Header con Avatar */}
      <div className="relative w-full h-52 overflow-hidden" style={{ backgroundColor: '#858bf2' }}>
        <div className="absolute top-3 right-3 z-10">
          {/* Botón de configuración */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-7 h-7 bg-white hover:bg-gray-50 text-gray-600 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
            title="Configuración"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        {/* Avatar que abarca toda la pantalla */}
        <div 
          className="relative w-full h-full transition-all duration-300 ease-out"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.3, 30)}px) scale(${Math.max(1 - scrollY * 0.001, 0.9)})`,
          }}
        >
          <img 
            src={avatar} 
            alt="Avatar" 
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Main Content con superposición */}
      <main className="relative z-10 bg-white rounded-t-3xl -mt-2 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Bienvenida */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">¡Hola {userData.name}! 👋</p>
        </div>

        {/* Título y descripción principal */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">Tu Salud Financiera</h1>
          <p className="text-sm text-gray-600">
          Optimiza tus finanzas diariamente con nuestro análisis inteligente. Visualiza tendencias, identifica oportunidades de ahorro y toma decisiones financieras más inteligentes.
          </p>
        </div>

        {/* Zona Financiera Saludable */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          {/* Gráfica de Zona Saludable */}
          <div className="h-52 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-3 relative">
            {/* Zona Saludable */}
            <div className="absolute inset-x-4 top-8 bottom-16 bg-primary-200 bg-opacity-30 rounded border-2 border-dashed border-primary-300">
              <div className="absolute top-2 left-2 text-xs font-medium text-primary-700">
                Zona Saludable (40-80 pts)
              </div>
            </div>
            
            {/* Línea de Progreso */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyScoreData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis domain={[30, 70]} hide />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#858BF2" 
                  strokeWidth={3}
                  dot={{ fill: '#858BF2', r: 6 }}
                  activeDot={{ r: 8, fill: '#858BF2' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4 Columnas de Porcentajes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">42%</div>
            <p className="text-xs font-medium text-gray-600">Consumo</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">57%</div>
            <p className="text-xs font-medium text-gray-600">Necesidades</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">19%</div>
            <p className="text-xs font-medium text-gray-600">Ahorro</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">8%</div>
            <p className="text-xs font-medium text-gray-600">Deuda</p>
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-semibold text-dark mb-4">Registros Recientes</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <DollarSign className={`h-4 w-4 ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-dark text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.category} • {transaction.date} {transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${
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