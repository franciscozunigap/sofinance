import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES, BORDER_RADIUS } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large' | 'xlarge';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'medium',
  shadow = 'medium',
  borderRadius = 'large'
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return SIZES.sm;
      case 'medium': return SIZES.md;
      case 'large': return SIZES.lg;
      default: return SIZES.md;
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case 'none': return {};
      case 'small': return {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      };
      case 'medium': return {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      };
      case 'large': return {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      };
      default: return {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      };
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'small': return BORDER_RADIUS.sm;
      case 'medium': return BORDER_RADIUS.md;
      case 'large': return BORDER_RADIUS.lg;
      case 'xlarge': return BORDER_RADIUS.xl;
      default: return BORDER_RADIUS.lg;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          padding: getPadding(),
          borderRadius: getBorderRadius(),
          ...getShadow(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
});

export default Card;
