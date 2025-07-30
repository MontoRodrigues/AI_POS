import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(authService.user$);
  return authService.user$.pipe(

    take(1),
    map(user => {
      console.log(user)
      if (user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
