import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { User } from '../../types';
import logo from '../../../assets/logo.png';
import { useUser } from '../../contexts/UserContext';

interface WebLoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onShowRegistration: () => void;
}

const WebLoginScreen: React.FC<WebLoginScreenProps> = ({ onLoginSuccess, onShowRegistration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const { setUser } = useUser();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Limpiar errores anteriores
    
    try {
      const firebaseUser = await AuthService.login({ email, password });
      // Convertir FirebaseUser a User personalizado
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
      };
      // Actualizar el contexto del usuario con los datos convertidos
      setUser(user);
      onLoginSuccess(user);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setErrors({ email: 'No existe una cuenta con este email' });
      } else if (error.code === 'auth/wrong-password') {
        setErrors({ password: 'Contraseña incorrecta' });
      } else if (error.code === 'auth/invalid-credential') {
        setErrors({ 
          general: 'Email o contraseña incorrectos'
        });
      } else if (error.code === 'auth/too-many-requests') {
        setErrors({ general: 'Demasiados intentos fallidos. Inténtalo más tarde.' });
      } else if (error.code === 'auth/network-request-failed') {
        setErrors({ general: 'Error de conexión. Verifica tu internet.' });
      } else {
        setErrors({ general: `Error: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 mb-6 bg-light rounded-full shadow-lg overflow-hidden">
                <img 
                  src={logo} 
                  alt="SoFinance Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-bold text-dark">SoFinance</h2>
            </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email || errors.general) {
                      setErrors(prev => ({ ...prev, email: undefined, general: undefined }));
                    }
                  }}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password || errors.general) {
                      setErrors(prev => ({ ...prev, password: undefined, general: undefined }));
                    }
                  }}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
                    errors.password ? 'border-danger' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu contraseña"
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

            {errors.general && (
              <div className="bg-red-50 border border-danger rounded-lg p-3">
                <p className="text-sm text-danger text-center">{errors.general}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-400 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={onShowRegistration}
                className="text-primary-400 hover:text-primary-500 text-sm font-medium"
              >
                ¿No tienes cuenta? Crear cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebLoginScreen;
