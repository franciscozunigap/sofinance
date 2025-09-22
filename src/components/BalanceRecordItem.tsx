import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import Input from './Input';
import CategorySelector from './CategorySelector';
import { BalanceRecord, BalanceCategory } from '../types';
import { formatChileanPeso } from '../utils/currencyUtils';

interface BalanceRecordItemProps {
  record: BalanceRecord;
  onUpdate: (record: BalanceRecord) => void;
  onDelete: () => void;
  canDelete: boolean;
  error?: string;
}

const BalanceRecordItem: React.FC<BalanceRecordItemProps> = ({
  record,
  onUpdate,
  onDelete,
  canDelete,
  error,
}) => {
  const [amount, setAmount] = useState(record.amount.toString());
  const [category, setCategory] = useState<BalanceCategory | null>(record.category);
  const [amountError, setAmountError] = useState<string | undefined>();

  const handleAmountChange = (text: string) => {
    // El componente Input ya maneja el formateo de moneda
    setAmount(text);
    
    // Validar que sea un número válido
    const numericValue = parseFloat(text);
    if (text && (isNaN(numericValue) || numericValue <= 0)) {
      setAmountError('Ingresa un monto válido');
    } else {
      setAmountError(undefined);
      onUpdate({
        ...record,
        amount: numericValue || 0,
      });
    }
  };

  const handleCategoryChange = (newCategory: BalanceCategory) => {
    setCategory(newCategory);
    onUpdate({
      ...record,
      category: newCategory,
    });
  };

  return (
    <View style={[styles.container, error && styles.containerError]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Registro</Text>
          {record.amount > 0 && (
            <Text style={styles.amountPreview}>
              {formatChileanPeso(record.amount)}
            </Text>
          )}
        </View>
        {canDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={24} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.inputRow}>
          <View style={styles.amountContainer}>
            <Text style={styles.fieldLabel}>Monto</Text>
            <Input
              placeholder="$0"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              error={amountError}
              currencyFormat={true}
            />
          </View>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.fieldLabel}>Categoría</Text>
            <CategorySelector
              selectedCategory={category}
              onCategorySelect={handleCategoryChange}
              showLabel={false}
            />
          </View>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerError: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginRight: SIZES.sm,
  },
  amountPreview: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  deleteButton: {
    padding: SIZES.xs,
  },
  content: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    alignItems: 'flex-start',
  },
  amountContainer: {
    flex: 1,
    marginBottom: 0,
  },
  categoryContainer: {
    flex: 1,
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginBottom: SIZES.xs,
    marginLeft: SIZES.xs,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
    marginTop: SIZES.xs,
  },
});

export default BalanceRecordItem;
