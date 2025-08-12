
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { Unsubscribe, where, orderBy, limit } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Welcome! {{user.displayName}}</h1>
    <button (click)="logout()">Logout</button>
    <h2>Top 10 Products (Price > 50)</h2>
    <ul>
      <li *ngFor="let product of products">
        {{ product.Name }}
      </li>
    </ul>
    <button type="button" (click)="navigateTo('purchase')">Purchase</button>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  products: any[] = [];
  private unsubscribe: Unsubscribe | undefined;
  user: any = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    this.authService.user$.subscribe(authState => {
      console.log("User Details")
      if (authState !== null) {
        this.user = authState;
        console.log(authState);
      }
    });

  }

  navigateTo(path: string){
    this.router.navigate(['/'+path]);
  }

  ngOnInit() {

    //  this.firebaseService.getCollection('products', 10).then(querySnapshot => {
    //   querySnapshot.forEach(doc => {
    //     this.products.push(doc.data());
    //   });
    // });

    const constraints = [
      // where('price', '>', 50),
      // orderBy('price', 'desc'),
      // orderBy('name'),
      limit(10)
    ];

    this.unsubscribe = this.firebaseService.subscribeToCollection('products', (snapshot) => {
      this.products = [];
      let p:any =[]
      snapshot.forEach(doc => {
        p.push(doc.data());
      });
      this.products =p;
      console.log(this.products);
      this.cdRef.detectChanges()
    }, constraints);
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  logout() {
    this.authService.signOut();
  }
}
