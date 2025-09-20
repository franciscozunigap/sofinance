import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { COLORS, SIZES } from '../../constants';
import { formatCurrency } from '../../utils';

interface TransactionItemProps {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  time: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  description,
  amount,
  category,
  date,
  time
}) => {
  const isPositive = amount > 0;
  const amountColor = isPositive ? COLORS.success : COLORS.danger;
  const iconBackgroundColor = isPositive ? '#dcfce7' : '#fef2f2';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
          <DollarSign 
            size={16} 
            color={amountColor} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.meta}>{category} • {date} {time}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isPositive ? '+' : ''}{formatCurrency(Math.abs(amount))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayScale[100],
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  meta: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TransactionItem;
