
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare var showLoader: Function;

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


  constructor(public authService: AuthService, private router: Router,) {

    this.authService.user$.subscribe(authState => {
      if (authState !== null) {
        console.log("Redirecting after login successful");
        this.router.navigate(['/']);
      }

    });
  }

  ngOnInit() {

    showLoader(false);

  }

  loginWithGoogle() {
    this.authService.signInWithGoogle();
  }

  loginWithEmail() {
    this.authService.signInWithEmail(this.email, this.password);
  }

  // signUpWithEmail() {
  //   this.authService.signUpWithEmail(this.email, this.password);
  // }

  logout() {
    this.authService.signOut();
  }
}
