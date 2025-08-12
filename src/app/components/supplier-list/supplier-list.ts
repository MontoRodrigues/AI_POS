import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { ISupplier } from '../../interface/isupplier';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css'
})
export class SupplierList {

  new_supplier: ISupplier = {
    id: null,
    name: null,
    productCategory: [],
    contactPerson: null,
    email: null,
    phone: null,
    address: null,
    location: null,
    businessDescription: null
  }

  new_supplier_validate = {
    id: "mb-3",
    name: "mb-3",
    productCategory: "mb-3",
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

  getProductList(): string[] {
    return this.productCategoryList.filter((item: any) => !this.new_supplier.productCategory.includes(item));
  }

  add_ProductCategory() {
    if (this.productCategory != "None") {
      this.new_supplier.productCategory.push(this.productCategory);
      this.productCategory = "None"
      this.new_supplier_validate.productCategory = "mb-3";
    }
    console.log(this.productCategory);
    
  }

  deleteProductCategory(index: number) {
    this.new_supplier.productCategory.splice(index, 1); 
  }

  private CollectionName: string = "suppliers";
  private subscribe_supplier: any;
  supplier_list: any[] = [];
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService) {


  }

  private validateSupplier():boolean {
    let validate:boolean = true;

    // Supplier Name
    if (this.new_supplier.name == null) {
      validate = false;
      this.new_supplier_validate.name = "mb-3 error";
    }
    else {
      this.new_supplier_validate.name = "mb-3";
    }

    // Product Category
    if (this.new_supplier.productCategory.length == 0) {
      validate = false;
      this.new_supplier_validate.productCategory = "mb-3 error";
    }
    else {
      this.new_supplier_validate.productCategory = "mb-3";
    }

     // contactPerson
    if (this.new_supplier.contactPerson == null) {
      validate = false;
      this.new_supplier_validate.contactPerson = "mb-3 error";
    }
    else {
      this.new_supplier_validate.contactPerson = "mb-3";
    }
  

    return validate;
  }

  addSupplier() {
    console.log(this.new_supplier);
    console.log(this.new_supplier_validate);

    if(this.validateSupplier()){
      // add Supplier
    }
  }


  ngOnInit() {
    this.subscribe_supplier = this.firebaseService.subscribeToCollection(this.CollectionName, (snapshot) => {
      this.supplier_list = [];
      let p: any = []
      snapshot.forEach(doc => {
        p.push(doc.data());
      });
      this.supplier_list = p;
      console.log(this.supplier_list);
      this.cdRef.detectChanges()
    });
  }



}
