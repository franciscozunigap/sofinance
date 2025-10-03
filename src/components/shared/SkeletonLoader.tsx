import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../constants';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
  children?: React.ReactNode;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'chart';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  children,
  variant = 'rectangular',
}) => {
  // Animación de pulso optimizada para mobile y Safari
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Animación de pulso suave
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500, // Más lento para mejor performance
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de shimmer (efecto de brillo) - Safari compatible
    const shimmer = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 2000, // Más lento y suave
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    shimmer.start();

    return () => {
      pulseAnimation.stop();
      shimmer.stop();
    };
  }, [shimmerAnim, translateX]);

  const getVariantStyle = useMemo(() => {
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
      case 'chart':
        // Skeleton especial para gráficos - Mobile optimized
        return {
          height: height || 200,
          borderRadius: BORDER_RADIUS.lg,
          backgroundColor: '#f3f4f6',
        };
      case 'rectangular':
      default:
        return { width, height, borderRadius };
    }
  }, [variant, width, height, borderRadius]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const shimmerTranslate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={[styles.container, getVariantStyle, style]}>
      <Animated.View style={[styles.base, { opacity }]} />
      {/* Shimmer solo en plataformas que lo soportan bien */}
      {Platform.OS !== 'web' && (
        <Animated.View 
          style={[
            styles.shimmer, 
            { transform: [{ translateX: shimmerTranslate }] }
          ]} 
        />
      )}
      {children}
    </View>
  );
};

// Componentes de Skeleton predefinidos y optimizados
export const SkeletonText: React.FC<{ lines?: number; width?: string; style?: any }> = ({ 
  lines = 1, 
  width, 
  style 
}) => (
  <View style={style}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLoader 
        key={`text-${i}`}
        variant="text"
        width={i === lines - 1 ? (width || '70%') : '100%'}
        style={{ marginBottom: i < lines - 1 ? 8 : 0 }}
      />
    ))}
  </View>
);

export const SkeletonCard: React.FC<{ style?: any }> = ({ style }) => (
  <View style={[styles.cardContainer, style]}>
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

export const SkeletonTransaction: React.FC<{ style?: any }> = ({ style }) => (
  <View style={[styles.transactionContainer, style]}>
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

// Nuevo: Skeleton para gráficos
export const SkeletonChart: React.FC<{ height?: number; style?: any }> = ({ 
  height = 200,
  style 
}) => (
  <View style={[styles.chartContainer, style]}>
    <SkeletonLoader 
      variant="text" 
      width="50%" 
      height={20} 
      style={{ marginBottom: 16 }} 
    />
    <SkeletonLoader 
      variant="chart" 
      height={height}
    />
  </View>
);

// Nuevo: Skeleton para métricas/stats
export const SkeletonMetric: React.FC<{ style?: any }> = ({ style }) => (
  <View style={[styles.metricContainer, style]}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
      <SkeletonLoader variant="circular" height={40} />
      <SkeletonLoader variant="rectangular" width={32} height={24} borderRadius={12} />
    </View>
    <SkeletonLoader variant="text" width="40%" height={28} style={{ marginBottom: 8 }} />
    <SkeletonLoader variant="text" width="60%" height={14} />
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
    ...Platform.select({
      ios: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
    }),
  },
  transactionContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: BORDER_RADIUS.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
    }),
  },
  metricContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: BORDER_RADIUS.lg,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
    }),
  },
});

export default SkeletonLoader;
