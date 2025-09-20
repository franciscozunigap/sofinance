import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface FloatingNavBarProps {
  currentView: 'dashboard' | 'analysis' | 'chat';
  onViewChange: (view: 'dashboard' | 'analysis' | 'chat') => void;
}

const FloatingNavBar: React.FC<FloatingNavBarProps> = ({ currentView, onViewChange }) => {
  return (
    <View style={styles.floatingNavContainer}>
      <View style={styles.floatingNavPanel}>
        <TouchableOpacity
          onPress={() => onViewChange('dashboard')}
          style={[styles.floatingNavItem, currentView === 'dashboard' && styles.floatingNavItemActive]}
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
        <TouchableOpacity
          onPress={() => onViewChange('analysis')}
          style={[styles.floatingNavItem, currentView === 'analysis' && styles.floatingNavItemActive]}
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
        <TouchableOpacity
          onPress={() => onViewChange('chat')}
          style={[styles.floatingNavItem, currentView === 'chat' && styles.floatingNavItemActive]}
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
      </View>
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
  floatingNavItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    transform: [{ scale: 1.05 }],
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
