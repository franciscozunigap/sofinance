import { db } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  writeBatch,
  runTransaction,
  onSnapshot,
  Unsubscribe,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp
} from 'firebase/firestore';

/**
 * Servicio base para operaciones Firebase con manejo de errores mejorado
 * y soporte para transacciones atómicas
 */
export class FirebaseService {
  /**
   * Ejecuta una transacción atómica
   */
  static async runTransaction<T>(
    transactionFunction: (transaction: any) => Promise<T>
  ): Promise<T> {
    try {
      return await runTransaction(db, transactionFunction);
    } catch (error) {
      throw new Error(`Error en transacción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Ejecuta operaciones en lote
   */
  static async runBatch(operations: Array<() => void>): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(operation => {
        operation();
      });
      
      await batch.commit();
    } catch (error) {
      throw new Error(`Error en operación en lote: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene un documento con manejo de errores
   */
  static async getDocument<T>(
    collection: string, 
    docId: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collection, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return this.convertFirestoreData<T>(docSnap.data());
      }
      return null;
    } catch (error) {
      throw new Error(`Error obteniendo documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Guarda un documento con validación
   */
  static async setDocument<T>(
    collection: string, 
    docId: string, 
    data: T,
    merge: boolean = false
  ): Promise<void> {
    try {
      const docRef = doc(db, collection, docId);
      const firestoreData = this.convertToFirestoreData(data);
      
      if (merge) {
        await setDoc(docRef, firestoreData, { merge: true });
      } else {
        await setDoc(docRef, firestoreData);
      }
    } catch (error) {
      throw new Error(`Error guardando documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Actualiza un documento
   */
  static async updateDocument(
    collection: string, 
    docId: string, 
    data: Partial<any>
  ): Promise<void> {
    try {
      const docRef = doc(db, collection, docId);
      const firestoreData = this.convertToFirestoreData(data);
      await updateDoc(docRef, firestoreData);
    } catch (error) {
      throw new Error(`Error actualizando documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Elimina un documento
   */
  static async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      const docRef = doc(db, collection, docId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(`Error eliminando documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Ejecuta una consulta con manejo de errores
   */
  static async queryDocuments<T>(
    collectionName: string,
    constraints: Array<any> = [],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    limitCount?: number
  ): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef, ...constraints);
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.convertFirestoreData<T>(doc.data()));
    } catch (error) {
      throw new Error(`Error ejecutando consulta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Escucha cambios en tiempo real
   */
  static subscribeToDocument<T>(
    collection: string,
    docId: string,
    callback: (data: T | null) => void
  ): Unsubscribe {
    try {
      const docRef = doc(db, collection, docId);
      return onSnapshot(docRef, (docSnap: DocumentSnapshot) => {
        if (docSnap.exists()) {
          callback(this.convertFirestoreData<T>(docSnap.data()));
        } else {
          callback(null);
        }
      }, (error) => {
        callback(null);
      });
    } catch (error) {
      throw new Error(`Error creando suscripción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Escucha cambios en una consulta
   */
  static subscribeToQuery<T>(
    collectionName: string,
    constraints: Array<any> = [],
    callback: (data: T[]) => void
  ): Unsubscribe {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      
      return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        const data = querySnapshot.docs.map(doc => this.convertFirestoreData<T>(doc.data()));
        callback(data);
      }, (error) => {
        callback([]);
      });
    } catch (error) {
      throw new Error(`Error creando suscripción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Convierte datos de Firestore a formato JavaScript
   */
  private static convertFirestoreData<T>(data: any): T {
    if (!data) return data;
    
    const converted = { ...data };
    
    // Convertir Timestamps a Date
    Object.keys(converted).forEach(key => {
      if (converted[key] instanceof Timestamp) {
        converted[key] = converted[key].toDate();
      } else if (converted[key] && typeof converted[key] === 'object' && !Array.isArray(converted[key])) {
        converted[key] = this.convertFirestoreData(converted[key]);
      }
    });
    
    return converted as T;
  }

  /**
   * Convierte datos JavaScript a formato Firestore
   */
  private static convertToFirestoreData(data: any): any {
    if (!data) return data;
    
    const converted = { ...data };
    
    // Convertir Date a Timestamp
    Object.keys(converted).forEach(key => {
      if (converted[key] instanceof Date) {
        converted[key] = Timestamp.fromDate(converted[key]);
      } else if (converted[key] && typeof converted[key] === 'object' && !Array.isArray(converted[key])) {
        converted[key] = this.convertToFirestoreData(converted[key]);
      }
    });
    
    return converted;
  }

  /**
   * Valida que un documento existe
   */
  static async documentExists(collection: string, docId: string): Promise<boolean> {
    try {
      const docRef = doc(db, collection, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene múltiples documentos por IDs
   */
  static async getDocumentsByIds<T>(
    collection: string, 
    docIds: string[]
  ): Promise<Array<T | null>> {
    try {
      const promises = docIds.map(id => this.getDocument<T>(collection, id));
      return await Promise.all(promises);
    } catch (error) {
      throw new Error(`Error obteniendo múltiples documentos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Cuenta documentos en una consulta
   */
  static async countDocuments(
    collectionName: string,
    constraints: Array<any> = []
  ): Promise<number> {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      throw new Error(`Error contando documentos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
