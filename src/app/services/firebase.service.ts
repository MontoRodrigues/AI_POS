
import { Injectable } from '@angular/core';
import { collection, getDocs, QuerySnapshot, query, onSnapshot, Unsubscribe, QueryConstraint, setDoc, doc, deleteDoc, DocumentReference, addDoc, SetOptions, updateDoc, collectionGroup } from 'firebase/firestore';
import { firestore, storage, database } from './firebase';
import { ref as dbRef, set as dbSet, onValue as dbOnValue, update as dbUpdate, remove as dbRemove, push as dbPush, off as dbOff, DataSnapshot } from 'firebase/database';
// import { ISupplier } from '../interface/isupplier';
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

  async addDocument(path: string, data: any): Promise<DocumentReference> {
    const collectionRef = collection(firestore, path);
    return await addDoc(collectionRef, data);
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

  subscribeToCollectionGroup(collectionName: string, callback: (snapshot: QuerySnapshot) => void, constraints: QueryConstraint[] = []): Unsubscribe {
    const collectionRef = collectionGroup(firestore, collectionName);
    const q = query(collectionRef, ...constraints);
    return onSnapshot(q, callback);
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

  // realtime DB
  // Add these methods to the FirebaseService class

  /**
   * Write (replace) data at a path in Realtime Database.
   * Usage: await firebaseService.writeRealtime('/path/to/node', { a: 1 });
   */
  async writeRealtime(path: string, data: any): Promise<void> {
    const nodeRef = dbRef(database, path);
    return dbSet(nodeRef, data);
  }

  /**
   * Push a new child under a path and set its value. Returns the pushed key.
   * Usage: const key = await firebaseService.pushRealtime('/items', { name: 'x' });
   */
  async pushRealtime(path: string, data: any): Promise<string> {
    const listRef = dbRef(database, path);
    const newRef = dbPush(listRef);
    await dbSet(newRef, data);
    return newRef.key || '';
  }

  /**
   * Update specific children at a path (shallow merge).
   * Usage: await firebaseService.updateRealtime('/path/to/node', { field: 'new' });
   */
  async updateRealtime(path: string, data: Record<string, any>): Promise<void> {
    const nodeRef = dbRef(database, path);
    return dbUpdate(nodeRef, data);
  }

  /**
   * Remove a node at given path.
   * Usage: await firebaseService.deleteRealtime('/path/to/node');
   */
  async deleteRealtime(path: string): Promise<void> {
    const nodeRef = dbRef(database, path);
    return dbRemove(nodeRef);
  }

  /**
   * Subscribe to value changes at a path. Callback receives the DataSnapshot.
   * Returns an unsubscribe function you can call to detach the listener.
   *
   * Usage:
   * const unsubscribe = firebaseService.subscribeToRealtime('/path', snap => {
   *   const val = snap.val();
   *   // ...
   * });
   *
   * // later
   * unsubscribe();
   */
  subscribeToRealtime(path: string, callback: (snapshot: DataSnapshot) => void): () => void {
    const nodeRef = dbRef(database, path);
    const listener = (snap: DataSnapshot) => callback(snap);
    dbOnValue(nodeRef, listener);
    return () => {
      dbOff(nodeRef, 'value', listener);
    };
  }

}
