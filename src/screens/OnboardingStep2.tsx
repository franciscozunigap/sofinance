import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { KeyboardAvoidingView, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [savingsPercentage, setSavingsPercentage] = useState(data.savingsPercentage?.toString() || '10');
  const [needsPercentage, setNeedsPercentage] = useState(data.needsPercentage?.toString() || '50');
  const [consumptionPercentage, setConsumptionPercentage] = useState(data.consumptionPercentage?.toString() || '30');
  const [investmentPercentage, setInvestmentPercentage] = useState(data.investmentPercentage?.toString() || '10');
  const [currentSavings, setCurrentSavings] = useState(data.currentSavings?.toString() || '');
  
  const [errors, setErrors] = useState<{ 
    monthlyIncome?: string; 
    savingsPercentage?: string; 
    needsPercentage?: string; 
    consumptionPercentage?: string; 
    investmentPercentage?: string;
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
      investmentPercentage?: string;
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
    const investment = parseFloat(investmentPercentage);
    
    if (isNaN(savings) || savings < 0 || savings > 100) {
      newErrors.savingsPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(needs) || needs < 0 || needs > 100) {
      newErrors.needsPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(consumption) || consumption < 0 || consumption > 100) {
      newErrors.consumptionPercentage = 'Porcentaje inválido (0-100)';
    }
    if (isNaN(investment) || investment < 0 || investment > 100) {
      newErrors.investmentPercentage = 'Porcentaje inválido (0-100)';
    }

    // Validar que los porcentajes sumen 100%
    const totalPercentage = savings + needs + consumption + investment;
    if (Math.abs(totalPercentage - 100) > 0.1) {
      newErrors.percentages = 'Los porcentajes deben sumar exactamente 100%';
    }

    // Validar monto actual
    if (!currentSavings.trim()) {
      newErrors.currentSavings = 'El monto actual es requerido';
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
      investmentPercentage: parseFloat(investmentPercentage),
      currentSavings: parseFloat(currentSavings),
    });
  };

  const applyRecommendedPercentages = () => {
    setSavingsPercentage('10');
    setNeedsPercentage('50');
    setConsumptionPercentage('30');
    setInvestmentPercentage('10');
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
                  label="Monto actual (CLP)"
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
                  Ingresa tu total de ingreso y ajusta los porcentajes según tus prioridades financieras
                </Text>
                
                <Input
                  label="Total de ingreso mensual (CLP)"
                  placeholder="Ej: 800000"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                  keyboardType="numeric"
                  error={errors.monthlyIncome}
                  style={styles.incomeInput}
                />
                


                {/* Sliders para porcentajes */}
                <View style={styles.slidersContainer}>
                  {/* Ahorro */}
                  <View style={styles.sliderItem}>
                    <View style={styles.sliderHeader}>
                      <Text style={styles.sliderLabel}>💚 Ahorro</Text>
                      <View style={styles.sliderValueContainer}>
                        <Text style={[styles.sliderValue, { color: '#10b981' }]}>
                          {savingsPercentage}%
                        </Text>
                        <Text style={styles.sliderAmount}>
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(savingsPercentage) / 100).toLocaleString()}
                        </Text>
                      </View>
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
                      <View style={styles.sliderValueContainer}>
                        <Text style={[styles.sliderValue, { color: '#ea580c' }]}>
                          {needsPercentage}%
                        </Text>
                        <Text style={styles.sliderAmount}>
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(needsPercentage) / 100).toLocaleString()}
                        </Text>
                      </View>
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
                      <View style={styles.sliderValueContainer}>
                        <Text style={[styles.sliderValue, { color: '#3b82f6' }]}>
                          {consumptionPercentage}%
                        </Text>
                        <Text style={styles.sliderAmount}>
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(consumptionPercentage) / 100).toLocaleString()}
                        </Text>
                      </View>
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

                  {/* Inversión */}
                  <View style={styles.sliderItem}>
                    <View style={styles.sliderHeader}>
                      <Text style={styles.sliderLabel}>📈 Inversión</Text>
                      <View style={styles.sliderValueContainer}>
                        <Text style={[styles.sliderValue, { color: '#8b5cf6' }]}>
                          {investmentPercentage}%
                        </Text>
                        <Text style={styles.sliderAmount}>
                          ${Math.round((parseFloat(monthlyIncome) || 0) * parseFloat(investmentPercentage) / 100).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <CustomSlider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      value={parseFloat(investmentPercentage)}
                      onValueChange={(value) => setInvestmentPercentage(value.toString())}
                      minimumTrackTintColor="#8b5cf6"
                      maximumTrackTintColor="#e5e7eb"
                      thumbTintColor="#8b5cf6"
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
                        color: Math.abs(parseFloat(savingsPercentage) + parseFloat(needsPercentage) + parseFloat(consumptionPercentage) + parseFloat(investmentPercentage) - 100) < 0.1 
                          ? '#10b981' 
                          : '#ef4444'
                      }
                    ]}>
                      {Math.round(parseFloat(savingsPercentage) + parseFloat(needsPercentage) + parseFloat(consumptionPercentage) + parseFloat(investmentPercentage))}%
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
    backgroundColor: COLORS.light, // Blanco Roto
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
    backgroundColor: '#eff6ff', // primary-50
    borderWidth: 2,
    borderColor: '#3b82f6', // primary-500
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  stepNumber: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#3b82f6', // primary-500
  },
  stepText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#3b82f6', // primary-500
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SIZES.sm,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.xl,
    shadowColor: COLORS.dark,
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
    backgroundColor: COLORS.blue[100],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.blue[200],
  },
  distributionSection: {
    marginBottom: SIZES.xl,
    padding: SIZES.lg,
    backgroundColor: COLORS.blue[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.blue[200],
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
    fontFamily: FONTS.medium,
    color: COLORS.dark,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.md,
  },
  recommendButton: {
    margin: SIZES.md,
    backgroundColor: COLORS.blue[100],
    borderColor: COLORS.blue[200],
    padding: 6,
    width: '80%',
    alignSelf: 'center',
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
    color: COLORS.dark,
  },
  sliderValue: {
    fontSize: 18,
    fontFamily: FONTS.medium,
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
    color: COLORS.gray,
  },
  totalIndicator: {
    backgroundColor: COLORS.grayScale[100],
    padding: SIZES.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayScale[200],
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
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  successText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: '#10b981',
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
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
    backgroundColor: COLORS.grayScale[200],
  },
  nextButton: {
    backgroundColor: '#3b82f6', // primary-500
  },
  incomeInput: {
    marginBottom: SIZES.lg,
  },
  sliderValueContainer: {
    alignItems: 'flex-end',
  },
  sliderAmount: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 2,
  },
});

export default OnboardingStep2;
