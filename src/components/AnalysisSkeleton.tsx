import React, { useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, ScrollView, Platform } from 'react-native';
import { COLORS } from '../constants';
import { SkeletonChart, SkeletonMetric, SkeletonCard, SkeletonText } from './shared/SkeletonLoader';

const { width } = Dimensions.get('window');

const AnalysisSkeleton: React.FC = () => {
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
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

  // Mobile first: detectar tamaño de dispositivo
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
      {/* Header Skeleton - Mobile optimized */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SkeletonBox width={isSmallDevice ? 28 : 32} height={isSmallDevice ? 28 : 32} />
          <SkeletonBox width={isSmallDevice ? 80 : 96} height={isSmallDevice ? 20 : 24} style={{ marginLeft: 12 }} />
        </View>
        <View style={styles.headerContent}>
          <SkeletonBox width={isSmallDevice ? 28 : 32} height={isSmallDevice ? 28 : 32} style={{ borderRadius: 16 }} />
        </View>
      </View>

      {/* Main Content Skeleton - Scrollable */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Title Section - Mobile friendly */}
        <View style={styles.titleSection}>
          <SkeletonBox width={isSmallDevice ? '85%' : '50%'} height={isSmallDevice ? 24 : 28} />
          <SkeletonBox width={isSmallDevice ? '100%' : '75%'} height={14} style={{ marginTop: 8 }} />
        </View>

        {/* Summary Card - Destacado */}
        <SkeletonCard style={{ marginBottom: 20 }} />

        {/* Financial Metrics - Mobile first grid */}
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

        {/* Monthly Trend Chart - Gráfico principal */}
        <SkeletonChart 
          height={isSmallDevice ? 220 : 260} 
          style={{ marginBottom: 20 }} 
        />

        {/* Category Charts - Stack en mobile, grid en desktop */}
        <View style={[styles.chartsSection, isSmallDevice && styles.chartsSectionSmall]}>
          <SkeletonChart 
            height={isSmallDevice ? 200 : 240} 
            style={{ width: isSmallDevice ? '100%' : '48%', marginBottom: 20 }} 
          />
          <SkeletonChart 
            height={isSmallDevice ? 200 : 240} 
            style={{ width: isSmallDevice ? '100%' : '48%', marginBottom: 20 }} 
          />
        </View>

        {/* Analysis Insights Section */}
        <View style={styles.insightsSection}>
          <SkeletonBox width={isSmallDevice ? 140 : 180} height={20} style={{ marginBottom: 16 }} />
          <View style={[styles.insightsGrid, isSmallDevice && styles.insightsGridSmall]}>
            {[1, 2, 3].map((item) => (
              <View 
                key={`insight-${item}`} 
                style={[
                  styles.insightCard,
                  isSmallDevice && styles.insightCardSmall
                ]}
              >
                <SkeletonBox width={32} height={32} style={{ marginBottom: 12 }} />
                <SkeletonText lines={3} width="80%" />
              </View>
            ))}
          </View>
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
    paddingBottom: 80,
  },
  titleSection: {
    marginBottom: 20,
  },
  // Mobile first grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricsGridSmall: {
    flexDirection: 'column',
  },
  // Charts section - Stack en mobile
  chartsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartsSectionSmall: {
    flexDirection: 'column',
  },
  // Insights section
  insightsSection: {
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
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  insightsGridSmall: {
    flexDirection: 'column',
  },
  insightCard: {
    width: '31%',
    padding: 12,
    backgroundColor: COLORS.grayScale[100],
    borderRadius: 12,
    marginBottom: 12,
  },
  insightCardSmall: {
    width: '100%',
  },
});

export default AnalysisSkeleton;
