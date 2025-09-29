import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants';

const AppSkeleton: React.FC = () => {
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
        {/* Title Skeleton */}
        <View style={styles.titleSection}>
          <SkeletonBox width={256} height={32} />
          <SkeletonBox width={384} height={16} style={{ marginTop: 8 }} />
        </View>

        {/* Cards Grid Skeleton */}
        <View style={styles.cardsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.card}>
              <View style={styles.cardHeader}>
                <SkeletonBox width={48} height={48} />
                <SkeletonBox width={32} height={32} />
              </View>
              <SkeletonBox width={80} height={32} style={{ marginTop: 16 }} />
              <SkeletonBox width={64} height={16} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>

        {/* Charts Grid Skeleton */}
        <View style={styles.chartsGrid}>
          <View style={styles.chartCard}>
            <SkeletonBox width={128} height={24} />
            <SkeletonBox width="100%" height={256} style={{ marginTop: 16 }} />
          </View>
          <View style={styles.chartCard}>
            <SkeletonBox width={160} height={24} />
            <SkeletonBox width="100%" height={256} style={{ marginTop: 16 }} />
          </View>
        </View>

        {/* Weekly Progress Skeleton */}
        <View style={styles.weeklyProgress}>
          <SkeletonBox width={192} height={24} />
          <View style={styles.weeklyGrid}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <View key={item} style={styles.weeklyItem}>
                <SkeletonBox width={32} height={32} style={{ borderRadius: 16 }} />
                <SkeletonBox width={48} height={24} style={{ marginTop: 8 }} />
                <SkeletonBox width={64} height={12} style={{ marginTop: 4 }} />
              </View>
            ))}
          </View>
        </View>

        {/* Transactions Skeleton */}
        <View style={styles.transactions}>
          <SkeletonBox width={160} height={24} />
          <View style={styles.transactionsList}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <SkeletonBox width={40} height={40} />
                  <View style={styles.transactionText}>
                    <SkeletonBox width={96} height={16} />
                    <SkeletonBox width={64} height={12} style={{ marginTop: 4 }} />
                  </View>
                </View>
                <SkeletonBox width={80} height={16} />
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations Skeleton */}
        <View style={styles.recommendations}>
          <SkeletonBox width={128} height={24} />
          <View style={styles.recommendationsGrid}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.recommendationItem}>
                <SkeletonBox width={32} height={32} />
                <SkeletonBox width={96} height={20} style={{ marginTop: 12 }} />
                <SkeletonBox width="100%" height={12} style={{ marginTop: 4 }} />
                <SkeletonBox width="75%" height={12} style={{ marginTop: 4 }} />
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
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartsGrid: {
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
  weeklyProgress: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  weeklyItem: {
    alignItems: 'center',
  },
  transactions: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  transactionsList: {
    marginTop: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionText: {
    marginLeft: 12,
  },
  recommendations: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  recommendationItem: {
    width: '30%',
    alignItems: 'center',
  },
});

export default AppSkeleton;
