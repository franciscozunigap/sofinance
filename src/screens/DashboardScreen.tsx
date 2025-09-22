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
import { useBalance } from '../hooks/useBalance';
import { getScoreStatus } from '../utils/financialUtils';
import { formatChileanPeso } from '../utils/currencyUtils';
import { isIOS, floatingNavConfig, safeAreaInsets } from '../platform/ios';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const { user } = useUser();
  const { currentView, navigateTo, goBack } = useViewNavigation();
  const { messages: chatMessages, input: chatInput, setInput: setChatInput, sendMessage: handleSendMessage } = useChat();
  const { currentBalance, monthlyStats, balanceHistory, loading: balanceLoading } = useBalance(user?.id || 'user-id');
  const [scrollY] = useState(new Animated.Value(0));
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Datos del usuario desde el contexto
  const userData = user ? {
    name: user.name || user.firstName || 'Usuario',
    firstName: user.firstName || '',
    monthlyIncome: user.monthlyIncome || user.wallet?.monthly_income || 0,
    currentScore: user.currentScore || 0,
    riskScore: user.riskScore || 0,
    monthlyExpenses: monthlyStats?.totalExpenses || user.monthlyExpenses || 0,
    currentSavings: currentBalance || user.currentSavings || user.wallet?.amount || 0,
    savingsGoal: user.savingsGoal || 0,
    alerts: user.alerts || 0,
    financialData: monthlyStats ? {
      consumo: { 
        percentage: monthlyStats.percentages.wants, 
        amount: monthlyStats.totalExpenses * 0.4, 
        previousChange: 0 
      },
      necesidades: { 
        percentage: monthlyStats.percentages.needs, 
        amount: monthlyStats.totalExpenses * 0.6, 
        previousChange: 0 
      },
      disponible: { 
        percentage: monthlyStats.percentages.savings, 
        amount: monthlyStats.balance * (monthlyStats.percentages.savings / 100), 
        previousChange: 0 
      },
      invertido: { 
        percentage: monthlyStats.percentages.investment, 
        amount: monthlyStats.balance * (monthlyStats.percentages.investment / 100), 
        previousChange: 0 
      }
    } : {
      consumo: { percentage: 0, amount: 0, previousChange: 0 },
      necesidades: { percentage: 0, amount: 0, previousChange: 0 },
      disponible: { percentage: 0, amount: 0, previousChange: 0 },
      invertido: { percentage: 0, amount: 0, previousChange: 0 }
    }
  } : {
    name: 'Usuario',
    firstName: '',
    monthlyIncome: 0,
    currentScore: 0,
    riskScore: 0,
    monthlyExpenses: 0,
    currentSavings: 0,
    savingsGoal: 0,
    alerts: 0,
    financialData: {
      consumo: { percentage: 0, amount: 0, previousChange: 0 },
      necesidades: { percentage: 0, amount: 0, previousChange: 0 },
      disponible: { percentage: 0, amount: 0, previousChange: 0 },
      invertido: { percentage: 0, amount: 0, previousChange: 0 }
    }
  };

  // Datos de balance diario - generar últimos 7 días con datos reales donde estén disponibles
  const generateBalanceData = () => {
    if (balanceHistory.length === 0) {
      // Si no hay datos reales, usar datos mock
      return monthlyStats ? [
        { date: 'Hoy', amount: currentBalance, upper_amount: currentBalance * 1.2, lower_amount: currentBalance * 0.8 },
      ] : [
        { date: '2024-01-15', amount: 1250000, upper_amount: 1500000, lower_amount: 1000000 },
        { date: '2024-01-16', amount: 1280000, upper_amount: 1500000, lower_amount: 1000000 },
        { date: '2024-01-17', amount: 980000, upper_amount: 1500000, lower_amount: 1000000 },
        { date: '2024-01-18', amount: 1350000, upper_amount: 1500000, lower_amount: 1000000 },
      ];
    }

    // Generar los últimos 7 días
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('es-CL', { month: 'short', day: 'numeric' });
      
      // Buscar si hay datos para este día
      const dayData = balanceHistory.find(registration => {
        const regDate = new Date(registration.date);
        return regDate.toDateString() === date.toDateString();
      });
      
      if (dayData) {
        // Si hay datos para este día, usarlos
        last7Days.push({
          date: dateStr,
          amount: dayData.balanceAfter,
          upper_amount: dayData.balanceAfter * 1.2,
          lower_amount: dayData.balanceAfter * 0.8,
        });
      } else {
        // Si no hay datos para este día, crear entrada sin punto
        const lastKnownBalance = balanceHistory[0]?.balanceAfter || currentBalance;
        last7Days.push({
          date: dateStr,
          amount: undefined, // Sin punto en el gráfico
          upper_amount: lastKnownBalance * 1.2,
          lower_amount: lastKnownBalance * 0.8,
        });
      }
    }
    
    return last7Days;
  };

  const balanceData = generateBalanceData();

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
        {/* Header con Avatar - mejorado para coincidir con web */}
        <View style={styles.avatarHeader}>
          {/* Gradiente de fondo */}
          <View style={styles.avatarGradient} />
          
          {/* Patrones decorativos */}
          <View style={styles.decorativePatterns}>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
          </View>
          
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
              {/* Overlay para integrar mejor con el fondo */}
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
          {/* Saldo actual */}
          <View style={styles.balanceSection}>
            {isUserDataLoading || balanceLoading ? (
              <SkeletonLoader width={200} height={60} borderRadius={12} />
            ) : (
              <>
                <Text style={styles.balanceLabel}>Saldo Actual</Text>
                <Text style={styles.balanceAmount}>
                  {formatChileanPeso(currentBalance)}
                </Text>
              </>
            )}
          </View>

        {/* Gráfico de Balance Diario con Rangos de Seguridad */}
        <View style={styles.balanceChartCard}>
          <BalanceChartMobile data={balanceData} height={300} />
        </View>

        {/* Grid de Métricas - Solo Porcentajes como en web */}
        <View style={styles.percentageGrid}>
          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#ea580c' }]}>
              {monthlyStats?.percentages.wants || userData.financialData?.consumo?.percentage || 0}%
            </Text>
            <Text style={styles.percentageLabel}>Consumo</Text>
          </View>

          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#3b82f6' }]}>
              {monthlyStats?.percentages.needs || userData.financialData?.necesidades?.percentage || 0}%
            </Text>
            <Text style={styles.percentageLabel}>Necesidades</Text>
          </View>

          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#8b5cf6' }]}>
              {monthlyStats?.percentages.savings || userData.financialData?.disponible?.percentage || 0}%
            </Text>
            <Text style={styles.percentageLabel}>Ahorro</Text>
          </View>

          <View style={[styles.percentageCard, { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
            <Text style={[styles.percentageValue, { color: '#10b981' }]}>
              {monthlyStats?.percentages.investment || userData.financialData?.invertido?.percentage || 0}%
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
            {balanceHistory.length > 0 ? (
              balanceHistory.slice(0, 5).map((registration, index) => (
                <View 
                  key={registration.id} 
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
                        backgroundColor: registration.type === 'income' ? '#dcfce7' : '#fef2f2'
                      }
                    ]}>
                      <Ionicons 
                        name={registration.type === 'income' ? 'add-circle-outline' : 'remove-circle-outline'} 
                        size={16} 
                        color={registration.type === 'income' ? '#16a34a' : '#dc2626'} 
                      />
                    </View>
                    <View>
                      <Text style={styles.registroDescription}>{registration.description}</Text>
                      <Text style={styles.registroCategory}>
                        {registration.category} • {registration.date.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.registroRight}>
                    <Text style={[
                      styles.registroAmount,
                      { color: registration.type === 'income' ? '#16a34a' : '#dc2626' }
                    ]}>
                      {registration.type === 'income' ? '+' : '-'}{formatChileanPeso(registration.amount)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={48} color={COLORS.gray} />
                <Text style={styles.emptyStateText}>No hay registros aún</Text>
                <Text style={styles.emptyStateSubtext}>Comienza registrando tu balance</Text>
              </View>
            )}
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
  // Avatar Header styles - mejorado para coincidir con web
  avatarHeader: {
    height: 256, // Aumentado para coincidir con web (h-64 = 256px)
    backgroundColor: COLORS.primary, // Usar color primario del tema
    position: 'relative',
    overflow: 'hidden',
  },
  avatarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary, // Usar color primario del tema
    // En React Native no podemos usar gradientes CSS directamente, 
    // pero podemos simular el efecto con múltiples capas
  },
  decorativePatterns: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    // Simulamos blur con opacidad reducida
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ translateX: -120 }, { translateY: -120 }],
  },
  avatarHeaderContent: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350, // Aumentado para dar más espacio y evitar corte
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderRadius: 0,
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
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 14, // Ajustado hacia arriba para mostrar la parte superior
    left: 0,
    tintColor: undefined,
    opacity: 1, // Sólido, sin transparencia
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary + '0D', // Usar color primario con transparencia
    borderRadius: 0,
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
    paddingBottom: isIOS ? 190 : 120, // Aumentado para evitar que el navegador flotante tape el contenido
  },
  // Main content styles
  mainContent: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
    paddingBottom: 80, // Aumentado padding inferior para evitar que el navegador tape el contenido
  },
  // Balance section
  balanceSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SIZES.lg,
    marginVertical: SIZES.lg,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: SIZES.sm,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  welcomeSection: {
    marginVertical: SIZES.lg,
  },
  welcomeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: -10,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
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
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  registroDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  registroCategory: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  registroRight: {
    alignItems: 'flex-end',
    minWidth: 80,
    marginLeft: SIZES.sm,
  },
  registroAmount: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
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
