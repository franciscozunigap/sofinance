import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS } from '../constants';

const { width, height } = Dimensions.get('window');

interface AppSkeletonProps {
  message?: string;
}

const AppSkeleton: React.FC<AppSkeletonProps> = ({ 
  message = 'Cargando tu información...' 
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  const SkeletonBox = ({ 
    width: boxWidth, 
    height: boxHeight, 
    borderRadius = 8,
    style = {}
  }: {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: any;
  }) => (
    <Animated.View
      style={[
        styles.skeletonBox,
        {
          width: boxWidth,
          height: boxHeight,
          borderRadius,
          ...style,
        },
        shimmerStyle,
      ]}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SkeletonBox width={50} height={50} borderRadius={25} />
          <View style={styles.headerTextContainer}>
            <SkeletonBox width={120} height={20} style={{ marginBottom: 8 }} />
            <SkeletonBox width={80} height={16} />
          </View>
        </View>
        <SkeletonBox width={40} height={40} borderRadius={20} />
      </View>

      {/* Main Content Skeleton */}
      <View style={styles.content}>
        {/* Balance Card Skeleton */}
        <View style={styles.balanceCard}>
          <SkeletonBox width={100} height={24} style={{ marginBottom: 16 }} />
          <SkeletonBox width={180} height={32} style={{ marginBottom: 8 }} />
          <SkeletonBox width={120} height={16} />
        </View>

        {/* Quick Actions Skeleton */}
        <View style={styles.quickActions}>
          <SkeletonBox width="100%" height={60} borderRadius={12} />
        </View>

        {/* Chart Skeleton */}
        <View style={styles.chartContainer}>
          <SkeletonBox width={100} height={20} style={{ marginBottom: 16 }} />
          <SkeletonBox width="100%" height={200} borderRadius={12} />
        </View>

        {/* Recent Transactions Skeleton */}
        <View style={styles.transactionsContainer}>
          <SkeletonBox width={150} height={20} style={{ marginBottom: 16 }} />
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <SkeletonBox width={40} height={40} borderRadius={20} />
                <View style={styles.transactionText}>
                  <SkeletonBox width={100} height={16} style={{ marginBottom: 4 }} />
                  <SkeletonBox width={80} height={14} />
                </View>
              </View>
              <SkeletonBox width={60} height={16} />
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Navigation Skeleton */}
      <View style={styles.bottomNav}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.navItem}>
            <SkeletonBox width={24} height={24} borderRadius={12} />
            <SkeletonBox width={40} height={12} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>

      {/* Loading Message */}
      <View style={styles.loadingMessage}>
        <Text style={styles.loadingText}>{message}</Text>
        <View style={styles.loadingDots}>
          {[1, 2, 3].map((dot) => (
            <Animated.View
              key={dot}
              style={[
                styles.loadingDot,
                {
                  opacity: shimmerAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: SIZES.md,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
  },
  balanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActions: {
    marginBottom: SIZES.lg,
  },
  chartContainer: {
    marginBottom: SIZES.lg,
  },
  transactionsContainer: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionText: {
    marginLeft: SIZES.md,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navItem: {
    alignItems: 'center',
  },
  loadingMessage: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    marginHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderRadius: 12,
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: SIZES.sm,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
    marginHorizontal: 2,
  },
  skeletonBox: {
    backgroundColor: COLORS.lightGray,
  },
});

export default AppSkeleton;
