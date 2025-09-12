
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { Unsubscribe, where, orderBy, limit } from 'firebase/firestore';
import { defaultConfig } from '../../config/config';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";

declare var showLoader: Function;

@Component({
  selector: 'app-home',
  imports: [CommonModule, Breadcrumb],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    showLoader(false);
    //throw new Error('Method not implemented.');
  }
  // products: any[] = [];
  // private unsubscribe: Unsubscribe | undefined;
  // user: any = null;

  // constructor(
  //   private cdRef: ChangeDetectorRef,
  //   private authService: AuthService,
  //   private router: Router,
  //   private firebaseService: FirebaseService
  // ) {

  // }

  // async add_UOm_collection() {
  //   let data=[]

  //   data.forEach(async d => {
  //     //console.log(d);
  //     await this.firebaseService.addDocument(defaultConfig.collections.attribute.name, d).then();
  //   });

  // }

  // navigateTo(path: string) {
  //   this.router.navigate(['/' + path]);
  // }

  // ngOnInit() {

  //   //  this.firebaseService.getCollection('products', 10).then(querySnapshot => {
  //   //   querySnapshot.forEach(doc => {
  //   //     this.products.push(doc.data());
  //   //   });
  //   // });

  //   const constraints = [
  //     // where('price', '>', 50),
  //     // orderBy('price', 'desc'),
  //     // orderBy('name'),
  //     limit(10)
  //   ];

  //   this.unsubscribe = this.firebaseService.subscribeToCollection('products', (snapshot) => {
  //     this.products = [];
  //     let p: any = []
  //     snapshot.forEach(doc => {
  //       p.push(doc.data());
  //     });
  //     this.products = p;
  //     //console.log(this.products);
  //     this.cdRef.detectChanges()
  //   }, constraints);
  // }

  // ngOnDestroy() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }

  // logout() {
  //   this.authService.signOut();
  // }
}
