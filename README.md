# 💰 SoFinance - Aplicación de Finanzas Personales

Una aplicación móvil moderna y optimizada para la gestión de finanzas personales, desarrollada con React Native y Expo.

## 🚀 Características

- **📱 Multiplataforma**: iOS y Android
- **🔐 Autenticación**: Sistema de login seguro
- **📊 Dashboard**: Resumen financiero en tiempo real
- **💰 Gestión de Transacciones**: Ingresos y gastos
- **🎨 UI/UX Optimizada**: Diseño moderno y fluido
- **⚡ Rendimiento**: Código optimizado y escalable
- **🔧 TypeScript**: Tipado estático para mayor confiabilidad

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

### Pantalla de Login
- Validación de email y contraseña
- Estados de carga
- Manejo de errores
- KeyboardAvoidingView para mejor UX

### Dashboard
- Resumen financiero con datos reales
- Pull-to-refresh
- Tarjeta financiera optimizada
- Botones de acción

### Servicios
- **AuthService**: Gestión de autenticación
- **FinancialService**: Gestión de datos financieros
- Simulación de llamadas API con delays realistas

## 🚀 Optimizaciones Implementadas

### Rendimiento
- Componentes optimizados con React.memo implícito
- Callbacks optimizados con useCallback
- Estado local optimizado
- Imports absolutos con alias

### Código
- TypeScript estricto
- Estructura de carpetas escalable
- Servicios separados
- Utilidades reutilizables
- Sistema de constantes centralizado

### Configuración
- Babel optimizado
- Metro configurado
- Paths absolutos configurados
- Dependencias actualizadas

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

- [ ] Navegación entre pantallas
- [ ] Gestión de transacciones
- [ ] Categorías personalizables
- [ ] Gráficos y estadísticas
- [ ] Exportar datos
- [ ] Notificaciones
- [ ] Sincronización en la nube

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ usando React Native y Expo.

---

**¡Disfruta gestionando tus finanzas con SoFinance!** 💰✨