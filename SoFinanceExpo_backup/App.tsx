/**
 * SoFinance App - Optimized Version
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { AuthService } from './src/services/authService';
import { COLORS } from './src/constants';

function App(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoading) {
    // You could add a loading screen here
    return null;
  }

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.light} 
        translucent={false}
      />
      {isLoggedIn ? (
        <DashboardScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;