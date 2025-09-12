import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { defaultConfig } from '../../../config/config';

declare var toggle_side_menu: Function;

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  show_menu = false;
  user: any = null;
  current_path: any[] | null = null;
  user_initial: string | undefined = "";
  navMenu: any[] = [];

  constructor(private router: Router, private authService: AuthService) {

    this.getPath(router.url);
    this.get_nav(router.url);
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

  private getPath(url: string) {
    let p: any[] = url.split("/").filter(item => item != '');
    let path = "";
    let path_array: any[] = [];
    // path_array.push({text:"home", path:"/"});
    p.forEach((e) => {
      path = "/" + e;
      path_array.push({ text: e.replaceAll("_"," "), path: path });
    })
    this.current_path = path_array;

  }

  get_nav(url: string) {

    

    let n: any = [];
    defaultConfig.nav.forEach((d: any) => {
      d["active"] = false;
      if (d.hasOwnProperty("path") && d.path == url)
        d["active"] = true;

      if (d.hasOwnProperty("subMenu")) {
       
        d.subMenu.forEach((s: any) => {
          if (s.path == url) {
            d["active"] = true;
            s["active"] = true;
          }
          else{
             s["active"] = false;
          }
        });
      }

      n.push(d);
    });

    this.navMenu = n;
  
  }

  ngOnInit() {
    this.getPath(this.router.url);
    this.get_nav(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.getPath(event.url);
      this.get_nav(event.url);
    });
  }



  navigateTo(path: string, con: boolean) {
    if (con == true)
      toggle_side_menu();
    this.router.navigate([path]);
  }

  logout() {
    this.authService.signOut();

  }
}
