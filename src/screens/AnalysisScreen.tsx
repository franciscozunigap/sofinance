import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
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
  onViewChange: (view: string) => void;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ currentView, onViewChange }) => {
  const { user } = useUser();
  const [showBalanceRegistration, setShowBalanceRegistration] = useState(false);

  // Datos del usuario
  const userData = user || {
    name: 'Usuario',
    monthlyIncome: 420000,
    currentScore: 52,
    riskScore: 48,
    monthlyExpenses: 318000,
    currentSavings: 1250000,
    savingsGoal: 1800000,
    alerts: 3,
    // Datos financieros mejorados como en la versión web
    financialData: {
      consumo: { percentage: 42, amount: 133500, previousChange: 2 },
      necesidades: { percentage: 57, amount: 181300, previousChange: -1 },
      ahorro: { percentage: 19, amount: 60000, previousChange: 3 },
      invertido: { percentage: 8, amount: 25000, previousChange: 5 }
    }
  };

  // Datos para análisis financiero
  const monthlyTrend = [
    { month: 'Ene', income: 420000, expenses: 350000, savings: 70000 },
    { month: 'Feb', income: 420000, expenses: 320000, savings: 100000 },
    { month: 'Mar', income: 420000, expenses: 380000, savings: 40000 },
    { month: 'Abr', income: 420000, expenses: 310000, savings: 110000 },
    { month: 'May', income: 420000, expenses: 330000, savings: 90000 },
    { month: 'Jun', income: 420000, expenses: 318000, savings: 102000 }
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
      type: 'warning',
      title: 'Gasto Alto en Entretenimiento',
      description: 'Has gastado 15% más en entretenimiento este mes. Considera reducir actividades costosas.',
      icon: 'warning',
      action: 'Ver detalles'
    },
    {
      type: 'success',
      title: 'Excelente Control de Alimentación',
      description: 'Redujiste 8% tus gastos en alimentación manteniendo una dieta saludable.',
      icon: 'checkmark-circle',
      action: 'Ver estrategias'
    },
    {
      type: 'info',
      title: 'Oportunidad de Ahorro',
      description: 'Podrías ahorrar $200 extra si optimizas tus gastos de transporte.',
      icon: 'information-circle',
      action: 'Crear plan'
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Análisis Financiero</Text>
              <Text style={styles.headerSubtitle}>Insights detallados sobre tu comportamiento financiero</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowBalanceRegistration(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Métricas Principales */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Ahorro Mensual</Text>
              <DollarSign size={20} color={COLORS.success} />
            </View>
            <Text style={[styles.metricValue, { color: COLORS.success }]}>
              ${userData.financialData?.ahorro?.amount?.toLocaleString() || '60,000'}
            </Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={12} color={COLORS.success} />
              <Text style={[styles.metricTrendText, { color: COLORS.success }]}>
                +{userData.financialData?.ahorro?.previousChange || 3}% vs mes anterior
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Gastos Promedio</Text>
              <BarChart3 size={20} color={COLORS.danger} />
            </View>
            <Text style={[styles.metricValue, { color: COLORS.danger }]}>
              ${userData.monthlyExpenses?.toLocaleString() || '318,000'}
            </Text>
            <View style={styles.metricTrend}>
              <TrendingDown size={12} color={COLORS.danger} />
              <Text style={[styles.metricTrendText, { color: COLORS.danger }]}>-5% vs mes anterior</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Consumo</Text>
              <Target size={20} color="#3b82f6" />
            </View>
            <Text style={[styles.metricValue, { color: '#3b82f6' }]}>
              {userData.financialData?.consumo?.percentage || 42}%
            </Text>
            <View style={styles.metricTrend}>
              <TrendingUp size={12} color="#3b82f6" />
              <Text style={[styles.metricTrendText, { color: '#3b82f6' }]}>
                +{userData.financialData?.consumo?.previousChange || 2}% vs mes anterior
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Necesidades</Text>
              <Award size={20} color="#ea580c" />
            </View>
            <Text style={[styles.metricValue, { color: '#ea580c' }]}>
              {userData.financialData?.necesidades?.percentage || 57}%
            </Text>
            <View style={styles.metricTrend}>
              <TrendingDown size={12} color="#ea580c" />
              <Text style={[styles.metricTrendText, { color: '#ea580c' }]}>
                {userData.financialData?.necesidades?.previousChange || -1}% vs mes anterior
              </Text>
            </View>
          </View>
        </View>

        {/* Gráficos Principales */}
        <View style={styles.chartsContainer}>
          {/* Tendencias Mensuales */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Tendencias de los Últimos 6 Meses</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: monthlyTrend.map(item => item.month),
                  datasets: [{
                    data: monthlyTrend.map(item => item.income),
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                    strokeWidth: 3
                  }, {
                    data: monthlyTrend.map(item => item.expenses),
                    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                    strokeWidth: 3
                  }, {
                    data: monthlyTrend.map(item => item.savings),
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
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

          {/* Gastos por Categoría */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución de Gastos</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={categoryAnalysis}
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
              {categoryAnalysis.map((category, index) => (
                <View key={index} style={styles.legendItem}>
                  <View 
                    style={[
                      styles.legendDot, 
                      { backgroundColor: category.color }
                    ]} 
                  />
                  <Text style={styles.legendText}>{category.name}</Text>
                  <Text style={styles.legendValue}>${category.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Análisis Semanal */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Patrones de Gasto Semanal</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={{
                labels: weeklySpending.map(item => item.day),
                datasets: [{
                  data: weeklySpending.map(item => item.amount)
                }]
              }}
              width={width - 80}
              height={180}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "4", strokeWidth: "2" }
              }}
              style={styles.chartView}
            />
          </View>
        </View>

        {/* Metas Financieras */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Metas Financieras</Text>
          <View style={styles.goalsContainer}>
            {financialGoals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              const priorityStyle = getPriorityColor(goal.priority);
              
              return (
                <View key={index} style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.backgroundColor }]}>
                      <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
                        {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Media' : 'Baja'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.goalProgress}>
                    <Text style={styles.goalProgressText}>
                      Progreso: ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                    </Text>
                    <Text style={styles.goalPercentage}>{Math.round(progress)}%</Text>
                  </View>
                  
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                  
                  <Text style={styles.goalDeadline}>Meta: {goal.deadline}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Insights y Recomendaciones */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Insights y Recomendaciones</Text>
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
                      <TouchableOpacity>
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
  header: {
    backgroundColor: COLORS.white, // Fondo blanco sólido sobre el gris
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: SIZES.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    paddingBottom: 100, // Aumentado para evitar que el navegador flotante tape el contenido
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  metricCard: {
    backgroundColor: COLORS.white, // Fondo blanco sólido sobre el gris
    borderRadius: 12,
    padding: SIZES.md,
    width: (width - SIZES.lg * 3) / 2,
    marginBottom: SIZES.sm,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricTrendText: {
    fontSize: 10,
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
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.md,
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
});

export default AnalysisScreen;
