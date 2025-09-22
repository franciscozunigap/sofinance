// src/services/userService.ts
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { User } from '../types';

export const fetchUserData = async (userId: string): Promise<User | null> => {
  console.log('fetchUserData llamado para userId:', userId);
  const userDocRef = doc(db, "users", userId);

  try {
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log("Datos del usuario desde Firestore:", userData);
      console.log("Mapeando datos:", {
        name: userData.name,
        last_name: userData.last_name,
        age: userData.age,
        wallet: userData.wallet,
        preferences: userData.preferences,
        financial_profile: userData.financial_profile
      });
      
      // Convertir la estructura del documento a la interfaz User
      const user: User = {
        id: userId,
        email: userData.email || '',
        name: `${userData.name || ''} ${userData.last_name || ''}`.trim(), // Nombre completo
        firstName: userData.name || '',
        lastName: userData.last_name || '',
        age: userData.age || 0,
        monthlyIncome: userData.wallet?.monthly_income || 0,
        currentSavings: userData.wallet?.amount || 0,
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
      
      console.log("Usuario mapeado final:", user);
      return user;
    } else {
      console.log("No se encontró un documento de usuario en Firestore con UID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento de usuario de Firestore:", error);
    return null;
  }
};

export const createUserData = async (userId: string, data: any) => {
    const userDocRef = doc(db, "users", userId);
    try {
        await setDoc(userDocRef, data);
        console.log("Documento de usuario creado en Firestore para UID:", userId);
    } catch (error) {
        console.error("Error al crear el documento de usuario en Firestore:", error);
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
        console.error("Error al verificar si el email existe:", error);
        throw error;
    }
};
