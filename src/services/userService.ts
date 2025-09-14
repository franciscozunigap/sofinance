// src/services/userService.ts
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from '../types';

export const fetchUserData = async (userId: string): Promise<User | null> => {
  const userDocRef = doc(db, "users", userId);

  try {
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as User;
      console.log("Datos del usuario desde Firestore:", userData);
      return { id: userId, ...userData };
    } else {
      console.log("No se encontró un documento de usuario en Firestore con UID:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento de usuario de Firestore:", error);
    return null;
  }
};

export const createUserData = async (userId: string, data: Omit<User, 'id'>) => {
    const userDocRef = doc(db, "users", userId);
    try {
        await setDoc(userDocRef, data);
        console.log("Documento de usuario creado en Firestore para UID:", userId);
    } catch (error) {
        console.error("Error al crear el documento de usuario en Firestore:", error);
    }
};
