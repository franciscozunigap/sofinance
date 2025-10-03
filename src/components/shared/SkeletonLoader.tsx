import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../constants';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  children?: React.ReactNode;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  children,
  variant = 'rectangular',
}) => {
  // ✅ Animación de pulso mejorada con shimmer effect
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Animación de pulso
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de shimmer (efecto de brillo)
    const shimmer = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    shimmer.start();

    return () => {
      pulseAnimation.stop();
      shimmer.stop();
    };
  }, []);

  const getVariantStyle = () => {
    switch (variant) {
      case 'text':
        return { height: 16, borderRadius: 4 };
      case 'circular':
        return { 
          width: height, 
          height, 
          borderRadius: height / 2 
        };
      case 'card':
        return { 
          height: 120, 
          borderRadius: BORDER_RADIUS.lg 
        };
      case 'rectangular':
      default:
        return { width, height, borderRadius };
    }
  };

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const shimmerTranslate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={[styles.container, getVariantStyle(), style]}>
      <Animated.View style={[styles.base, { opacity }]} />
      <Animated.View 
        style={[
          styles.shimmer, 
          { transform: [{ translateX: shimmerTranslate }] }
        ]} 
      />
      {children}
    </View>
  );
};

// ✅ Componentes de Skeleton predefinidos
export const SkeletonText: React.FC<{ lines?: number; width?: string }> = ({ lines = 1, width }) => (
  <View>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLoader 
        key={i}
        variant="text"
        width={i === lines - 1 ? (width || '70%') : '100%'}
        style={{ marginBottom: 8 }}
      />
    ))}
  </View>
);

export const SkeletonCard: React.FC = () => (
  <View style={styles.cardContainer}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <SkeletonLoader variant="circular" height={48} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <SkeletonLoader variant="text" width="60%" style={{ marginBottom: 8 }} />
        <SkeletonLoader variant="text" width="40%" />
      </View>
    </View>
    <SkeletonLoader variant="rectangular" height={100} />
  </View>
);

export const SkeletonTransaction: React.FC = () => (
  <View style={styles.transactionContainer}>
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <SkeletonLoader variant="circular" height={44} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <SkeletonLoader variant="text" width="70%" style={{ marginBottom: 6 }} />
        <SkeletonLoader variant="text" width="40%" height={12} />
      </View>
    </View>
    <SkeletonLoader variant="text" width={90} height={20} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.grayScale[200],
    overflow: 'hidden',
    position: 'relative',
  },
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.grayScale[200],
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: '-50%',
    right: '-50%',
    bottom: 0,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: 12,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default SkeletonLoader;
