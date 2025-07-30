
import { Injectable } from '@angular/core';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(auth, user => {
      this.userSubject.next(user);
    });
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  signOut() {
    return signOut(auth);
  }
}
