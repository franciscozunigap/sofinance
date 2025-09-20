# Registro de Balance Financiero

## Descripción
Esta funcionalidad permite a los usuarios registrar un balance financiero a través de un flujo de dos pasos, accesible desde la sección de "Análisis" mediante el botón "+".

## Flujo de Usuario

### Paso 1: Ingreso del Monto Actual
- **Título**: "Registrar Balance"
- **Descripción**: Campo de entrada con teclado numérico para ingresar el monto total actual
- **Validación**: El botón "Siguiente" se deshabilita hasta que se ingrese un valor mayor a cero
- **Mensaje de error**: "Por favor, ingresa un monto válido" si se intenta continuar sin ingresar nada

### Paso 2: Detalle de la Diferencia
- **Título**: "Detalle de Diferencia"
- **Monto a detallar**: Muestra la diferencia entre el monto actual y el saldo registrado en la base de datos
- **Lista de registros**: Hasta 5 registros dinámicos, cada uno con:
  - Campo para valor monetario
  - Menú desplegable para categoría (Ingreso, Deuda, Consumo, Necesidad, Inversión)
  - Icono + para agregar nuevos registros
  - Icono x para eliminar registros específicos

### Lógica de Categorías
- **Ingreso**: Suma al total
- **Deuda, Consumo, Necesidad, Inversión**: Restan del total

### Validación Final
- Los montos de los registros deben sumar exactamente la diferencia calculada
- Si no coinciden, se muestra una alerta pidiendo ajustar los valores

## Componentes Creados

### 1. CategorySelector
- Selector de categorías con modal
- Iconos y colores distintivos para cada categoría
- Validación de selección

### 2. BalanceRecordItem
- Componente para cada registro individual
- Campos de monto y categoría
- Botón de eliminación
- Validación en tiempo real

### 3. BalanceRegistrationScreen
- Pantalla principal del flujo
- Manejo de estados entre pasos
- Validaciones completas
- Integración con servicios

## Servicios

### BalanceService
- `calculateTotal()`: Calcula el total según las categorías
- `validateRecords()`: Valida que los registros sumen la diferencia exacta
- `createEmptyRecord()`: Crea un registro vacío
- `getCurrentBalance()`: Obtiene el balance actual del usuario
- `saveBalanceRegistration()`: Guarda el registro en la base de datos

### Hook useBalance
- Manejo del estado del balance
- Carga de datos
- Operaciones de guardado
- Manejo de errores y loading

## Tipos TypeScript

```typescript
interface BalanceRecord {
  id: string;
  amount: number;
  category: BalanceCategory;
}

type BalanceCategory = 'Ingreso' | 'Deuda' | 'Consumo' | 'Necesidad' | 'Inversión';

interface BalanceRegistrationData {
  currentAmount: number;
  records: BalanceRecord[];
}
```

## Integración

La funcionalidad se integra en `AnalysisScreen` mediante:
1. Estado `showBalanceRegistration` para mostrar/ocultar la pantalla
2. Botón "+" en el header que activa el flujo
3. Prop `onComplete` para volver a la vista de análisis

## Uso

```tsx
// En AnalysisScreen
const [showBalanceRegistration, setShowBalanceRegistration] = useState(false);

// Mostrar pantalla de registro
if (showBalanceRegistration) {
  return (
    <BalanceRegistrationScreen
      onComplete={() => setShowBalanceRegistration(false)}
      currentBalance={userData.currentSavings || 0}
    />
  );
}
```

## Características Técnicas

- **Validación en tiempo real**: Los campos se validan mientras el usuario escribe
- **Cálculo automático**: La diferencia se calcula automáticamente
- **Límite de registros**: Máximo 5 registros por balance
- **Persistencia**: Los datos se guardan en la base de datos
- **Manejo de errores**: Mensajes claros para el usuario
- **Loading states**: Indicadores de carga durante las operaciones
- **Responsive**: Adaptado para diferentes tamaños de pantalla
