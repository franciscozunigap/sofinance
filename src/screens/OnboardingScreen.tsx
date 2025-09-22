import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import { OnboardingData } from '../types';
import { AuthService } from '../services/authService';
import { Alert } from '../platform';
import { COLORS } from '../constants';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface OnboardingScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const { toast, showError, hideToast } = useToast();

  const handleStep1Next = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(2);
  };

  const handleStep2Next = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(3);
  };

  const handleStep3Next = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(4);
  };

  const handleStep4Complete = async (stepData: Partial<OnboardingData>) => {
    const completeData = { ...onboardingData, ...stepData } as OnboardingData;
    
    setLoading(true);
    try {
      // Registrar usuario con todos los datos del onboarding
      await AuthService.register({
        firstName: completeData.firstName,
        lastName: completeData.lastName,
        email: completeData.email,
        age: completeData.age,
        password: completeData.password,
        monthlyIncome: completeData.monthlyIncome,
        savingsPercentage: completeData.savingsPercentage,
        needsPercentage: completeData.needsPercentage,
        consumptionPercentage: completeData.consumptionPercentage,
        investmentPercentage: completeData.investmentPercentage,
        currentSavings: completeData.currentSavings,
        financialProfile: completeData.financialProfile,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error en registro:', error);
      
      let errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
      let title = 'Error';
      
      if (error instanceof Error) {
        if (error.message.includes('correo electrónico ya está registrado')) {
          // Mostrar toast con opciones
          showError(
            'Este correo electrónico ya está en uso. ¿Te gustaría iniciar sesión?',
            6000,
            () => {
              // Regresar a la pantalla de login
              if (onBack) {
                onBack();
              }
            },
            'Iniciar sesión'
          );
          
          // También mostrar opción de cambiar email después de un delay
          setTimeout(() => {
            Alert.alert(
              '¿Cambiar email?',
              'También puedes regresar al paso 1 para usar un email diferente.',
              [
                {
                  text: 'Cambiar email',
                  onPress: () => setCurrentStep(1)
                },
                {
                  text: 'Cancelar',
                  style: 'cancel'
                }
              ]
            );
          }, 2000);
          return;
        } else if (error.message.includes('contraseña')) {
          title = 'Error de contraseña';
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (error.message.includes('email')) {
          title = 'Error de email';
          errorMessage = 'Por favor, ingresa un email válido.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };


  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            data={onboardingData}
            onNext={handleStep1Next}
            onBack={onBack}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            data={onboardingData}
            onNext={handleStep2Next}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            data={onboardingData}
            onComplete={handleStep3Next}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            data={onboardingData}
            onComplete={handleStep4Complete}
            onBack={handleBack}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {renderCurrentStep()}
      </Animated.View>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
        onAction={toast.onAction}
        actionText={toast.actionText}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light, // Blanco Roto
  },
  content: {
    flex: 1,
  },
});

export default OnboardingScreen;
