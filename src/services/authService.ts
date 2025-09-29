import { LoginCredentials, User, OnboardingData } from '../types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { fetchUserData, createUserData, checkEmailExists } from './userService';
import { BalanceService } from './balanceService';

// Simulación de servicio de autenticación
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return userCredential.user;
  }

  static async register(data: OnboardingData): Promise<FirebaseUser> {
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.age) {
      throw new Error('Todos los campos son requeridos');
    }

    let userCredential;
    try {
      // Intentar crear el usuario directamente
      // Firebase Auth ya valida emails únicos automáticamente
      userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      // Si el error es por email ya registrado, mostrar mensaje personalizado
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este correo electrónico ya está registrado. Por favor, usa otro email o inicia sesión.');
      }
      // Re-lanzar otros errores
      throw error;
    }
    
    const firebaseUser = userCredential.user;
    
    // Crear el documento con la estructura exacta que me mostraste
    const userDocument = {
      age: data.age,
      email: data.email,
      last_name: data.lastName,
      name: data.firstName,
      preferences: {
        needs_percent: data.needsPercentage,
        saving_percent: data.savingsPercentage,
        wants_percent: data.consumptionPercentage,
        investment_percent: data.investmentPercentage,
      },
      wallet: {
        monthly_income: data.monthlyIncome,
        amount: data.currentSavings,
      },
      financial_profile: data.financialProfile || '', // Guardar el perfil financiero
    };

    await createUserData(firebaseUser.uid, userDocument);

    // Crear documentos iniciales necesarios
    try {
      // Crear balance inicial
      await BalanceService.createInitialBalance(firebaseUser.uid);
      console.log('Balance inicial creado exitosamente');

      // Si el usuario tiene disponibles iniciales, registrar el balance PRIMERO
      if (data.currentSavings > 0) {
        await BalanceService.registerBalance(
          firebaseUser.uid,
          'income',
          'Balance inicial',
          data.currentSavings,
          'Balance Inicial'
        );
        console.log('Registro de balance inicial creado exitosamente');
      }

      // Crear estadísticas mensuales iniciales DESPUÉS del registro
      await BalanceService.createInitialMonthlyStats(firebaseUser.uid);
      console.log('Estadísticas mensuales iniciales creadas exitosamente');
    } catch (error) {
      console.error('Error al crear documentos iniciales:', error);
      // No lanzar error aquí para no interrumpir el registro del usuario
    }

    return firebaseUser;
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onFirebaseAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser.uid);
        if (userData) {
            callback(userData);
        } else {
            // This could happen if the user document is not created yet
            // Or for a new registration before the document is created.
            // We can return a basic user object.
            const basicUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            };
            callback(basicUser);
        }
      } else {
        callback(null);
      }
    });
  }
  
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}
