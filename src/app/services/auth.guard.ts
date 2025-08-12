import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { first, map, take } from 'rxjs/operators';
import { from } from 'rxjs';

/**
 * An authentication guard that uses Firebase Authentication to protect routes.
 * It checks the user's login status and redirects to a login page if they are not authenticated.
 * @returns A boolean observable that resolves to true if the user is logged in, or false otherwise.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = getAuth();

  // Return a promise that resolves only after the authentication state has been checked.
  return new Promise<boolean>((resolve) => {
    // This listener fires immediately with the current state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if a user object exists.
      if (user) {
        // User is logged in, allow access.
        console.log('User is authenticated. Allowing access.');
        resolve(true);
      } else {
        // User is not logged in, redirect to the login page.
        console.log('User is not authenticated. Redirecting to /login.');
        router.navigate(['/login']);
        resolve(false);
      }
      // Unsubscribe immediately after the first check to prevent memory leaks.
      unsubscribe();
    });
  });
};
