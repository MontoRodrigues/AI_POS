
import { Injectable } from '@angular/core';
import { collection, getDocs, QuerySnapshot, query, onSnapshot, Unsubscribe, QueryConstraint, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { ISupplier } from '../interface/isupplier';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }

  async getCollection(collectionName: string, constraints: QueryConstraint[] = []): Promise<QuerySnapshot> {
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);
    return await getDocs(q);
  }


  async addUpdateDocument(collectionName: string, doc_id: string, data: any) {
    let r = await setDoc(doc(firestore, collectionName, doc_id), data);
    return r;
  }

  async deleteDocument(collectionName: string, doc_id: string, data: any) {
    let r = await deleteDoc(doc(firestore, collectionName, doc_id));
    return r;
  }

  subscribeToCollection(collectionName: string, callback: (snapshot: QuerySnapshot) => void, constraints: QueryConstraint[] = []): Unsubscribe {
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);
    return onSnapshot(q, callback);
  }
}
