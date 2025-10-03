# 🚀 Instrucciones Rápidas - Deploy en Vercel

## ✅ Estado Actual
- ✅ Configuración de Vercel lista
- ✅ Build funcionando correctamente
- ✅ Variables de entorno configuradas localmente

## 🎯 Pasos para Desplegar

### 1. Subir código a GitHub
```bash
git add .
git commit -m "Configurar para despliegue en Vercel"
git push origin main
```

### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Conecta GitHub y selecciona `sofinance`
4. Configuración automática detectada ✅

### 3. Configurar Variables de Entorno
En Vercel Dashboard → Settings → Environment Variables, agrega:

```
PRIVATE_FIREBASE_APIKEY = [tu-api-key]
PRIVATE_FIREBASE_AUTH_DOMAIN = sofinance-eee64.firebaseapp.com
PRIVATE_FIREBASE_PROYECT_ID = sofinance-eee64
PRIVATE_FIREBASE_STORAGE_BUCKET = sofinance-eee64.appspot.com
PRIVATE_FIREBASE_MESSAGING_SENDER_ID = [tu-sender-id]
PRIVATE_FIREBASE_APP_ID = [tu-app-id]
PRIVATE_FIREBASE_MEASUREMENT_ID = [tu-measurement-id]
```

### 4. Desplegar
- Click **"Deploy"**
- Espera 2-3 minutos
- ¡Listo! 🎉

## 🔍 Verificar Despliegue
- URL: `https://sofinance-xxx.vercel.app`
- Login: `demo@sofinance.app` / `Demo123456`

## 📚 Documentación Completa
Ver `DEPLOY_VERCEL.md` para detalles técnicos completos.

---
**¿Problemas?** Ejecuta `npm run verify:deployment` para diagnosticar.
