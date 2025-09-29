import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants';

const AnalysisSkeleton: React.FC = () => {
  const pulseAnim = new Animated.Value(0.3);

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const SkeletonBox = ({ width, height, style = {} }: { width: number | string; height: number; style?: any }) => (
    <Animated.View
      style={[
        {
          width,
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
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SkeletonBox width={32} height={32} />
          <SkeletonBox width={96} height={24} style={{ marginLeft: 12 }} />
        </View>
        <View style={styles.headerContent}>
          <SkeletonBox width={32} height={32} style={{ borderRadius: 16 }} />
          <SkeletonBox width={80} height={16} style={{ marginLeft: 16 }} />
        </View>
      </View>

      {/* Main Content Skeleton */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <SkeletonBox width={200} height={28} />
          <SkeletonBox width={300} height={16} style={{ marginTop: 8 }} />
        </View>

        {/* Metrics Cards */}
        <View style={styles.metricsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <SkeletonBox width={48} height={48} />
                <SkeletonBox width={32} height={32} />
              </View>
              <SkeletonBox width={80} height={28} style={{ marginTop: 16 }} />
              <SkeletonBox width={64} height={16} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>

        {/* Charts Section */}
        <View style={styles.chartsSection}>
          <View style={styles.chartCard}>
            <SkeletonBox width={160} height={24} />
            <SkeletonBox width="100%" height={200} style={{ marginTop: 16 }} />
          </View>
          <View style={styles.chartCard}>
            <SkeletonBox width={140} height={24} />
            <SkeletonBox width="100%" height={200} style={{ marginTop: 16 }} />
          </View>
        </View>

        {/* Analysis Cards */}
        <View style={styles.analysisCards}>
          <View style={styles.analysisCard}>
            <SkeletonBox width={120} height={24} />
            <SkeletonBox width="100%" height={150} style={{ marginTop: 16 }} />
          </View>
          <View style={styles.analysisCard}>
            <SkeletonBox width={100} height={24} />
            <SkeletonBox width="100%" height={150} style={{ marginTop: 16 }} />
          </View>
        </View>

        {/* Recommendations Section */}
        <View style={styles.recommendationsSection}>
          <SkeletonBox width={180} height={24} />
          <View style={styles.recommendationsList}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.recommendationItem}>
                <View style={styles.recommendationLeft}>
                  <SkeletonBox width={40} height={40} />
                  <View style={styles.recommendationText}>
                    <SkeletonBox width={120} height={16} />
                    <SkeletonBox width={200} height={12} style={{ marginTop: 4 }} />
                    <SkeletonBox width={160} height={12} style={{ marginTop: 4 }} />
                  </View>
                </View>
                <SkeletonBox width={24} height={24} />
              </View>
            ))}
          </View>
        </View>
      </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleSection: {
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  analysisCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  analysisCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  recommendationsSection: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  recommendationsList: {
    marginTop: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  recommendationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendationText: {
    marginLeft: 12,
    flex: 1,
  },
});

export default AnalysisSkeleton;
