import React, { useState } from 'react';
import WebLoginScreen from '../screens/web/WebLoginScreen';
import WebOnboardingScreen from '../screens/web/WebOnboardingScreen';
import WebDashboardScreen from '../screens/web/WebDashboardScreen';

interface WebAppNavigatorProps {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onRegistrationSuccess: () => void;
}

const WebAppNavigator: React.FC<WebAppNavigatorProps> = ({
  isLoggedIn,
  onLoginSuccess,
  onRegistrationSuccess,
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Si no está autenticado, mostrar pantalla de login/onboarding
  if (!isLoggedIn) {
    if (showOnboarding) {
      return (
        <WebOnboardingScreen
          onComplete={onRegistrationSuccess}
          onBack={() => setShowOnboarding(false)}
        />
      );
    }
    
    return (
      <WebLoginScreen
        onLoginSuccess={onLoginSuccess}
        onShowRegistration={() => setShowOnboarding(true)}
      />
    );
  }

  // Si está autenticado, mostrar dashboard
  return <WebDashboardScreen />;
};

export default WebAppNavigator;
