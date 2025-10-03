import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

interface FABProps {
  onPress: () => void;
  icon?: string;
  label?: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'large';
}

const FAB: React.FC<FABProps> = ({
  onPress,
  icon = 'add',
  label,
  variant = 'primary',
  size = 'large',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {}
    }
    onPress();
  };

  const isExtended = !!label;
  const fabSize = size === 'large' ? 64 : 56;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.fab,
          variant === 'primary' ? styles.fabPrimary : styles.fabSecondary,
          isExtended ? styles.fabExtended : { width: fabSize, height: fabSize },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Ionicons 
          name={icon as any} 
          size={size === 'large' ? 28 : 24} 
          color={COLORS.white} 
        />
        {isExtended && label && (
          <Text style={styles.fabLabel}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
  },
  fabPrimary: {
    backgroundColor: COLORS.primary,
  },
  fabSecondary: {
    backgroundColor: COLORS.primaryIntense,
  },
  fabExtended: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  fabLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default FAB;

