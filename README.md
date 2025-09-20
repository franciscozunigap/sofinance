# 💰 SoFinance - Aplicación de Finanzas Personales Multiplataforma

## Paleta de colores

A partir del código CSS que proporcionaste, la paleta de colores de SoFinance Web incluye los siguientes tonos:

Blanco Roto: #F2F2F2 (Usado para el color de fondo principal y la pista de la barra de desplazamiento).

Negro Suave: #212226 (Usado para el color del texto principal).

Azul Suave: #858BF2 (Usado para el pulgar de la barra de desplazamiento).

Azul Intenso: #1B3BF2 (Usado para el pulgar de la barra de desplazamiento al pasar el cursor sobre él).

Una aplicación moderna y optimizada para la gestión de finanzas personales, desarrollada con **React Native**, **Expo** y **React Native Web** para funcionar en **Web**, **iOS** y **Android** simultáneamente.

## 🚀 Características

- **🌐 Multiplataforma**: Web, iOS y Android con código compartido
- **📱 Mobile First**: Diseño optimizado para móviles con escalabilidad a web
- **🔐 Autenticación**: Sistema de login y registro de 3 pasos
- **📊 Dashboard**: Resumen financiero interactivo con animaciones
- **💰 Gestión de Transacciones**: Ingresos y gastos con visualizaciones
- **🎨 UI/UX Premium**: Diseño moderno con animaciones y micro-interacciones
- **⚡ Hot Reload**: Desarrollo simultáneo en todas las plataformas
- **🔧 TypeScript**: Tipado estático para mayor confiabilidad

## 🛠️ Tecnologías

- **React Native** 0.76.9
- **React Native Web** 0.19.13
- **Expo** 52.0.0
- **TypeScript** 5.8.3
- **React** 18.3.1
- **Webpack** 5.101.3
- **Concurrently** 8.2.2

## 📁 Estructura del Proyecto

```
sofinance/
├── src/                    # Código fuente compartido
│   ├── components/         # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── FinancialCard.tsx
│   ├── screens/           # Pantallas de la aplicación
│   │   ├── LoginScreen.tsx
│   │   ├── RegistrationScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── services/          # Servicios (API, autenticación)
│   │   ├── authService.ts
│   │   └── financialService.ts
│   ├── platform/          # Configuración por plataforma
│   │   ├── index.js       # React Native
│   │   └── index.web.tsx  # React Native Web
│   ├── utils/             # Utilidades y helpers
│   ├── types/             # Tipos de TypeScript
│   └── constants/         # Constantes y configuración
├── web/                   # Configuración web
│   ├── webpack.config.js  # Webpack para web
│   ├── index.html         # HTML de entrada
│   └── styles.css         # Estilos globales
├── scripts/               # Scripts de desarrollo
│   ├── dev-all.js         # Desarrollo completo
│   └── dev-multi.js       # Menú interactivo
├── config/                # Configuraciones
│   └── development.js     # Config de desarrollo
└── assets/                # Recursos de la aplicación
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Expo CLI** (se instala automáticamente)
- **Expo Go** (aplicación móvil para probar)
- **Xcode** (para iOS - opcional)
- **Android Studio** (para Android - opcional)

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

3. **Configurar Firebase (Requerido)**
   ```bash
   # Ejecutar script de configuración interactivo
   npm run setup:firebase
   
   # O configurar manualmente editando:
   # src/firebase/firebaseConfig.ts
   ```
   
   📖 **Ver documentación completa**: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 🔥 Desarrollo Multiplataforma

### **Desarrollo Simultáneo (Recomendado)**

```bash
# Menú interactivo para elegir plataformas
npm run dev:multi

# Desarrollo completo (Web + Mobile)
npm run dev:both

# Desarrollo con concurrently
npm run dev:all
```

### **Desarrollo por Plataforma**

#### **Solo Web**
```bash
npm run web
# Abre http://localhost:3000
```

#### **Solo Mobile (Expo)**
```bash
npm run start
# Abre http://localhost:8081
# Escanea QR con Expo Go
```

#### **iOS Simulator**
```bash
npm run ios
# Abre iOS Simulator automáticamente
```

#### **Android Emulator**
```bash
npm run android
# Abre Android Emulator automáticamente
```

## 📱 Ejecutar la Aplicación

### **Web**
- **URL**: http://localhost:3000
- **Hot Reload**: Automático
- **DevTools**: F12 en navegador

### **Mobile (Expo Go)**
1. Instala **Expo Go** en tu móvil
2. Escanea el QR code desde http://localhost:8081
3. Hot reload automático

### **iOS Simulator**
1. Instala Xcode
2. Abre iOS Simulator
3. Ejecuta `npm run ios`

### **Android Emulator**
1. Instala Android Studio
2. Configura AVD
3. Ejecuta `npm run android`

## 🔐 Autenticación y Base de Datos

### **Firebase Integration**
- **Autenticación**: Email/Password con Firebase Auth
- **Base de Datos**: Firestore para almacenamiento de datos
- **Multiplataforma**: Funciona en Web, iOS y Android
- **Configuración**: Script automático de configuración

### **Credenciales de Prueba**
- **Email**: Cualquier email válido (ej: `usuario@ejemplo.com`)
- **Contraseña**: Mínimo 6 caracteres (ej: `123456`)

### **Registro de Usuario**
- **Paso 1**: Información personal (nombre, apellido, email)
- **Paso 2**: Información financiera (ingresos, objetivos)
- **Paso 3**: Seguridad (contraseña, términos)
- **Almacenamiento**: Datos guardados en Firestore

## 🎨 Sistema de Diseño

### **Colores**
- **Primario**: #3498db (Azul)
- **Secundario**: #2c3e50 (Azul oscuro)
- **Éxito**: #27ae60 (Verde)
- **Peligro**: #e74c3c (Rojo)
- **Advertencia**: #f39c12 (Naranja)

### **Tipografía**
- **Regular**: System
- **Medium**: System
- **Bold**: System

### **Espaciado**
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 40px

## 🔧 Scripts Disponibles

### **Desarrollo**
```bash
npm run web          # Solo web
npm run start        # Solo mobile
npm run dev:both     # Ambos simultáneamente
npm run dev:multi    # Menú interactivo
npm run clean        # Limpiar cache
```

### **Configuración**
```bash
npm run setup:firebase  # Configurar Firebase
npm run test:env        # Probar variables de entorno
npm run test:android    # Probar configuración de Android
```

### **Plataformas Específicas**
```bash
npm run ios          # iOS Simulator
npm run android      # Android Emulator
```

### **Build**
```bash
npm run build:web    # Build web para producción
npm run build:mobile # Build mobile para producción
```

### **Testing**
```bash
npm run test:web     # Probar web
npm run test:mobile  # Probar mobile
```

## 📊 Funcionalidades

### **🔐 Sistema de Autenticación**
- **Login** con validación en tiempo real
- **Registro de 3 pasos** con formulario progresivo
- **Validación de campos** con feedback visual
- **Animaciones suaves** en transiciones

### **📊 Dashboard Interactivo**
- **Resumen financiero** con indicadores visuales
- **Tarjeta de bienvenida** personalizada
- **Badge de estado** (Positivo/Negativo)
- **Botones de acción** con ancho completo
- **Pull-to-refresh** nativo

### **💳 FinancialCard Mejorado**
- **Indicadores visuales** con colores y iconos
- **Resumen del mes** con cálculo automático
- **Cards de ingresos/gastos** con iconos temáticos
- **Estados de salud financiera** claros

### **🔘 Componentes Interactivos**
- **Botones animados** con feedback táctil
- **Inputs inteligentes** con validación visual
- **Estados de carga** con spinners
- **Transiciones suaves** en todas las interacciones

## 🚀 Optimizaciones Implementadas

### **🎨 Mejoras UX/UI**
- **Animaciones fluidas** con React Native Animated
- **Micro-interacciones** en botones y inputs
- **Feedback visual** inmediato para el usuario
- **Diseño responsivo** adaptado a todas las plataformas
- **Jerarquía visual** clara y consistente

### **⚡ Rendimiento**
- **Componentes optimizados** con React.memo implícito
- **Callbacks optimizados** con useCallback
- **Estado local optimizado** para mejor rendimiento
- **Imports absolutos** con alias para mejor organización
- **Animaciones nativas** para mejor performance

### **🌐 Multiplataforma**
- **Código compartido** entre web y mobile
- **Configuración por plataforma** automática
- **Hot reload** en todas las plataformas
- **Desarrollo simultáneo** eficiente

## 🐛 Solución de Problemas

### **Puerto Ocupado**
```bash
# Cambiar puerto web
npm run web -- --port 3001

# Cambiar puerto Expo
npx expo start --port 8082
```

### **Cache Issues**
```bash
# Limpiar todo
npm run clean

# Limpiar solo Expo
npx expo start --clear

# Limpiar solo Webpack
rm -rf dist/
```

### **Problemas de Hot Reload**
```bash
# Reiniciar con cache limpio
npm run clean

# Verificar puertos
lsof -i :3000
lsof -i :8081
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

## 👨‍💻 Autor

Desarrollado con ❤️ usando React Native, Expo y React Native Web, con enfoque en la experiencia de usuario multiplataforma y el diseño moderno.

---

**¡Disfruta gestionando tus finanzas con SoFinance!** 💰✨

*Una aplicación que combina funcionalidad, belleza y usabilidad en cada detalle, funcionando perfectamente en web y mobile.*