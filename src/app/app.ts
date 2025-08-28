
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Menu } from './components/shared/menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AI_POS');

  private user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.user$.subscribe(authState => {
      if (authState !== null) {
        this.user = authState;
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
