import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../contexts/UserContext';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Award, BarChart3, PieChart as PieChartIcon } from 'lucide-react-native';
import FloatingNavBar from '../components/FloatingNavBar';
import BalanceRegistrationScreen from './BalanceRegistrationScreen';

const { width } = Dimensions.get('window');

interface AnalysisScreenProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'analysis' | 'chat' | 'settings') => void;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ currentView, onViewChange }) => {
  const { user } = useUser();
  const [showBalanceRegistration, setShowBalanceRegistration] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<typeof insights[0] | null>(null);

  // Datos del usuario
  const userData = {
    name: user?.name || 'Usuario',
    monthlyIncome: user?.monthlyIncome || 420000,
    currentScore: user?.currentScore || 52,
    riskScore: user?.riskScore || 48,
    monthlyExpenses: user?.monthlyExpenses || 318000,
    currentSavings: user?.currentSavings || 1500000,
    savingsGoal: user?.savingsGoal || 1800000,
    alerts: user?.alerts || 3,
    // Datos financieros mejorados como en la versión web
    financialData: {
      consumo: { percentage: 42, amount: 133500, previousChange: 2 },
      necesidades: { percentage: 57, amount: 181300, previousChange: -1 },
      ahorro: { percentage: 19, amount: 60000, previousChange: 3 },
      invertido: { percentage: 8, amount: 25000, previousChange: 5 }
    }
  };

  // Datos para análisis financiero - porcentual
  const monthlyTrend = [
    { month: 'Ene', consumo: 42, necesidades: 57, ahorro: 19, invertido: 8 },
    { month: 'Feb', consumo: 38, necesidades: 55, ahorro: 22, invertido: 10 },
    { month: 'Mar', consumo: 45, necesidades: 60, ahorro: 15, invertido: 6 },
    { month: 'Abr', consumo: 40, necesidades: 52, ahorro: 25, invertido: 12 },
    { month: 'May', consumo: 43, necesidades: 58, ahorro: 18, invertido: 9 },
    { month: 'Jun', consumo: 42, necesidades: 57, ahorro: 19, invertido: 8 }
  ];

  const categoryAnalysis = [
    { name: 'Vivienda', value: 120000, color: '#ef4444' },
    { name: 'Alimentación', value: 60000, color: '#f97316' },
    { name: 'Transporte', value: 40000, color: '#eab308' },
    { name: 'Entretenimiento', value: 30000, color: '#8b5cf6' },
    { name: 'Salud', value: 20000, color: '#06b6d4' },
    { name: 'Otros', value: 48000, color: '#10b981' }
  ];

  const weeklySpending = [
    { day: 'Lun', amount: 12000 },
    { day: 'Mar', amount: 8500 },
    { day: 'Mié', amount: 20000 },
    { day: 'Jue', amount: 15000 },
    { day: 'Vie', amount: 30000 },
    { day: 'Sáb', amount: 45000 },
    { day: 'Dom', amount: 18000 }
  ];

  const financialGoals = [
    { name: 'Fondo de Emergencia', target: 1000000, current: 800000, deadline: 'Dic 2024', priority: 'high' },
    { name: 'Vacaciones', target: 300000, current: 120000, deadline: 'Ago 2024', priority: 'medium' },
    { name: 'Casa Propia', target: 5000000, current: 1250000, deadline: '2026', priority: 'high' }
  ];

  const insights = [
    {
      type: 'info',
      title: 'Regla del 50/30/20',
      description: 'Asigna el 50% de tus ingresos a necesidades básicas, 30% a deseos personales y 20% a ahorros e inversiones. Esta regla te ayuda a mantener un equilibrio financiero saludable y te permite disfrutar de la vida mientras construyes tu futuro financiero.',
      icon: 'information-circle',
      action: 'Ver detalle',
      detail: 'La regla del 50/30/20 es una estrategia de presupuesto simple y efectiva:\n\n• 50% para necesidades básicas (vivienda, alimentación, transporte, servicios)\n• 30% para deseos personales (entretenimiento, viajes, hobbies)\n• 20% para ahorros e inversiones (fondo de emergencia, jubilación, inversiones)\n\nEsta regla te ayuda a mantener un equilibrio financiero saludable y te permite disfrutar de la vida mientras construyes tu futuro financiero.'
    },
    {
      type: 'warning',
      title: 'Fondo de Emergencia',
      description: 'Mantén un fondo de emergencia equivalente a 3-6 meses de gastos. Este dinero debe estar en una cuenta de fácil acceso y te protegerá ante imprevistos como pérdida de empleo, gastos médicos inesperados o reparaciones urgentes en tu hogar.',
      icon: 'warning',
      action: 'Ver detalle',
      detail: 'Un fondo de emergencia es tu red de seguridad financiera:\n\n• Equivalente a 3-6 meses de gastos básicos\n• Debe estar en una cuenta de fácil acceso\n• Te protege ante imprevistos como pérdida de empleo\n• Cubre gastos médicos inesperados\n• Permite reparaciones urgentes en tu hogar\n\nEste fondo te dará tranquilidad y estabilidad financiera.'
    },
    {
      type: 'success',
      title: 'Presupuesto Mensual',
      description: 'Crea y sigue un presupuesto mensual detallado. Registra todos tus ingresos y gastos, categorízalos y revisa tu progreso semanalmente. Un presupuesto bien estructurado es la base de una buena salud financiera.',
      icon: 'checkmark-circle',
      action: 'Ver detalle',
      detail: 'Un presupuesto mensual es la base de tu salud financiera:\n\n• Registra todos tus ingresos y gastos\n• Categoriza cada transacción\n• Revisa tu progreso semanalmente\n• Ajusta según sea necesario\n• Te ayuda a tomar decisiones informadas\n\nUn presupuesto bien estructurado te da control total sobre tu dinero.'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: COLORS.danger, backgroundColor: '#fef2f2' };
      case 'medium':
        return { color: '#f59e0b', backgroundColor: '#fffbeb' };
      case 'low':
        return { color: COLORS.success, backgroundColor: '#f0fdf4' };
      default:
        return { color: COLORS.gray, backgroundColor: '#f9fafb' };
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return { color: COLORS.danger, backgroundColor: '#fef2f2', borderColor: COLORS.danger };
      case 'success':
        return { color: COLORS.success, backgroundColor: '#f0fdf4', borderColor: COLORS.success };
      case 'info':
        return { color: COLORS.primary, backgroundColor: '#eff6ff', borderColor: COLORS.primary };
      default:
        return { color: COLORS.gray, backgroundColor: '#f9fafb', borderColor: COLORS.gray };
    }
  };

  // Función para determinar el estado de riesgo del saldo
  const getRiskStatus = (currentSavings: number, monthlyExpenses: number) => {
    const monthsCoverage = currentSavings / monthlyExpenses;
    
    if (monthsCoverage < 3) {
      return {
        status: 'Riesgoso',
        color: COLORS.danger,
        backgroundColor: '#fef2f2',
        description: 'Riesgoso'
      };
    } else if (monthsCoverage >= 3 && monthsCoverage < 6) {
      return {
        status: 'Seguro',
        color: COLORS.success,
        backgroundColor: '#f0fdf4',
        description: 'Seguro'
      };
    } else {
      return {
        status: 'Sobre Recomendado',
        color: '#3b82f6',
        backgroundColor: '#eff6ff',
        description: 'Sobre Recomendado'
      };
    }
  };

  const riskStatus = getRiskStatus(userData.currentSavings || 0, userData.monthlyExpenses || 0);

  // Si se está mostrando el registro de balance, renderizar esa pantalla
  if (showBalanceRegistration) {
    return (
      <BalanceRegistrationScreen
        onComplete={() => setShowBalanceRegistration(false)}
        currentBalance={userData.currentSavings || 0}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Main Content con superposición */}
      <View style={styles.mainContentOverlay}>
        {/* Header Mejorado con Métricas Dinámicas */}
        <View style={styles.enhancedHeader}>
          <View style={styles.enhancedHeaderContent}>
            {/* Primera fila: Título y Botón + */}
            <View style={styles.headerTopRow}>
              <View style={styles.headerTitleSection}>
                <View style={styles.headerIconContainer}>
                  <BarChart3 size={24} color={COLORS.white} />
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.enhancedHeaderTitle}>Dashboard</Text>
                  <Text style={styles.enhancedHeaderSubtitle}>
                    Última actualización: {new Date().toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </Text>
                </View>
              </View>
              
              {/* Botón + en la esquina superior derecha */}
              <TouchableOpacity 
                style={styles.enhancedAddButton}
                onPress={() => setShowBalanceRegistration(true)}
              >
                <Text style={styles.enhancedAddButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Saldo Actual */}
        <View style={styles.singleMetricContainer}>
          <View style={styles.singleMetricCard}>
            <View style={styles.singleMetricHeader}>
              <Text style={styles.singleMetricLabel}>Saldo Actual</Text>
              <DollarSign size={24} color={COLORS.primary} />
            </View>
            <Text style={[styles.singleMetricValue, { color: COLORS.primary }]}>
              ${userData.currentSavings?.toLocaleString() || '1,500,000'}
            </Text>
            <View style={[styles.riskStatusContainer, { backgroundColor: riskStatus.backgroundColor }]}>
              <Text style={[styles.riskStatusText, { color: riskStatus.color }]}>
                {riskStatus.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Montos y Dashboard - Ahorro, Consumo, Necesidades, Invertido */}
        <View style={styles.verticalMetricsContainer}>
          <View style={styles.verticalMetricCard}>
            <View style={styles.verticalMetricHeader}>
              <View style={[styles.verticalMetricIcon, { backgroundColor: '#d1fae5' }]}>
                <TrendingUp size={20} color={COLORS.success} />
              </View>
              <View style={styles.verticalMetricContent}>
                <Text style={styles.verticalMetricLabel}>Ahorro Mensual</Text>
                <View style={styles.verticalMetricValues}>
                  <Text style={[styles.verticalMetricPercentage, { color: COLORS.success }]}>
                    {userData.financialData?.ahorro?.percentage || 19}%
                  </Text>
                  <Text style={[styles.verticalMetricAmount, { color: COLORS.dark }]}>
                    ${userData.financialData?.ahorro?.amount?.toLocaleString() || '60,000'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.verticalMetricTrend}>
              <TrendingUp size={12} color={COLORS.success} />
              <Text style={[styles.verticalMetricTrendText, { color: COLORS.success }]}>
                +{userData.financialData?.ahorro?.previousChange || 3}% vs mes anterior
              </Text>
            </View>
          </View>
          <View style={styles.verticalMetricCard}>
            <View style={styles.verticalMetricHeader}>
              <View style={[styles.verticalMetricIcon, { backgroundColor: '#fef3c7' }]}>
                <Target size={20} color="#f59e0b" />
              </View>
              <View style={styles.verticalMetricContent}>
                <Text style={styles.verticalMetricLabel}>Consumo</Text>
                <View style={styles.verticalMetricValues}>
                  <Text style={[styles.verticalMetricPercentage, { color: '#f59e0b' }]}>
                    {userData.financialData?.consumo?.percentage || 42}%
                  </Text>
                  <Text style={[styles.verticalMetricAmount, { color: COLORS.dark }]}>
                    ${userData.financialData?.consumo?.amount?.toLocaleString() || '133,500'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.verticalMetricTrend}>
              {(userData.financialData?.consumo?.previousChange || 0) >= 0 ? (
                <TrendingUp size={12} color="#f59e0b" />
              ) : (
                <TrendingDown size={12} color={COLORS.success} />
              )}
              <Text style={[styles.verticalMetricTrendText, { 
                color: (userData.financialData?.consumo?.previousChange || 0) >= 0 ? '#f59e0b' : COLORS.success 
              }]}>
                {(userData.financialData?.consumo?.previousChange || 0) >= 0 ? '+' : ''}{userData.financialData?.consumo?.previousChange || 2}% vs mes anterior
              </Text>
            </View>
          </View>

          <View style={styles.verticalMetricCard}>
            <View style={styles.verticalMetricHeader}>
              <View style={[styles.verticalMetricIcon, { backgroundColor: '#dbeafe' }]}>
                <Award size={20} color="#3b82f6" />
              </View>
              <View style={styles.verticalMetricContent}>
                <Text style={styles.verticalMetricLabel}>Necesidades</Text>
                <View style={styles.verticalMetricValues}>
                  <Text style={[styles.verticalMetricPercentage, { color: '#3b82f6' }]}>
                    {userData.financialData?.necesidades?.percentage || 57}%
                  </Text>
                  <Text style={[styles.verticalMetricAmount, { color: COLORS.dark }]}>
                    ${userData.financialData?.necesidades?.amount?.toLocaleString() || '181,300'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.verticalMetricTrend}>
              {(userData.financialData?.necesidades?.previousChange || 0) >= 0 ? (
                <TrendingUp size={12} color="#3b82f6" />
              ) : (
                <TrendingDown size={12} color={COLORS.success} />
              )}
              <Text style={[styles.verticalMetricTrendText, { 
                color: (userData.financialData?.necesidades?.previousChange || 0) >= 0 ? '#3b82f6' : COLORS.success 
              }]}>
                {(userData.financialData?.necesidades?.previousChange || 0) >= 0 ? '+' : ''}{userData.financialData?.necesidades?.previousChange || -1}% vs mes anterior
              </Text>
            </View>
          </View>

          <View style={styles.verticalMetricCard}>
            <View style={styles.verticalMetricHeader}>
              <View style={[styles.verticalMetricIcon, { backgroundColor: '#d1fae5' }]}>
                <TrendingUp size={20} color={COLORS.success} />
              </View>
              <View style={styles.verticalMetricContent}>
                <Text style={styles.verticalMetricLabel}>Invertido</Text>
                <View style={styles.verticalMetricValues}>
                  <Text style={[styles.verticalMetricPercentage, { color: COLORS.success }]}>
                    {userData.financialData?.invertido?.percentage || 8}%
                  </Text>
                  <Text style={[styles.verticalMetricAmount, { color: COLORS.dark }]}>
                    ${userData.financialData?.invertido?.amount?.toLocaleString() || '25,000'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.verticalMetricTrend}>
              {(userData.financialData?.invertido?.previousChange || 0) >= 0 ? (
                <TrendingUp size={12} color={COLORS.success} />
              ) : (
                <TrendingDown size={12} color={COLORS.danger} />
              )}
              <Text style={[styles.verticalMetricTrendText, { 
                color: (userData.financialData?.invertido?.previousChange || 0) >= 0 ? COLORS.success : COLORS.danger 
              }]}>
                {(userData.financialData?.invertido?.previousChange || 0) >= 0 ? '+' : ''}{userData.financialData?.invertido?.previousChange || 5}% vs mes anterior
              </Text>
            </View>
          </View>
        </View>

        {/* Tendencias Últimos 6 Meses */}
        <View style={styles.chartsContainer}>
          {/* Tendencias Mensuales - Porcentual */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Tendencias Últimos 6 Meses</Text>
            <Text style={styles.chartSubtitle}>Evolución de Categorías Financieras</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: monthlyTrend.map(item => item.month),
                  datasets: [{
                    data: monthlyTrend.map(item => item.consumo),
                    color: (opacity = 1) => `rgba(234, 88, 12, ${opacity})`, // Naranja para consumo
                    strokeWidth: 3
                  }, {
                    data: monthlyTrend.map(item => item.necesidades),
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Azul para necesidades
                    strokeWidth: 3
                  }, {
                    data: monthlyTrend.map(item => item.ahorro),
                    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Púrpura para ahorro
                    strokeWidth: 3
                  }, {
                    data: monthlyTrend.map(item => item.invertido),
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Verde para invertido
                    strokeWidth: 3
                  }]
                }}
                width={width - 80}
                height={200}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "4", strokeWidth: "2" }
                }}
                style={styles.chartView}
              />
            </View>
          </View>

        </View>

        {/* Recomendaciones Generales */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Recomendaciones Generales</Text>
          <View style={styles.insightsContainer}>
            {insights.map((insight, index) => {
              const insightStyle = getInsightColor(insight.type);
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.insightItem,
                    { 
                      backgroundColor: insightStyle.backgroundColor,
                      borderLeftColor: insightStyle.borderColor
                    }
                  ]}
                >
                  <View style={styles.insightContent}>
                    <Ionicons 
                      name={insight.icon as any} 
                      size={20} 
                      color={insightStyle.color} 
                      style={styles.insightIcon}
                    />
                    <View style={styles.insightText}>
                      <Text style={[styles.insightTitle, { color: insightStyle.color }]}>
                        {insight.title}
                      </Text>
                      <Text style={styles.insightDescription}>{insight.description}</Text>
                      <TouchableOpacity onPress={() => setSelectedRecommendation(insight)}>
                        <Text style={[styles.insightAction, { color: COLORS.primary }]}>
                          {insight.action} →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        </ScrollView>
      </View>

      {/* Floating Navigation Panel */}
      <FloatingNavBar 
        currentView={currentView as 'dashboard' | 'analysis' | 'chat'}
        onViewChange={onViewChange}
      />

      {/* Modal de Recomendación */}
      <Modal
        visible={selectedRecommendation !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedRecommendation(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedRecommendation?.title}
              </Text>
              <TouchableOpacity 
                onPress={() => setSelectedRecommendation(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalDetail}>
                {selectedRecommendation?.detail}
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setSelectedRecommendation(null)}
              >
                <Text style={styles.modalButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color gris claro para unificar con DashboardScreen
  },
  // Main content overlay
  mainContentOverlay: {
    flex: 1,
    backgroundColor: '#F2F2F2', // Color gris claro como en DashboardScreen
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -5, // Aumentado para cubrir completamente el área
    zIndex: 10,
    marginBottom: Platform.OS === 'ios' ? -100 : -120,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Aumentado para evitar que el navegador flotante tape el contenido
  },
  // Header mejorado
  enhancedHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  enhancedHeaderContent: {
    paddingVertical: SIZES.lg,
    paddingHorizontal: SIZES.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  enhancedHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  enhancedHeaderSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  enhancedAddButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  enhancedAddButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Métricas rápidas en el header
  quickMetricsContainer: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  quickMetricCard: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: SIZES.sm,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  quickMetricCardPurple: {
    flex: 1,
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: SIZES.sm,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  quickMetricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickMetricLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 2,
  },
  quickMetricLabelPurple: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8b5cf6',
    marginBottom: 2,
  },
  quickMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  quickMetricValuePurple: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    paddingBottom: 100, // Aumentado para evitar que el navegador flotante tape el contenido
  },
  // Saldo Actual único
  singleMetricContainer: {
    marginBottom: SIZES.lg,
  },
  singleMetricCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  singleMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  singleMetricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  singleMetricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
  },
  // Indicador de estado de riesgo
  riskStatusContainer: {
    padding: SIZES.sm,
    borderRadius: 8,
    marginTop: SIZES.sm,
  },
  riskStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  riskStatusDescription: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Métricas detalladas (Consumo, Necesidades, Invertido)
  detailedMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
    gap: SIZES.sm,
  },
  detailedMetricCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.md,
    flex: 1,
    marginHorizontal: SIZES.xs,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailedMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  detailedMetricIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailedMetricValues: {
    alignItems: 'flex-end',
  },
  detailedMetricPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  detailedMetricAmount: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailedMetricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  detailedMetricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailedMetricTrendText: {
    fontSize: 10,
    marginLeft: 4,
  },
  // Métricas verticales (Consumo, Necesidades, Invertido en filas completas)
  verticalMetricsContainer: {
    marginBottom: SIZES.lg,
  },
  verticalMetricCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  verticalMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  verticalMetricIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  verticalMetricContent: {
    flex: 1,
  },
  verticalMetricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  verticalMetricValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalMetricPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  verticalMetricAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  verticalMetricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalMetricTrendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  chartsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  chartCard: {
    backgroundColor: COLORS.white, // Fondo blanco sólido sobre el gris
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: width < 768 ? '100%' : '48%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.xs,
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  chartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartView: {
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SIZES.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: SIZES.sm,
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
    flex: 1,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.dark,
  },
  goalsContainer: {
    gap: SIZES.md,
  },
  goalItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: SIZES.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  goalProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  goalProgressText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  goalPercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.dark,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: SIZES.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  goalDeadline: {
    fontSize: 10,
    color: COLORS.gray,
  },
  insightsContainer: {
    gap: SIZES.md,
  },
  insightItem: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: SIZES.md,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    marginRight: SIZES.sm,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  insightAction: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalDetail: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.gray,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnalysisScreen;
