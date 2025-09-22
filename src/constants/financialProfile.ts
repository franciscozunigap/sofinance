import { FinancialProfileTag } from '../types';

export const FINANCIAL_PROFILE_TAGS: FinancialProfileTag[] = [
  // Gastos
  { id: 'compro_cafe', label: 'Compro café', category: 'gastos', icon: '☕' },
  { id: 'pago_dividendo', label: 'Pago dividendo', category: 'responsabilidades', icon: '🏠' },
  { id: 'tengo_vehiculo', label: 'Tengo vehículo', category: 'activos', icon: '🚗' },
  { id: 'tengo_casa', label: 'Tengo casa propia', category: 'activos', icon: '🏠' },
  { id: 'tengo_disponibles', label: 'Tengo disponibles', category: 'activos', icon: '💰' },
  { id: 'tengo_inversiones_activas', label: 'Tengo inversiones activas', category: 'activos', icon: '📊' },
  { id: 'tengo_oro', label: 'Tengo oro/metales preciosos', category: 'activos', icon: '🥇' },
  { id: 'pago_arriendo', label: 'Pago arriendo', category: 'responsabilidades', icon: '🏡' },
  { id: 'pago_creditos', label: 'Pago créditos', category: 'responsabilidades', icon: '💳' },
  { id: 'pago_seguros', label: 'Pago seguros', category: 'responsabilidades', icon: '🛡️' },
  { id: 'pago_servicios', label: 'Pago servicios básicos', category: 'responsabilidades', icon: '⚡' },
  { id: 'pago_educacion', label: 'Pago educación', category: 'responsabilidades', icon: '🎓' },
  { id: 'compro_ropa', label: 'Compro ropa frecuentemente', category: 'gastos', icon: '👕' },
  { id: 'salgo_comer', label: 'Salgo a comer fuera', category: 'gastos', icon: '🍽️' },
  { id: 'tengo_mascota', label: 'Tengo mascota', category: 'gastos', icon: '🐕' },
  { id: 'pago_gym', label: 'Pago gimnasio', category: 'gastos', icon: '💪' },
  { id: 'tengo_netflix', label: 'Tengo Netflix/streaming', category: 'gastos', icon: '📺' },
  { id: 'compro_tecnologia', label: 'Compro tecnología', category: 'gastos', icon: '📱' },
  
  // Ingresos
  { id: 'trabajo_remoto', label: 'Trabajo remoto', category: 'ingresos', icon: '💻' },
  { id: 'tengo_negocio', label: 'Tengo negocio propio', category: 'ingresos', icon: '🏪' },
  { id: 'tengo_inversiones', label: 'Tengo inversiones', category: 'ingresos', icon: '📈' },
  { id: 'recibo_bonus', label: 'Recibo bonos', category: 'ingresos', icon: '💰' },
  { id: 'trabajo_extra', label: 'Hago trabajos extra', category: 'ingresos', icon: '⚡' }
];

export const getTagsByCategory = (category: FinancialProfileTag['category']) => {
  return FINANCIAL_PROFILE_TAGS.filter(tag => tag.category === category);
};
