
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(public authService: AuthService) { }

  loginWithGoogle() {
    this.authService.signInWithGoogle();
  }

  loginWithEmail() {
    this.authService.signInWithEmail(this.email, this.password);
  }

  signUpWithEmail() {
    this.authService.signUpWithEmail(this.email, this.password);
  }

  logout() {
    this.authService.signOut();
  }
}
