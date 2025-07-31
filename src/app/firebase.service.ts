
import { Injectable } from '@angular/core';
import { collection, getDocs, QuerySnapshot, query, onSnapshot, Unsubscribe, QueryConstraint } from 'firebase/firestore';
import { firestore } from './firebase';

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

  subscribeToCollection(collectionName: string, callback: (snapshot: QuerySnapshot) => void, constraints: QueryConstraint[] = []): Unsubscribe {
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);
    return onSnapshot(q, callback);
  }
}
