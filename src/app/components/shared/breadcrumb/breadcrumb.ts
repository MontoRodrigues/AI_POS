import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css'
})
export class Breadcrumb {
  current_path: any[] | null = null;
  constructor(private router: Router) {

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

  ngOnInit() {
    this.getPath(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.getPath(event.url);
    });
  }



  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
