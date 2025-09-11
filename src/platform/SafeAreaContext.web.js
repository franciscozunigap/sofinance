// Mock de SafeAreaContext para web
import React from 'react';

const SafeAreaContext = React.createContext({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

// Exportaciones adicionales requeridas por React Navigation
export const SafeAreaInsetsContext = SafeAreaContext;

export const initialWindowMetrics = {
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
  frame: { x: 0, y: 0, width: 0, height: 0 },
};

export const SafeAreaProvider = ({ children }) => {
  return React.createElement('div', { children });
};

export const SafeAreaView = ({ children, style, ...props }) => {
  return React.createElement('div', { 
    style: { 
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      ...style 
    }, 
    ...props, 
    children 
  });
};

export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
});

export default SafeAreaContext;
