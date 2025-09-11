/**
 * SoFinance App - Optimized Version
 * @format
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar, ActivityIndicator } from './src/platform';
import AppNavigator from './src/navigation/AppNavigator';
import WebAppNavigator from './src/navigation/WebAppNavigator';
import { AuthService } from './src/services/authService';
import { COLORS } from './src/constants';
import { UserProvider } from './src/contexts/UserContext';

// Componente de carga
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingContent}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>💰</Text>
      </View>
      <Text style={styles.loadingTitle}>SoFinance</Text>
      <Text style={styles.loadingSubtitle}>Cargando tu información...</Text>
      <ActivityIndicator 
        size="large" 
        color={COLORS.primary} 
        style={styles.loadingSpinner}
      />
    </View>
  </View>
);

// Componente principal de la aplicación
const AppContent = () => {
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

  const handleOnboardingComplete = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.light} 
        translucent={false}
      />
      {Platform.OS === 'web' ? (
        <WebAppNavigator
          isLoggedIn={isLoggedIn}
          onLoginSuccess={handleLoginSuccess}
          onRegistrationSuccess={handleLoginSuccess}
        />
      ) : (
        <AppNavigator
          isLoggedIn={isLoggedIn}
          onLoginSuccess={handleLoginSuccess}
          onRegistrationSuccess={handleLoginSuccess}
          onOnboardingComplete={handleOnboardingComplete}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

function App(): JSX.Element {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 32,
    textAlign: 'center',
  },
  loadingSpinner: {
    marginTop: 16,
  },
});

export default App;