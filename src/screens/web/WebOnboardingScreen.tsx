import React, { useState } from 'react';
import WebOnboardingStep1 from './WebOnboardingStep1';
import WebOnboardingStep2 from './WebOnboardingStep2';
import WebOnboardingStep3 from './WebOnboardingStep3';
import WebOnboardingStep4 from './WebOnboardingStep4';
import { OnboardingData } from '../../types';
import { AuthService } from '../../services/authService';

interface WebOnboardingScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

const WebOnboardingScreen: React.FC<WebOnboardingScreenProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [loading, setLoading] = useState(false);

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
          title = 'Email ya registrado';
          errorMessage = 'Este correo electrónico ya está en uso. ¿Te gustaría iniciar sesión en su lugar?';
          
          // Mostrar opciones al usuario
          const userChoice = confirm(`${title}\n\n${errorMessage}\n\n¿Quieres iniciar sesión? (Cancelar para cambiar email)`);
          
          if (userChoice) {
            // Regresar a la pantalla de login
            if (onBack) {
              onBack();
            }
          } else {
            // Regresar al paso 1 para cambiar el email
            setCurrentStep(1);
          }
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
      
      alert(`${title}\n\n${errorMessage}`);
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WebOnboardingStep1
            data={onboardingData}
            onNext={handleStep1Next}
            onBack={onBack}
          />
        );
      case 2:
        return (
          <WebOnboardingStep2
            data={onboardingData}
            onNext={handleStep2Next}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <WebOnboardingStep3
            data={onboardingData}
            onComplete={handleStep3Next}
            onBack={handleBack}
            loading={loading}
          />
        );
      case 4:
        return (
          <WebOnboardingStep4
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {renderCurrentStep()}
    </div>
  );
};

export default WebOnboardingScreen;
