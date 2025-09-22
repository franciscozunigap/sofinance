import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAvoidingView, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS, FINANCIAL_PROFILE_TAGS, getTagsByCategory } from '../constants';
import { validatePassword } from '../utils';
import { OnboardingData, FinancialProfileTag } from '../types';
import { User } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingStep3Props {
  data: Partial<OnboardingData>;
  onComplete: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ data, onComplete, onBack }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(data.financialProfile || []);
  const [errors, setErrors] = useState<{ financialProfile?: string }>({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const validateForm = (): boolean => {
    const newErrors: { financialProfile?: string } = {};

    if (selectedTags.length === 0) {
      newErrors.financialProfile = 'Selecciona al menos una característica de tu perfil financiero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (!validateForm()) return;

    onComplete({
      financialProfile: selectedTags,
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const isTagSelected = (tagId: string) => selectedTags.includes(tagId);

  React.useEffect(() => {
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
            {/* Header con diseño moderno */}
            <View style={styles.header}>
              <View style={styles.stepIndicator}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>3</Text>
                </View>
                <Text style={styles.stepText}>de 3</Text>
              </View>
              <Text style={styles.title}>Perfil Financiero</Text>
              <Text style={styles.subtitle}>
                Cuéntanos sobre tus hábitos financieros para personalizar tu experiencia
              </Text>
            </View>
            
            {/* Formulario principal */}
            <View style={styles.formContainer}>
              {/* Sección de perfil financiero */}
              <View style={styles.profileSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconContainer}>
                    <User size={20} color={COLORS.primary} />
                  </View>
                  <Text style={styles.sectionTitle}>Perfil Financiero</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Selecciona las características que mejor te describan
                </Text>
                
                {/* Etiquetas por categoría */}
                {['gastos', 'ingresos', 'activos', 'responsabilidades'].map(category => {
                  const categoryTags = getTagsByCategory(category as FinancialProfileTag['category']);
                  const categoryLabels = {
                    gastos: 'Gastos',
                    ingresos: 'Ingresos', 
                    activos: 'Activos',
                    responsabilidades: 'Responsabilidades'
                  };
                  
                  return (
                    <View key={category} style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>{categoryLabels[category as keyof typeof categoryLabels]}</Text>
                      <View style={styles.tagsContainer}>
                        {categoryTags.map(tag => (
                          <TouchableOpacity
                            key={tag.id}
                            style={[
                              styles.tag,
                              isTagSelected(tag.id) && styles.tagSelected
                            ]}
                            onPress={() => toggleTag(tag.id)}
                          >
                            <Text style={styles.tagIcon}>{tag.icon}</Text>
                            <Text style={[
                              styles.tagText,
                              isTagSelected(tag.id) && styles.tagTextSelected
                            ]}>
                              {tag.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
                
                {errors.financialProfile && (
                  <Text style={styles.errorText}>{errors.financialProfile}</Text>
                )}
              </View>
              
              {/* Botones */}
              <View style={styles.buttonContainer}>
                {onBack && (
                  <Button
                    title="Atrás"
                    onPress={onBack}
                    variant="secondary"
                    style={[styles.button, styles.backButton]}
                  />
                )}
                <Button
                  title="Continuar"
                  onPress={handleComplete}
                  style={[styles.button, styles.completeButton]}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light, // Blanco Roto
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  content: {
    flex: 1,
    padding: SIZES.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff', // primary-50
    borderWidth: 2,
    borderColor: '#3b82f6', // primary-500
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  stepNumber: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#3b82f6', // primary-500
  },
  stepText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#3b82f6', // primary-500
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    color: COLORS.dark, // Negro Suave
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SIZES.sm,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.xl,
    shadowColor: COLORS.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  form: {
    width: '100%',
    marginBottom: SIZES.xl,
  },
  profileSection: {
    marginBottom: SIZES.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SIZES.lg,
    lineHeight: 20,
  },
  categorySection: {
    marginBottom: SIZES.lg,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginBottom: SIZES.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.grayScale[100],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grayScale[300],
    marginBottom: SIZES.xs,
  },
  tagSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagIcon: {
    fontSize: 16,
    marginRight: SIZES.xs,
  },
  tagText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
  },
  tagTextSelected: {
    color: COLORS.white,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
  },
  backButton: {
    backgroundColor: COLORS.grayScale[200],
  },
  completeButton: {
    backgroundColor: '#3b82f6', // primary-500
  },
});

export default OnboardingStep3;
