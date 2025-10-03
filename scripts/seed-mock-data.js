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
  currentSavings: 800000, // $800.000 CLP
  preferences: {
    needs_percent: 50,
    wants_percent: 30,
    saving_percent: 15,
    investment_percent: 5,
  },
  financialProfile: ['salario_fijo', 'gastos_controlados', 'ahorro_activo'],
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
 * Genera todas las transacciones para un mes
 */
function generateMonthTransactions(userId, year, month) {
  const transactions = [
    ...generateIncomeTransactions(userId, year, month),
    ...generateNeedsTransactions(userId, year, month),
    ...generateWantsTransactions(userId, year, month),
    ...generateInvestmentTransactions(userId, year, month),
  ];

  return sortByDate(transactions);
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
 * Guarda todas las transacciones en Firebase
 */
async function saveTransactions(transactions) {
  console.log(`💾 Guardando ${transactions.length} transacciones...`);

  for (const transaction of transactions) {
    // Calcular balanceAfter basándose en las transacciones anteriores
    const previousTransactions = transactions.filter(
      (t) => t.date < transaction.date && t.month === transaction.month && t.year === transaction.year
    );

    let balanceAfter = 0;
    if (transaction.month === 1 && transaction.year === 2024) {
      // Primer mes: empezar con el ahorro inicial
      balanceAfter = MOCK_USER.currentSavings;
    } else {
      // Obtener balance del mes anterior (calculado después)
      balanceAfter = 0; // Se calculará después
    }

    previousTransactions.forEach((t) => {
      if (t.type === 'income') {
        balanceAfter += t.amount;
      } else {
        balanceAfter -= t.amount;
      }
    });

    if (transaction.type === 'income') {
      balanceAfter += transaction.amount;
    } else {
      balanceAfter -= transaction.amount;
    }

    transaction.balanceAfter = balanceAfter;

    const docRef = doc(db, 'balance_registrations', transaction.id);
    await setDoc(docRef, transaction);
  }

  console.log('✅ Transacciones guardadas');
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

    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        MOCK_USER.email,
        MOCK_USER.password
      );
      console.log('✅ Usuario creado en Firebase Auth\n');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Usuario ya existe, usando el existente\n');
        // En este caso, necesitarías el UID del usuario existente
        // Por simplicidad, salimos del script
        console.log('❌ Por favor, elimina el usuario existente o usa otro email');
        process.exit(1);
      } else {
        throw error;
      }
    }

    const userId = userCredential.user.uid;
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

      console.log(`📅 Mes ${month}/${year}:`);

      // Generar transacciones del mes
      const monthTransactions = generateMonthTransactions(userId, year, month);
      console.log(`   - ${monthTransactions.length} transacciones generadas`);

      // Calcular estadísticas del mes
      const monthStats = calculateMonthlyStats(userId, year, month, monthTransactions, previousBalance);
      console.log(`   - Balance: $${monthStats.balance.toLocaleString('es-CL')}`);
      console.log(`   - Ingresos: $${monthStats.totalIncome.toLocaleString('es-CL')}`);
      console.log(`   - Gastos: $${monthStats.totalExpenses.toLocaleString('es-CL')}`);

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

