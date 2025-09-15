/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.tsx",
    "./index.ts",
    "./web/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores específica para CRM/gestión
        primary: {
          50: '#f0f2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#858BF2', // Azul Suave - Color primario
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        primaryIntense: '#1B3BF2', // Azul Intenso - Botones CTA
        light: '#F2F2F2', // Blanco Roto - Principal para fondos
        dark: '#212226', // Negro Suave - Principal para textos
        danger: '#F20505', // Rojo Vibrante - Estados de error
        success: '#27ae60',
        warning: '#f39c12',
        gray: {
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
        }
      },
    },
  },
  plugins: [],
}
