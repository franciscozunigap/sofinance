export const COLORS = {
  // Paleta de colores específica para CRM/gestión
  // Colores de Base (60% - Dominante)
  light: '#F2F2F2', // Blanco Roto - Principal para fondos
  dark: '#212226', // Negro Suave - Principal para textos
  
  // Color Primario (30% - Secundario)
  primary: '#858BF2', // Azul Suave - Elementos principales
  primaryIntense: '#1B3BF2', // Azul Intenso - Botones CTA
  
  // Colores de Acento y Semánticos (10% - Acentos)
  danger: '#F20505', // Rojo Vibrante - Estados de error/alertas
  success: '#27ae60', // Verde para éxito
  warning: '#f39c12', // Amarillo para advertencias
  
  // Colores de soporte
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280', // Gris medio para textos secundarios
  lightGray: '#e5e7eb', // Gris claro para bordes y fondos
  error: '#F20505', // Rojo para errores (alias de danger)
  
  // Escalas de azul basadas en el primario
  blue: {
    50: '#f0f2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#858BF2', // Color primario
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  
  // Escala de grises basada en la paleta
  grayScale: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Colores semánticos específicos
  semantic: {
    error: '#F20505', // Rojo vibrante para errores
    success: '#27ae60', // Verde para éxito
    warning: '#f39c12', // Amarillo para advertencias
    info: '#1B3BF2', // Azul intenso para información
  }
} as const;

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;
