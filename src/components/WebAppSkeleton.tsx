import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';

const { width, height } = Dimensions.get('window');

interface WebAppSkeletonProps {
  message?: string;
}

const WebAppSkeleton: React.FC<WebAppSkeletonProps> = ({ 
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
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <SkeletonBox width={120} height={24} style={{ marginLeft: 12 }} />
        </View>
        <View style={styles.headerRight}>
          <SkeletonBox width={100} height={32} borderRadius={16} />
          <SkeletonBox width={40} height={40} borderRadius={20} style={{ marginLeft: 12 }} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Sidebar Skeleton */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarItem}>
            <SkeletonBox width={24} height={24} borderRadius={12} />
            <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
          </View>
          <View style={styles.sidebarItem}>
            <SkeletonBox width={24} height={24} borderRadius={12} />
            <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
          </View>
          <View style={styles.sidebarItem}>
            <SkeletonBox width={24} height={24} borderRadius={12} />
            <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
          </View>
          <View style={styles.sidebarItem}>
            <SkeletonBox width={24} height={24} borderRadius={12} />
            <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Top Cards */}
          <View style={styles.topCards}>
            <View style={styles.card}>
              <SkeletonBox width={120} height={20} style={{ marginBottom: 16 }} />
              <SkeletonBox width={200} height={32} style={{ marginBottom: 8 }} />
              <SkeletonBox width={100} height={16} />
            </View>
            <View style={styles.card}>
              <SkeletonBox width={120} height={20} style={{ marginBottom: 16 }} />
              <SkeletonBox width={200} height={32} style={{ marginBottom: 8 }} />
              <SkeletonBox width={100} height={16} />
            </View>
            <View style={styles.card}>
              <SkeletonBox width={120} height={20} style={{ marginBottom: 16 }} />
              <SkeletonBox width={200} height={32} style={{ marginBottom: 8 }} />
              <SkeletonBox width={100} height={16} />
            </View>
          </View>

          {/* Chart Area */}
          <View style={styles.chartArea}>
            <SkeletonBox width={200} height={24} style={{ marginBottom: 20 }} />
            <SkeletonBox width="100%" height={300} borderRadius={12} />
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.transactionsSection}>
              <SkeletonBox width={150} height={20} style={{ marginBottom: 16 }} />
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <SkeletonBox width={40} height={40} borderRadius={20} />
                    <View style={styles.transactionText}>
                      <SkeletonBox width={120} height={16} style={{ marginBottom: 4 }} />
                      <SkeletonBox width={80} height={14} />
                    </View>
                  </View>
                  <SkeletonBox width={80} height={16} />
                </View>
              ))}
            </View>

            <View style={styles.chatSection}>
              <SkeletonBox width={120} height={20} style={{ marginBottom: 16 }} />
              <View style={styles.chatMessages}>
                {[1, 2, 3].map((item) => (
                  <View key={item} style={styles.chatMessage}>
                    <SkeletonBox width={32} height={32} borderRadius={16} />
                    <View style={styles.chatBubble}>
                      <SkeletonBox width={200} height={16} style={{ marginBottom: 4 }} />
                      <SkeletonBox width={150} height={14} />
                    </View>
                  </View>
                ))}
              </View>
              <View style={styles.chatInput}>
                <SkeletonBox width="100%" height={40} borderRadius={20} />
              </View>
            </View>
          </View>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    minHeight: height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGray,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  contentArea: {
    flex: 1,
    padding: 24,
  },
  topCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartArea: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomSection: {
    flexDirection: 'row',
    gap: 24,
  },
  transactionsSection: {
    flex: 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  chatSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chatMessages: {
    marginBottom: 16,
  },
  chatMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chatBubble: {
    marginLeft: 8,
    flex: 1,
  },
  chatInput: {
    marginTop: 'auto',
  },
  loadingMessage: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: 8,
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

export default WebAppSkeleton;
