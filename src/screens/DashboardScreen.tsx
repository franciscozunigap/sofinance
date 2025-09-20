import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from '../platform';
import { useUser } from '../contexts/UserContext';
import { COLORS, SIZES, BORDER_RADIUS } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import AnalysisScreen from './AnalysisScreen';
import FloatingNavBar from '../components/FloatingNavBar';
import ChatComponent from '../components/ChatComponent';
import SettingsComponent from '../components/SettingsComponent';
import { Header, Card, TransactionItem, PercentageCard } from '../components/shared';
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
import { DollarSign } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const { user } = useUser();
  const { currentView, navigateTo, goBack } = useViewNavigation();
  const { messages: chatMessages, input: chatInput, setInput: setChatInput, sendMessage: handleSendMessage } = useChat();
  const [scrollY] = useState(new Animated.Value(0));

  // Datos del usuario desde el contexto
  const userData = user || MOCK_USER_DATA;

  // Obtener el estado del score
  const scoreStatus = getScoreStatus(userData.currentScore || 0);

  // Vista de Análisis
  if (currentView === 'analysis') {
    return (
      <AnalysisScreen 
        currentView={currentView}
        onViewChange={navigateTo}
      />
    );
  }

  if (currentView === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        <SettingsComponent 
          onBack={goBack}
          onLogout={onLogout}
        />
        <FloatingNavBar 
          currentView={currentView as 'dashboard' | 'analysis' | 'chat'}
          onViewChange={navigateTo}
        />
      </SafeAreaView>
    );
  }

  if (currentView === 'chat') {
    return (
      <SafeAreaView style={styles.container}>
        <ChatComponent 
          onBack={goBack}
          initialMessages={INITIAL_CHAT_MESSAGES}
          responses={CHAT_RESPONSES}
        />
        <FloatingNavBar 
          currentView={currentView as 'dashboard' | 'analysis' | 'chat'}
          onViewChange={navigateTo}
        />
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
            onPress={() => navigateTo('settings')}
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
                labels: DAILY_SCORE_DATA.map(item => item.day),
                datasets: [{
                  data: DAILY_SCORE_DATA.map(item => item.score),
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
          {PERCENTAGE_DATA.map((item, index) => (
            <PercentageCard
              key={index}
              label={item.label}
              percentage={item.value}
              amount={item.amount}
              color={item.color}
              style={styles.percentageCard}
            />
          ))}
        </View>

          {/* Lista de Registros */}
          <View style={styles.registrosCard}>
            <Text style={styles.registrosTitle}>Registros Recientes</Text>
            <View style={styles.registrosList}>
              {RECENT_TRANSACTIONS.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  id={transaction.id}
                  description={transaction.description}
                  amount={transaction.amount}
                  category={transaction.category}
                  date={transaction.date}
                  time={transaction.time}
                />
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
        onViewChange={navigateTo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color gris claro para unificar con AnalysisScreen
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
