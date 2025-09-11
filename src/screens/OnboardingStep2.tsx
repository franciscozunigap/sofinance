import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, KeyboardAvoidingView, ScrollView, Animated } from '../platform';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { OnboardingData } from '../types';

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
            <View style={styles.header}>
              <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>Paso 2 de 3</Text>
              </View>
              <Text style={styles.title}>Información Financiera</Text>
              <Text style={styles.subtitle}>
                Ayúdanos a entender tu situación financiera actual
              </Text>
            </View>
            
            <View style={styles.form}>
              <Input
                label="Ingreso mensual (CLP)"
                placeholder="Ej: 800000"
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
                keyboardType="numeric"
                error={errors.monthlyIncome}
              />

              <View style={styles.percentageSection}>
                <Text style={styles.sectionTitle}>Distribución de gastos</Text>
                <Text style={styles.sectionSubtitle}>
                  Recomendamos: 20% ahorro, 50% necesidades, 30% consumo
                </Text>
                
                <View style={styles.recommendButtonContainer}>
                  <Button
                    title="Aplicar recomendación"
                    onPress={applyRecommendedPercentages}
                    variant="secondary"
                    style={styles.recommendButton}
                  />
                </View>

                <View style={styles.percentageInputs}>
                  <Input
                    label="Ahorro (%)"
                    placeholder="20"
                    value={savingsPercentage}
                    onChangeText={setSavingsPercentage}
                    keyboardType="numeric"
                    error={errors.savingsPercentage}
                    style={styles.percentageInput}
                  />
                  
                  <Input
                    label="Necesidades (%)"
                    placeholder="50"
                    value={needsPercentage}
                    onChangeText={setNeedsPercentage}
                    keyboardType="numeric"
                    error={errors.needsPercentage}
                    style={styles.percentageInput}
                  />
                  
                  <Input
                    label="Consumo (%)"
                    placeholder="30"
                    value={consumptionPercentage}
                    onChangeText={setConsumptionPercentage}
                    keyboardType="numeric"
                    error={errors.consumptionPercentage}
                    style={styles.percentageInput}
                  />
                </View>

                {errors.percentages && (
                  <Text style={styles.errorText}>{errors.percentages}</Text>
                )}
              </View>
              
              <Input
                label="Ahorro actual (CLP)"
                placeholder="Ej: 500000"
                value={currentSavings}
                onChangeText={setCurrentSavings}
                keyboardType="numeric"
                error={errors.currentSavings}
              />
              
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
    backgroundColor: COLORS.light,
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
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    marginBottom: SIZES.lg,
  },
  stepText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  percentageSection: {
    marginVertical: SIZES.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.md,
  },
  recommendButtonContainer: {
    marginBottom: SIZES.md,
  },
  recommendButton: {
    alignSelf: 'flex-start',
  },
  percentageInputs: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  percentageInput: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.xl,
  },
  button: {
    flex: 1,
  },
  backButton: {
    // Estilos específicos para el botón de atrás si es necesario
  },
  nextButton: {
    // Estilos específicos para el botón de continuar si es necesario
  },
});

export default OnboardingStep2;
