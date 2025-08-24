
import { Injectable } from '@angular/core';
import { collection, getDocs, QuerySnapshot, query, onSnapshot, Unsubscribe, QueryConstraint, setDoc, doc, deleteDoc, DocumentReference, addDoc, SetOptions, updateDoc } from 'firebase/firestore';
import { firestore, storage } from './firebase';
import { ISupplier } from '../interface/isupplier';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

  addDocument(path: string, data: any): Promise<DocumentReference> {
    const collectionRef = collection(firestore, path);
    return addDoc(collectionRef, data);
  }

  setDocument(path: string, data: any, options?: SetOptions): Promise<void> {
    const docRef = doc(firestore, path);
    return setDoc(docRef, data, options || {});
  }

  updateDocument(path: string, data: any): Promise<void> {
    const docRef = doc(firestore, path);
    return updateDoc(docRef, data);
  }

  deleteDocument(path: string): Promise<void> {
    const docRef = doc(firestore, path);
    return deleteDoc(docRef);
  }

  subscribeToCollection(collectionName: string, callback: (snapshot: QuerySnapshot) => void, constraints: QueryConstraint[] = []): Unsubscribe {
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);
    return onSnapshot(q, callback);
  }

  async uploadImage(imageBlob: Blob, path: string) {
    // 
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, imageBlob);
    return await getDownloadURL(storageRef);
  }
}
