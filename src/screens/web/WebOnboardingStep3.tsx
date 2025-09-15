import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { validatePassword } from '../../utils';

interface WebOnboardingStep3Props {
  data: Partial<OnboardingData>;
  onComplete: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
  loading?: boolean;
}

const WebOnboardingStep3: React.FC<WebOnboardingStep3Props> = ({ data, onComplete, onBack, loading = false }) => {
  const [password, setPassword] = useState(data.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (!validateForm()) return;

    onComplete({
      password: password.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-400">3</span>
            </div>
            <h2 className="text-3xl font-bold text-dark mb-2">Crea tu contraseña</h2>
            <p className="text-gray-600">
              Protege tu cuenta con una contraseña segura
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Consejos de contraseña */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Consejos para una contraseña segura:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Usa al menos 6 caracteres</li>
                <li>• Combina letras y números</li>
                <li>• Evita información personal</li>
                <li>• No la compartas con nadie</li>
              </ul>
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
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebOnboardingStep3;
