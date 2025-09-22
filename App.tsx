/**
 * SoFinance App - Optimized Version
 * @format
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import WebAppNavigator from './src/navigation/WebAppNavigator';
import { AuthService } from './src/services/authService';
import { COLORS } from './src/constants';
import { UserProvider, useUser } from './src/contexts/UserContext';
import { testFirebaseConfig } from './src/firebase/testConnection';
import IOSStatusBar from './src/components/IOSStatusBar';
import AppSkeleton from './src/components/AppSkeleton';
import WebAppSkeleton from './src/components/WebAppSkeleton';

// Componente de carga
const LoadingScreen = ({ firebaseReady }: { firebaseReady: boolean }) => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingContent}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>💰</Text>
      </View>
      <Text style={styles.loadingTitle}>SoFinance</Text>
      <Text style={styles.loadingSubtitle}>
        {firebaseReady ? 'Cargando tu información...' : 'Configurando servicios...'}
      </Text>
      {!firebaseReady && (
        <Text style={styles.warningText}>
          ⚠️ Verificando configuración de Firebase
        </Text>
      )}
      <View style={styles.loadingSpinner}>
        <View style={styles.spinner} />
      </View>
    </View>
  </View>
);

// Componente principal de la aplicación
const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const { loading: userLoading } = useUser();

  useEffect(() => {
    // Probar la configuración de Firebase al iniciar
    const testFirebase = async () => {
      try {
        const isConfigValid = testFirebaseConfig();
        setFirebaseReady(isConfigValid);
        
        if (!isConfigValid) {
          console.error('Firebase configuration is invalid. Please check your configuration.');
        }
      } catch (error) {
        console.error('Error testing Firebase configuration:', error);
        setFirebaseReady(false);
      }
    };

    testFirebase();
  }, []);

  useEffect(() => {
    // Solo configurar el listener de autenticación si Firebase está listo
    if (!firebaseReady) return;

    const unsubscribe = AuthService.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseReady]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleOnboardingComplete = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Mostrar skeleton mientras se carga el contexto del usuario o Firebase
  if (isLoading || !firebaseReady || userLoading) {
    if (!firebaseReady) {
      return <LoadingScreen firebaseReady={firebaseReady} />;
    }
    return Platform.OS === 'web' 
      ? <WebAppSkeleton message="Cargando tu información financiera..." />
      : <AppSkeleton message="Cargando tu información financiera..." />;
  }

  return (
    <>
      <IOSStatusBar />
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
    <SafeAreaProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </SafeAreaProvider>
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
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: COLORS.lightGray,
    borderTopColor: COLORS.primary,
    // Animación de rotación
    transform: [{ rotate: '0deg' }],
  },
  warningText: {
    fontSize: 14,
    color: COLORS.warning || '#FFA500',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default App;