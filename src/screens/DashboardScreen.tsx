import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Dimensions, SafeAreaView, RefreshControl } from '../platform';
import FinancialCard from '../components/FinancialCard';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../constants';
import { FinancialData } from '../types';
import { FinancialService } from '../services/financialService';
import { AuthService } from '../services/authService';

interface DashboardScreenProps {
  onLogout: () => void;
}

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout }) => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

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
    
    // Animar entrada del dashboard
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
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
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.greeting}>¡Hola! 👋</Text>
              <Text style={styles.title}>Bienvenido a SoFinance</Text>
              <Text style={styles.subtitle}>
                {user?.name || user?.email}
              </Text>
            </View>
          </View>
          
          <FinancialCard
            title="Resumen Financiero"
            balance={financialData.balance}
            monthlyIncome={financialData.monthlyIncome}
            monthlyExpenses={financialData.monthlyExpenses}
          />

          <View style={styles.actionsContainer}>
            <Button
              title="📊 Ver Transacciones"
              onPress={() => {/* TODO: Navigate to transactions */}}
              style={styles.actionButton}
            />
            
            <Button
              title="➕ Agregar Transacción"
              onPress={() => {/* TODO: Navigate to add transaction */}}
              variant="secondary"
              style={styles.actionButton}
            />
            
            <Button
              title="📈 Estadísticas"
              onPress={() => {/* TODO: Navigate to stats */}}
              variant="secondary"
              style={styles.actionButton}
            />
            
            <Button
              title="⚙️ Configuración"
              onPress={() => {/* TODO: Navigate to settings */}}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>

          <Button
            title="🚪 Cerrar Sesión"
            onPress={handleLogout}
            variant="danger"
            style={[styles.actionButton, styles.logoutButton]}
          />
        </Animated.View>
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
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  title: {
    fontSize: 24,
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
    width: '100%',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
  },
  logoutButton: {
    marginTop: SIZES.lg,
  },
});

export default DashboardScreen;
