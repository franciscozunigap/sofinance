// Configuración específica para iOS
import { Platform, Dimensions } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Dimensiones específicas para iOS
export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Configuración de SafeArea para iOS
export const safeAreaInsets = {
  top: isIOS ? 44 : 0, // Status bar + notch
  bottom: isIOS ? 34 : 0, // Home indicator
  left: 0,
  right: 0,
};

// Configuración de navegación flotante para iOS
export const floatingNavConfig = {
  bottomOffset: isIOS ? 34 : 20,
  height: 60,
  borderRadius: 16,
};

// Configuración de StatusBar para iOS
export const statusBarConfig = {
  barStyle: 'dark-content' as const,
  backgroundColor: '#F2F2F2',
  translucent: false,
};

// Configuración de teclado para iOS
export const keyboardConfig = {
  behavior: isIOS ? 'padding' as const : 'height' as const,
  keyboardVerticalOffset: isIOS ? 0 : 0,
};

// Configuración de animaciones para iOS
export const animationConfig = {
  duration: 300,
  useNativeDriver: true,
  tension: 100,
  friction: 8,
};

// Configuración de sombras para iOS
export const shadowConfig = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3, // Solo para Android
};

// Configuración de glassmorphism para iOS
export const glassmorphismConfig = {
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
};
