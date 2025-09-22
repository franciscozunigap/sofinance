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
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { validateEmail } from '../utils';
import { OnboardingData } from '../types';

const { width, height } = Dimensions.get('window');

interface OnboardingStep1Props {
  data: Partial<OnboardingData>;
  onNext: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ data, onNext, onBack }) => {
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [email, setEmail] = useState(data.email || '');
  const [age, setAge] = useState(data.age?.toString() || '');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; age?: string }>({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const validateForm = (): boolean => {
    const newErrors: { firstName?: string; lastName?: string; email?: string; age?: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!age.trim()) {
      newErrors.age = 'La edad es requerida';
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        newErrors.age = 'La edad debe ser entre 18 y 100 años';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    onNext({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      age: parseInt(age),
    });
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
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepText}>de 3</Text>
              </View>
              <Text style={styles.title}>¡Bienvenido a SoFinance!</Text>
              <Text style={styles.subtitle}>
                Comencemos con algunos datos básicos para personalizar tu experiencia
              </Text>
            </View>
            
            {/* Formulario con mejor diseño */}
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Input
                  label="Nombre"
                  placeholder="Ingresa tu nombre"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  error={errors.firstName}
                />
                
                <Input
                  label="Apellido"
                  placeholder="Ingresa tu apellido"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  error={errors.lastName}
                />
                
                <Input
                  label="Correo electrónico"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email}
                />
                
                <Input
                  label="Edad"
                  placeholder="Ingresa tu edad"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  autoCorrect={false}
                  error={errors.age}
                />
              </View>
              
              {/* Botones con mejor diseño */}
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
    color: COLORS.dark, // Negro Suave
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
  form: {
    width: '100%',
    marginBottom: SIZES.xl,
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
});

export default OnboardingStep1;
