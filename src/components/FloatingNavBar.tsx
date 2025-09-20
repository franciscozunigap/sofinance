import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface FloatingNavBarProps {
  currentView: 'dashboard' | 'analysis' | 'chat';
  onViewChange: (view: 'dashboard' | 'analysis' | 'chat') => void;
}

const FloatingNavBar: React.FC<FloatingNavBarProps> = ({ currentView, onViewChange }) => {
  const [scaleAnim] = React.useState(new Animated.Value(1));
  const [activeItemAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // Animar el elemento activo cuando cambie
    Animated.spring(activeItemAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [currentView]);

  const handlePress = (view: 'dashboard' | 'analysis' | 'chat') => {
    // Animación de escala al presionar
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onViewChange(view);
  };

  return (
    <View style={styles.floatingNavContainer}>
      <Animated.View style={[styles.floatingNavPanel, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View
          style={[
            styles.floatingNavItem,
            currentView === 'dashboard' && styles.floatingNavItemActive,
            {
              transform: [
                {
                  scale: currentView === 'dashboard' ? activeItemAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }) : 1,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress('dashboard')}
            style={styles.floatingNavItemTouchable}
            activeOpacity={0.7}
          >
            <Ionicons
              name="home-outline"
              size={16}
              color={currentView === 'dashboard' ? COLORS.white : COLORS.gray}
            />
            <Text style={[styles.floatingNavLabel, currentView === 'dashboard' && styles.floatingNavLabelActive]}>
              Finance
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.floatingNavItem,
            currentView === 'analysis' && styles.floatingNavItemActive,
            {
              transform: [
                {
                  scale: currentView === 'analysis' ? activeItemAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }) : 1,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress('analysis')}
            style={styles.floatingNavItemTouchable}
            activeOpacity={0.7}
          >
            <Ionicons
              name="bar-chart-outline"
              size={16}
              color={currentView === 'analysis' ? COLORS.white : COLORS.gray}
            />
            <Text style={[styles.floatingNavLabel, currentView === 'analysis' && styles.floatingNavLabelActive]}>
              Análisis
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.floatingNavItem,
            currentView === 'chat' && styles.floatingNavItemActive,
            {
              transform: [
                {
                  scale: currentView === 'chat' ? activeItemAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }) : 1,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress('chat')}
            style={styles.floatingNavItemTouchable}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color={currentView === 'chat' ? COLORS.white : COLORS.gray}
            />
            <Text style={[styles.floatingNavLabel, currentView === 'chat' && styles.floatingNavLabelActive]}>
              SofIA
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <View style={styles.floatingNavTopLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  floatingNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 50,
  },
  floatingNavPanel: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  floatingNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    position: 'relative',
    minWidth: 70,
    flex: 1,
  },
  floatingNavItemTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  floatingNavItemActive: {
    backgroundColor: 'rgba(133, 139, 242, 0.9)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  floatingNavLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
    fontWeight: '600',
  },
  floatingNavLabelActive: {
    color: COLORS.white,
  },
  floatingNavTopLine: {
    position: 'absolute',
    top: -6,
    width: 40,
    height: 3,
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    borderRadius: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default FloatingNavBar;
