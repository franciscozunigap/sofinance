import React, { useState } from 'react';
import { OnboardingData, FinancialProfileTag } from '../../types';
import { validatePassword } from '../../utils';
import { FINANCIAL_PROFILE_TAGS, getTagsByCategory } from '../../constants';

interface WebOnboardingStep3Props {
  data: Partial<OnboardingData>;
  onComplete: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
  loading?: boolean;
}

const WebOnboardingStep3: React.FC<WebOnboardingStep3Props> = ({ data, onComplete, onBack, loading = false }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(data.financialProfile || []);
  const [errors, setErrors] = useState<{ financialProfile?: string }>({});

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 border-2 border-blue-500">
              <span className="text-2xl font-bold text-blue-500">3</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Perfil Financiero</h2>
            <p className="text-gray-600">
              Cuéntanos sobre tus hábitos financieros para personalizar tu experiencia
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Sección de perfil financiero */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">👤 Perfil Financiero</h3>
              <p className="text-sm text-gray-600 mb-6">
                Selecciona las características que mejor te describan
              </p>
              
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
                  <div key={category} className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            isTagSelected(tag.id)
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                          }`}
                        >
                          <span className="mr-2">{tag.icon}</span>
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {errors.financialProfile && (
                <p className="mt-2 text-sm text-red-600">{errors.financialProfile}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              {onBack && (
                <button
                  onClick={onBack}
                  disabled={loading}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Atrás
                </button>
              )}
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Continuando...' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebOnboardingStep3;
