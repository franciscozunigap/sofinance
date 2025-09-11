import React, { useState } from 'react';
import WebLoginScreen from '../screens/web/WebLoginScreen';
import WebRegistrationScreen from '../screens/web/WebRegistrationScreen';
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
  const [showRegistration, setShowRegistration] = useState(false);

  // Si no está autenticado, mostrar pantalla de login/registro
  if (!isLoggedIn) {
    if (showRegistration) {
      return (
        <WebRegistrationScreen
          onRegistrationSuccess={onRegistrationSuccess}
          onShowLogin={() => setShowRegistration(false)}
        />
      );
    }
    
    return (
      <WebLoginScreen
        onLoginSuccess={onLoginSuccess}
        onShowRegistration={() => setShowRegistration(true)}
      />
    );
  }

  // Si está autenticado, mostrar dashboard
  return <WebDashboardScreen />;
};

export default WebAppNavigator;
