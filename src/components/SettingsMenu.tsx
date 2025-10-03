import React, { useRef, useEffect, useState } from 'react';
import { X, HelpCircle, LogOut, Mail } from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user?: {
    name?: string;
    email?: string;
  } | null;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, onLogout, user }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('francisco.zunigap@usm.cl');
    alert('Correo copiado al portapapeles');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Menu Principal */}
      <div className="fixed inset-0 z-50 flex items-start justify-end pt-12 pr-3">
        <div 
          ref={menuRef}
          className="settings-menu rounded-xl w-72 overflow-hidden shadow-xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}
        >
          {/* Header con Info del Usuario */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">Mi Cuenta</h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            {/* User Info Destacada */}
            {user && (
              <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-sm font-semibold text-gray-900 mb-1">{user.name || 'Usuario'}</p>
                <p className="text-xs text-gray-600">{user.email || 'usuario@ejemplo.com'}</p>
              </div>
            )}
          </div>

          {/* Menu Items Simplificado */}
          <div className="p-2">
            {/* Ayuda */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-all duration-200 group"
            >
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <HelpCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ayuda</p>
                <p className="text-xs text-gray-500">Contacta con soporte</p>
              </div>
            </button>

            {/* Cerrar Sesión */}
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">Cerrar Sesión</p>
                <p className="text-xs text-red-400">Salir de tu cuenta</p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              SoFinance v1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Ayuda */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowHelpModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
              <p className="text-gray-600">Contáctanos para cualquier consulta o soporte</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Correo de contacto:</p>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200">
                <a 
                  href="mailto:francisco.zunigap@usm.cl"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex-1"
                >
                  francisco.zunigap@usm.cl
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="ml-2 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copiar correo"
                >
                  <Mail className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowHelpModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <a
                href="mailto:francisco.zunigap@usm.cl"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsMenu;
