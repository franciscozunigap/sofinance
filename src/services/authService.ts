import { LoginCredentials, User, OnboardingData } from '../types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { fetchUserData, createUserData } from './userService';

// Simulación de servicio de autenticación
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return userCredential.user;
  }

  static async register(data: OnboardingData): Promise<FirebaseUser> {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new Error('Todos los campos son requeridos');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = userCredential.user;
    
    const newUser: Omit<User, 'id'> = {
        email: firebaseUser.email || '',
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        monthlyIncome: 4200,
        currentScore: 52,
        riskScore: 48,
        monthlyExpenses: 3180,
        currentSavings: 12500,
        savingsGoal: 18000,
        alerts: 3,
    };

    await createUserData(firebaseUser.uid, newUser);

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
