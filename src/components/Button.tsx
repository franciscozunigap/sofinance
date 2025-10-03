import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  Platform,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';

// Haptic feedback (solo para mobile nativo)
const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    try {
      // Intentar usar expo-haptics si está disponible
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Si no está disponible, no hacer nada
    }
  }
};

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  icon,
}) => {
  // ✅ Animación de escala para feedback visual
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary, disabled && styles.disabled];
      case 'secondary':
        return [...baseStyle, styles.secondary, disabled && styles.disabledSecondary];
      case 'outline':
        return [...baseStyle, styles.outline, disabled && styles.disabledOutline];
      case 'danger':
        return [...baseStyle, styles.danger, disabled && styles.disabledDanger];
      default:
        return [...baseStyle, styles.primary, disabled && styles.disabled];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        return [...baseTextStyle, styles.primaryText, disabled && styles.disabledText];
      case 'secondary':
        return [...baseTextStyle, styles.secondaryText, disabled && styles.disabledText];
      case 'outline':
        return [...baseTextStyle, styles.outlineText, disabled && styles.disabledText];
      case 'danger':
        return [...baseTextStyle, styles.dangerText, disabled && styles.disabledText];
      default:
        return [...baseTextStyle, styles.primaryText, disabled && styles.disabledText];
    }
  };

  const isDisabled = disabled || loading;

  // ✅ Handlers para micro-interacciones
  const handlePressIn = () => {
    if (!isDisabled) {
      triggerHaptic();
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!isDisabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[...getButtonStyle(), style]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="small" 
              color={variant === 'primary' ? COLORS.white : COLORS.primary} 
            />
            <Text style={[...getTextStyle(), { marginLeft: SIZES.sm }]}>
              Cargando...
            </Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Sizes (✅ Touch targets mínimos 44x44px)
  small: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    minHeight: 44,  // ✅ Mínimo touch target
  },
  medium: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    minHeight: 50,  // ✅ Más cómodo para mobile
  },
  large: {
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.lg,
    minHeight: 56,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondary: {
    backgroundColor: COLORS.lightGray,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.error || '#FF6B6B',
  },
  // Disabled states
  disabled: {
    backgroundColor: COLORS.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledSecondary: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.6,
  },
  disabledOutline: {
    borderColor: COLORS.lightGray,
    opacity: 0.6,
  },
  disabledDanger: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.6,
  },
  // Text styles
  text: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.dark,
  },
  outlineText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.white,
  },
  disabledText: {
    color: COLORS.gray,
  },
  // Content
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: SIZES.sm,
  },
});

export default Button;
