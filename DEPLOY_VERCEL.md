# 🚀 Desplegar SoFinance en Vercel

## 📋 Prerrequisitos

1. **Cuenta de Vercel**: Regístrate en [vercel.com](https://vercel.com)
2. **Cuenta de GitHub**: Para conectar el repositorio
3. **Variables de entorno configuradas**: Archivo `.env` con credenciales de Firebase

---

## 🔧 Configuración del Proyecto

### 1. Crear archivo `vercel.json`

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "web/webpack.config.js",
      "use": "@vercel/webpack"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "npm run build:web",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### 2. Crear archivo `.vercelignore`

Crea un archivo `.vercelignore` para excluir archivos innecesarios:

```
node_modules
coverage
android
ios
__tests__
scripts
*.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 3. Verificar scripts de build

Asegúrate de que tu `package.json` tenga el script de build correcto:

```json
{
  "scripts": {
    "build:web": "webpack --config web/webpack.config.js --mode production"
  }
}
```

---

## 🌐 Configuración de Variables de Entorno en Vercel

### 1. Obtener credenciales de Firebase

Si no tienes el archivo `.env`, sigue las instrucciones en `CONFIGURAR_ENV.md` para obtener las credenciales de Firebase.

### 2. Configurar variables en Vercel

En el dashboard de Vercel:

1. Ve a tu proyecto
2. Click en **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```
PRIVATE_FIREBASE_APIKEY = tu-api-key-aqui
PRIVATE_FIREBASE_AUTH_DOMAIN = sofinance-eee64.firebaseapp.com
PRIVATE_FIREBASE_PROYECT_ID = sofinance-eee64
PRIVATE_FIREBASE_STORAGE_BUCKET = sofinance-eee64.appspot.com
PRIVATE_FIREBASE_MESSAGING_SENDER_ID = 123456789
PRIVATE_FIREBASE_APP_ID = 1:123456789:web:abc123
PRIVATE_FIREBASE_MEASUREMENT_ID = G-ABC123
```

**Importante**: Reemplaza los valores con tus credenciales reales de Firebase.

---

## 🚀 Proceso de Despliegue

### Opción 1: Despliegue desde GitHub (Recomendado)

1. **Subir código a GitHub**:
   ```bash
   git add .
   git commit -m "Preparar para despliegue en Vercel"
   git push origin main
   ```

2. **Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Click en **"New Project"**
   - Selecciona **"Import Git Repository"**
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `sofinance`

3. **Configurar el proyecto**:
   - **Framework Preset**: Other
   - **Root Directory**: `/` (raíz del proyecto)
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Configurar variables de entorno**:
   - En la sección "Environment Variables"
   - Agrega todas las variables de Firebase (ver sección anterior)

5. **Desplegar**:
   - Click en **"Deploy"**
   - Espera a que termine el proceso

### Opción 2: Despliegue con Vercel CLI

1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Iniciar sesión**:
   ```bash
   vercel login
   ```

3. **Desplegar**:
   ```bash
   vercel
   ```

4. **Seguir las instrucciones**:
   - ¿Cuál es el directorio de tu proyecto? → `.`
   - ¿Quieres sobrescribir la configuración? → `N`
   - ¿Cuál es el comando de build? → `npm run build:web`
   - ¿Cuál es el directorio de salida? → `dist`

---

## 🔧 Configuración Adicional

### 1. Configurar dominio personalizado (Opcional)

1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

### 2. Configurar redirecciones

Si necesitas redirecciones, agrega en `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### 3. Configurar headers de seguridad

Agrega en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🧪 Verificación Post-Despliegue

### 1. Verificar que la aplicación carga
- Visita la URL proporcionada por Vercel
- Verifica que no hay errores en la consola del navegador

### 2. Verificar conexión con Firebase
- Intenta hacer login con las credenciales de prueba:
  - Email: `demo@sofinance.app`
  - Password: `Demo123456`

### 3. Verificar funcionalidades
- Navegación entre pantallas
- Carga de datos
- Funcionalidad de transacciones

---

## 🐛 Troubleshooting

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` localmente para verificar

### Error: "Environment variables not defined"
- Verifica que las variables estén configuradas en Vercel Dashboard
- Asegúrate de que los nombres coincidan exactamente

### Error: "Build failed"
- Revisa los logs de build en Vercel Dashboard
- Verifica que el comando de build funcione localmente:
  ```bash
  npm run build:web
  ```

### Error: "Firebase connection failed"
- Verifica que las credenciales de Firebase sean correctas
- Asegúrate de que el proyecto de Firebase esté activo
- Verifica que las reglas de Firestore permitan el acceso

---

## 📊 Monitoreo y Analytics

### 1. Vercel Analytics
- Activa Vercel Analytics en el dashboard
- Monitorea el rendimiento y errores

### 2. Firebase Analytics
- Configura Firebase Analytics para tracking de usuarios
- Monitorea eventos personalizados

---

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:

1. **Hacer cambios en el código**
2. **Commit y push a GitHub**:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
3. **Vercel desplegará automáticamente** la nueva versión

---

## ✅ Checklist de Despliegue

- [ ] Archivo `vercel.json` creado
- [ ] Archivo `.vercelignore` creado
- [ ] Variables de entorno configuradas en Vercel
- [ ] Código subido a GitHub
- [ ] Proyecto conectado en Vercel
- [ ] Build exitoso
- [ ] Aplicación accesible en la URL
- [ ] Login con credenciales de prueba funciona
- [ ] Todas las funcionalidades operativas

---

## 🎉 ¡Listo!

Tu aplicación SoFinance debería estar funcionando en Vercel. La URL será algo como:
`https://sofinance-xxx.vercel.app`

**¿Necesitas ayuda?** Revisa los logs de build en Vercel Dashboard o contacta para soporte técnico.
