# 🔧 Configurar Variables de Entorno

## 📋 Paso a Paso

### **1. Obtener Credenciales de Firebase**

Ve a Firebase Console:
https://console.firebase.google.com/project/sofinance-eee64/settings/general

1. En la sección **"Tus apps"**
2. Selecciona tu app web (ícono `</>`Web)
3. Busca **"Configuración de SDK"**
4. Copia los valores del objeto `firebaseConfig`

---

### **2. Crear Archivo `.env`**

En la raíz del proyecto (`/Users/usuario/code/GIT/sofinance/`), crea un archivo llamado `.env`:

```bash
# En la terminal:
touch .env
```

O simplemente créalo con tu editor de código.

---

### **3. Pegar Credenciales**

Abre el archivo `.env` y pega esto (reemplaza con tus valores reales):

```env
# Firebase Web Configuration
PRIVATE_FIREBASE_APIKEY=AIzaSy...tu-api-key-aqui
PRIVATE_FIREBASE_AUTH_DOMAIN=sofinance-eee64.firebaseapp.com
PRIVATE_FIREBASE_PROYECT_ID=sofinance-eee64
PRIVATE_FIREBASE_STORAGE_BUCKET=sofinance-eee64.appspot.com
PRIVATE_FIREBASE_MESSAGING_SENDER_ID=123456789
PRIVATE_FIREBASE_APP_ID=1:123456789:web:abc123
PRIVATE_FIREBASE_MEASUREMENT_ID=G-ABC123

# Firebase iOS Configuration (opcional - mismo que web)
IOS_FIREBASE_APIKEY=AIzaSy...tu-api-key-aqui
IOS_FIREBASE_AUTH_DOMAIN=sofinance-eee64.firebaseapp.com
IOS_FIREBASE_PROYECT_ID=sofinance-eee64
IOS_FIREBASE_STORAGE_BUCKET=sofinance-eee64.appspot.com
IOS_FIREBASE_MESSAGING_SENDER_ID=123456789
IOS_FIREBASE_APP_ID=1:123456789:ios:xyz789
IOS_FIREBASE_MEASUREMENT_ID=G-ABC123

# Firebase Android Configuration (opcional - mismo que web)
ANDROID_FIREBASE_APIKEY=AIzaSy...tu-api-key-aqui
ANDROID_FIREBASE_AUTH_DOMAIN=sofinance-eee64.firebaseapp.com
ANDROID_FIREBASE_PROYECT_ID=sofinance-eee64
ANDROID_FIREBASE_STORAGE_BUCKET=sofinance-eee64.appspot.com
ANDROID_FIREBASE_MESSAGING_SENDER_ID=123456789
ANDROID_FIREBASE_APP_ID=1:123456789:android:def456
ANDROID_FIREBASE_MEASUREMENT_ID=G-ABC123
```

---

### **4. Obtener los Valores Reales**

En Firebase Console, verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...ABC123",                    // ← PRIVATE_FIREBASE_APIKEY
  authDomain: "sofinance-eee64.firebaseapp.com", // ← PRIVATE_FIREBASE_AUTH_DOMAIN
  projectId: "sofinance-eee64",                  // ← PRIVATE_FIREBASE_PROYECT_ID
  storageBucket: "sofinance-eee64.appspot.com",  // ← PRIVATE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",                // ← PRIVATE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123",               // ← PRIVATE_FIREBASE_APP_ID
  measurementId: "G-ABC123"                      // ← PRIVATE_FIREBASE_MEASUREMENT_ID
};
```

**Copia cada valor** y pégalo en tu archivo `.env`.

---

### **5. Verificar**

Tu archivo `.env` debería verse así (con tus valores reales):

```env
PRIVATE_FIREBASE_APIKEY=AIzaSyDxE7F...tu-key-real
PRIVATE_FIREBASE_AUTH_DOMAIN=sofinance-eee64.firebaseapp.com
PRIVATE_FIREBASE_PROYECT_ID=sofinance-eee64
PRIVATE_FIREBASE_STORAGE_BUCKET=sofinance-eee64.appspot.com
PRIVATE_FIREBASE_MESSAGING_SENDER_ID=987654321
PRIVATE_FIREBASE_APP_ID=1:987654321:web:abc123def456
PRIVATE_FIREBASE_MEASUREMENT_ID=G-XYZ123
```

---

### **6. Reiniciar Script**

Ahora ejecuta de nuevo:

```bash
npm run seed:mock
```

Debería funcionar correctamente. ✅

---

## ⚠️ Importante

1. **NO subas `.env` a Git** (ya está en `.gitignore`)
2. **NO compartas** tus credenciales públicamente
3. **Copia valores exactos** de Firebase Console (sin espacios)
4. **Reinicia** la app después de cambiar `.env`

---

## 🔍 Troubleshooting

### **Error: "invalid-api-key"**
- Verifica que copiaste el `apiKey` completo
- No debe tener comillas ni espacios
- Ejemplo correcto: `AIzaSyDxE7F8...`

### **Error: Variables no definidas**
- Asegúrate de que el archivo se llame exactamente `.env` (con el punto al inicio)
- Verifica que esté en la raíz del proyecto
- Reinicia la terminal

### **¿Dónde está mi API Key?**
1. Firebase Console → Project Settings
2. Scroll down a "Your apps"
3. Click en el ícono `</>` (Web)
4. Copia el objeto `firebaseConfig`

---

## ✅ Verificar Configuración

Para verificar que todo está bien:

```bash
node -e "require('dotenv').config(); console.log('API Key:', process.env.PRIVATE_FIREBASE_APIKEY ? '✅ Configurada' : '❌ No configurada')"
```

Deberías ver: `✅ Configurada`

---

**¿Necesitas ayuda?** Avísame y te guío paso a paso. 🚀

