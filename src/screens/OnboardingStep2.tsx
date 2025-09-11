import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, KeyboardAvoidingView, ScrollView, Animated } from '../platform';
import CustomSlider from '../components/CustomSlider';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { OnboardingData } from '../types';

const { width, height } = Dimensions.get('window');

interface OnboardingStep2Props {
  data: Partial<OnboardingData>;
  onNext: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ data, onNext, onBack }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(data.monthlyIncome?.toString() || '');
  const [savingsPercentage, setSavingsPercentage] = useState(data.savingsPercentage?.toString() || '20');
  const [needsPercentage, setNeedsPercentage] = useState(data.needsPercentage?.toString() || '50');
  const [consumptionPercentage, setConsumptionPercentage] = useState(data.consumptionPercentage?.toString() || '30');
  const [currentSavings, setCurrentSavings] = useState(data.currentSavings?.toString() || '');
  
  const [errors, setErrors] = useState<{ 
    monthlyIncome?: string; 
    savingsPercentage?: string; 
    needsPercentage?: string; 
    consumptionPercentage?: string; 
    currentSavings?: string;
    percentages?: string;
  }>({});
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const validateForm = (): boolean => {
    const newErrors: { 
      monthlyIncome?: string; 
      savingsPercentage?: string; 
      needsPercentage?: string; 
      consumptionPercentage?: string; 
      currentSavings?: string;
      percentages?: string;
    } = {};

    // Validar ingreso mensual
    if (!monthlyIncome.trim()) {
      newErrors.monthlyIncome = 'El ingreso mensual es requerido';
    } else {
      const income = parseFloat(monthlyIncome);
      if (isNaN(income) || income <= 0) {
        newErrors.monthlyIncome = 'Ingresa un monto válido';
      }
    }

    // Validar porcentajes
    const savings = parseFloat(savingsPercentage);
    const needs = parseFloat(needsPercentage);
    const consumption = parseFloat(consumptionPercentage);
    
    if (isNaN(savings) || savings < 0 || savings > 100) {
      newErrors.savingsPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(needs) || needs < 0 || needs > 100) {
      newErrors.needsPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(consumption) || consumption < 0 || consumption > 100) {
      newErrors.consumptionPercentage = 'Porcentaje inválido (0-100)';
    }

    // Validar que los porcentajes sumen 100%
    const totalPercentage = savings + needs + consumption;
    if (Math.abs(totalPercentage - 100) > 0.1) {
      newErrors.percentages = 'Los porcentajes deben sumar exactamente 100%';
    }

    // Validar ahorro actual
    if (!currentSavings.trim()) {
      newErrors.currentSavings = 'El monto de ahorro actual es requerido';
    } else {
      const savings = parseFloat(currentSavings);
      if (isNaN(savings) || savings < 0) {
        newErrors.currentSavings = 'Ingresa un monto válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    onNext({
      monthlyIncome: parseFloat(monthlyIncome),
      savingsPercentage: parseFloat(savingsPercentage),
      needsPercentage: parseFloat(needsPercentage),
      consumptionPercentage: parseFloat(consumptionPercentage),
      currentSavings: parseFloat(currentSavings),
    });
  };

  const applyRecommendedPercentages = () => {
    setSavingsPercentage('20');
    setNeedsPercentage('50');
    setConsumptionPercentage('30');
  };

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header con diseño moderno */}
            <View style={styles.header}>
              <View style={styles.stepIndicator}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepText}>de 3</Text>
              </View>
              <Text style={styles.title}>Información Financiera</Text>
              <Text style={styles.subtitle}>
                Ayúdanos a entender tu situación financiera actual
              </Text>
            </View>
            
            {/* Formulario principal */}
            <View style={styles.formContainer}>
              {/* Sección de montos */}
              <View style={styles.amountsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>💰</Text>
                  <Text style={styles.sectionTitle}>Información Financiera</Text>
                </View>
                
                <Input
                  label="Ingreso mensual (CLP)"
                  placeholder="Ej: 800000"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                  keyboardType="numeric"
                  error={errors.monthlyIncome}
                />
                
                <Input
                  label="Ahorro actual (CLP)"
                  placeholder="Ej: 500000"
                  value={currentSavings}
                  onChangeText={setCurrentSavings}
                  keyboardType="numeric"
                  error={errors.currentSavings}
                />
              </View>

              {/* Sección de distribución con sliders */}
              <View style={styles.distributionSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionIcon}>📊</Text>
                  <Text style={styles.sectionTitle}>Distribución de Gastos</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Ajusta los porcentajes según tus prioridades financieras
                </Text>
                


                {/* Sliders para porcentajes */}
                <View style={styles.slidersContainer}>
                  {/* Ahorro */}
                  <View style={styles.sliderItem}>
                    <View style={styles.sliderHeader}>
                      <Text style={styles.sliderLabel}>💚 Ahorro</Text>
                      <Text style={[styles.sliderValue, { color: '#10b981' }]}>
                        {savingsPercentage}%
                      </Text>
                    </View>
                    <CustomSlider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      value={parseFloat(savingsPercentage)}
                      onValueChange={(value) => setSavingsPercentage(value.toString())}
                      minimumTrackTintColor="#10b981"
                      maximumTrackTintColor="#e5e7eb"
                      thumbTintColor="#10b981"
                    />
                    <View style={styles.sliderRange}>
                      <Text style={styles.rangeText}>0%</Text>
                      <Text style={styles.rangeText}>100%</Text>
                    </View>
                  </View>

                  {/* Necesidades */}
                  <View style={styles.sliderItem}>
                    <View style={styles.sliderHeader}>
                      <Text style={styles.sliderLabel}>🏠 Necesidades</Text>
                      <Text style={[styles.sliderValue, { color: '#ea580c' }]}>
                        {needsPercentage}%
                      </Text>
                    </View>
                    <CustomSlider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      value={parseFloat(needsPercentage)}
                      onValueChange={(value) => setNeedsPercentage(value.toString())}
                      minimumTrackTintColor="#ea580c"
                      maximumTrackTintColor="#e5e7eb"
                      thumbTintColor="#ea580c"
                    />
                    <View style={styles.sliderRange}>
                      <Text style={styles.rangeText}>0%</Text>
                      <Text style={styles.rangeText}>100%</Text>
                    </View>
                  </View>

                  {/* Consumo */}
                  <View style={styles.sliderItem}>
                    <View style={styles.sliderHeader}>
                      <Text style={styles.sliderLabel}>🛍️ Consumo</Text>
                      <Text style={[styles.sliderValue, { color: '#3b82f6' }]}>
                        {consumptionPercentage}%
                      </Text>
                    </View>
                    <CustomSlider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      value={parseFloat(consumptionPercentage)}
                      onValueChange={(value) => setConsumptionPercentage(value.toString())}
                      minimumTrackTintColor="#3b82f6"
                      maximumTrackTintColor="#e5e7eb"
                      thumbTintColor="#3b82f6"
                    />
                    <View style={styles.sliderRange}>
                      <Text style={styles.rangeText}>0%</Text>
                      <Text style={styles.rangeText}>100%</Text>
                    </View>
                  </View>
                </View>

                {/* Indicador del total */}
                <View style={styles.totalIndicator}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={[
                      styles.totalValue,
                      {
                        color: Math.abs(parseFloat(savingsPercentage) + parseFloat(needsPercentage) + parseFloat(consumptionPercentage) - 100) < 0.1 
                          ? '#10b981' 
                          : '#ef4444'
                      }
                    ]}>
                      {Math.round(parseFloat(savingsPercentage) + parseFloat(needsPercentage) + parseFloat(consumptionPercentage))}%
                    </Text>
                  </View>
                </View>

                <Button
                  title="Restablecer"
                  onPress={applyRecommendedPercentages}
                  variant="secondary"
                  style={styles.recommendButton}
                />

                {errors.percentages && (
                  <Text style={styles.errorText}>{errors.percentages}</Text>
                )}
              </View>
              
              {/* Botones */}
              <View style={styles.buttonContainer}>
                {onBack && (
                  <Button
                    title="Atrás"
                    onPress={onBack}
                    variant="secondary"
                    style={[styles.button, styles.backButton]}
                  />
                )}
                <Button
                  title="Continuar"
                  onPress={handleNext}
                  style={[styles.button, styles.nextButton]}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // bg-gray-50
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fed7aa', // orange-200
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  stepNumber: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#ea580c', // orange-600
  },
  stepText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#ea580c', // orange-600
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: '#111827', // gray-900
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#6b7280', // gray-500
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SIZES.sm,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: SIZES.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  amountsSection: {
    marginBottom: SIZES.xl,
    padding: SIZES.lg,
    backgroundColor: '#dbeafe', // blue-100
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe', // blue-200
  },
  distributionSection: {
    marginBottom: SIZES.xl,
    padding: SIZES.lg,
    backgroundColor: '#fff7ed', // orange-50
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa', // orange-200
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: SIZES.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: '#111827', // gray-900
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#6b7280', // gray-500
    marginBottom: SIZES.md,
  },
  recommendButton: {
    margin: SIZES.md,
    backgroundColor: '#fed7aa', // orange-100 
    borderColor: '#fed7aa', // orange-200
    padding: 6,
    width: '80%',
    alignSelf: 'center',
    fontSize: 8,
  },
  slidersContainer: {
    marginBottom: SIZES.lg,
  },
  sliderItem: {
    marginBottom: SIZES.lg,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#374151', // gray-700
  },
  sliderValue: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.xs,
  },
  rangeText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#9ca3af', // gray-400
  },
  totalIndicator: {
    backgroundColor: '#f3f4f6', // gray-100
    padding: SIZES.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#374151', // gray-700
  },
  totalValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  successText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#10b981', // green-600
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#ef4444', // red-500
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
  },
  backButton: {
    backgroundColor: '#e5e7eb', // gray-200
  },
  nextButton: {
    backgroundColor: '#ea580c', // orange-600
  },
});

export default OnboardingStep2;
