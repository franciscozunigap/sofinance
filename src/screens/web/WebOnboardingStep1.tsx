import React, { useState } from 'react';
import { OnboardingData } from '../../types';
import { validateEmail } from '../../utils';

interface WebOnboardingStep1Props {
  data: Partial<OnboardingData>;
  onNext: (stepData: Partial<OnboardingData>) => void;
  onBack?: () => void;
}

const WebOnboardingStep1: React.FC<WebOnboardingStep1Props> = ({ data, onNext, onBack }) => {
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [email, setEmail] = useState(data.email || '');
  const [age, setAge] = useState(data.age?.toString() || '');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string; age?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { firstName?: string; lastName?: string; email?: string; age?: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!age.trim()) {
      newErrors.age = 'La edad es requerida';
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        newErrors.age = 'La edad debe ser entre 18 y 100 años';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    onNext({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      age: parseInt(age),
    });
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-400">1</span>
            </div>
            <h2 className="text-3xl font-bold text-dark mb-2">¡Bienvenido a SoFinance!</h2>
            <p className="text-gray-600">
              Comencemos con algunos datos básicos para personalizar tu experiencia
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-dark mb-2">
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  errors.firstName ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu nombre"
                autoCapitalize="words"
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-danger">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-dark mb-2">
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  errors.lastName ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu apellido"
                autoCapitalize="words"
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-danger">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  errors.email ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu email"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-dark mb-2">
                Edad
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                  errors.age ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu edad"
                min="18"
                max="100"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-danger">{errors.age}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex-1 bg-gray-200 text-dark py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Atrás
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 bg-primary-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-500 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebOnboardingStep1;
