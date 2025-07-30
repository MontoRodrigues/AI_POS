import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1>You are Welcome!</h1>
    <button (click)="logout()">Logout</button>
  `
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe(authState => {
      console.log("User Details")
      if (authState !== null) {

      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.signOut();
  }
}
