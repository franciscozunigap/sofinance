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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center slide-in-left">
          <div className="mx-auto h-24 w-24 mb-6 flex items-center justify-center">
            <img 
              src={logo} 
              alt="SoFinance Logo" 
              className="w-20 h-20 object-cover rounded-3xl shadow-2xl"
            />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            SoFinance
          </h2>
          <p className="text-gray-600">Gestiona tus finanzas de manera inteligente</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm py-8 px-8 shadow-2xl rounded-3xl border border-white/20 slide-in-right">
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
                  className={`block w-full pl-10 pr-3 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-danger bg-red-50' : 'border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white'
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
                  className={`block w-full pl-10 pr-10 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-danger bg-red-50' : 'border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white'
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
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
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
