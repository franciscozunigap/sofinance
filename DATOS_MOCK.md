# 🎭 Datos Mock - SoFinance

## 📊 Cuenta de Prueba con Datos Realistas

Este script genera una cuenta de usuario con **6 meses de transacciones realistas** para testing y demos.

---

## 🚀 Uso Rápido

### **Generar Datos Mock**

```bash
npm run seed:mock
```

Este comando:
1. ✅ Crea un usuario en Firebase Auth
2. ✅ Genera transacciones de los últimos 6 meses
3. ✅ Crea estadísticas mensuales (`monthly_stats`)
4. ✅ Guarda todo en Firestore

---

## 🔐 Credenciales de la Cuenta Demo

```
Email:    demo@sofinance.app
Password: Demo123456
```

**Importante:** Usa estas credenciales para hacer login y ver los datos generados.

---

## 👤 Perfil del Usuario Mock

```javascript
Nombre: Sofia Hernández
Edad: 28 años
Ingreso mensual: $1.500.000 CLP
Ahorro inicial: $800.000 CLP

Distribución de gastos:
- Necesidades: 50%
- Consumo: 30%
- Ahorro: 15%
- Inversión: 5%

Perfil financiero:
- Salario fijo
- Gastos controlados
- Ahorro activo
```

---

## 💰 Tipos de Transacciones Generadas

### **Ingresos** 💵
- Sueldo mensual (95% probabilidad)
- Bono de desempeño (20% probabilidad)
- Freelance (30% probabilidad)
- Venta de productos usados (10% probabilidad)

### **Necesidades** 🏠
- Arriendo: $450.000
- Supermercado: $150.000
- Cuentas básicas: $80.000
- Internet y teléfono: $45.000
- Transporte: $60.000
- Seguro de salud: $70.000
- Medicamentos: $25.000 (ocasional)

### **Consumo** 🎉
- Restaurante: $35.000
- Cine: $12.000
- Ropa: $80.000
- Streaming: $15.000
- Café: $5.000
- Gimnasio: $35.000
- Salidas con amigos: $40.000
- Compras online: $60.000

### **Inversión** 📈
- Fondo mutuo: $50.000
- Acciones: $100.000
- Criptomonedas: $30.000

---

## 📅 Datos Generados

El script genera datos para los **últimos 6 meses**:

```
Mes 1 (6 meses atrás)  →  20-30 transacciones
Mes 2 (5 meses atrás)  →  20-30 transacciones
Mes 3 (4 meses atrás)  →  20-30 transacciones
Mes 4 (3 meses atrás)  →  20-30 transacciones
Mes 5 (2 meses atrás)  →  20-30 transacciones
Mes 6 (mes actual)     →  20-30 transacciones

Total: ~120-180 transacciones
```

---

## 🗄️ Estructura en Firestore

El script crea:

### **1. Usuario**
```
📁 users/{userId}
├── email: "demo@sofinance.app"
├── name: "Sofia"
├── last_name: "Hernández"
├── age: 28
├── wallet: { monthly_income: 1500000, amount: 800000 }
├── preferences: { needs_percent: 50, wants_percent: 30, ... }
└── financial_profile: ["salario_fijo", "gastos_controlados", ...]
```

### **2. Transacciones (120-180 docs)**
```
📁 balance_registrations/{id}
├── userId
├── type: "income" | "expense"
├── description: "Sueldo mensual"
├── amount: 1500000
├── category: "Ingreso" | "Necesidad" | "Consumo" | "Inversión"
├── date: Timestamp
├── balanceAfter: 2300000
├── month: 10
└── year: 2024
```

### **3. Estadísticas Mensuales (6 docs)**
```
📁 monthly_stats/{year-month_userId}
├── userId
├── month: 10
├── year: 2024
├── balance: 1200000
├── totalIncome: 1500000
├── totalExpenses: 1100000
├── percentages: { needs: 50, wants: 28, savings: 18, investment: 4 }
└── variation: { balanceChange: 100000, percentageChange: 9.1, ... }
```

---

## ⚙️ Personalización

### **Cambiar Datos del Usuario**

Edita `scripts/seed-mock-data.js`:

```javascript
const MOCK_USER = {
  email: 'tu-email@ejemplo.com',        // Cambiar email
  password: 'TuPassword123',             // Cambiar password
  firstName: 'Tu Nombre',                // Cambiar nombre
  lastName: 'Tu Apellido',               // Cambiar apellido
  monthlyIncome: 2000000,                // Cambiar ingreso
  currentSavings: 1000000,               // Cambiar ahorro inicial
  // ...
};
```

### **Cambiar Número de Meses**

En la línea 367:

```javascript
// Cambiar de 6 a X meses
for (let i = 5; i >= 0; i--) {  // i = X-1
  // ...
}
```

### **Cambiar Tipos de Transacciones**

Edita el objeto `TRANSACTION_TYPES` en el script:

```javascript
const TRANSACTION_TYPES = {
  income: [
    { description: 'Tu ingreso', category: 'Ingreso', probability: 0.95 },
    // Agregar más...
  ],
  // ...
};
```

---

## 🔄 Ejecutar Múltiples Veces

**Importante:** El script **NO permite** crear el mismo usuario dos veces.

### **Para regenerar datos:**

1. **Opción 1:** Eliminar usuario en Firebase Console
   - Ve a Authentication
   - Busca `demo@sofinance.app`
   - Eliminar usuario
   - Ejecutar `npm run seed:mock` de nuevo

2. **Opción 2:** Cambiar email en el script
   ```javascript
   email: 'demo2@sofinance.app',  // Cambiar
   ```

---

## 🧪 Testing

### **Verificar Datos Generados**

1. **Login en la app:**
   ```bash
   npm run web
   ```

2. **Iniciar sesión:**
   ```
   Email: demo@sofinance.app
   Password: Demo123456
   ```

3. **Verificar:**
   - ✅ Balance actual muestra valor correcto
   - ✅ Gráficos muestran datos de 6 meses
   - ✅ Historial de transacciones tiene ~120-180 registros
   - ✅ Estadísticas mensuales calculadas correctamente

### **Verificar en Firebase Console**

Ve a: https://console.firebase.google.com/project/sofinance-eee64/firestore

1. **Colección `users`:**
   - Busca el documento con email `demo@sofinance.app`

2. **Colección `balance_registrations`:**
   - Debería tener ~120-180 documentos
   - Filtrar por `userId`

3. **Colección `monthly_stats`:**
   - Debería tener 6 documentos
   - Formato: `2024-10_{userId}`, `2024-09_{userId}`, etc.

---

## 📊 Ejemplo de Output

```bash
$ npm run seed:mock

🚀 Iniciando generación de datos mock...

1️⃣ Creando usuario de prueba...
   Email: demo@sofinance.app
   Password: Demo123456

✅ Usuario creado en Firebase Auth

👤 User ID: abc123xyz789

✅ Usuario guardado

2️⃣ Generando transacciones de los últimos 6 meses...

📅 Mes 5/2024:
   - 24 transacciones generadas
   - Balance: $1.150.000
   - Ingresos: $1.500.000
   - Gastos: $1.150.000

📅 Mes 6/2024:
   - 26 transacciones generadas
   - Balance: $1.280.000
   - Ingresos: $1.500.000
   - Gastos: $1.370.000

...

3️⃣ Guardando datos en Firebase...

💾 Guardando 156 transacciones...
✅ Transacciones guardadas

📊 Guardando estadísticas de 5/2024...
✅ Estadísticas guardadas

...

✅ ¡Datos mock generados exitosamente!

📊 RESUMEN:
════════════════════════════════════════
👤 Usuario: Sofia Hernández
📧 Email: demo@sofinance.app
🔑 Password: Demo123456
💰 Balance inicial: $800.000
💰 Balance final: $1.280.000
📈 Transacciones totales: 156
📊 Meses generados: 6
════════════════════════════════════════

🎉 Puedes iniciar sesión con:
   Email: demo@sofinance.app
   Password: Demo123456
```

---

## ⚠️ Notas Importantes

1. **Variables de entorno:** Asegúrate de que tu archivo `.env` esté configurado con las credenciales de Firebase.

2. **Índices requeridos:** El script requiere que los índices estén desplegados (`npm run firebase:indexes`).

3. **Usuario único:** No puedes ejecutar el script dos veces con el mismo email.

4. **Datos realistas:** Las transacciones tienen variación aleatoria del 15-30% para simular la realidad.

5. **Fechas aleatorias:** Las transacciones se distribuyen aleatoriamente en cada mes.

---

## 🎯 Casos de Uso

### **1. Demos y Presentaciones**
Muestra la app con datos realistas sin exponibilizar usuarios reales.

### **2. Testing**
Prueba funcionalidades con un usuario que tiene historial completo.

### **3. Desarrollo**
Desarrolla nuevas features con datos de prueba consistentes.

### **4. QA**
Verifica cálculos y visualizaciones con datos conocidos.

---

## 🚀 Próximos Pasos

Después de generar los datos:

1. **Login:** Inicia sesión con las credenciales demo
2. **Explorar:** Navega por todas las pantallas
3. **Verificar:** Confirma que todos los gráficos y cálculos sean correctos
4. **Desarrollar:** Usa estos datos para nuevas features

---

**¡Disfruta de tu cuenta demo con datos realistas!** 🎉

