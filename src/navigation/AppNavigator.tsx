import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

export type RootStackParamList = {
  Login: { onLoginSuccess: () => void };
  Register: { onRegistrationSuccess: () => void };
  Onboarding: { onComplete: () => void };
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onRegistrationSuccess: () => void;
  onOnboardingComplete: () => void;
  onLogout: () => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  isLoggedIn,
  onLoginSuccess,
  onRegistrationSuccess,
  onOnboardingComplete,
  onLogout,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen 
            name="Dashboard" 
            component={(props: any) => <DashboardScreen {...props} onLogout={onLogout} />}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={(props: any) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
            />
            <Stack.Screen 
              name="Register" 
              component={(props: any) => <RegistrationScreen {...props} onRegistrationSuccess={onRegistrationSuccess} />}
            />
            <Stack.Screen 
              name="Onboarding" 
              component={(props: any) => <OnboardingScreen {...props} onComplete={onOnboardingComplete} />}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
