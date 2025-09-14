import React, { useState } from 'react';
import WebLoginScreen from '../screens/web/WebLoginScreen';
import WebOnboardingScreen from '../screens/web/WebOnboardingScreen';
import WebDashboardScreen from '../screens/web/WebDashboardScreen';
import { User } from '../types';
import { UserProvider } from '../contexts/UserContext';

interface WebAppNavigatorProps {
  isLoggedIn: boolean;
  onLoginSuccess: (user: User) => void;
  onRegistrationSuccess: (user: User) => void;
}

const WebAppNavigatorContent: React.FC<WebAppNavigatorProps> = ({
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

const WebAppNavigator: React.FC<WebAppNavigatorProps> = (props) => {
  return (
    <UserProvider>
      <WebAppNavigatorContent {...props} />
    </UserProvider>
  );
};

export default WebAppNavigator;
