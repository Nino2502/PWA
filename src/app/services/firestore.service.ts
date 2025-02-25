import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, getDoc, deleteDoc, updateDoc, Timestamp} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import {query, where, getDocs } from "firebase/firestore"; 

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getCollection<T>(collectionName: string): Observable<T[]> {
    const ref = collection(this.firestore, collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }


  addDocument(collectionName: string, data: any) {
    const ref = collection(this.firestore, collectionName);
    return addDoc(ref, data);
    
  }
  async getDocument(collectionName: string, docId: string) {
    const docRef = doc(this.firestore, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }


  async actualizar_login(collectionName: string, userId: string) {
    const usersRef = collection(this.firestore, collectionName);
    const q = query(usersRef, where("id", "==", userId));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userDocRef = doc(this.firestore, collectionName, userDoc.id); 

            await updateDoc(userDocRef, { last_login: Timestamp.now() });
            return true;
        } else {
            console.log("No se encontró un usuario con ese ID");
            return false;
        }
    } catch (error) {
        console.error("Error al actualizar last_login:", error);
        return false;
    }
}




  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await deleteDoc(docRef);
      console.log(`Documento ${docId} eliminado de la colección ${collectionName}`);
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      throw error;
    }
  }

  async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await updateDoc(docRef, data);
      console.log(`Documento ${docId} actualizado en la colección ${collectionName}`);
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      throw error;
    }
  }
  



  
}
