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
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta. Inténtalo de nuevo.';
      alert(errorMessage);
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
