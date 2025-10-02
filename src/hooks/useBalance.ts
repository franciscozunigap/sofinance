import { useState, useEffect } from 'react';
import { BalanceRegistration, MonthlyStats } from '../types';
import { BalanceService } from '../services/balanceService';

export const useBalance = (userId: string) => {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [balanceHistory, setBalanceHistory] = useState<BalanceRegistration[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar balance actual
  const loadCurrentBalance = async () => {
    console.log('💰 [useBalance.loadCurrentBalance] Iniciando...');
    console.log('👤 [useBalance.loadCurrentBalance] userId:', userId);
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useBalance.loadCurrentBalance] Llamando a BalanceService.getCurrentBalance...');
      const balance = await BalanceService.getCurrentBalance(userId);
      console.log('💰 [useBalance.loadCurrentBalance] Balance obtenido:', balance);
      setCurrentBalance(balance);
      console.log('✅ [useBalance.loadCurrentBalance] Balance actualizado en estado');
    } catch (err) {
      console.error('💥 [useBalance.loadCurrentBalance] Error:', err);
      setError('Error al cargar el balance actual');
    } finally {
      console.log('🏁 [useBalance.loadCurrentBalance] Finalizando');
      setLoading(false);
    }
  };

  // Cargar historial de balance
  const loadBalanceHistory = async () => {
    console.log('📜 [useBalance.loadBalanceHistory] Iniciando...');
    console.log('👤 [useBalance.loadBalanceHistory] userId:', userId);
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useBalance.loadBalanceHistory] Llamando a BalanceService.getBalanceHistory...');
      const history = await BalanceService.getBalanceHistory(userId);
      console.log('📜 [useBalance.loadBalanceHistory] Historial obtenido:', history.length, 'registros');
      setBalanceHistory(history);
      console.log('✅ [useBalance.loadBalanceHistory] Historial actualizado en estado');
    } catch (err) {
      console.error('💥 [useBalance.loadBalanceHistory] Error:', err);
      setError('Error al cargar el historial de balance');
    } finally {
      console.log('🏁 [useBalance.loadBalanceHistory] Finalizando');
      setLoading(false);
    }
  };

  // Cargar estadísticas del mes actual
  const loadMonthlyStats = async () => {
    console.log('📊 [useBalance.loadMonthlyStats] Iniciando...');
    console.log('👤 [useBalance.loadMonthlyStats] userId:', userId);
    
    try {
      setLoading(true);
      setError(null);
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      console.log('📅 [useBalance.loadMonthlyStats] Fecha:', { now, month, year });
      
      console.log('🔄 [useBalance.loadMonthlyStats] Llamando a BalanceService.getMonthlyStats...');
      const stats = await BalanceService.getMonthlyStats(userId, month, year);
      console.log('📊 [useBalance.loadMonthlyStats] Estadísticas obtenidas:', stats);
      setMonthlyStats(stats);
      console.log('✅ [useBalance.loadMonthlyStats] Estadísticas actualizadas en estado');
    } catch (err) {
      console.error('💥 [useBalance.loadMonthlyStats] Error:', err);
      setError('Error al cargar las estadísticas mensuales');
    } finally {
      console.log('🏁 [useBalance.loadMonthlyStats] Finalizando');
      setLoading(false);
    }
  };

  // Registrar nuevo balance
  const registerBalance = async (
    type: 'income' | 'expense' | 'adjustment',
    description: string,
    amount: number,
    category: string
  ): Promise<boolean> => {
    console.log('🎯 [useBalance] Iniciando registerBalance...');
    console.log('📊 [useBalance] Parámetros recibidos:', { userId, type, description, amount, category });
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useBalance] Llamando a BalanceService.registerBalance...');
      const result = await BalanceService.registerBalance(userId, type, description, amount, category);
      console.log('📋 [useBalance] Resultado del servicio:', result);
      
      if (result.success) {
        console.log('✅ [useBalance] Registro exitoso, recargando datos...');
        // Recargar todos los datos
        await Promise.all([
          loadCurrentBalance(),
          loadBalanceHistory(),
          loadMonthlyStats()
        ]);
        console.log('🔄 [useBalance] Datos recargados exitosamente');
        return true;
      } else {
        console.error('❌ [useBalance] Error en el servicio:', result.error);
        setError(result.error || 'Error al registrar el balance');
        return false;
      }
    } catch (err) {
      console.error('💥 [useBalance] Error durante registerBalance:', err);
      console.error('💥 [useBalance] Stack trace:', err instanceof Error ? err.stack : 'No stack trace available');
      setError('Error al registrar el balance');
      return false;
    } finally {
      console.log('🏁 [useBalance] Finalizando registerBalance');
      setLoading(false);
    }
  };

  // Cargar datos iniciales solo si el userId es válido
  useEffect(() => {
    if (userId && userId !== 'user-id') {
      loadCurrentBalance();
      loadBalanceHistory();
      loadMonthlyStats();
    }
  }, [userId]);

  return {
    currentBalance,
    balanceHistory,
    monthlyStats,
    loading,
    error,
    loadCurrentBalance,
    loadBalanceHistory,
    loadMonthlyStats,
    registerBalance,
  };
};
