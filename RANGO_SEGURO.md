# 🎯 Sistema de Rango Seguro - Estilo Gentler Streak

## 📊 Cómo Funciona el Balance

### **Rangos Basados en Ingreso Mensual**

```
Ingreso mensual: $1.500.000

$2.250.000 ━━━━━━━━━━━━━━━━━━━━━━━━━━ 🟢 RANGO SUPERIOR (1.5x)
           ┃                         ┃
$2.025.000 ┃ - - - - - - - - - - - - ┃ Zona alta del rango (evitar exceder)
           ┃                         ┃
$1.800.000 ┃ ════════════════════════ ┃ 🎯 META ÚLTIMOS MESES (1.2x)
           ┃ ░░░░░░░░░░░░░░░░░░░░░░░ ┃
           ┃ ░                       ░ ┃
$1.600.000 ┃ ░  💰 Balance Inicial  ░ ┃ <- Usuario empieza aquí
           ┃ ░                       ░ ┃
$1.500.000 ┃ ░ ZONA SEGURA (verde)  ░ ┃ = Ingreso mensual
           ┃ ░                       ░ ┃
$1.200.000 ┃ ░                       ░ ┃
           ┃ ░░░░░░░░░░░░░░░░░░░░░░░ ┃
$825.000   ┃ - - - - - - - - - - - - ┃ Zona baja del rango (evitar caer)
           ┃                         ┃
$750.000   ━━━━━━━━━━━━━━━━━━━━━━━━━━ 🟡 RANGO INFERIOR (0.5x)
```

## 🔄 Evolución del Balance Mes a Mes

### **Ejemplo con 6 meses de datos:**

```
Mes 1 (Mayo):
  Balance inicial:   $1.600.000 (1.07x) 🟢
  + Ingreso:         $1.500.000
  - Gastos (92%):    $1.380.000
  = Balance final:   $1.720.000 (1.15x) 📈 Subiendo

Mes 2 (Junio):
  Balance inicial:   $1.720.000 (1.15x) 🟢
  + Ingreso:         $1.500.000
  - Gastos (98%):    $1.470.000
  = Balance final:   $1.750.000 (1.17x) 📈 Estable

Mes 3 (Julio):
  Balance inicial:   $1.750.000 (1.17x) 🟢
  + Ingreso:         $1.500.000
  - Gastos (105%):   $1.575.000
  = Balance final:   $1.675.000 (1.12x) 📉 Bajó un poco

Mes 4 (Agosto):
  Balance inicial:   $1.675.000 (1.12x) 🟢
  + Ingreso:         $1.500.000
  - Gastos (93%):    $1.395.000
  = Balance final:   $1.780.000 (1.19x) 📈 Recuperando

Mes 5 (Septiembre) - PENÚLTIMO MES:
  Balance inicial:   $1.780.000 (1.19x) 🟢
  + Ingreso:         $1.500.000
  - Gastos (90%):    $1.350.000 ⬇️ Ahorra más
  = Balance final:   $1.930.000 (1.29x) 📈 Subiendo fuerte

Mes 6 (Octubre) - MES ACTUAL:
  Balance inicial:   $1.930.000 (1.29x) 🟢
  + Ingreso:         $1.500.000
  - Gastos (88%):    $1.320.000 ⬇️ Ahorra MÁS
  = Balance final:   $2.110.000 (1.41x) 📈 Cerca del superior
```

## 🎯 Sistema de Ajuste Automático

### **Caso 1: Balance se acerca al límite superior**

```javascript
Si balance proyectado > $2.250.000:
  ⚠️  "Balance muy alto"
  ➡️  Aumenta inversiones automáticamente
  ➡️  O aumenta consumo opcional
  🎯 Mantiene balance cerca de $2.000.000
```

### **Caso 2: Balance se acerca al límite inferior**

```javascript
Si balance proyectado < $750.000:
  ⚠️  "Balance muy bajo"
  ➡️  Reduce gastos variables (consumo)
  ➡️  Reduce inversiones temporalmente
  🎯 Mantiene balance cerca de $900.000
```

### **Caso 3: Últimos 2 meses (comportamiento especial)**

```javascript
Meses 5 y 6:
  📈 Ahorra MÁS: solo gasta 88-93% del ingreso
  🎯 Objetivo: balance de $1.800.000 (1.2x)
  
  Si balance < $1.800.000:
    ➡️  Reduce gastos adicionales
    ➡️  Prioriza ahorro
  
  Resultado: Balance sube progresivamente
```

## 📈 Gráfico Visual Resultante

```
$2.250.000 ━━━━━━━━━━━━━━━━━━━━━━━━ Límite superior
           ░░░░░░░░░░░░░░░░░░░░░░░░  
           ░                    ●  ░ <- Mes 6: $2.110.000
           ░                 ●     ░ <- Mes 5: $1.930.000
           ░             ●         ░ <- Mes 4: $1.780.000
           ░          ●            ░ <- Mes 3: $1.675.000
           ░       ●               ░ <- Mes 2: $1.750.000
           ░    ●                  ░ <- Mes 1: $1.720.000
           ░░░░░░░░░░░░░░░░░░░░░░░░  
$750.000   ━━━━━━━━━━━━━━━━━━━━━━━━ Límite inferior

         Tendencia: ↗️ Subiendo hacia el rango superior
```

## 💡 Características Clave

1. **Balance Inicial**: $1.600.000 (1.07x) - En zona media-alta
2. **Últimos 2 meses**: Ahorra 7-12% (gastos 88-93%)
3. **Tendencia**: Sube progresivamente hacia $2.000.000+
4. **Siempre visible**: Área verde muestra claramente el rango
5. **Auto-corrección**: Si se sale, ajusta automáticamente

## 🚀 Resultado Esperado

Al ejecutar `npm run seed:mock`, los últimos días mostrarán:

- ✅ Balance entre $1.800.000 - $2.100.000
- ✅ Dentro del área verde del gráfico
- ✅ Cerca del límite superior (sobrando dinero)
- ✅ Tendencia ascendente visible en la línea

¡El usuario estará financieramente saludable con dinero sobrante! 💰

