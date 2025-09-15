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
  const netIncome = monthlyIncome - monthlyExpenses;
  const isPositive = netIncome >= 0;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: isPositive ? COLORS.success : COLORS.danger }]}>
          <Text style={styles.statusText}>
            {isPositive ? '📈' : '📉'} {isPositive ? 'Positivo' : 'Negativo'}
          </Text>
        </View>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance Total</Text>
        <Text style={[
          styles.balanceAmount,
          { color: balance >= 0 ? COLORS.success : COLORS.danger }
        ]}>
          {formatCurrency(balance)}
        </Text>
        <View style={styles.balanceIndicator}>
          <View style={[styles.indicatorDot, { backgroundColor: balance >= 0 ? COLORS.success : COLORS.danger }]} />
          <Text style={styles.indicatorText}>
            {balance >= 0 ? 'Saldo saludable' : 'Revisar gastos'}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statItem, styles.incomeCard]}>
          <View style={styles.statIcon}>
            <Text style={styles.iconText}>💰</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Ingresos</Text>
            <Text style={[styles.statAmount, { color: COLORS.success }]}>
              {formatCurrency(monthlyIncome)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.statItem, styles.expenseCard]}>
          <View style={styles.statIcon}>
            <Text style={styles.iconText}>💸</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Gastos</Text>
            <Text style={[styles.statAmount, { color: COLORS.danger }]}>
              {formatCurrency(monthlyExpenses)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>Resumen del mes</Text>
        <Text style={[styles.summaryAmount, { color: isPositive ? COLORS.success : COLORS.danger }]}>
          {isPositive ? '+' : ''}{formatCurrency(netIncome)}
        </Text>
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
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark, // Negro Suave
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    fontWeight: '600',
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
    fontSize: 28,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
    marginBottom: SIZES.sm,
  },
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.xs,
  },
  indicatorText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.lg,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.sm,
    borderRadius: 12,
    marginHorizontal: SIZES.xs,
  },
  incomeCard: {
    backgroundColor: COLORS.blue[50], // Azul muy claro para ingresos
  },
  expenseCard: {
    backgroundColor: '#fef2f2', // Mantener rojo claro para gastos
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  iconText: {
    fontSize: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  statAmount: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: COLORS.light, // Blanco Roto
    padding: SIZES.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  summaryAmount: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
});

export default FinancialCard;
