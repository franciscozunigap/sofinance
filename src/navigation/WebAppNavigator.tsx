import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import DashboardScreen from '../screens/DashboardScreen';

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <DashboardScreen /> : <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : (
        <LoginScreen 
          onLoginSuccess={onLoginSuccess} 
          onShowRegistration={() => setShowRegistration(true)}
        />
      ),
    },
    {
      path: "/register",
      element: isLoggedIn ? <Navigate to="/" replace /> : (
        <RegistrationScreen 
          onRegistrationSuccess={onRegistrationSuccess}
          onBackToLogin={() => setShowRegistration(false)}
        />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default WebAppNavigator;
