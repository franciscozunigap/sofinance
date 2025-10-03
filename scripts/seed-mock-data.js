/**
 * Script para generar datos mock realistas en Firebase
 * Crea un usuario de prueba con transacciones de varios meses
 * 
 * Uso: node scripts/seed-mock-data.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de Firebase (usar las mismas variables que la app)
const firebaseConfig = {
  apiKey: process.env.PRIVATE_FIREBASE_APIKEY,
  authDomain: process.env.PRIVATE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PRIVATE_FIREBASE_PROYECT_ID,
  storageBucket: process.env.PRIVATE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PRIVATE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PRIVATE_FIREBASE_APP_ID,
};

// Verificar que las variables estén configuradas
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('\n❌ Error: Variables de entorno de Firebase no configuradas\n');
  console.log('Por favor, asegúrate de tener un archivo .env con:');
  console.log('  PRIVATE_FIREBASE_APIKEY=tu-api-key');
  console.log('  PRIVATE_FIREBASE_AUTH_DOMAIN=tu-auth-domain');
  console.log('  PRIVATE_FIREBASE_PROYECT_ID=tu-project-id');
  console.log('  PRIVATE_FIREBASE_STORAGE_BUCKET=tu-storage-bucket');
  console.log('  PRIVATE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id');
  console.log('  PRIVATE_FIREBASE_APP_ID=tu-app-id\n');
  console.log('Obtén estos valores de:');
  console.log('https://console.firebase.google.com/project/sofinance-eee64/settings/general\n');
  process.exit(1);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// DATOS DEL USUARIO MOCK
// ==========================================

const MOCK_USER = {
  email: 'demo@sofinance.app',
  password: 'Demo123456',
  firstName: 'Sofia',
  lastName: 'Hernández',
  age: 28,
  monthlyIncome: 1500000, // $1.500.000 CLP
  currentSavings: 1800000, // $1.800.000 CLP - 1.2x del ingreso (en zona alta del rango seguro)
  preferences: {
    needs_percent: 50,
    wants_percent: 30,
    saving_percent: 15,
    investment_percent: 5,
  },
  financialProfile: ['salario_fijo', 'gastos_controlados', 'ahorro_activo'],
  // Rangos de seguridad basados en ingreso mensual (estilo Gentler Streak)
  safeRange: {
    upper: 1500000 * 1.5, // $2.250.000 (150% del ingreso)
    lower: 1500000 * 0.5, // $750.000 (50% del ingreso)
  },
};

// ==========================================
// CATEGORÍAS Y TRANSACCIONES TIPO
// ==========================================

const TRANSACTION_TYPES = {
  income: [
    { description: 'Sueldo mensual', category: 'Ingreso', probability: 0.95 },
    { description: 'Bono de desempeño', category: 'Ingreso', probability: 0.2 },
    { description: 'Freelance', category: 'Ingreso', probability: 0.3 },
    { description: 'Venta producto usado', category: 'Ingreso', probability: 0.1 },
  ],
  needs: [
    { description: 'Arriendo', amount: 450000, probability: 0.95 },
    { description: 'Supermercado', amount: 150000, probability: 0.9 },
    { description: 'Cuentas básicas (agua, luz, gas)', amount: 80000, probability: 0.9 },
    { description: 'Internet y teléfono', amount: 45000, probability: 0.95 },
    { description: 'Transporte público', amount: 60000, probability: 0.85 },
    { description: 'Medicamentos', amount: 25000, probability: 0.3 },
    { description: 'Seguro de salud', amount: 70000, probability: 0.95 },
  ],
  wants: [
    { description: 'Restaurante', amount: 35000, probability: 0.6 },
    { description: 'Cine', amount: 12000, probability: 0.4 },
    { description: 'Ropa', amount: 80000, probability: 0.5 },
    { description: 'Streaming (Netflix, Spotify)', amount: 15000, probability: 0.8 },
    { description: 'Café', amount: 5000, probability: 0.7 },
    { description: 'Gimnasio', amount: 35000, probability: 0.6 },
    { description: 'Salida con amigos', amount: 40000, probability: 0.5 },
    { description: 'Compras online', amount: 60000, probability: 0.4 },
  ],
  investment: [
    { description: 'Fondo mutuo', amount: 50000, probability: 0.7 },
    { description: 'Acciones', amount: 100000, probability: 0.3 },
    { description: 'Criptomonedas', amount: 30000, probability: 0.2 },
  ],
};

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Genera un ID único
 */
function generateId() {
  return doc(collection(db, 'balance_registrations')).id;
}

/**
 * Genera un monto aleatorio con variación
 */
function generateAmount(baseAmount, variation = 0.2) {
  const min = baseAmount * (1 - variation);
  const max = baseAmount * (1 + variation);
  return Math.round(min + Math.random() * (max - min));
}

/**
 * Decide si una transacción ocurre basado en probabilidad
 */
function shouldOccur(probability) {
  return Math.random() < probability;
}

/**
 * Genera una fecha aleatoria dentro de un mes
 */
function generateRandomDate(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return new Date(year, month - 1, day, hour, minute);
}

/**
 * Ordena transacciones por fecha
 */
function sortByDate(transactions) {
  return transactions.sort((a, b) => a.date - b.date);
}

// ==========================================
// GENERACIÓN DE TRANSACCIONES
// ==========================================

/**
 * Genera transacciones de ingresos para un mes
 */
function generateIncomeTransactions(userId, year, month) {
  const transactions = [];

  TRANSACTION_TYPES.income.forEach((type) => {
    if (shouldOccur(type.probability)) {
      const amount = type.description.includes('Sueldo')
        ? MOCK_USER.monthlyIncome
        : generateAmount(200000, 0.5);

      transactions.push({
        id: generateId(),
        userId,
        date: generateRandomDate(year, month),
        type: 'income',
        description: type.description,
        amount,
        category: type.category,
        month,
        year,
        createdAt: new Date(),
      });
    }
  });

  return transactions;
}

/**
 * Genera transacciones de necesidades para un mes
 */
function generateNeedsTransactions(userId, year, month) {
  const transactions = [];

  TRANSACTION_TYPES.needs.forEach((type) => {
    if (shouldOccur(type.probability)) {
      const amount = generateAmount(type.amount, 0.15);

      transactions.push({
        id: generateId(),
        userId,
        date: generateRandomDate(year, month),
        type: 'expense',
        description: type.description,
        amount,
        category: 'Necesidad',
        month,
        year,
        createdAt: new Date(),
      });
    }
  });

  return transactions;
}

/**
 * Genera transacciones de consumo para un mes
 */
function generateWantsTransactions(userId, year, month) {
  const transactions = [];

  TRANSACTION_TYPES.wants.forEach((type) => {
    if (shouldOccur(type.probability)) {
      const amount = generateAmount(type.amount, 0.3);

      transactions.push({
        id: generateId(),
        userId,
        date: generateRandomDate(year, month),
        type: 'expense',
        description: type.description,
        amount,
        category: 'Consumo',
        month,
        year,
        createdAt: new Date(),
      });
    }
  });

  return transactions;
}

/**
 * Genera transacciones de inversión para un mes
 */
function generateInvestmentTransactions(userId, year, month) {
  const transactions = [];

  TRANSACTION_TYPES.investment.forEach((type) => {
    if (shouldOccur(type.probability)) {
      const amount = generateAmount(type.amount, 0.2);

      transactions.push({
        id: generateId(),
        userId,
        date: generateRandomDate(year, month),
        type: 'expense',
        description: type.description,
        amount,
        category: 'Inversión',
        month,
        year,
        createdAt: new Date(),
      });
    }
  });

  return transactions;
}

/**
 * Genera todas las transacciones para un mes con comportamiento realista
 * Balance siempre en rango seguro (0.5x - 1.5x del ingreso)
 * Gastos entre 90%-110% del ingreso mensual
 * Últimos meses tienden a ahorrar más (balance hacia rango superior)
 */
function generateMonthTransactions(userId, year, month, previousBalance, monthIndex = 0, totalMonths = 6) {
  const incomeTransactions = generateIncomeTransactions(userId, year, month);
  
  // Calcular ingreso total del mes
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0) || MOCK_USER.monthlyIncome;
  
  // Rango seguro basado en ingreso mensual
  const safeRangeUpper = totalIncome * 1.5; // $2.250.000
  const safeRangeLower = totalIncome * 0.5; // $750.000
  const safeRangeMid = (safeRangeUpper + safeRangeLower) / 2; // $1.500.000
  
  // Los últimos 2 meses tienden a ahorrar más (tirando hacia rango superior)
  const isRecentMonth = monthIndex >= totalMonths - 2;
  
  // Determinar gastos objetivo (entre 90% y 110% del ingreso)
  // Meta: mantener balance estable y en rango seguro
  let expensePercentage;
  
  if (isRecentMonth) {
    // Últimos 2 meses: Ahorrar más para subir el balance
    expensePercentage = 0.90 + Math.random() * 0.03; // 90-93% (ahorra 7-10%)
    console.log(`   📈 Mes reciente: Ahorrando (${(expensePercentage * 100).toFixed(1)}% de gastos)`);
  } else {
    // Meses anteriores: comportamiento normal pero controlado
    const roll = Math.random();
    
    if (roll < 0.7) {
      // Mayoría de meses - ahorra un poco
      expensePercentage = 0.92 + Math.random() * 0.06; // 92-98%
    } else {
      // Algunos meses - gasta más pero sin excederse
      expensePercentage = 0.98 + Math.random() * 0.07; // 98-105%
    }
  }
  
  let targetExpenses = totalIncome * expensePercentage;
  
  // IMPORTANTE: Ajustar gastos para mantener balance en rango seguro
  let projectedBalance = previousBalance + totalIncome - targetExpenses;
  
  // Objetivo para últimos meses: estar entre 1.1x y 1.3x del ingreso (zona superior del rango)
  const targetBalanceRecent = totalIncome * 1.2; // $1.800.000 para últimos meses
  
  // Si el balance proyectado se sale del rango, ajustar gastos
  if (projectedBalance > safeRangeUpper) {
    // Balance muy alto - aumentar gastos o inversión para mantenerlo en límite
    const excess = projectedBalance - (safeRangeUpper * 0.95); // Apuntar a 95% del máximo
    targetExpenses += excess;
    console.log(`   ⚠️  Balance muy alto, aumentando inversiones en $${excess.toLocaleString('es-CL')}`);
  } else if (projectedBalance < safeRangeLower) {
    // Balance muy bajo - reducir gastos drasticamente
    const deficit = (safeRangeLower * 1.1) - projectedBalance; // Apuntar a 110% del mínimo
    targetExpenses = Math.max(targetExpenses - deficit, totalIncome * 0.75); // Mínimo 75% de gastos
    console.log(`   ⚠️  Balance muy bajo, reduciendo gastos en $${deficit.toLocaleString('es-CL')}`);
  } else if (isRecentMonth && projectedBalance < targetBalanceRecent) {
    // Mes reciente con balance bajo del objetivo - reducir aún más los gastos
    const adjustment = targetBalanceRecent - projectedBalance;
    targetExpenses = Math.max(targetExpenses - adjustment * 0.5, totalIncome * 0.85);
    console.log(`   💰 Ajustando para aumentar ahorro hacia rango superior`);
  }
  
  // Asegurar que los gastos estén entre 90% y 110% del ingreso
  targetExpenses = Math.max(totalIncome * 0.90, Math.min(totalIncome * 1.10, targetExpenses));
  
  // Recalcular balance proyectado después de ajustes
  projectedBalance = previousBalance + totalIncome - targetExpenses;
  
  // Distribuir gastos según preferencias del usuario
  const needsTarget = targetExpenses * (MOCK_USER.preferences.needs_percent / 100);
  const wantsTarget = targetExpenses * (MOCK_USER.preferences.wants_percent / 100);
  const investmentTarget = targetExpenses * (MOCK_USER.preferences.investment_percent / 100);
  
  // Generar transacciones ajustadas al objetivo
  const needsTransactions = generateNeedsTransactionsWithBudget(userId, year, month, needsTarget);
  const wantsTransactions = generateWantsTransactionsWithBudget(userId, year, month, wantsTarget);
  const investmentTransactions = generateInvestmentTransactionsWithBudget(userId, year, month, investmentTarget);
  
  const transactions = [
    ...incomeTransactions,
    ...needsTransactions,
    ...wantsTransactions,
    ...investmentTransactions,
  ];

  return sortByDate(transactions);
}

/**
 * Genera transacciones de necesidades ajustadas a un presupuesto
 */
function generateNeedsTransactionsWithBudget(userId, year, month, budget) {
  const transactions = [];
  let spent = 0;
  
  // Transacciones fijas (arriendo, cuentas)
  const fixedNeeds = TRANSACTION_TYPES.needs.filter(t => t.probability >= 0.9);
  const variableNeeds = TRANSACTION_TYPES.needs.filter(t => t.probability < 0.9);
  
  // Agregar necesidades fijas primero
  fixedNeeds.forEach((type) => {
    const amount = generateAmount(type.amount, 0.1); // Poca variación en fijos
    if (spent + amount <= budget) {
      transactions.push({
        id: generateId(),
        userId,
        date: generateRandomDate(year, month),
        type: 'expense',
        description: type.description,
        amount,
        category: 'Necesidad',
        month,
        year,
        createdAt: new Date(),
      });
      spent += amount;
    }
  });
  
  // Agregar variables si queda presupuesto
  variableNeeds.forEach((type) => {
    if (shouldOccur(type.probability) && spent < budget) {
      const remaining = budget - spent;
      const amount = Math.min(generateAmount(type.amount, 0.2), remaining);
      if (amount > 0) {
        transactions.push({
          id: generateId(),
          userId,
          date: generateRandomDate(year, month),
          type: 'expense',
          description: type.description,
          amount,
          category: 'Necesidad',
          month,
          year,
          createdAt: new Date(),
        });
        spent += amount;
      }
    }
  });
  
  return transactions;
}

/**
 * Genera transacciones de consumo ajustadas a un presupuesto
 */
function generateWantsTransactionsWithBudget(userId, year, month, budget) {
  const transactions = [];
  let spent = 0;
  
  TRANSACTION_TYPES.wants.forEach((type) => {
    if (shouldOccur(type.probability) && spent < budget) {
      const remaining = budget - spent;
      const amount = Math.min(generateAmount(type.amount, 0.3), remaining);
      if (amount > 0) {
        transactions.push({
          id: generateId(),
          userId,
          date: generateRandomDate(year, month),
          type: 'expense',
          description: type.description,
          amount,
          category: 'Consumo',
          month,
          year,
          createdAt: new Date(),
        });
        spent += amount;
      }
    }
  });
  
  return transactions;
}

/**
 * Genera transacciones de inversión ajustadas a un presupuesto
 */
function generateInvestmentTransactionsWithBudget(userId, year, month, budget) {
  const transactions = [];
  let spent = 0;
  
  TRANSACTION_TYPES.investment.forEach((type) => {
    if (shouldOccur(type.probability) && spent < budget) {
      const remaining = budget - spent;
      const amount = Math.min(generateAmount(type.amount, 0.2), remaining);
      if (amount > 0) {
        transactions.push({
          id: generateId(),
          userId,
          date: generateRandomDate(year, month),
          type: 'expense',
          description: type.description,
          amount,
          category: 'Inversión',
          month,
          year,
          createdAt: new Date(),
        });
        spent += amount;
      }
    }
  });
  
  return transactions;
}

// ==========================================
// CÁLCULO DE ESTADÍSTICAS
// ==========================================

/**
 * Calcula las estadísticas mensuales basadas en transacciones
 */
function calculateMonthlyStats(userId, year, month, transactions, previousBalance = 0) {
  let totalIncome = 0;
  let totalNeeds = 0;
  let totalWants = 0;
  let totalInvestment = 0;

  // Sumar todas las transacciones
  transactions.forEach((transaction) => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      switch (transaction.category) {
        case 'Necesidad':
          totalNeeds += transaction.amount;
          break;
        case 'Consumo':
          totalWants += transaction.amount;
          break;
        case 'Inversión':
          totalInvestment += transaction.amount;
          break;
      }
    }
  });

  const totalExpenses = totalNeeds + totalWants + totalInvestment;
  const balance = previousBalance + totalIncome - totalExpenses;

  // Calcular porcentajes respecto al ingreso total
  const percentages =
    totalIncome === 0
      ? { needs: 0, wants: 0, savings: 0, investment: 0 }
      : {
          needs: Math.round((totalNeeds / totalIncome) * 1000) / 10,
          wants: Math.round((totalWants / totalIncome) * 1000) / 10,
          savings: Math.round(((balance / totalIncome) * 1000) / 10),
          investment: Math.round((totalInvestment / totalIncome) * 1000) / 10,
        };

  const statsId = `${year}-${month.toString().padStart(2, '0')}_${userId}`;

  return {
    id: statsId,
    userId,
    month,
    year,
    totalIncome,
    totalExpenses,
    balance,
    percentages,
    variation: {
      balanceChange: balance - previousBalance,
      percentageChange:
        previousBalance !== 0 ? ((balance - previousBalance) / previousBalance) * 100 : 0,
      previousMonthBalance: previousBalance,
    },
    lastUpdated: new Date(),
    createdAt: new Date(),
  };
}

// ==========================================
// GUARDADO EN FIREBASE
// ==========================================

/**
 * Guarda todas las transacciones en Firebase con balanceAfter correcto
 */
async function saveTransactions(transactions) {
  console.log(`💾 Guardando ${transactions.length} transacciones...`);

  // Ordenar TODAS las transacciones por fecha cronológicamente
  const sortedTransactions = transactions.sort((a, b) => a.date - b.date);

  // Calcular balanceAfter correctamente transacción por transacción
  let runningBalance = MOCK_USER.currentSavings; // Balance inicial

  console.log(`   💰 Balance inicial: $${runningBalance.toLocaleString('es-CL')}`);

  for (let i = 0; i < sortedTransactions.length; i++) {
    const transaction = sortedTransactions[i];
    
    // Aplicar la transacción al balance acumulado
    if (transaction.type === 'income') {
      runningBalance += transaction.amount;
    } else {
      runningBalance -= transaction.amount;
    }

    // Asignar el balance después de esta transacción
    transaction.balanceAfter = Math.round(runningBalance);

    // Guardar en Firestore
    const docRef = doc(db, 'balance_registrations', transaction.id);
    await setDoc(docRef, transaction);

    // Log cada 20 transacciones para ver progreso
    if ((i + 1) % 20 === 0 || i === sortedTransactions.length - 1) {
      console.log(`   ✓ ${i + 1}/${sortedTransactions.length} transacciones | Balance actual: $${Math.round(runningBalance).toLocaleString('es-CL')}`);
    }
  }

  console.log(`✅ Transacciones guardadas con balance acumulativo correcto`);
  console.log(`💰 Balance final total: $${Math.round(runningBalance).toLocaleString('es-CL')}`);
}

/**
 * Guarda las estadísticas mensuales en Firebase
 */
async function saveMonthlyStats(stats) {
  console.log(`📊 Guardando estadísticas de ${stats.month}/${stats.year}...`);

  const docRef = doc(db, 'monthly_stats', stats.id);
  await setDoc(docRef, stats);

  console.log('✅ Estadísticas guardadas');
}

/**
 * Guarda el usuario en Firebase
 */
async function saveUser(userId) {
  console.log('👤 Guardando usuario...');

  const userDoc = {
    email: MOCK_USER.email,
    name: MOCK_USER.firstName,
    last_name: MOCK_USER.lastName,
    age: MOCK_USER.age,
    wallet: {
      monthly_income: MOCK_USER.monthlyIncome,
      amount: MOCK_USER.currentSavings,
    },
    preferences: MOCK_USER.preferences,
    financial_profile: MOCK_USER.financialProfile,
  };

  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, userDoc);

  console.log('✅ Usuario guardado');
}

// ==========================================
// SCRIPT PRINCIPAL
// ==========================================

async function main() {
  console.log('🚀 Iniciando generación de datos mock...\n');

  try {
    // 1. Crear usuario en Firebase Auth
    console.log('1️⃣ Creando usuario de prueba...');
    console.log(`   Email: ${MOCK_USER.email}`);
    console.log(`   Password: ${MOCK_USER.password}\n`);

    let userId;
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        MOCK_USER.email,
        MOCK_USER.password
      );
      userId = userCredential.user.uid;
      console.log('✅ Usuario creado en Firebase Auth\n');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Usuario ya existe, regenerando datos para el usuario existente...\n');
        
        // Usar un ID fijo derivado del email para testing
        userId = 'demo-user-' + MOCK_USER.email.split('@')[0];
        console.log(`📝 Usando User ID: ${userId}\n`);
        console.log('⚠️  NOTA: Las transacciones y estadísticas existentes serán sobrescritas\n');
      } else {
        throw error;
      }
    }
    console.log(`👤 User ID: ${userId}\n`);

    // 2. Guardar datos del usuario
    await saveUser(userId);

    // 3. Generar datos de los últimos 6 meses
    console.log('\n2️⃣ Generando transacciones de los últimos 6 meses...\n');

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const allTransactions = [];
    const allStats = [];
    let previousBalance = MOCK_USER.currentSavings;

    // Generar 6 meses de datos (empezando hace 6 meses)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      console.log(`📅 Mes ${month}/${year} (${i === 0 ? 'MES ACTUAL' : `hace ${i} ${i === 1 ? 'mes' : 'meses'}`}):`);

      // Generar transacciones del mes pasando el balance previo y el índice
      const monthIndex = 5 - i; // 0 es el mes más antiguo, 5 es el actual
      const monthTransactions = generateMonthTransactions(userId, year, month, previousBalance, monthIndex, 6);
      console.log(`   - ${monthTransactions.length} transacciones generadas`);

      // Calcular estadísticas del mes
      const monthStats = calculateMonthlyStats(userId, year, month, monthTransactions, previousBalance);
      console.log(`   - Balance: $${monthStats.balance.toLocaleString('es-CL')}`);
      console.log(`   - Ingresos: $${monthStats.totalIncome.toLocaleString('es-CL')}`);
      console.log(`   - Gastos: $${monthStats.totalExpenses.toLocaleString('es-CL')}`);
      
      // Verificar que el balance esté en rango seguro
      const safeUpper = monthStats.totalIncome * 1.5;
      const safeLower = monthStats.totalIncome * 0.5;
      const inRange = monthStats.balance >= safeLower && monthStats.balance <= safeUpper;
      const rangeStatus = monthStats.balance > safeUpper ? '🔴 Sobre rango' : 
                         monthStats.balance < safeLower ? '🟡 Bajo rango' : 
                         '🟢 En rango seguro';
      console.log(`   - Estado: ${rangeStatus} (${safeLower.toLocaleString('es-CL')} - ${safeUpper.toLocaleString('es-CL')})`);

      allTransactions.push(...monthTransactions);
      allStats.push(monthStats);
      previousBalance = monthStats.balance;
    }

    // 4. Guardar todas las transacciones
    console.log('\n3️⃣ Guardando datos en Firebase...\n');
    await saveTransactions(allTransactions);

    // 5. Guardar todas las estadísticas
    for (const stats of allStats) {
      await saveMonthlyStats(stats);
    }

    // 6. Resumen
    console.log('\n✅ ¡Datos mock generados exitosamente!\n');
    console.log('📊 RESUMEN:');
    console.log('════════════════════════════════════════');
    console.log(`👤 Usuario: ${MOCK_USER.firstName} ${MOCK_USER.lastName}`);
    console.log(`📧 Email: ${MOCK_USER.email}`);
    console.log(`🔑 Password: ${MOCK_USER.password}`);
    console.log(`💰 Balance inicial: $${MOCK_USER.currentSavings.toLocaleString('es-CL')}`);
    console.log(`💰 Balance final: $${previousBalance.toLocaleString('es-CL')}`);
    console.log(`📈 Transacciones totales: ${allTransactions.length}`);
    console.log(`📊 Meses generados: ${allStats.length}`);
    console.log('════════════════════════════════════════\n');

    console.log('🎉 Puedes iniciar sesión con:');
    console.log(`   Email: ${MOCK_USER.email}`);
    console.log(`   Password: ${MOCK_USER.password}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error generando datos mock:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar script
main();

