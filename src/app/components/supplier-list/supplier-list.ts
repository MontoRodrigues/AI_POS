import { Component, OnInit, OnDestroy, ChangeDetectorRef, computed } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { ISupplier } from '../../interface/isupplier';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Multiselect, inputData } from '../shared/multiselect/multiselect';
import { dataCategory, DataService, dataSupplier } from '../../services/data-service';
import { Subscription } from 'rxjs';

declare var showLoader: Function;
declare var notify: Function;

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, FormsModule, Multiselect],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css'
})
export class SupplierList {


  private subscribe_supplier: Subscription | undefined;
  supplierList: dataSupplier[] = [];

  private subscribe_category: Subscription | undefined;
  category_list: dataCategory[] = [];

  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService, private dataService: DataService) {

  }


  ngOnInit() {
    this.subscribe_supplier = this.dataService.supplier$.subscribe({
      next: (value: dataSupplier[]) => {
        console.log("supplier", value);
        this.supplierList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    this.subscribe_category = this.dataService.category$.subscribe({
      next: (value: dataCategory[]) => {
        console.log("category", value);
        this.category_list = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    showLoader(false);
  }


  ngOnDestroy() {
    if (this.subscribe_supplier) {
      this.subscribe_supplier.unsubscribe();
    }
  }

  // new_supplier: ISupplier = {
  //   id: null,
  //   name: null,
  //   productCategory: [],
  //   contactPerson: null,
  //   email: null,
  //   phone: null,
  //   address: null,
  //   location: null,
  //   businessDescription: null
  // }

  new_supplier: ISupplier = {
    id: null,
    name: "Beauty India",
    productCategory: ["SjiBshoi8O2AEhFnNmEu"],
    contactPerson: "John Dow",
    email: "name@email.com",
    phone: "1234567890",
    address: "Bairaghar Bhopal ",
    location: "maps.google.com",
    businessDescription: "Cosmetics Seller"
  }

  new_supplier_validate = {
    id: "mb-3",
    name: "mb-3",
    productCategory: false,
    contactPerson: "mb-3",
    email: "mb-3",
    phone: "mb-3",
    address: "mb-3",
    location: "mb-3",
    businessDescription: "mb-3"
  }

  productCategory: string = "None";

  productCategoryList: any = [
    "None",
    "Cosmetics",
    "Jeweller",
    "Cloths"
  ];



  // getProductCategoryList = computed(() => this.productCategoryList.map((item: any) => { return { "value": item, "text": item } }));
  updateProductCategory(e: any[]) {
    this.new_supplier.productCategory = e;
    console.log(e);
  }






  // private validateSupplier(): boolean {

  //   let validate: boolean = true;

  //   // Supplier Name
  //   if (this.new_supplier.name == null || this.new_supplier.name == "") {
  //     validate = false;
  //     this.new_supplier_validate.name = "mb-3 error";
  //   }
  //   else {
  //     this.new_supplier_validate.name = "mb-3";
  //   }

  //   // Product Category
  //   if (this.new_supplier.productCategory.length == 0) {
  //     validate = false;
  //     this.new_supplier_validate.productCategory = true;
  //   }
  //   else {
  //     this.new_supplier_validate.productCategory = false;
  //   }

  //   // contactPerson
  //   if (this.new_supplier.contactPerson == null || this.new_supplier.contactPerson == "") {
  //     validate = false;
  //     this.new_supplier_validate.contactPerson = "mb-3 error";
  //   }
  //   else {
  //     this.new_supplier_validate.contactPerson = "mb-3";
  //   }


  //   // email
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!this.new_supplier.email || !emailRegex.test(this.new_supplier.email)) {
  //     validate = false;
  //     this.new_supplier_validate.email = "mb-3 error";
  //   } else {
  //     this.new_supplier_validate.email = "mb-3";
  //   }


  //   // phone
  //   const phoneRegex = /^\d{10}$/;
  //   if (!this.new_supplier.phone || !phoneRegex.test(this.new_supplier.phone)) {
  //     validate = false;
  //     this.new_supplier_validate.phone = "mb-3 error";
  //   } else {
  //     this.new_supplier_validate.phone = "mb-3";
  //   }

  //   // address
  //   if (!this.new_supplier.address || this.new_supplier.address == "") {
  //     validate = false;
  //     this.new_supplier_validate.address = "mb-3 error";
  //   } else {
  //     this.new_supplier_validate.address = "mb-3";
  //   }

  //   // location
  //   if (!this.new_supplier.location || this.new_supplier.location == "") {
  //     validate = false;
  //     this.new_supplier_validate.location = "mb-3 error";
  //   } else {
  //     this.new_supplier_validate.location = "mb-3";
  //   }

  //   // businessDescription
  //   if (!this.new_supplier.businessDescription || this.new_supplier.businessDescription == "") {
  //     validate = false;
  //     this.new_supplier_validate.businessDescription = "mb-3 error";
  //   } else {
  //     this.new_supplier_validate.businessDescription = "mb-3";
  //   }



  //   return validate;
  // }

  addSupplier() {
    console.log(this.new_supplier);
  }
  // async addSupplier() {
  //   console.log("Validating");
  //   console.log(this.new_supplier);
  //   console.log(this.new_supplier_validate);

  //   if (this.validateSupplier()) {
  //     // add Supplier
  //     toggle_left_slide_model();
  //     this.new_supplier.id = self.crypto.randomUUID();
  //     await this.firebaseService.addDocument(this.CollectionName, this.new_supplier);

  //     // clear New Supplier 
  //     this.new_supplier = {
  //       id: null,
  //       name: null,
  //       productCategory: [],
  //       contactPerson: null,
  //       email: null,
  //       phone: null,
  //       address: null,
  //       location: null,
  //       businessDescription: null
  //     };

  //   }
  // }

  // navigateTo(path: string) {
  //   // this.router.navigate(['/dashboard']);
  //   this.router.navigate([path]);
  // }




}
