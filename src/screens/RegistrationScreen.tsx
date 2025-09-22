import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { KeyboardAvoidingView, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';

type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegistrationScreenProps {
  onRegistrationSuccess?: () => void;
  onBackToLogin?: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ 
  onRegistrationSuccess,
  onBackToLogin 
}) => {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const handleStartOnboarding = () => {
    navigation.navigate('Onboarding', { onComplete: onRegistrationSuccess || (() => {}) });
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
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/logo.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>¡Bienvenido a SoFinance!</Text>
              <Text style={styles.subtitle}>
                Vamos a crear tu cuenta paso a paso
              </Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>¿Qué necesitamos de ti?</Text>
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Información personal</Text>
                  <Text style={styles.stepDescription}>Nombre, apellido y correo electrónico</Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Información financiera</Text>
                  <Text style={styles.stepDescription}>Ingresos mensuales, distribución de gastos y ahorro actual</Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Perfil financiero</Text>
                  <Text style={styles.stepDescription}>Selecciona tu perfil financiero y objetivos</Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Contraseña</Text>
                  <Text style={styles.stepDescription}>Crea una contraseña segura para tu cuenta</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Crear cuenta"
                onPress={handleStartOnboarding}
                style={styles.startButton}
              />
              
              <Button
                title="¿Ya tienes cuenta? Iniciar Sesión"
                onPress={() => {
                  if (Platform.OS === 'web' && onBackToLogin) {
                    onBackToLogin();
                  } else {
                    navigation.navigate('Login', { onLoginSuccess: () => {} });
                  }
                }}
                variant="secondary"
                style={styles.backButton}
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
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
    borderWidth: 5,
    borderColor: COLORS.lightGray,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.xxl,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginBottom: SIZES.xs,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  startButton: {
    width: '100%',
    marginBottom: SIZES.md,
  },
  backButton: {
    width: '100%',
  },
});

export default RegistrationScreen;