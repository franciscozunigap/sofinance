import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import BalanceRecordItem from '../components/BalanceRecordItem';
import { BalanceRecord, BalanceCategory, BalanceRegistrationData } from '../types';
import { BalanceService } from '../services/balanceService';
import { useFinancialData } from '../contexts/FinancialDataContext';
import { useUser } from '../contexts/UserContext';
import { formatChileanPeso } from '../utils/currencyUtils';

const { width } = Dimensions.get('window');

interface BalanceRegistrationScreenProps {
  onComplete: () => void;
  currentBalance?: number; // Balance actual de la base de datos
}

const BalanceRegistrationScreen: React.FC<BalanceRegistrationScreenProps> = ({
  onComplete,
  currentBalance = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentAmount, setCurrentAmount] = useState('');
  const [records, setRecords] = useState<BalanceRecord[]>([]);
  const [amountError, setAmountError] = useState<string | undefined>();
  const [recordsError, setRecordsError] = useState<string | undefined>();
  
  // Animaciones para transiciones fluidas
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  
  // Obtener el usuario del contexto
  const { user } = useUser();
  const { registerBalance, loading } = useFinancialData();

  // Calcular la diferencia
  const currentAmountNum = parseFloat(currentAmount) || 0;
  const difference = currentAmountNum - currentBalance;

  // Calcular el total de los registros usando el servicio
  const totalRecords = BalanceService.calculateTotal(records);
  const absoluteTotalRecords = BalanceService.calculateAbsoluteTotal(records);

  // Validar monto actual
  const validateCurrentAmount = () => {
    const amount = parseFloat(currentAmount);
    if (!currentAmount || isNaN(amount) || amount <= 0) {
      setAmountError('Por favor, ingresa un monto válido');
      return false;
    }
    setAmountError(undefined);
    return true;
  };

  // Validar registros usando el servicio
  const validateRecords = () => {
    const validation = BalanceService.validateRecords(records, difference);
    if (!validation.isValid) {
      setRecordsError(validation.error);
      return false;
    }
    setRecordsError(undefined);
    return true;
  };

  const handleNext = () => {
    if (validateCurrentAmount()) {
      // Animación de transición al siguiente paso
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(2);
        // Restaurar animaciones
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const handleRegister = async () => {
    if (validateRecords()) {
      // Registrar cada transacción individualmente
      let allSuccess = true;
      
      for (const record of records) {
        const type = record.category === 'Ingreso' ? 'income' : 'expense';
        // ✅ Usar la descripción personalizada del usuario
        const description = record.description || `Registro de ${record.category}`;
        
        const success = await registerBalance(
          type,
          description,  // ✅ Descripción del usuario
          record.amount,
          record.category
        );
        
        if (!success) {
          allSuccess = false;
          break;
        }
      }
      
      if (allSuccess) {
        Alert.alert(
          'Balance Registrado',
          'Tu balance financiero ha sido registrado exitosamente.',
          [
            {
              text: 'OK',
              onPress: onComplete,
            },
          ]
        );
      } else {
        Alert.alert(
          'Error',
          'Hubo un error al registrar algunos de los balances. Inténtalo de nuevo.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const addRecord = () => {
    if (records.length < 5) {
      const newRecord = BalanceService.createSmartEmptyRecord(difference);
      setRecords([...records, newRecord]);
    }
  };

  const updateRecord = (updatedRecord: BalanceRecord) => {
    setRecords(records.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ));
  };

  const deleteRecord = (recordId: string) => {
    setRecords(records.filter(record => record.id !== recordId));
  };

  const goBack = () => {
    if (currentStep === 1) {
      onComplete();
    } else {
      // Animación de transición al paso anterior
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(1);
        // Restaurar animaciones
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentStep === 1 ? 'Registrar Balance' : 'Detalle de Diferencia'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 ? (
          // Paso 1: Ingreso del monto actual
          <Animated.View 
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.stepTitle}>Ingresa tu monto actual</Text>
            <Text style={styles.stepDescription}>
              Ingresa el monto total actual de tu cuenta o cartera
            </Text>

            <View style={styles.inputContainer}>
              <Input
                label="Monto Actual"
                placeholder="$0"
                value={currentAmount}
                onChangeText={setCurrentAmount}
                keyboardType="numeric"
                error={amountError}
                currencyFormat={true}
                autoFocus={true}  // ✅ Auto-focus al abrir
              />
            </View>

            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Balance registrado en la base de datos:</Text>
              <Text style={styles.balanceValue}>{formatChileanPeso(currentBalance)}</Text>
            </View>

            <Button
              title="Siguiente"
              onPress={handleNext}
              disabled={!currentAmount || parseFloat(currentAmount) <= 0}
              style={styles.nextButton}
            />
          </Animated.View>
        ) : (
          // Paso 2: Detalle de la diferencia
          <Animated.View 
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.stepTitle}>Detalle de Diferencia</Text>
            
            <View style={styles.differenceCard}>
              <Text style={styles.differenceLabel}>Monto a detallar:</Text>
              <Text style={styles.differenceValue}>
                {formatChileanPeso(Math.abs(difference))}
              </Text>
              <Text style={styles.differenceDescription}>
                {difference > 0 
                  ? 'Diferencia positiva - necesitas registrar ingresos'
                  : 'Diferencia negativa - necesitas registrar gastos'
                }
              </Text>
            </View>

            <View style={styles.recordsSection}>
              <View style={styles.recordsHeader}>
                <Text style={styles.recordsTitle}>Registros ({records.length}/5)</Text>
                {records.length < 5 && (
                  <TouchableOpacity style={styles.addButton} onPress={addRecord}>
                    <Ionicons name="add" size={20} color={COLORS.white} />
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </TouchableOpacity>
                )}
              </View>

              {records.map((record) => (
                <BalanceRecordItem
                  key={record.id}
                  record={record}
                  onUpdate={updateRecord}
                  onDelete={() => deleteRecord(record.id)}
                  canDelete={records.length > 1}
                />
              ))}

              {recordsError && (
                <Text style={styles.recordsErrorText}>{recordsError}</Text>
              )}
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumen</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total registros:</Text>
                <Text style={styles.summaryValue}>
                  {formatChileanPeso(absoluteTotalRecords)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Impacto neto:</Text>
                <Text style={[
                  styles.summaryValue,
                  totalRecords >= 0 ? styles.positiveValue : styles.negativeValue
                ]}>
                  {formatChileanPeso(totalRecords)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Diferencia requerida:</Text>
                <Text style={styles.summaryValue}>
                  {formatChileanPeso(difference)}
                </Text>
              </View>
              <View style={[
                styles.summaryRow,
                Math.abs(totalRecords - difference) > 0.01 && styles.summaryRowError
              ]}>
                <Text style={styles.summaryLabel}>Estado:</Text>
                <Text style={[
                  styles.summaryValue,
                  Math.abs(totalRecords - difference) > 0.01 && styles.summaryValueError
                ]}>
                  {Math.abs(totalRecords - difference) <= 0.01 ? '✓ Correcto' : '✗ Ajustar valores'}
                </Text>
              </View>
            </View>

          </Animated.View>
        )}
      </ScrollView>

      {/* ✅ Botón sticky siempre visible en paso 2 */}
      {currentStep === 2 && (
        <View style={styles.stickyButtonContainer}>
          <Button
            title="Registrar"
            onPress={handleRegister}
            disabled={records.length === 0 || Math.abs(totalRecords - difference) > 0.01 || loading}
            loading={loading}
            size="large"
          />
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: SIZES.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
  },
  scrollContentContainer: {
    paddingBottom: 120,  // ✅ Espacio para botón sticky
  },
  stepContainer: {
    flex: 1,
  },
  // ✅ Botón sticky siempre visible
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.md,
    paddingBottom: Platform.OS === 'ios' ? SIZES.xl : SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.xl,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  balanceInfo: {
    backgroundColor: COLORS.blue[50],
    padding: SIZES.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SIZES.xl,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xs,
  },
  balanceValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  nextButton: {
    marginTop: SIZES.xl,
  },
  differenceCard: {
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SIZES.xl,
    alignItems: 'center',
  },
  differenceLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  differenceValue: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  differenceDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  recordsSection: {
    marginBottom: SIZES.xl,
  },
  recordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  recordsTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  addButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    marginLeft: SIZES.xs,
  },
  recordsErrorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SIZES.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  summaryRowError: {
    backgroundColor: COLORS.danger + '10',
    padding: SIZES.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: -SIZES.sm,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  summaryValueError: {
    color: COLORS.danger,
  },
  positiveValue: {
    color: COLORS.success || '#22c55e',
  },
  negativeValue: {
    color: COLORS.danger,
  },
  registerButton: {
    marginTop: SIZES.lg,
  },
});

export default BalanceRegistrationScreen;
