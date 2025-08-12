import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { Unsubscribe, where, orderBy, limit } from 'firebase/firestore';

@Component({
  selector: 'app-purchase-list.component',
  imports: [],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent {
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
      let p: any = []
      snapshot.forEach(doc => {
        p.push(doc.data());
      });
      this.products = p;
      console.log(this.products);
      this.cdRef.detectChanges()
    }, constraints);
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

}
