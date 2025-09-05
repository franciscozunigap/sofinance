# 💰 SoFinance - Aplicación de Finanzas Personales

Una aplicación móvil moderna y optimizada para la gestión de finanzas personales, desarrollada con React Native y Expo.

## 🚀 Características

- **📱 Multiplataforma**: iOS y Android con diseño nativo
- **🔐 Autenticación**: Sistema de login seguro con validación en tiempo real
- **📊 Dashboard**: Resumen financiero interactivo con animaciones
- **💰 Gestión de Transacciones**: Ingresos y gastos con visualizaciones atractivas
- **🎨 UI/UX Premium**: Diseño moderno con animaciones y micro-interacciones
- **⚡ Rendimiento**: Código optimizado y escalable
- **🔧 TypeScript**: Tipado estático para mayor confiabilidad
- **✨ Animaciones**: Transiciones suaves y feedback visual
- **🎯 Accesibilidad**: Diseño intuitivo y fácil de usar

## 🛠️ Tecnologías

- **React Native** 0.76.9
- **Expo** 52.0.0
- **TypeScript** 5.8.3
- **React** 18.3.1
- **React Native Safe Area Context** 4.12.0

## 📁 Estructura del Proyecto

```
sofinance/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── FinancialCard.tsx
│   ├── screens/             # Pantallas de la aplicación
│   │   ├── LoginScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── services/            # Servicios (API, autenticación)
│   │   ├── authService.ts
│   │   └── financialService.ts
│   ├── utils/               # Utilidades y helpers
│   │   └── index.ts
│   ├── types/               # Tipos de TypeScript
│   │   └── index.ts
│   ├── constants/           # Constantes y configuración
│   │   └── index.ts
│   └── navigation/          # Navegación (preparado para futuro)
├── assets/                  # Recursos de la aplicación
├── app.json                 # Configuración de Expo
├── package.json             # Dependencias del proyecto
├── tsconfig.json            # Configuración de TypeScript
├── babel.config.js          # Configuración de Babel
└── metro.config.js          # Configuración de Metro
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Expo CLI** (se instala automáticamente)
- **Expo Go** (aplicación móvil para probar)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd sofinance
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # o
   npx expo start
   ```

## 📱 Ejecutar la Aplicación

### iOS
```bash
npm run ios
# o
npx expo start --ios
```

### Android
```bash
npm run android
# o
npx expo start --android
```

### Expo Go
1. Instala **Expo Go** en tu dispositivo móvil
2. Escanea el código QR que aparece en la terminal
3. La aplicación se abrirá automáticamente

## 🔐 Credenciales de Acceso

La aplicación utiliza un **sistema de login de demostración** que acepta cualquier credencial válida:

### Credenciales de Ejemplo
- **Email**: `usuario@ejemplo.com`
- **Contraseña**: `123456`

### Validaciones
- ✅ **Email**: Debe tener formato válido (ejemplo@dominio.com)
- ✅ **Contraseña**: Mínimo 6 caracteres
- ✅ **Cualquier combinación** que cumpla estos requisitos funcionará

## 🎨 Sistema de Diseño

### Colores
- **Primario**: #3498db (Azul)
- **Secundario**: #2c3e50 (Azul oscuro)
- **Éxito**: #27ae60 (Verde)
- **Peligro**: #e74c3c (Rojo)
- **Advertencia**: #f39c12 (Naranja)

### Tipografía
- **Regular**: System
- **Medium**: System
- **Bold**: System

### Espaciado
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 40px

## 🔧 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en iOS
npm run ios

# Ejecutar en Android
npm run android

# Verificar configuración
npx expo-doctor

# Limpiar cache
npx expo start --clear
```

## 📊 Funcionalidades

### 🎨 Pantalla de Login
- **Logo animado** con círculo y sombra
- **Animaciones de entrada** suaves (fade + slide)
- **Validación en tiempo real** con feedback visual
- **Estados de éxito/error** con iconos
- **KeyboardAvoidingView** optimizado para iOS/Android
- **Diseño responsivo** y accesible

### 📊 Dashboard Interactivo
- **Tarjeta de bienvenida** personalizada
- **Resumen financiero** con indicadores visuales
- **Badge de estado** (Positivo/Negativo)
- **Botones de acción** con ancho completo
- **Animaciones de entrada** suaves
- **Pull-to-refresh** nativo

### 💳 FinancialCard Mejorado
- **Indicadores visuales** con colores y iconos
- **Resumen del mes** con cálculo automático
- **Cards de ingresos/gastos** con iconos temáticos
- **Estados de salud financiera** claros
- **Diseño moderno** con sombras y bordes redondeados

### 🔘 Componentes Interactivos
- **Botones animados** con feedback táctil
- **Inputs inteligentes** con validación visual
- **Estados de carga** con spinners
- **Transiciones suaves** en todas las interacciones

### 🛠️ Servicios
- **AuthService**: Gestión de autenticación
- **FinancialService**: Gestión de datos financieros
- **Simulación de API** con delays realistas
- **Manejo de errores** robusto

## 🚀 Optimizaciones Implementadas

### 🎨 Mejoras UX/UI
- **Animaciones fluidas** con React Native Animated
- **Micro-interacciones** en botones y inputs
- **Feedback visual** inmediato para el usuario
- **Diseño responsivo** adaptado a iOS y Android
- **Jerarquía visual** clara y consistente
- **Estados de carga** profesionales

### ⚡ Rendimiento
- **Componentes optimizados** con React.memo implícito
- **Callbacks optimizados** con useCallback
- **Estado local optimizado** para mejor rendimiento
- **Imports absolutos** con alias para mejor organización
- **Animaciones nativas** para mejor performance

### 🔧 Código
- **TypeScript estricto** para mayor confiabilidad
- **Estructura escalable** y mantenible
- **Servicios separados** para mejor organización
- **Utilidades reutilizables** y modulares
- **Sistema de constantes** centralizado

### ⚙️ Configuración
- **Babel optimizado** para mejor compilación
- **Metro configurado** para desarrollo eficiente
- **Paths absolutos** configurados
- **Dependencias actualizadas** a las últimas versiones
- **Expo Doctor** validado sin errores

## 🐛 Solución de Problemas

### Error de Babel
Si encuentras errores relacionados con `react-native-reanimated/plugin`, verifica que el archivo `babel.config.js` no incluya plugins no instalados.

### Puerto en Uso
Si el puerto 8081 está ocupado, Expo automáticamente usará el puerto 8082.

### Cache
Si tienes problemas de cache, ejecuta:
```bash
npx expo start --clear
```

## 📝 Próximas Funcionalidades

- [ ] **Navegación completa** entre pantallas
- [ ] **Gestión de transacciones** con CRUD completo
- [ ] **Categorías personalizables** para ingresos y gastos
- [ ] **Gráficos interactivos** y estadísticas avanzadas
- [ ] **Exportar datos** en PDF y Excel
- [ ] **Notificaciones push** para recordatorios
- [ ] **Sincronización en la nube** con Firebase
- [ ] **Modo oscuro** para mejor experiencia nocturna
- [ ] **Widgets** para pantalla de inicio
- [ ] **Biometría** para autenticación rápida

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎯 Características Destacadas

### ✨ Experiencia de Usuario Premium
- **Animaciones fluidas** que hacen la app sentir nativa
- **Feedback visual** inmediato en todas las interacciones
- **Diseño intuitivo** que guía al usuario naturalmente
- **Estados de carga** elegantes y profesionales

### 🚀 Tecnología de Vanguardia
- **React Native 0.76.9** con New Architecture
- **Expo 52.0.0** para desarrollo rápido
- **TypeScript** para código robusto y mantenible
- **Animaciones nativas** para mejor rendimiento

### 📱 Multiplataforma Nativa
- **iOS**: Optimizado para iPhone y iPad
- **Android**: Diseño adaptativo para diferentes tamaños
- **Comportamientos específicos** para cada plataforma
- **Iconos adaptativos** y recursos optimizados

## 👨‍💻 Autor

Desarrollado con ❤️ usando React Native y Expo, con enfoque en la experiencia de usuario y el diseño moderno.

---

**¡Disfruta gestionando tus finanzas con SoFinance!** 💰✨

*Una aplicación que combina funcionalidad, belleza y usabilidad en cada detalle.*