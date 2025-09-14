import { LoginCredentials, User, OnboardingData } from '../types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase/config';

const defaultFinancialData = {
  monthlyIncome: 4200,
  currentScore: 52,
  riskScore: 48,
  monthlyExpenses: 3180,
  currentSavings: 12500,
  savingsGoal: 18000,
  alerts: 3,
};

// Simulación de servicio de autenticación
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const firebaseUser = userCredential.user;
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
        ...defaultFinancialData
    };
  }

  static async register(data: OnboardingData): Promise<User> {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new Error('Todos los campos son requeridos');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = userCredential.user;
    
    // Here you would typically update the user's profile with their name
    // For example: await updateProfile(firebaseUser, { displayName: `${data.firstName} ${data.lastName}` });

    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        ...defaultFinancialData
    };
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onFirebaseAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          ...defaultFinancialData
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }
  
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}
