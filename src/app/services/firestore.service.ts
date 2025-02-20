import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, getDoc, deleteDoc, updateDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
