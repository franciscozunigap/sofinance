import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FinancialCard from '../components/FinancialCard';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { FinancialData } from '../types';
import { FinancialService } from '../services/financialService';
import { AuthService } from '../services/authService';

interface DashboardScreenProps {
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFinancialData = useCallback(async () => {
    try {
      const data = await FinancialService.getFinancialData();
      setFinancialData(data);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFinancialData();
    setRefreshing(false);
  }, [loadFinancialData]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  const user = AuthService.getCurrentUser();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>¡Bienvenido a SoFinance!</Text>
            <Text style={styles.subtitle}>
              Hola, {user?.name || user?.email}
            </Text>
          </View>
          
          <FinancialCard
            title="Resumen Financiero"
            balance={financialData.balance}
            monthlyIncome={financialData.monthlyIncome}
            monthlyExpenses={financialData.monthlyExpenses}
          />

          <View style={styles.actionsContainer}>
            <Button
              title="Ver Transacciones"
              onPress={() => {/* TODO: Navigate to transactions */}}
              style={styles.actionButton}
            />
            
            <Button
              title="Agregar Transacción"
              onPress={() => {/* TODO: Navigate to add transaction */}}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>

          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
  },
  header: {
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: SIZES.lg,
  },
  actionButton: {
    marginBottom: SIZES.md,
  },
  logoutButton: {
    marginTop: SIZES.lg,
  },
});

export default DashboardScreen;
