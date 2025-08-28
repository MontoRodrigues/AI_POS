import { ChangeDetectorRef, Component } from '@angular/core';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { where, orderBy, limit } from 'firebase/firestore';
import { defaultConfig } from '../../config/config';
import { Iproduct } from '../../interface/iproduct';
import { FormsModule } from '@angular/forms';
import { TextDropdown } from "../shared/text-dropdown/text-dropdown";

@Component({
  selector: 'app-product-add',
  imports: [Breadcrumb, FormsModule, TextDropdown],
  templateUrl: './product-add.html',
  styleUrl: './product-add.css'
})
export class ProductAdd {

  private subscribe_category: any;
  category_list: any[] = [];

  private subscribe_brand: any;
  brandList: any[] = [];

  private subscribe_attr: any;
  attrList: any[] = [];

  newProduct: Iproduct = {
      id: null,
      sku: null,
      barcode: null,
      name: null,
      slug: null,
      brand: null,
      categoryIds: [],
      path: null,
      uom: null,
      taxRate: 0,
      sale: null,
      image: null,
      searchTokens: [],
      attributes: []
    };
  
    validateNewProduct = {
      name: "form-div",
      sku: "form-div",
      barcode: "form-div",
      brand: "form-div",
      uom: "form-div",
      categoryIds: "form-div",
      image: "form-div",
      searchTokens: "form-div",
      attributes: "form-div",
    }
  



  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService) { }
  ngOnInit() {
  
    // subscribe Category collection 
    this.subscribe_category = this.firebaseService.subscribeToCollection(defaultConfig.collections.category.name, (snapshot) => {
      this.category_list = [];
      let p: any = []

      snapshot.forEach(doc => {
        p.push({ docId: doc.id, data: doc.data() });
      });

      this.category_list = p;
      this.cdRef.detectChanges();
      console.log(this.category_list);
    }, [orderBy('path')]);

    // subscribe Brand collection 
    this.subscribe_brand = this.firebaseService.subscribeToCollection(defaultConfig.collections.brand.name, (snapshot) => {
      this.brandList = [];
      let p: any = []

      snapshot.forEach(doc => {
        p.push(doc.data()["name"]);
      });
      this.brandList = p;
      this.cdRef.detectChanges();
      console.log(this.brandList);
    }, [
      orderBy('name')
    ]);

    // subscribe Brand collection 
    this.subscribe_attr = this.firebaseService.subscribeToCollection(defaultConfig.collections.attribute.name, (snapshot) => {
      this.attrList = [];
      let p: any = []

      snapshot.forEach(doc => {
        p.push(doc.data()["name"]);
      });
      this.attrList = p;
      this.cdRef.detectChanges();
      console.log(this.attrList);
    }, [
      orderBy('name')
    ]);

  }

  ngOnDestroy() {
    if (this.subscribe_category) {
      this.subscribe_category();
    }

    if (this.subscribe_brand) {
      this.subscribe_brand();
    }

    if (this.subscribe_attr) {
      this.subscribe_attr();
    }
  }


  // start scanning 
  startScanner(){

  }
}
