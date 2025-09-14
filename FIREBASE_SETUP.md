# Configuración de Firebase para SoFinance

Este documento explica cómo configurar Firebase para que funcione tanto en la versión web como en iOS.

## Pasos para configurar Firebase

### 1. Crear un proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication y Firestore Database

### 2. Configurar Authentication

1. En Firebase Console, ve a Authentication > Sign-in method
2. Habilita "Email/Password" como método de autenticación
3. Configura las reglas de seguridad según necesites

### 3. Configurar Firestore Database

1. En Firebase Console, ve a Firestore Database
2. Crea una base de datos en modo de prueba
3. Configura las reglas de seguridad

### 4. Obtener las credenciales de configuración

#### Para Web:
1. En Firebase Console, ve a Project Settings > General
2. En la sección "Your apps", haz clic en el ícono web
3. Registra tu app web
4. Copia la configuración que aparece

#### Para iOS:
1. En Firebase Console, ve a Project Settings > General
2. En la sección "Your apps", haz clic en el ícono iOS
3. Registra tu app iOS con el bundle ID: `com.sofinance` (o el que uses)
4. Descarga el archivo `GoogleService-Info.plist`
5. Coloca el archivo en `ios/SoFinance/GoogleService-Info.plist`

### 5. Actualizar la configuración en el código

Edita el archivo `src/firebase/firebaseConfig.ts` y reemplaza los valores de ejemplo con tus credenciales reales:

```typescript
export const firebaseConfigs: Record<string, FirebaseConfig> = {
  web: {
    apiKey: "tu-api-key-web",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890",
    measurementId: "G-XXXXXXXXXX"
  },
  
  ios: {
    apiKey: "tu-api-key-ios",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:ios:abcdef1234567890",
    measurementId: "G-XXXXXXXXXX"
  },
  
  android: {
    apiKey: "tu-api-key-android",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:android:abcdef1234567890",
    measurementId: "G-XXXXXXXXXX"
  }
};
```

### 6. Configurar variables de entorno para Web (opcional)

Si prefieres usar variables de entorno para la configuración web, crea un archivo `.env` en la raíz del proyecto:

```env
PRIVATE_FIREBASE_APIKEY=tu-api-key-web
PRIVATE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
PRIVATE_FIREBASE_PROYECT_ID=tu-proyecto-id
PRIVATE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
PRIVATE_FIREBASE_MESSAGING_SENDER_ID=123456789012
PRIVATE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
PRIVATE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 7. Configurar reglas de Firestore

En Firebase Console > Firestore Database > Rules, configura las reglas básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura solo a usuarios autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Verificación

Después de configurar todo:

1. **Para Web**: Ejecuta `npm run web` y verifica que la autenticación funcione
2. **Para iOS**: Ejecuta `npm run ios` y verifica que la autenticación funcione

## Solución de problemas

### Error: "Firebase configuration is incomplete"
- Verifica que todas las credenciales estén correctamente configuradas
- Asegúrate de que el platform sea detectado correctamente (web, ios, android)

### Error: "Firebase app already initialized"
- Esto puede ocurrir si Firebase se inicializa múltiples veces
- Verifica que solo haya una inicialización de Firebase en tu app

### Error de autenticación en iOS
- Verifica que el bundle ID en Firebase Console coincida con el de tu app
- Asegúrate de que el archivo `GoogleService-Info.plist` esté en la ubicación correcta

## Notas de seguridad

- **NUNCA** subas las credenciales de Firebase a un repositorio público
- Usa variables de entorno para la configuración web en producción
- Considera usar Firebase App Check para mayor seguridad
- Revisa regularmente las reglas de seguridad de Firestore
