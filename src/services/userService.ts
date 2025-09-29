// src/services/userService.ts
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { User } from '../types';

export const fetchUserData = async (userId: string): Promise<User | null> => {
  const userDocRef = doc(db, "users", userId);

  try {
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      
      // Convertir la estructura del documento a la interfaz User
      const user: User = {
        id: userId,
        email: userData.email || '',
        name: `${userData.name || ''} ${userData.last_name || ''}`.trim(), // Nombre completo
        firstName: userData.name || '',
        lastName: userData.last_name || '',
        age: userData.age || 0,
        monthlyIncome: userData.wallet?.monthly_income || 0,
        currentSavings: 0, // No usar wallet.amount, se calculará desde monthlyStats
        preferences: userData.preferences || {
          needs_percent: 0,
          saving_percent: 0,
          wants_percent: 0,
        },
        wallet: userData.wallet || {
          monthly_income: 0,
          amount: 0,
        },
        financialProfile: userData.financial_profile || '',
        // Valores por defecto para campos opcionales
        currentScore: 0,
        riskScore: 0,
        monthlyExpenses: 0,
        savingsGoal: userData.savings_goal || 0,
        alerts: 0,
      };
      
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const createUserData = async (userId: string, data: any) => {
    const userDocRef = doc(db, "users", userId);
    try {
        await setDoc(userDocRef, data);
    } catch (error) {
        throw error; // Re-lanzar el error para que se maneje en el servicio de autenticación
    }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        return !querySnapshot.empty;
    } catch (error) {
        throw error;
    }
};
