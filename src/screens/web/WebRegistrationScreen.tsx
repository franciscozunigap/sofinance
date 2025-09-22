import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { User } from '../../types';
import logo from '../../../assets/logo.png';

interface WebRegistrationScreenProps {
  onRegistrationSuccess: (user: User) => void;
  onShowLogin: () => void;
  onShowOnboarding?: () => void;
}

const WebRegistrationScreen: React.FC<WebRegistrationScreenProps> = ({ onRegistrationSuccess, onShowLogin, onShowOnboarding }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const user = await AuthService.register({
        email: formData.email,
        password: formData.password,
        firstName: firstName || '',
        lastName: lastName || ''
      });
      
      onRegistrationSuccess(user);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Error: El correo electrónico ya está en uso.');
      } else {
        alert(`Error al crear la cuenta: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 mb-6 flex items-center justify-center">
            <img 
              src={logo} 
              alt="SoFinance Logo" 
              className="w-16 h-16 object-cover rounded-3xl shadow-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-dark">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">Únete a SoFinance y toma control de tus finanzas</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegistration(); }}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
                    errors.name ? 'border-danger' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-danger">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
                    errors.email ? 'border-danger' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-danger">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
                    errors.password ? 'border-danger' : 'border-gray-300'
                  }`}
                  placeholder="Crea una contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-danger">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
                    errors.confirmPassword ? 'border-danger' : 'border-gray-300'
                  }`}
                  placeholder="Confirma tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </div>

            <div className="text-center space-y-3">
              {onShowOnboarding && (
                <button
                  type="button"
                  onClick={onShowOnboarding}
                  className="w-full bg-gradient-to-r from-primary-400 to-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-500 hover:to-primary-700 transition-all duration-200 shadow-md"
                >
                  Configuración completa paso a paso
                </button>
              )}
              <button
                type="button"
                onClick={onShowLogin}
                className="text-primary-400 hover:text-primary-500 text-sm font-medium flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebRegistrationScreen;
