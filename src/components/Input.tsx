import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Animated,
} from 'react-native';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleTextChange = (text: string) => {
    setHasValue(text.length > 0);
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  const inputStyle = [
    styles.input,
    isFocused && styles.focused,
    error && styles.error,
    hasValue && !error && styles.success,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label,
          isFocused && styles.labelFocused,
          error && styles.labelError,
        ]}>
          {label}
        </Text>
      )}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TextInput
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          placeholderTextColor={COLORS.gray}
          {...props}
        />
      </Animated.View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {hasValue && !error && (
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successText}>Válido</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark, // Negro Suave
    marginBottom: SIZES.sm,
  },
  labelFocused: {
    color: COLORS.primary, // Azul Suave
  },
  labelError: {
    color: COLORS.danger, // Rojo Vibrante
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark, // Negro Suave
    borderWidth: 1,
    borderColor: COLORS.grayScale[300],
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  focused: {
    borderColor: COLORS.primary, // Azul Suave
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  error: {
    borderColor: COLORS.danger, // Rojo Vibrante
    borderWidth: 2,
    shadowColor: COLORS.danger,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  success: {
    borderColor: COLORS.success,
    borderWidth: 2,
    shadowColor: COLORS.success,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  errorIcon: {
    fontSize: 12,
    marginRight: SIZES.xs,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.danger, // Rojo Vibrante
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  successIcon: {
    fontSize: 12,
    marginRight: SIZES.xs,
  },
  successText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.success,
    flex: 1,
  },
});

export default Input;
