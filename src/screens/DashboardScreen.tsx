import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from '../platform';
import { useUser } from '../contexts/UserContext';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { DollarSign, TrendingUp, Target, AlertTriangle, Award, Mic, Send, Settings, Home, BarChart3, MessageCircle, HelpCircle, LogOut } from 'lucide-react-native';
import AnalysisScreen from './AnalysisScreen';
import FloatingNavBar from '../components/FloatingNavBar';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'sofia',
      text: '¡Hola! 👋 Veo que tu score financiero está mejorando. ¿Te gustaría revisar algunas recomendaciones para este mes?',
      timestamp: '10:30 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Datos del usuario desde el contexto
  const userData = user || {
    name: 'María',
    monthlyIncome: 4200,
    currentScore: 52,
    riskScore: 48,
    monthlyExpenses: 3180,
    currentSavings: 12500,
    savingsGoal: 18000,
    alerts: 3
  };

  // MODIFICADO: El gasto mensual ahora es la suma de las 3 nuevas categorías
  const monthlyExpenses = 3180; // 1800 (Necesidades) + 780 (Consumo) + 600 (Ahorro)

  // Gráfico de salud financiera - 7 días
  const currentMonth = "Septiembre";
  const dailyScoreData = [
    { day: 'Lun', score: 45 },
    { day: 'Mar', score: 48 },
    { day: 'Mié', score: 44 },
    { day: 'Jue', score: 52 },
    { day: 'Vie', score: 49 },
    { day: 'Sáb', score: 47 },
    { day: 'Dom', score: 50 }
  ];

  // MODIFICADO: Categorías de gastos simplificadas a 3 tipos
  const expenseCategories = [
    { name: 'Necesidades', value: 1800, color: '#ea580c' }, // Gastos fijos, vivienda, etc.
    { name: 'Consumo', value: 780, color: '#fb923c' },     // Salidas, compras no esenciales, etc.
    { name: 'Ahorro', value: 600, color: '#fed7aa' }       // Inversión, metas, etc.
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
    if (score >= 60) return { text: '¡Excelente! Estás en zona óptima', color: '#16a34a', emoji: '🚀' };
    if (score >= 40) return { text: 'Bien, mantén el ritmo', color: '#ea580c', emoji: '💪' };
    return { text: 'Necesitas mejorar', color: '#dc2626', emoji: '⚠️' };
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            onLogout();
          },
        },
      ]
    );
  };

  const scoreStatus = getScoreStatus(userData.currentScore || 0);

  // Vista de Análisis
  if (currentView === 'analysis') {
    return (
      <AnalysisScreen 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header de Ajustes */}
        <View style={styles.chatHeader}>
          <View style={styles.chatHeaderContent}>
            <TouchableOpacity 
              onPress={() => setCurrentView('dashboard')}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.chatUserInfo}>
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarText}>⚙️</Text>
              </View>
              <View>
                <Text style={styles.chatUserName}>Ajustes</Text>
                <Text style={styles.chatUserStatus}>Configuración</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contenido de Ajustes */}
        <ScrollView style={styles.settingsContent}>
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Cuenta</Text>
            
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Ionicons name="person-outline" size={24} color={COLORS.gray} />
                <Text style={styles.settingsItemText}>Perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Ionicons name="shield-outline" size={24} color={COLORS.gray} />
                <Text style={styles.settingsItemText}>Privacidad</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Ionicons name="notifications-outline" size={24} color={COLORS.gray} />
                <Text style={styles.settingsItemText}>Notificaciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Aplicación</Text>
            
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Ionicons name="help-circle-outline" size={24} color={COLORS.gray} />
                <Text style={styles.settingsItemText}>Ayuda</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Ionicons name="information-circle-outline" size={24} color={COLORS.gray} />
                <Text style={styles.settingsItemText}>Acerca de</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsSection}>
            <TouchableOpacity style={[styles.settingsItem, styles.logoutItem]} onPress={handleLogout}>
              <View style={styles.settingsItemLeft}>
                <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
                <Text style={[styles.settingsItemText, styles.logoutText]}>Cerrar Sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Floating Navigation Panel */}
        <FloatingNavBar 
          currentView={currentView as 'dashboard' | 'analysis' | 'chat'}
          onViewChange={setCurrentView}
        />
      </SafeAreaView>
    );
  }

  if (currentView === 'chat') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Contenedor con fondo gris como AnalysisScreen */}
        <View style={styles.chatContainer}>
          {/* Header del Chat */}
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderContent}>
              <TouchableOpacity 
                onPress={() => setCurrentView('dashboard')}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <View style={styles.chatUserInfo}>
                <View style={styles.chatAvatar}>
                  <Image 
                    source={require('../../assets/avatar.png')} 
                    style={styles.chatAvatarImage}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={styles.chatUserName}>Sofía</Text>
                  <Text style={styles.chatUserStatus}>En línea</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chat Messages */}
          <ScrollView style={styles.chatMessages} contentContainerStyle={styles.chatMessagesContent}>
          {chatMessages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.userMessageContainer : styles.sofiaMessageContainer
              ]}
            >
              <View style={styles.messageContent}>
                {message.sender === 'sofia' && (
                  <View style={styles.messageAvatar}>
                    <Image 
                      source={require('../../assets/avatar.png')} 
                      style={styles.messageAvatarImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
                
                <View style={styles.messageBubble}>
                  <View
                    style={[
                      styles.messageBubbleContent,
                      message.sender === 'user' ? styles.userMessageBubble : styles.sofiaMessageBubble
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.sofiaMessageText
                    ]}>
                      {message.text}
                    </Text>
                  </View>
                  <Text style={[
                    styles.messageTime,
                    message.sender === 'user' ? styles.userMessageTime : styles.sofiaMessageTime
                  ]}>
                    {message.timestamp}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          </ScrollView>

          {/* Chat Input */}
          <View style={styles.chatInput}>
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatTextInput}
                  value={chatInput}
                onChangeText={setChatInput}
                  placeholder="Pregúntame sobre tus finanzas..."
                placeholderTextColor={COLORS.gray}
              />
              <TouchableOpacity style={styles.chatSendButton} onPress={handleSendMessage}>
                <Text style={styles.chatSendButtonText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con Avatar */}
      <View style={styles.avatarHeader}>
        <View style={styles.avatarHeaderContent}>
          {/* Botón de perfil */}
          <TouchableOpacity
            onPress={() => setCurrentView('settings')}
            style={styles.profileButton}
          >
            <Ionicons name="person-outline" size={18} color={COLORS.white} />
          </TouchableOpacity>
          
          {/* Avatar que abarca toda la pantalla */}
          <Animated.View 
            style={[
              styles.avatarContainer,
              {
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, 30],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    scale: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0.96, 0.84], // Aumentado 20% (0.8*1.2 = 0.96, 0.7*1.2 = 0.84)
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          >
            <Image 
              source={require('../../assets/avatar.png')} 
              style={styles.avatarImage}
              resizeMode="cover"
              onError={(error) => console.log('Error loading avatar image:', error)}
              onLoad={() => console.log('Avatar image loaded successfully')}
            />
          </Animated.View>
        </View>
      </View>

      {/* Main Content con superposición */}
      <View style={styles.mainContentOverlay}>
        <Animated.ScrollView 
          style={styles.mainContent} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* Bienvenida */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>¡Hola {userData.name}! 👋</Text>
          </View>

          {/* Título y descripción principal */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Tu Salud Financiera</Text>
            <Text style={styles.mainDescription}>
              Optimiza tus finanzas diariamente con nuestro análisis inteligente. Visualiza tendencias, identifica oportunidades de ahorro y toma decisiones financieras más inteligentes.
            </Text>
          </View>

        {/* Zona Financiera Saludable */}
        <View style={styles.healthCard}>

          {/* Gráfica de Zona Saludable */}
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: dailyScoreData.map(item => item.day),
                datasets: [{
                  data: dailyScoreData.map(item => item.score),
                  color: (opacity = 1) => `rgba(133, 139, 242, ${opacity})`,
                  strokeWidth: 3
                }]
              }}
              width={width - 120}
              height={200}
              chartConfig={{
                backgroundColor: '#f0f2ff',
                backgroundGradientFrom: '#f0f2ff',
                backgroundGradientTo: '#f0f2ff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(133, 139, 242, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: '#858BF2'
                }
              }}
              style={styles.chartView}
            />
          </View>
        </View>

        {/* 4 Columnas de Porcentajes */}
        <View style={styles.percentageGrid}>
          <View style={styles.percentageCard}>
            <Text style={[styles.percentageValue, { color: '#ea580c' }]}>42%</Text>
            <Text style={styles.percentageLabel}>Consumo</Text>
          </View>

          <View style={styles.percentageCard}>
            <Text style={[styles.percentageValue, { color: '#dc2626' }]}>57%</Text>
            <Text style={styles.percentageLabel}>Necesidades</Text>
          </View>

          <View style={styles.percentageCard}>
            <Text style={[styles.percentageValue, { color: '#16a34a' }]}>19%</Text>
            <Text style={styles.percentageLabel}>Ahorro</Text>
          </View>

          <View style={styles.percentageCard}>
            <Text style={[styles.percentageValue, { color: '#7c3aed' }]}>8%</Text>
            <Text style={styles.percentageLabel}>Deuda</Text>
          </View>
        </View>

          {/* Lista de Registros */}
          <View style={styles.registrosCard}>
            <Text style={styles.registrosTitle}>Registros Recientes</Text>
            <View style={styles.registrosList}>
              {recentTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.registroItem}>
                  <View style={styles.registroLeft}>
                    <View style={[
                      styles.registroIcon,
                      { backgroundColor: transaction.amount > 0 ? '#dcfce7' : '#fef2f2' }
                    ]}>
                      <DollarSign 
                        size={16} 
                        color={transaction.amount > 0 ? '#16a34a' : '#dc2626'} 
                      />
                    </View>
                    <View>
                      <Text style={styles.registroDescription}>{transaction.description}</Text>
                      <Text style={styles.registroCategory}>{transaction.category} • {transaction.date} {transaction.time}</Text>
                    </View>
                  </View>
                  <View style={styles.registroRight}>
                    <Text style={[
                      styles.registroAmount,
                      { color: transaction.amount > 0 ? '#16a34a' : '#dc2626' }
                    ]}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

        </Animated.ScrollView>
      </View>

      {/* Chat Button - Ocultado */}
      {/* <TouchableOpacity
        onPress={() => setCurrentView('chat')}
        style={styles.chatButton}
      >
        <Ionicons name="chatbubble-outline" size={24} color={COLORS.white} />
      </TouchableOpacity> */}

      {/* Floating Navigation Panel */}
      <FloatingNavBar 
        currentView={currentView as 'dashboard' | 'analysis' | 'chat'}
        onViewChange={setCurrentView}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#858bf2', // Color de la app (mismo que el fondo de la imagen)
  },
  // Avatar Header styles
  avatarHeader: {
    height: 200, // Reducido a 1/3 de la vista (aproximadamente 200px de 600px)
    backgroundColor: '#858bf2',
    position: 'relative',
  },
  avatarHeaderContent: {
    flex: 1,
    position: 'relative',
  },
  profileButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary, // Color de la app
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avatarText: {
    fontSize: 48,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Main content overlay
  mainContentOverlay: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color gris claro como en AnalysisScreen
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -5, // Aumentado para cubrir completamente el área del avatar
    zIndex: 10,
    marginBottom: -120,
    width: '100%',
    paddingBottom: 100, // Aumentado para evitar que el navegador flotante tape el contenido
  },
  // Main content styles
  mainContent: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
    paddingBottom: 20, // Añadido padding inferior para evitar que el navegador tape el contenido
  },
  welcomeSection: {
    marginVertical: SIZES.lg,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark, // Negro Suave
    marginBottom: SIZES.xs,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  scoreText: {
    fontWeight: '600',
    color: COLORS.primary, // Azul Suave
  },
  // Title section
  titleSection: {
    marginBottom: SIZES.lg,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  mainDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  // Percentage grid
  percentageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  percentageCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    width: (width - SIZES.lg * 3) / 2,
    marginBottom: SIZES.sm,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80, // Para coincidir con la altura de web
  },
  percentageValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  percentageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  // Registros styles
  registrosCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8, // Para coincidir con shadow-lg de web
    elevation: 3,
  },
  registrosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.md,
  },
  registrosList: {
    gap: SIZES.sm,
  },
  registroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  registroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  registroIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  registroDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  registroCategory: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  registroRight: {
    alignItems: 'flex-end',
  },
  registroAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Health card styles
  healthCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8, // Para coincidir con shadow-lg de web
    elevation: 3,
  },
  chartContainer: {
    height: 208, // Ajustado para coincidir con web (52 * 4)
    backgroundColor: '#f0f2ff', // Azul muy claro para coincidir con web
    borderRadius: BORDER_RADIUS.lg,
    padding: SIZES.md,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  // Metrics grid styles
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  metricCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SIZES.lg,
    width: (width - SIZES.lg * 3) / 2,
    marginBottom: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8, // Para coincidir con shadow-lg de web
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary, // Azul Suave
    marginTop: SIZES.xs,
  },
  metricSubtext: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.grayScale[200],
    borderRadius: 4,
    marginTop: SIZES.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary, // Azul Suave
    borderRadius: 4,
  },
  // Transactions card styles
  transactionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8, // Para coincidir con shadow-lg de web
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark, // Negro Suave
    marginBottom: SIZES.lg,
  },
  transactionsList: {
    gap: SIZES.md,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayScale[100],
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark, // Negro Suave
  },
  transactionCategory: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  // Achievements card styles
  achievementsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SIZES.lg,
    marginBottom: SIZES.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8, // Para coincidir con shadow-lg de web
    elevation: 3,
  },
  achievementsList: {
    gap: SIZES.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
  },
  achievementUnlocked: {
    borderColor: '#fed7aa',
    backgroundColor: '#fff7ed',
  },
  achievementLocked: {
    borderColor: COLORS.grayScale[200],
    backgroundColor: COLORS.grayScale[50],
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: SIZES.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark, // Negro Suave
    marginBottom: SIZES.xs,
  },
  achievementDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  // Chat styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color gris claro como en AnalysisScreen
  },
  chatHeader: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayScale[200],
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: SIZES.sm,
    marginRight: SIZES.md,
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.gray,
  },
  chatUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  chatAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'contain',
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark, // Negro Suave
  },
  chatUserStatus: {
    fontSize: 14,
    color: COLORS.success,
  },
  chatMessages: {
    flex: 1,
    paddingBottom: 80, // Reducido para quitar espacio vacío
  },
  chatMessagesContent: {
    padding: SIZES.lg,
  },
  messageContainer: {
    marginBottom: SIZES.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  sofiaMessageContainer: {
    alignItems: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  messageAvatarText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },
  messageBubble: {
    flex: 1,
  },
  messageBubbleContent: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  sofiaMessageBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grayScale[200],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
  },
  userMessageText: {
    color: COLORS.white,
  },
  sofiaMessageText: {
    color: COLORS.dark, // Negro Suave
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  userMessageTime: {
    textAlign: 'right',
  },
  sofiaMessageTime: {
    textAlign: 'left',
  },
  chatInput: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayScale[200],
    padding: SIZES.lg,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayScale[100],
    borderRadius: 20,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark, // Negro Suave
    paddingVertical: SIZES.xs,
  },
  chatSendButton: {
    backgroundColor: COLORS.primary, // Azul Suave
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  chatSendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Chat button
  chatButton: {
    position: 'absolute',
    bottom: 100,
    right: SIZES.lg,
    backgroundColor: COLORS.primary, // Azul Suave
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Chart styles
  chartsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8, // Para coincidir con shadow-lg de web
    elevation: 3,
    width: width < 768 ? '100%' : '48%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.md,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  chartView: {
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SIZES.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.sm,
    marginVertical: SIZES.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SIZES.xs,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  // Settings styles
  settingsContent: {
    flex: 1,
    padding: SIZES.lg,
    paddingBottom: 80, // Reducido para quitar espacio vacío
    backgroundColor: '#F2F2F2', // Color gris claro como en AnalysisScreen
  },
  settingsSection: {
    marginBottom: SIZES.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark, // Negro Suave
    marginBottom: SIZES.md,
    marginLeft: SIZES.sm,
    marginTop: SIZES.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayScale[100],
    borderRadius: BORDER_RADIUS.md, // Para coincidir con web
    marginHorizontal: SIZES.sm,
    marginTop: SIZES.sm,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemText: {
    fontSize: 16,
    color: COLORS.dark, // Negro Suave
    marginLeft: SIZES.md,
  },
  logoutItem: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    marginTop: SIZES.sm,
    borderBottomWidth: 0,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  logoutText: {
    color: COLORS.danger, // Rojo Vibrante
    fontWeight: '500',
  },
});

export default DashboardScreen;
