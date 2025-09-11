import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';

export type RootStackParamList = {
  Login: { onLoginSuccess: () => void };
  Register: { onRegistrationSuccess: () => void };
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onRegistrationSuccess: () => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  isLoggedIn,
  onLoginSuccess,
  onRegistrationSuccess,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              initialParams={{ onLoginSuccess }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegistrationScreen}
              initialParams={{ onRegistrationSuccess }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
