import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants';

const { width } = Dimensions.get('window');

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onHide: () => void;
  onAction?: () => void;
  actionText?: string;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 4000,
  onHide,
  onAction,
  actionText,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Mostrar toast
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide después de la duración especificada
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#f0fdf4',
          borderColor: '#10b981',
          iconColor: '#10b981',
          iconName: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          backgroundColor: '#fef2f2',
          borderColor: '#ef4444',
          iconColor: '#ef4444',
          iconName: 'close-circle' as const,
        };
      case 'warning':
        return {
          backgroundColor: '#fffbeb',
          borderColor: '#f59e0b',
          iconColor: '#f59e0b',
          iconName: 'warning' as const,
        };
      default:
        return {
          backgroundColor: '#eff6ff',
          borderColor: '#3b82f6',
          iconColor: '#3b82f6',
          iconName: 'information-circle' as const,
        };
    }
  };

  const toastStyle = getToastStyle();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: toastStyle.backgroundColor,
            borderColor: toastStyle.borderColor,
          },
        ]}
      >
        <View style={styles.content}>
          <Ionicons
            name={toastStyle.iconName}
            size={20}
            color={toastStyle.iconColor}
            style={styles.icon}
          />
          <Text style={[styles.message, { color: toastStyle.iconColor }]}>
            {message}
          </Text>
        </View>
        
        {onAction && actionText && (
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: toastStyle.iconColor }]}
            onPress={onAction}
          >
            <Text style={[styles.actionText, { color: toastStyle.iconColor }]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideToast}
        >
          <Ionicons name="close" size={16} color={toastStyle.iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: SIZES.md,
    right: SIZES.md,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 12,
    borderWidth: 1,
    padding: SIZES.md,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: SIZES.sm,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.medium,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: SIZES.sm,
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    padding: SIZES.xs,
  },
});

export default Toast;
