import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, Animated } from '../platform';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { OnboardingData } from '../types';
import { AuthService } from '../services/authService';
import { Alert } from '../platform';
import { COLORS } from '../constants';

interface OnboardingScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleStep1Next = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(2);
  };

  const handleStep2Next = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(3);
  };

  const handleStep3Complete = async (stepData: Partial<OnboardingData>) => {
    const completeData = { ...onboardingData, ...stepData } as OnboardingData;
    
    setLoading(true);
    try {
      // Registrar usuario con todos los datos del onboarding
      await AuthService.register({
        firstName: completeData.firstName,
        lastName: completeData.lastName,
        email: completeData.email,
        password: completeData.password,
        monthlyIncome: completeData.monthlyIncome,
        savingsPercentage: completeData.savingsPercentage,
        needsPercentage: completeData.needsPercentage,
        consumptionPercentage: completeData.consumptionPercentage,
        currentSavings: completeData.currentSavings,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta. Inténtalo de nuevo.';
      Alert.alert('Error', errorMessage);
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
            onComplete={handleStep3Complete}
            onBack={handleBack}
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
