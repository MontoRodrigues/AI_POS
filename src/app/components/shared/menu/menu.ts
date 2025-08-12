import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  show_menu = false;
   user: any = null;

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(authState => {
      console.log("User Details")
      if (authState !== null) {
        this.user = authState;
        console.log(authState);
      }
    });
  }

  navigateTo(path:string){
    console.log(path)
  }

  cssClass(e: string) {
    if (this.show_menu)
      return "show " + e;
    else
      return e;
  }

  menu_toggle() {
    if (this.show_menu)
      this.show_menu = false;
    else
      this.show_menu = true;
    console.log("Show Mnu=", this.show_menu);
  }
}
