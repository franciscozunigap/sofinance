import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Alert, Dimensions, SafeAreaView, KeyboardAvoidingView, ScrollView, Animated } from '../platform';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { validateEmail, validatePassword } from '../utils';
import { AuthService } from '../services/authService';
import { RootStackParamList } from '@/types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onShowRegistration?: () => void;
}

const { width } = Dimensions.get('window');

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onShowRegistration }) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  // Debug: verificar si las props están llegando
  console.log('LoginScreen props:', { onLoginSuccess, onShowRegistration });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Intentando login con:', { email, password });
      await AuthService.login({ email, password });
      console.log('Login exitoso');
      
      // Siempre usar la prop onLoginSuccess si está disponible
      if (onLoginSuccess && typeof onLoginSuccess === 'function') {
        console.log('Usando onLoginSuccess prop');
        onLoginSuccess();
      } else {
        console.log('onLoginSuccess no disponible, usando navegación directa');
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      console.error('Error en login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Credenciales inválidas. Inténtalo de nuevo.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
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
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>💰</Text>
              </View>
              <Text style={styles.title}>SoFinance</Text>
            </View>
            
            <View style={styles.form}>
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
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
              />
              
              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
              />
              
              <Button
                title="¿No tienes cuenta? Regístrate"
                onPress={() => {
                  if (Platform.OS === 'web' && onShowRegistration) {
                    onShowRegistration();
                  } else {
                    navigation.navigate('Register', { onRegistrationSuccess: () => {} });
                  }
                }}
                variant="secondary"
                style={styles.registerButton}
              />
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary, // Azul Suave
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
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.dark, // Negro Suave
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  helpText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.xxl,
    backgroundColor: COLORS.white, // Fondo blanco para el texto de ayuda
    padding: SIZES.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '30', // Borde azul suave
  },
  form: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  registerButton: {
    marginTop: SIZES.md,
  },
});

export default LoginScreen;
