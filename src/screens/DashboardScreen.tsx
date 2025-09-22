import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import AnalysisScreen from './AnalysisScreen';
import FloatingNavBar from '../components/FloatingNavBar';
import ChatComponent from '../components/ChatComponent';
import SettingsComponent from '../components/SettingsComponent';
import BalanceChartMobile from '../components/BalanceChartMobile';
import { Header, Card, TransactionItem, PercentageCard, SkeletonLoader } from '../components/shared';
import { 
  MOCK_USER_DATA, 
  DAILY_SCORE_DATA, 
  RECENT_TRANSACTIONS, 
  PERCENTAGE_DATA,
  CHAT_RESPONSES,
  INITIAL_CHAT_MESSAGES
} from '../data/mockData';
import { useViewNavigation } from '../hooks/useViewNavigation';
import { useChat } from '../hooks/useChat';
import { getScoreStatus } from '../utils/financialUtils';
import { isIOS, floatingNavConfig, safeAreaInsets } from '../platform/ios';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const { user } = useUser();
  const { currentView, navigateTo, goBack } = useViewNavigation();
  const { messages: chatMessages, input: chatInput, setInput: setChatInput, sendMessage: handleSendMessage } = useChat();
  const [scrollY] = useState(new Animated.Value(0));
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Datos del usuario desde el contexto
  const userData = user || {
    ...MOCK_USER_DATA,
    // Datos financieros mejorados como en la versión web
    financialData: {
      consumo: { percentage: 42, amount: 133500, previousChange: 2 },
      necesidades: { percentage: 57, amount: 181300, previousChange: -1 },
      ahorro: { percentage: 19, amount: 60000, previousChange: 3 },
      invertido: { percentage: 8, amount: 25000, previousChange: 5 }
    }
  };

  // Datos de balance diario para los últimos 4 días (en pesos chilenos) - igual que en web
  const balanceData = [
    // Lunes - Verde (dentro del rango seguro)
    { date: '2024-01-15', amount: 1250000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Martes - Verde (dentro del rango seguro)
    { date: '2024-01-16', amount: 1280000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Miércoles - Amarillo (por debajo del rango inferior)
    { date: '2024-01-17', amount: 980000, upper_amount: 1500000, lower_amount: 1000000 },
    
    // Jueves - Verde (dentro del rango seguro)
    { date: '2024-01-18', amount: 1350000, upper_amount: 1500000, lower_amount: 1000000 },
  ];

  // Simular carga de datos del usuario
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUserDataLoading(false);
    }, 1500); // Simular 1.5 segundos de carga

    return () => clearTimeout(timer);
  }, []);

  // Función para transiciones suaves entre vistas
  const handleViewChange = (view: 'dashboard' | 'analysis' | 'chat' | 'settings') => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    navigateTo(view);
  };

  // Obtener el estado del score
  const scoreStatus = getScoreStatus(userData.currentScore || 0);

  // Vista de Análisis
  if (currentView === 'analysis') {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <AnalysisScreen 
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      </Animated.View>
    );
  }

  if (currentView === 'settings') {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SafeAreaView style={styles.container}>
          <SettingsComponent 
            onBack={goBack}
            onLogout={onLogout}
          />
          <FloatingNavBar 
            currentView={currentView as 'dashboard' | 'analysis' | 'chat'}
            onViewChange={handleViewChange}
          />
        </SafeAreaView>
      </Animated.View>
    );
  }

  if (currentView === 'chat') {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SafeAreaView style={styles.container}>
          <ChatComponent 
            onBack={goBack}
            initialMessages={INITIAL_CHAT_MESSAGES}
            responses={CHAT_RESPONSES}
          />
          <FloatingNavBar 
            currentView={currentView as 'dashboard' | 'analysis' | 'chat'}
            onViewChange={handleViewChange}
          />
        </SafeAreaView>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header con Avatar - igual que web */}
        <View style={styles.avatarHeader}>
          <View style={styles.avatarHeaderContent}>
            {/* Botón de configuración mejorado */}
            <TouchableOpacity
              onPress={() => handleViewChange('settings')}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
            
            {/* Avatar con efecto parallax mejorado */}
            <Animated.View 
              style={[
                styles.avatarContainer,
                {
                  transform: [
                    {
                      translateY: scrollY.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 20],
                        extrapolate: 'clamp',
                      }),
                    },
                    {
                      scale: scrollY.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 0.95],
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
              {/* Overlay sutil */}
              <View style={styles.avatarOverlay} />
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>

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
            {isUserDataLoading ? (
              <SkeletonLoader width={200} height={24} borderRadius={12} />
            ) : (
              <Text style={styles.welcomeTitle}>¡Hola {userData.name}! 👋</Text>
            )}
          </View>

          {/* Título y descripción principal */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>¡Qué bien lo estás haciendo!</Text>
            <Text style={styles.mainDescription}>
            Hoy mantuviste tus gastos bajo control. Cada vez que tus ingresos superan tus gastos, estás construyendo una base más fuerte para tu libertad financiera. ¡Un gran paso!
            </Text>
          </View>

        {/* Gráfico de Balance Diario con Rangos de Seguridad */}
        <View style={styles.balanceChartCard}>
          <BalanceChartMobile data={balanceData} height={300} />
        </View>

        {/* Grid de Métricas - Solo Porcentajes como en web */}
        <View style={styles.percentageGrid}>
          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#ea580c' }]}>
              {userData.financialData?.consumo?.percentage || 42}%
            </Text>
            <Text style={styles.percentageLabel}>Consumo</Text>
          </View>

          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#3b82f6' }]}>
              {userData.financialData?.necesidades?.percentage || 57}%
            </Text>
            <Text style={styles.percentageLabel}>Necesidades</Text>
          </View>

          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#8b5cf6' }]}>
              {userData.financialData?.ahorro?.percentage || 19}%
            </Text>
            <Text style={styles.percentageLabel}>Ahorro</Text>
          </View>

          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#10b981' }]}>
              {userData.financialData?.invertido?.percentage || 8}%
            </Text>
            <Text style={styles.percentageLabel}>Invertido</Text>
          </View>
        </View>

        {/* Lista de Registros Mejorada */}
        <View style={styles.registrosCard}>
          <View style={styles.registrosHeader}>
            <Text style={styles.registrosTitle}>Registros Recientes</Text>
            <TouchableOpacity style={styles.verTodosButton}>
              <Text style={styles.verTodosText}>Ver todos</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.registrosList}>
            {RECENT_TRANSACTIONS.map((transaction, index) => (
              <View 
                key={transaction.id} 
                style={[
                  styles.registroItem,
                  { 
                    backgroundColor: 'rgba(243, 244, 246, 0.5)'
                  }
                ]}
              >
                <View style={styles.registroLeft}>
                  <View style={[
                    styles.registroIcon,
                    { 
                      backgroundColor: transaction.amount > 0 ? '#dcfce7' : '#fef2f2'
                    }
                  ]}>
                    <Ionicons 
                      name="cash-outline" 
                      size={20} 
                      color={transaction.amount > 0 ? '#16a34a' : '#dc2626'} 
                    />
                  </View>
                  <View>
                    <Text style={styles.registroDescription}>{transaction.description}</Text>
                    <Text style={styles.registroCategory}>
                      {transaction.category} • {transaction.date} {transaction.time}
                    </Text>
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
        onViewChange={handleViewChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color gris claro para unificar con AnalysisScreen
  },
  safeArea: {
    flex: 0,
  },
  // Avatar Header styles - igual que web
  avatarHeader: {
    height: 256, // Aumentado para coincidir con web (h-64 = 256px)
    backgroundColor: '#858bf2',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarHeaderContent: {
    flex: 1,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  // Main content overlay - igual que web
  mainContentOverlay: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color gris claro como en AnalysisScreen
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -8, // Aumentado para cubrir completamente el área del avatar
    zIndex: 10,
    marginBottom: isIOS ? -100 : -120,
    width: '100%',
    paddingBottom: isIOS ? 120 : 100, // Aumentado para evitar que el navegador flotante tape el contenido
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
  // Percentage grid - igual que web
  percentageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  percentageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: SIZES.lg,
    width: (width - SIZES.lg * 3) / 2,
    marginBottom: SIZES.md,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  percentageValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  // Nuevos estilos para métricas financieras
  financialMetricsContainer: {
    marginBottom: SIZES.lg,
  },
  financialMetricsTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  financialMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  financialMetricCard: {
    width: '48%',
    padding: SIZES.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: SIZES.md,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  financialMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  financialMetricLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  financialMetricPercentage: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  financialMetricAmount: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: SIZES.xs,
  },
  financialMetricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  financialMetricTrendText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  percentageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  // Registros styles - igual que web
  registrosCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  registrosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  registrosTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  verTodosButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verTodosText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginRight: 4,
  },
  registrosList: {
    gap: SIZES.md,
  },
  registroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: 12,
    marginBottom: SIZES.sm,
  },
  registroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  registroIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  registroDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  registroCategory: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  registroRight: {
    alignItems: 'flex-end',
  },
  registroAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  // Balance chart card styles - igual que web
  balanceChartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
