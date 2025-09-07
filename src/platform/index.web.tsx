// Configuración específica para web - React Native Web
import React from 'react';

// Re-exportar componentes de React Native Web
export { default as View } from 'react-native-web/dist/exports/View';
export { default as Text } from 'react-native-web/dist/exports/Text';
export { default as TextInput } from 'react-native-web/dist/exports/TextInput';
export { default as TouchableOpacity } from 'react-native-web/dist/exports/TouchableOpacity';
export { default as ScrollView } from 'react-native-web/dist/exports/ScrollView';
export { default as KeyboardAvoidingView } from 'react-native-web/dist/exports/KeyboardAvoidingView';
export { default as Animated } from 'react-native-web/dist/exports/Animated';
export { default as StyleSheet } from 'react-native-web/dist/exports/StyleSheet';
export { default as Dimensions } from 'react-native-web/dist/exports/Dimensions';
export { default as Platform } from 'react-native-web/dist/exports/Platform';

// Re-exportar RefreshControl
export { default as RefreshControl } from 'react-native-web/dist/exports/RefreshControl';

// Componentes personalizados para web
export const StatusBar = ({ barStyle, backgroundColor, translucent }: any) => {
  React.useEffect(() => {
    // Configurar meta viewport para web
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Configurar color de la barra de estado
    if (backgroundColor) {
      document.body.style.backgroundColor = backgroundColor;
    }
    
    // Configurar tema de la barra de estado
    if (barStyle === 'dark-content') {
      document.documentElement.style.setProperty('--status-bar-theme', 'dark');
    } else {
      document.documentElement.style.setProperty('--status-bar-theme', 'light');
    }
  }, [backgroundColor, barStyle]);

  return null;
};

export const ActivityIndicator = ({ size = 'small', color = '#4F46E5', style }: any) => {
  const sizeValue = size === 'large' ? '40px' : '20px';
  
  return React.createElement('div', {
    style: {
      width: sizeValue,
      height: sizeValue,
      border: `4px solid #e5e7eb`,
      borderTop: `4px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      ...style,
    },
  });
};

export const Alert = {
  alert: (title: string, message?: string, buttons?: any[]) => {
    if (window.confirm(`${title}\n\n${message || ''}`)) {
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  },
};

// SafeAreaContext para web
export const SafeAreaProvider = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', { children });
};

export const SafeAreaView = ({ children, style, ...props }: any) => {
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

// RefreshControl personalizado para web (mantener compatibilidad)
export const RefreshControlWeb = ({ refreshing, onRefresh, colors, tintColor }: any) => {
  return null; // En web no necesitamos pull-to-refresh
};