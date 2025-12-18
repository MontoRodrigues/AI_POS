import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var showLoader: Function;
declare var notify: Function;
declare var hideMenu: Function;

@Component({
  selector: 'app-pos1',
  imports: [],
  templateUrl: './pos1.html',
  styleUrl: './pos1.css'
})
export class Pos1 {

  user: any = null;
  user_initial: string | undefined = "";

  constructor(private authService: AuthService) {

    this.authService.user$.subscribe(authState => {
      if (authState !== null) {
        this.user = authState;

        this.user_initial = authState.displayName?.split(" ").map(word => word.charAt(0)).join('');
      }
      else {
        this.user = null;
      }

    });
  }

  logout() {
    this.authService.signOut();

  }
  ngOnInit() {
    showLoader(false);
  }
}
