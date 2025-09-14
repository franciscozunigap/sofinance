import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Bell, User as UserIcon, MessageCircle, TrendingUp, DollarSign, Target, AlertTriangle, Award, Mic, Send, ArrowLeft, ChevronRight, Home, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';
import WebAppNavigator from '../src/navigation/WebAppNavigator';
import { AuthService } from '../src/services/authService';
import { User } from '../src/types';
import { UserProvider, useUser } from '../src/contexts/UserContext';

const SofinanceAppContent = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // Gráfico de salud financiera
  const currentMonth = "Septiembre";
  const monthlyScoreData = [
    { week: 'Semana 1', score: 45 },
    { week: 'Semana 2', score: 48 },
    { week: 'Semana 3', score: 44 },
    { week: 'Semana 4', score: 52 }
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

  const scoreStatus = getScoreStatus(userData.currentScore);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
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

  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-gray-50">
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
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sofía</h3>
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
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">S</span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-br-md'
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
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Sofinance</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {userData.alerts}
                </span>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-orange-600" />
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">¡Hola {userData.name}! 👋</h2>
            <p className="text-gray-600 mt-1">Score actual: <span className="font-semibold text-orange-600">{userData.currentScore}/100</span> - Tu progreso mensual es constante</p>
          </div>
        </div>

        {/* Zona Financiera Saludable */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Salud Financiera de {currentMonth}</h3>
              <p className="text-sm text-gray-600">Evolución semanal de tu score</p>
            </div>
            <div className={`flex items-center space-x-2 ${scoreStatus.color}`}>
              <span className="text-2xl">{scoreStatus.emoji}</span>
              <span className="font-medium">{scoreStatus.text}</span>
            </div>
          </div>

          {/* Gráfica de Zona Saludable */}
          <div className="h-64 bg-gradient-to-b from-green-50 to-green-100 rounded-lg p-4 relative">
            {/* Zona Saludable */}
            <div className="absolute inset-x-4 top-8 bottom-16 bg-green-200 bg-opacity-30 rounded border-2 border-dashed border-green-300">
              <div className="absolute top-2 left-2 text-xs font-medium text-green-700">
                Zona Saludable (40-80 pts)
              </div>
            </div>
            
            {/* Línea de Progreso */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyScoreData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis domain={[30, 70]} hide />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ea580c" 
                  strokeWidth={3}
                  dot={{ fill: '#ea580c', r: 6 }}
                  activeDot={{ r: 8, fill: '#ea580c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score de Riesgo</p>
                <p className="text-2xl font-bold text-orange-600">{userData.riskScore}/100</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${userData.riskScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gastos del Mes</p>
                <p className="text-2xl font-bold text-red-600">${userData.monthlyExpenses.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {((userData.monthlyExpenses / userData.monthlyIncome) * 100).toFixed(1)}% de tus ingresos
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ahorros Actuales</p>
                <p className="text-2xl font-bold text-green-600">${userData.currentSavings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+5.2% vs mes anterior</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meta de Ahorro</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${userData.savingsGoal.toLocaleString()}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(userData.currentSavings / userData.savingsGoal) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {((userData.currentSavings / userData.savingsGoal) * 100).toFixed(1)}% completado
              </p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gastos por Categoría */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Gastos</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={expenseCategories} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    dataKey="value" 
                    paddingAngle={5}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Leyenda */}
            <div className="flex justify-center space-x-6 mt-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evolución Semanal */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Semanal</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="gastos" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transacciones Recientes y Logros */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transacciones Recientes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transacciones Recientes</h3>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <DollarSign className={`h-5 w-5 ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.date} {transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logros */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus Logros</h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 ${
                    achievement.unlocked 
                      ? 'border-orange-200 bg-orange-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Award className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Chat Button */}
      <button
        onClick={() => setCurrentView('chat')}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center p-2 ${currentView === 'dashboard' ? 'text-orange-500' : 'text-gray-400'}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Inicio</span>
          </button>
          <button 
            onClick={() => setCurrentView('analysis')}
            className={`flex flex-col items-center p-2 ${currentView === 'analysis' ? 'text-orange-500' : 'text-gray-400'}`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">Análisis</span>
          </button>
          <button 
            onClick={() => setCurrentView('chat')}
            className={`flex flex-col items-center p-2 ${currentView === 'chat' ? 'text-orange-500' : 'text-gray-400'}`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs mt-1">Sofía</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-gray-400"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs mt-1">Salir</span>
          </button>
        </div>
      </nav>
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