import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
} from 'react-native';
import { Alert, Platform, Dimensions, SafeAreaView } from '../platform';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { validateEmail, validatePassword } from '../utils';
import { AuthService } from '../services/authService';

interface RegistrationScreenProps {
  onRegistrationSuccess: () => void;
  onBackToLogin: () => void;
}

const { width } = Dimensions.get('window');

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ 
  onRegistrationSuccess, 
  onBackToLogin 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Información personal
    firstName: '',
    lastName: '',
    email: '',
    // Paso 2: Información financiera
    monthlyIncome: '',
    financialGoals: '',
    // Paso 3: Seguridad
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'El nombre es requerido';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'El apellido es requerido';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'El email es requerido';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'El email no es válido';
        }
        break;
      
      case 2:
        if (!formData.monthlyIncome.trim()) {
          newErrors.monthlyIncome = 'El ingreso mensual es requerido';
        } else if (isNaN(Number(formData.monthlyIncome)) || Number(formData.monthlyIncome) <= 0) {
          newErrors.monthlyIncome = 'Ingresa un monto válido';
        }
        if (!formData.financialGoals.trim()) {
          newErrors.financialGoals = 'Los objetivos financieros son requeridos';
        }
        break;
      
      case 3:
        if (!formData.password.trim()) {
          newErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(formData.password)) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        animateTransition();
      } else {
        handleRegistration();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      animateTransition();
    }
  };

  const handleRegistration = async () => {
    setLoading(true);
    try {
      // Simular registro (en una app real, esto sería una llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear usuario
      const user = {
        id: Date.now().toString(),
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
      };
      
      // Simular login automático después del registro
      await AuthService.login({ email: formData.email, password: formData.password });
      onRegistrationSuccess();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con el registro. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const animateTransition = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  React.useEffect(() => {
    animateTransition();
  }, []);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={[
            styles.stepDot,
            currentStep >= step && styles.stepDotActive,
          ]}
        />
      ))}
      <Text style={styles.stepText}>
        Paso {currentStep} de 3
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Información Personal</Text>
      <Text style={styles.stepSubtitle}>
        Cuéntanos sobre ti para personalizar tu experiencia
      </Text>
      
      <Input
        label="Nombre"
        placeholder="Tu nombre"
        value={formData.firstName}
        onChangeText={(value) => updateFormData('firstName', value)}
        error={errors.firstName}
      />
      
      <Input
        label="Apellido"
        placeholder="Tu apellido"
        value={formData.lastName}
        onChangeText={(value) => updateFormData('lastName', value)}
        error={errors.lastName}
      />
      
      <Input
        label="Correo electrónico"
        placeholder="tu@email.com"
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Información Financiera</Text>
      <Text style={styles.stepSubtitle}>
        Ayúdanos a entender tu situación financiera
      </Text>
      
      <Input
        label="Ingreso mensual"
        placeholder="€0.00"
        value={formData.monthlyIncome}
        onChangeText={(value) => updateFormData('monthlyIncome', value)}
        keyboardType="numeric"
        error={errors.monthlyIncome}
      />
      
      <View style={styles.textAreaContainer}>
        <Text style={styles.label}>Objetivos financieros</Text>
        <View style={styles.textArea}>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Describe tus objetivos financieros..."
            value={formData.financialGoals}
            onChangeText={(value) => updateFormData('financialGoals', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        {errors.financialGoals && (
          <Text style={styles.errorText}>{errors.financialGoals}</Text>
        )}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Seguridad</Text>
      <Text style={styles.stepSubtitle}>
        Crea una contraseña segura para tu cuenta
      </Text>
      
      <Input
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        value={formData.password}
        onChangeText={(value) => updateFormData('password', value)}
        secureTextEntry
        error={errors.password}
      />
      
      <Input
        label="Confirmar contraseña"
        placeholder="Repite tu contraseña"
        value={formData.confirmPassword}
        onChangeText={(value) => updateFormData('confirmPassword', value)}
        secureTextEntry
        error={errors.confirmPassword}
      />
      
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateFormData('termsAccepted', !formData.termsAccepted)}
        >
          <View style={[
            styles.checkboxBox,
            formData.termsAccepted && styles.checkboxBoxChecked
          ]}>
            {formData.termsAccepted && (
              <Text style={styles.checkboxCheck}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxText}>
            Acepto los{' '}
            <Text style={styles.checkboxLink}>términos y condiciones</Text>
            {' '}y la{' '}
            <Text style={styles.checkboxLink}>política de privacidad</Text>
          </Text>
        </TouchableOpacity>
        {errors.termsAccepted && (
          <Text style={styles.errorText}>{errors.termsAccepted}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>💰</Text>
              </View>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>Únete a SoFinance</Text>
            </View>
            
            {renderStepIndicator()}
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            
            <View style={styles.buttonContainer}>
              {currentStep > 1 && (
                <Button
                  title="Anterior"
                  onPress={handlePrevious}
                  variant="secondary"
                  style={styles.button}
                />
              )}
              
              <Button
                title={currentStep === 3 ? 'Crear Cuenta' : 'Siguiente'}
                onPress={handleNext}
                loading={loading}
                disabled={loading}
                style={[styles.button, currentStep === 1 && styles.buttonFull]}
              />
            </View>
            
            <Button
              title="¿Ya tienes cuenta? Iniciar Sesión"
              onPress={onBackToLogin}
              variant="secondary"
              style={[styles.button, styles.backButton]}
            />
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
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
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
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xl,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginLeft: SIZES.md,
  },
  stepContent: {
    marginBottom: SIZES.xl,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  textAreaContainer: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.light,
    padding: SIZES.md,
  },
  textAreaInput: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    minHeight: 100,
  },
  checkboxContainer: {
    marginTop: SIZES.lg,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gray,
    marginRight: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxCheck: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    flex: 1,
    lineHeight: 20,
  },
  checkboxLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  button: {
    flex: 1,
    marginHorizontal: SIZES.xs,
  },
  buttonFull: {
    marginHorizontal: 0,
  },
  backButton: {
    marginTop: SIZES.md,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
    marginTop: SIZES.xs,
  },
});

export default RegistrationScreen;
