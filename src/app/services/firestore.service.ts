import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, getDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getCollection<T>(collectionName: string): Observable<T[]> {
    const ref = collection(this.firestore, collectionName);
    return collectionData(ref) as Observable<T[]>;
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
  



  
}
