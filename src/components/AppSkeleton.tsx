import React, { useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView, Platform } from 'react-native';
import { COLORS } from '../constants';
import { SkeletonCard, SkeletonChart, SkeletonMetric, SkeletonTransaction } from './shared/SkeletonLoader';

const { width } = Dimensions.get('window');

const AppSkeleton: React.FC = () => {
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500, // Más suave
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Detectar si es mobile pequeño para adaptar layout
  const isSmallDevice = useMemo(() => width < 375, []);
  const cardWidth = useMemo(() => isSmallDevice ? '100%' : '48%', [isSmallDevice]);

  const SkeletonBox = ({ width: boxWidth, height, style = {} }: { width: number | string; height: number; style?: any }) => (
    <Animated.View
      style={[
        {
          width: boxWidth,
          height,
          backgroundColor: COLORS.lightGray,
          opacity: pulseAnim,
          borderRadius: 8,
        },
        style,
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header Skeleton - Mobile first */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SkeletonBox width={isSmallDevice ? 28 : 32} height={isSmallDevice ? 28 : 32} />
          <SkeletonBox width={isSmallDevice ? 80 : 96} height={isSmallDevice ? 20 : 24} style={{ marginLeft: 12 }} />
        </View>
        <View style={styles.headerContent}>
          <SkeletonBox width={isSmallDevice ? 28 : 32} height={isSmallDevice ? 28 : 32} style={{ borderRadius: 16 }} />
        </View>
      </View>

      {/* Main Content Skeleton - Scrollable para mobile */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Title Skeleton - Mobile friendly */}
        <View style={styles.titleSection}>
          <SkeletonBox width={isSmallDevice ? '90%' : '60%'} height={isSmallDevice ? 24 : 32} />
          <SkeletonBox width={isSmallDevice ? '100%' : '80%'} height={14} style={{ marginTop: 8 }} />
        </View>

        {/* Balance Score Card - Destacado en mobile */}
        <SkeletonCard style={{ marginBottom: 20 }} />

        {/* Metrics Grid - Mobile first: stack en pequeño, grid en grande */}
        <View style={[styles.metricsGrid, isSmallDevice && styles.metricsGridSmall]}>
          {[1, 2, 3, 4].map((item) => (
            <SkeletonMetric 
              key={`metric-${item}`} 
              style={{ 
                width: cardWidth, 
                marginBottom: 16 
              }} 
            />
          ))}
        </View>

        {/* Balance Chart - Full width en mobile */}
        <SkeletonChart height={isSmallDevice ? 220 : 280} style={{ marginBottom: 20 }} />

        {/* Weekly Progress - Responsive */}
        <View style={styles.weeklySection}>
          <SkeletonBox width={isSmallDevice ? 140 : 180} height={20} style={{ marginBottom: 16 }} />
          <View style={styles.weeklyGrid}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <View key={`day-${item}`} style={styles.weeklyItem}>
                <SkeletonBox width={isSmallDevice ? 28 : 32} height={isSmallDevice ? 28 : 32} style={{ borderRadius: 16, marginBottom: 4 }} />
                <SkeletonBox width={isSmallDevice ? 36 : 48} height={12} />
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions - Using new component */}
        <View style={styles.transactionsSection}>
          <SkeletonBox width={isSmallDevice ? 180 : 200} height={20} style={{ marginBottom: 16 }} />
          {[1, 2, 3, 4].map((item) => (
            <SkeletonTransaction key={`trans-${item}`} style={{ marginBottom: 8 }} />
          ))}
        </View>

        {/* Bottom Spacer para navegación flotante */}
        <View style={{ height: 100 }} />
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Espacio para navegación flotante
  },
  titleSection: {
    marginBottom: 20,
  },
  // Metrics Grid - Mobile first
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricsGridSmall: {
    flexDirection: 'column', // Stack en dispositivos pequeños
  },
  // Weekly Progress - Responsive
  weeklySection: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
    }),
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weeklyItem: {
    alignItems: 'center',
    flex: 1,
  },
  // Transactions Section
  transactionsSection: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
    }),
  },
});

export default AppSkeleton;
