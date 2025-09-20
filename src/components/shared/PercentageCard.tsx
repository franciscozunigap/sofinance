import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency } from '../../utils';

interface PercentageCardProps {
  label: string;
  percentage: number;
  amount: number;
  color: string;
  style?: any;
}

const PercentageCard: React.FC<PercentageCardProps> = ({
  label,
  percentage,
  amount,
  color,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.percentage, { color }]}>
        {percentage}%
      </Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>
        {formatCurrency(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 80,
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SIZES.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: 2,
  },
  amount: {
    fontSize: 12,
    color: COLORS.gray,
  },
});

export default PercentageCard;
