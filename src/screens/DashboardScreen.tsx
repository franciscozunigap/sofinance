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
} from 'react-native';
import { SafeAreaView } from '../platform';
import { useUser } from '../contexts/UserContext';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { DollarSign, TrendingUp, Target, AlertTriangle, Award, Mic, Send, Settings, Home, BarChart3, MessageCircle, HelpCircle, LogOut } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
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

  // MODIFICADO: Gráfico de salud financiera ahora es semanal para el mes actual
  const currentMonth = "Septiembre";
  const monthlyScoreData = [
    { week: 'Semana 1', score: 45 },
    { week: 'Semana 2', score: 48 },
    { week: 'Semana 3', score: 44 },
    { week: 'Semana 4', score: 52 }
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

        {/* Navigation Bar (Mobile) */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            onPress={() => setCurrentView('dashboard')}
            style={[styles.navItem, currentView === 'dashboard' && styles.navItemActive]}
          >
            <Ionicons name="home-outline" size={20} color={currentView === 'dashboard' ? COLORS.primary : COLORS.gray} />
            <Text style={[styles.navLabel, currentView === 'dashboard' && styles.navLabelActive]}>
              Inicio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setCurrentView('analysis')}
            style={[styles.navItem, currentView === 'analysis' && styles.navItemActive]}
          >
            <Ionicons name="bar-chart-outline" size={20} color={currentView === 'analysis' ? COLORS.primary : COLORS.gray} />
            <Text style={[styles.navLabel, currentView === 'analysis' && styles.navLabelActive]}>
              Análisis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setCurrentView('chat')}
            style={[styles.navItem, currentView === 'chat' && styles.navItemActive]}
          >
            <Ionicons name="chatbubble-outline" size={20} color={currentView === 'chat' ? COLORS.primary : COLORS.gray} />
            <Text style={[styles.navLabel, currentView === 'chat' && styles.navLabelActive]}>
              Sofía
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setCurrentView('settings')}
            style={[styles.navItem, currentView === 'settings' && styles.navItemActive]}
          >
            <Ionicons name="settings-outline" size={20} color={currentView === 'settings' ? COLORS.primary : COLORS.gray} />
            <Text style={[styles.navLabel, currentView === 'settings' && styles.navLabelActive]}>
              Ajustes
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentView === 'chat') {
    return (
      <SafeAreaView style={styles.container}>
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
                  source={Platform.OS === 'ios' ? require('../../ios/SoFinance/Images.xcassets/Avatar.imageset/avatar.png') : require('../../assets/avatar.svg')} 
                  style={styles.chatAvatarImage}
                  resizeMode="cover"
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
                      source={Platform.OS === 'ios' ? require('../../ios/SoFinance/Images.xcassets/Avatar.imageset/avatar.png') : require('../../assets/avatar.svg')} 
                      style={styles.messageAvatarImage}
                      resizeMode="cover"
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con Avatar */}
      <View style={styles.avatarHeader}>
        <View style={styles.avatarHeaderContent}>
          {/* Botón de configuración */}
          <TouchableOpacity
            onPress={() => setCurrentView('settings')}
            style={styles.settingsButton}
          >
            <Settings size={16} color={COLORS.white} />
          </TouchableOpacity>
          
          {/* Avatar que abarca toda la pantalla */}
          <View style={styles.avatarContainer}>
            <Image 
              source={Platform.OS === 'ios' ? require('../../ios/SoFinance/Images.xcassets/Avatar.imageset/avatar.png') : require('../../assets/avatar.svg')} 
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Main Content con superposición */}
      <View style={styles.mainContentOverlay}>
        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
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
          <View style={styles.healthCardHeader}>
            <View>
              <Text style={styles.healthCardTitle}>Salud Financiera de {currentMonth}</Text>
              <Text style={styles.healthCardSubtitle}>Evolución semanal de tu score</Text>
            </View>
            <View style={styles.scoreStatusContainer}>
              <Text style={styles.scoreEmoji}>{scoreStatus.emoji}</Text>
              <Text style={[styles.scoreStatusText, { color: scoreStatus.color }]}>
                {scoreStatus.text}
              </Text>
            </View>
          </View>

          {/* Gráfica de Zona Saludable */}
          <View style={styles.chartContainer}>
            <View style={styles.healthyZone}>
              <Text style={styles.healthyZoneText}>Zona Saludable (40-80 pts)</Text>
            </View>
            <LineChart
              data={{
                labels: monthlyScoreData.map(item => item.week),
                datasets: [{
                  data: monthlyScoreData.map(item => item.score),
                  color: (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
                  strokeWidth: 3
                }]
              }}
              width={width - 80}
              height={200}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: COLORS.primary
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

        {/* Gráficos */}
        <View style={styles.chartsContainer}>
          {/* Gastos por Categoría */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución de Gastos</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={expenseCategories}
                width={width - 80}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
              />
            </View>
            
            {/* Leyenda */}
            <View style={styles.legendContainer}>
              {expenseCategories.map((category, index) => (
                <View key={index} style={styles.legendItem}>
                  <View 
                    style={[
                      styles.legendDot, 
                      { backgroundColor: category.color }
                    ]} 
                  />
                  <Text style={styles.legendText}>{category.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Evolución Semanal */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Evolución Semanal</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: weeklyTrend.map(item => item.week),
                  datasets: [{
                    data: weeklyTrend.map(item => item.gastos)
                  }]
                }}
                width={width - 80}
                height={200}
                yAxisLabel="$"
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: COLORS.white,
                  backgroundGradientFrom: COLORS.white,
                  backgroundGradientTo: COLORS.white,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(234, 88, 12, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: COLORS.primary
                  }
                }}
                style={styles.chartView}
              />
            </View>
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

          {/* Logros */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Tus Logros</Text>
          <View style={styles.achievementsList}>
              {achievements.map((achievement) => (
              <View 
                  key={achievement.id}
                style={[
                  styles.achievementItem,
                  achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                    {achievement.unlocked && (
                  <Ionicons name="trophy-outline" size={20} color={COLORS.primary} />
                )}
              </View>
            ))}
          </View>
        </View>
        </ScrollView>
      </View>

      {/* Chat Button - Ocultado */}
      {/* <TouchableOpacity
        onPress={() => setCurrentView('chat')}
        style={styles.chatButton}
      >
        <Ionicons name="chatbubble-outline" size={24} color={COLORS.white} />
      </TouchableOpacity> */}

      {/* Navigation Bar (Mobile) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          onPress={() => setCurrentView('dashboard')}
          style={[styles.navItem, currentView === 'dashboard' && styles.navItemActive]}
        >
          <Ionicons name="home-outline" size={20} color={currentView === 'dashboard' ? COLORS.primary : COLORS.gray} />
          <Text style={[styles.navLabel, currentView === 'dashboard' && styles.navLabelActive]}>
            Inicio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setCurrentView('analysis')}
          style={[styles.navItem, currentView === 'analysis' && styles.navItemActive]}
        >
          <Ionicons name="bar-chart-outline" size={20} color={currentView === 'analysis' ? COLORS.primary : COLORS.gray} />
          <Text style={[styles.navLabel, currentView === 'analysis' && styles.navLabelActive]}>
            Análisis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setCurrentView('chat')}
          style={[styles.navItem, currentView === 'chat' && styles.navItemActive]}
        >
          <Ionicons name="chatbubble-outline" size={20} color={currentView === 'chat' ? COLORS.primary : COLORS.gray} />
          <Text style={[styles.navLabel, currentView === 'chat' && styles.navLabelActive]}>
            Sofía
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setCurrentView('settings')}
          style={[styles.navItem, currentView === 'settings' && styles.navItemActive]}
        >
          <Ionicons name="settings-outline" size={20} color={currentView === 'settings' ? COLORS.primary : COLORS.gray} />
          <Text style={[styles.navLabel, currentView === 'settings' && styles.navLabelActive]}>
            Ajustes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light, // Blanco Roto
  },
  // Avatar Header styles
  avatarHeader: {
    height: 250, // Aumentado para mejor visualización del avatar
    backgroundColor: '#858bf2',
    position: 'relative',
  },
  avatarHeaderContent: {
    flex: 1,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    alignSelf: 'stretch',
  },
  // Main content overlay
  mainContentOverlay: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -8,
    zIndex: 10,
    maxWidth: 1200, // Para coincidir con max-w-7xl de web
    alignSelf: 'center',
    width: '100%',
  },
  // Main content styles
  mainContent: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
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
  healthCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  healthCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark, // Negro Suave
  },
  healthCardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  scoreStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreEmoji: {
    fontSize: 24,
    marginRight: SIZES.sm,
  },
  scoreStatusText: {
    fontWeight: '500',
    fontSize: 14,
  },
  chartContainer: {
    height: 208, // Ajustado para coincidir con web (52 * 4)
    backgroundColor: '#f0f2ff', // Azul muy claro para coincidir con web
    borderRadius: BORDER_RADIUS.lg,
    padding: SIZES.md,
    position: 'relative',
  },
  healthyZone: {
    position: 'absolute',
    top: SIZES.md,
    left: SIZES.md,
    right: SIZES.md,
    bottom: SIZES.xl,
    backgroundColor: 'rgba(133, 139, 242, 0.3)', // Azul Suave con transparencia
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: 'rgba(133, 139, 242, 0.5)', // Azul Suave con transparencia
    borderStyle: 'dashed',
  },
  healthyZoneText: {
    position: 'absolute',
    top: SIZES.xs,
    left: SIZES.xs,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary, // Azul Suave
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
    resizeMode: 'cover',
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
    resizeMode: 'cover',
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
  // Bottom navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayScale[200],
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  navItemActive: {
    // Active state styling
  },
  navLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  navLabelActive: {
    color: COLORS.primary, // Azul Suave
    fontWeight: '500',
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
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayScale[50],
    borderRadius: BORDER_RADIUS.md,
  },
  chartPlaceholderText: {
    fontSize: 48,
    marginBottom: SIZES.sm,
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
    backgroundColor: COLORS.light, // Para coincidir con web
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
