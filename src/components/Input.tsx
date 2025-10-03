import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../constants';
import { formatChileanPesoWithoutSymbol, parseChileanPeso } from '../utils/currencyUtils';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  currencyFormat?: boolean;
  autoFocus?: boolean;  // ✅ Nueva prop
  maxLength?: number;   // ✅ Nueva prop
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  currencyFormat = false,
  autoFocus = false,
  maxLength,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  // ✅ Animación de shake para errores
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Auto-focus cuando autoFocus es true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // ✅ Animación de shake cuando hay error
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleTextChange = (text: string) => {
    if (currencyFormat) {
      // Para formato de moneda, solo permitir números
      const cleanText = text.replace(/[^\d]/g, '');
      const numericValue = parseFloat(cleanText) || 0;
      onChangeText(numericValue.toString());
    } else {
      onChangeText(text);
    }
  };

  const displayValue = currencyFormat && value ? formatChileanPesoWithoutSymbol(parseFloat(value)) : value;

  const inputStyle = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    multiline && styles.inputMultiline,
    style,
  ];

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={displayValue}
          onChangeText={handleTextChange}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={COLORS.gray} />
            ) : (
              <Eye size={20} color={COLORS.gray} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    backgroundColor: COLORS.white,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.error || '#FF6B6B',
    borderWidth: 2,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  eyeIcon: {
    position: 'absolute',
    right: SIZES.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.error || '#FF6B6B',
    marginTop: SIZES.xs,
    marginLeft: SIZES.xs,
  },
});

export default Input;
