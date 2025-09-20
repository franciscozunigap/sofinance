import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, BORDER_RADIUS } from '../constants';
import { BalanceCategory } from '../types';

interface CategorySelectorProps {
  selectedCategory: BalanceCategory | null;
  onCategorySelect: (category: BalanceCategory) => void;
  error?: string;
  showLabel?: boolean;
}

const categories: { value: BalanceCategory; label: string; icon: string; color: string }[] = [
  { value: 'Ingreso', label: 'Ingreso', icon: 'trending-up', color: COLORS.success },
  { value: 'Deuda', label: 'Deuda', icon: 'trending-down', color: COLORS.danger },
  { value: 'Consumo', label: 'Consumo', icon: 'shopping-cart', color: COLORS.warning },
  { value: 'Necesidad', label: 'Necesidad', icon: 'home', color: COLORS.primary },
  { value: 'Inversión', label: 'Inversión', icon: 'trending-up', color: '#8b5cf6' },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  error,
  showLabel = true,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory);

  const handleCategorySelect = (category: BalanceCategory) => {
    onCategorySelect(category);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.selector,
          error && styles.selectorError,
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedCategoryData ? (
            <>
              <View style={[styles.categoryIcon, { backgroundColor: selectedCategoryData.color }]}>
                <Ionicons name={selectedCategoryData.icon as any} size={16} color={COLORS.white} />
              </View>
              <Text style={styles.selectedText}>{selectedCategoryData.label}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>Seleccionar categoría</Text>
          )}
          <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
        </View>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item.value && styles.selectedCategoryItem,
                  ]}
                  onPress={() => handleCategorySelect(item.value)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={16} color={COLORS.white} />
                  </View>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === item.value && styles.selectedCategoryText,
                  ]}>
                    {item.label}
                  </Text>
                  {selectedCategory === item.value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  selector: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    minHeight: 48,
  },
  selectorError: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    flex: 1,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  selectedText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
    marginTop: SIZES.xs,
    marginLeft: SIZES.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    maxHeight: '70%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
  },
  closeButton: {
    padding: SIZES.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.blue[50],
  },
  categoryText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    flex: 1,
    marginLeft: SIZES.sm,
  },
  selectedCategoryText: {
    color: COLORS.primary,
  },
});

export default CategorySelector;
