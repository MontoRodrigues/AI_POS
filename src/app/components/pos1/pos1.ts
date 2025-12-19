import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { defaultConfig } from '../../config/config';
import { categoryObject, categoryStore, iProduct } from '../../interface/ipos';
import { PosCategory } from '../shared/pos-category/pos-category';
import { orderBy } from 'firebase/firestore';

declare var showLoader: Function;
declare var notify: Function;
declare var hideMenu: Function;


interface Category {
  id: string;
  name: string;
  icon: string;
}
// --- Mock Data ---
const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items', icon: '🔍' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'bakery', name: 'Bakery', icon: '🥐' },
  { id: 'food', name: 'Hot Food', icon: '🍔' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
];

@Component({
  selector: 'app-pos1',
  imports: [PosCategory],
  templateUrl: './pos1.html',
  styleUrl: './pos1.css'
})
export class Pos1 {

  user: any = null;
  user_initial: string | undefined = "";

  categories = CATEGORIES;

  private fb_subscribe_category: any;
  categoryList = signal<categoryStore[]>([]);
  selectedCategory = signal<string>('all');

  private fb_subscribe_product: any;
  productList = signal<iProduct[]>([]);




  constructor(private authService: AuthService, private firebaseService: FirebaseService) {

    this.authService.user$.subscribe(authState => {
      if (authState !== null) {
        this.user = authState;

        this.user_initial = authState.displayName?.split(" ").map(word => word.charAt(0)).join('');
      }
      else {
        this.user = null;
      }

    });

    // subscribe to Category collection
    this.fb_subscribe_category = this.firebaseService.subscribeToCollection(defaultConfig.collections.category.name, (snapshot) => {
      this.categoryList.set(this.getCategoryArray(snapshot));

      console.log("categoryList", this.categoryList());
    }, [orderBy('name')]);

    //subscribe to Products Collection
    this.fb_subscribe_product = this.firebaseService.subscribeToCollection(defaultConfig.collections.products.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        if (p[x]["sale"] != null) {
          p[x]["sale"].validFrom = p[x]["sale"].validFrom != null ? new Date(p[x]["sale"].validFrom.seconds * 1000 + p[x]["sale"].validFrom.nanoseconds / 1000000) : null;
          p[x]["sale"].validTill = p[x]["sale"].validTill != null ? new Date(p[x]["sale"].validTill.seconds * 1000 + p[x]["sale"].validTill.nanoseconds / 1000000) : null;
        }
      }
      this.productList.set(p);
      console.log("Product List", this.productList())
    }, [orderBy('name')]);
  }

  // filtered Category List
  filteredProducts = computed(():iProduct[] => {
    if (this.selectedCategory() == "all")
      return this.productList();
    else {
      return this.productList().filter((p) => p.categories.categoryIds.includes(this.selectedCategory()));
    }
  });

  // create Category JSON object
  getCategoryObject(snapshot: any): categoryObject {
    let category: any = {};

    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      category[doc.id] = d;
    });
    return category;
  }

  getCategoryArray(snapshot: any): categoryStore[] {
    let p: categoryStore[] = [];
    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      p.push(d);
    });
    return p;
  }

  // Get collection data as Array
  getDataFromCollection(snapshot: any): any[] {
    let p: any = []
    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      p.push(d);
    });
    return p;
  }


  logout() {
    this.authService.signOut();

  }
  ngOnInit() {
    showLoader(false);
  }
}
