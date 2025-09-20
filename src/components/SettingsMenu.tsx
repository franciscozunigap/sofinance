import React, { useState, useRef, useEffect } from 'react';
import { Settings, User, Bell, Shield, HelpCircle, LogOut, ChevronDown } from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState<string | null>(null);
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

  const menuItems = [
    {
      id: 'profile',
      title: 'Perfil',
      icon: User,
      description: 'Gestiona tu información personal',
      items: [
        { label: 'Información personal', action: () => console.log('Editar perfil') },
        { label: 'Foto de perfil', action: () => console.log('Cambiar foto') },
        { label: 'Preferencias', action: () => console.log('Preferencias') }
      ]
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: Bell,
      description: 'Configura tus alertas',
      items: [
        { label: 'Alertas de gastos', action: () => console.log('Alertas gastos') },
        { label: 'Recordatorios', action: () => console.log('Recordatorios') },
        { label: 'Resúmenes semanales', action: () => console.log('Resúmenes') }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacidad',
      icon: Shield,
      description: 'Controla tu privacidad',
      items: [
        { label: 'Datos personales', action: () => console.log('Datos personales') },
        { label: 'Compartir información', action: () => console.log('Compartir') },
        { label: 'Eliminar cuenta', action: () => console.log('Eliminar cuenta') }
      ]
    },
    {
      id: 'help',
      title: 'Ayuda',
      icon: HelpCircle,
      description: 'Soporte y ayuda',
      items: [
        { label: 'Centro de ayuda', action: () => console.log('Centro ayuda') },
        { label: 'Contactar soporte', action: () => console.log('Soporte') },
        { label: 'Términos y condiciones', action: () => console.log('Términos') }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-12 pr-3">
      <div 
        ref={menuRef}
        className="settings-menu rounded-xl w-64 max-h-[70vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Configuración</h3>
              <p className="text-xs text-gray-500">Gestiona tu cuenta y preferencias</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-gray-900">{user.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500">{user.email || 'usuario@ejemplo.com'}</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="max-h-72 overflow-y-auto custom-scrollbar">
          {menuItems.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <div key={section.id} className="border-b border-gray-50 last:border-b-0">
                <button
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{section.title}</p>
                        <p className="text-xs text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-3 w-3 text-gray-400 transition-transform ${
                        isActive ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>
                
                {/* Submenu */}
                {isActive && (
                  <div className="bg-gray-50 px-3 pb-3">
                    <div className="space-y-1">
                      {section.items.map((item, index) => (
                        <button
                          key={index}
                          onClick={item.action}
                          className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-white hover:text-blue-600 rounded-md transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer con Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
