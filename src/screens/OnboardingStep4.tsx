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
import { validatePassword } from '../utils';
import { OnboardingData } from '../types';

const { width, height } = Dimensions.get('window');

interface OnboardingStep4Props {
  data: Partial<OnboardingData>;
  onComplete: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ data, onComplete, onBack }) => {
  const [password, setPassword] = useState(data.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (!validateForm()) return;

    onComplete({
      password: password.trim(),
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
                  <Text style={styles.stepNumber}>4</Text>
                </View>
                <Text style={styles.stepText}>de 4</Text>
              </View>
              <Text style={styles.title}>Crea tu contraseña</Text>
              <Text style={styles.subtitle}>
                Protege tu cuenta con una contraseña segura
              </Text>
            </View>
            
            {/* Formulario principal */}
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Input
                  label="Contraseña"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                />
                
                <Input
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  error={errors.confirmPassword}
                />
              </View>

              {/* Consejos de contraseña con mejor diseño */}
              <View style={styles.passwordTips}>
                <View style={styles.tipsHeader}>
                  <Text style={styles.tipsIcon}>🔒</Text>
                  <Text style={styles.tipsTitle}>Consejos para una contraseña segura</Text>
                </View>
                <View style={styles.tipsList}>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Usa al menos 6 caracteres</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Combina letras y números</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Evita información personal</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>No la compartas con nadie</Text>
                  </View>
                </View>
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
                  title="Crear cuenta"
                  onPress={handleComplete}
                  style={[styles.button, styles.completeButton]}
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
  passwordTips: {
    backgroundColor: COLORS.blue[50], // Azul muy claro
    padding: SIZES.lg,
    borderRadius: 12,
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: COLORS.blue[200], // Azul medio
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary, // Azul Suave
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  tipsIcon: {
    fontSize: 20,
    marginRight: SIZES.sm,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark, // Negro Suave
  },
  tipsList: {
    gap: SIZES.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.primary, // Azul Suave
    marginRight: SIZES.sm,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    flex: 1,
    lineHeight: 20,
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
  completeButton: {
    backgroundColor: '#3b82f6', // primary-500
  },
});

export default OnboardingStep4;
