import React from 'react';
import { Home, BarChart3, MessageCircle } from 'lucide-react';

interface FloatingNavigationPanelProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const FloatingNavigationPanel: React.FC<FloatingNavigationPanelProps> = ({
  currentView,
  onViewChange
}) => {
  const navigationItems = [
    {
      id: 'finance',
      label: 'Finance',
      icon: Home,
      description: 'Dashboard principal'
    },
    {
      id: 'analysis',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Dashboard detallado'
    },
    {
      id: 'sofia',
      label: 'SofIA',
      icon: MessageCircle,
      description: 'Chat con IA'
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-2xl px-6 py-4 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-center space-x-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  // Navegación inmediata de un solo clic
                  onViewChange(item.id);
                }}
                className={`
                  floating-nav-item relative flex flex-col items-center justify-center p-2 rounded-lg group cursor-pointer min-w-[60px]
                  ${isActive ? 'active bg-blue-500/70 text-white shadow-lg' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50/50'}
                `}
                title={item.description}
                type="button"
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className={`text-xs font-medium mt-1 transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'}`}>
                  {item.label}
                </span>
                
                {/* Indicador de activo */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400/80 rounded-full animate-pulse" />
                )}
                
                {/* Efecto de hover */}
                <div className={`
                  absolute inset-0 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/70 to-blue-600/70' 
                    : 'bg-gradient-to-r from-blue-50/50 to-blue-100/50 opacity-0 group-hover:opacity-100'
                  }
                `} />
              </button>
            );
          })}
        </div>
        
        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400/60 to-blue-400/60 rounded-full -translate-y-1" />
      </div>
    </div>
  );
};

export default FloatingNavigationPanel;
