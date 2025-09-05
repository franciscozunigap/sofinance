import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import { formatCurrency } from '../utils';

interface FinancialCardProps {
  title: string;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  style?: ViewStyle;
}

const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  balance,
  monthlyIncome,
  monthlyExpenses,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance Total</Text>
        <Text style={[
          styles.balanceAmount,
          { color: balance >= 0 ? COLORS.success : COLORS.danger }
        ]}>
          {formatCurrency(balance)}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Ingresos</Text>
          <Text style={[styles.statAmount, { color: COLORS.success }]}>
            {formatCurrency(monthlyIncome)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Gastos</Text>
          <Text style={[styles.statAmount, { color: COLORS.danger }]}>
            {formatCurrency(monthlyExpenses)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
    paddingBottom: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  balanceAmount: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  statAmount: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    fontWeight: '600',
  },
});

export default FinancialCard;
