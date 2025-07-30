import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1>Welcome!</h1>
    <button (click)="logout()">Logout</button>
  `
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.signOut();
  }
}
