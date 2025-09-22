// Configuración específica para React Native
import { 
  Platform, 
  Dimensions, 
  StatusBar, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export { 
  Platform, 
  Dimensions, 
  StatusBar, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  RefreshControl
};

// Exportar configuración específica de iOS
export * from './ios';
