import { Component, OnInit, OnDestroy, ChangeDetectorRef, computed } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { ISupplier } from '../../interface/isupplier';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Multiselect, inputData } from '../shared/multiselect/multiselect';
import { dataCategory, DataService, dataSupplier } from '../../services/data-service';
import { Subscription } from 'rxjs';
import { Breadcrumb } from '../shared/breadcrumb/breadcrumb';
import { defaultConfig } from '../../config/config';

declare var showLoader: Function;
declare var notify: Function;

@Component({
  selector: 'app-supplier-list',
  imports: [CommonModule, FormsModule, Multiselect, Breadcrumb],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css'
})
export class SupplierList {


  private subscribe_supplier: Subscription | undefined;
  supplier_list: dataSupplier[] = [];

  private subscribe_category: Subscription | undefined;
  category_list: dataCategory[] = [];

  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService, private dataService: DataService) {

  }


  ngOnInit() {
    this.subscribe_supplier = this.dataService.supplier$.subscribe({
      next: (value: dataSupplier[]) => {
        console.log("supplier", value);
        this.supplier_list = value;
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
    name: null,
    productCategory: ["SjiBshoi8O2AEhFnNmEu"],
    contactPerson: null,
    email: "name@email.com",
    phone: "9167665818",
    address: " Bhopal MP 462042 India",
    location: "https://maps.google.com",
    businessDescription: ""
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

  // productCategory: string = "None";

  // productCategoryList: any = [
  //   "None",
  //   "Cosmetics",
  //   "Jeweller",
  //   "Cloths"
  // ];



  // getProductCategoryList = computed(() => this.productCategoryList.map((item: any) => { return { "value": item, "text": item } }));
  // updateProductCategory(e: any[]) {
  //   this.new_supplier.productCategory = e;
  //   console.log(e);
  // }


  // Get Category Name from docId
  get_categoryName(docId: string): string {
    let category = this.category_list.find(cat => cat.docId == docId);
    if (category) {
      return category.name;
    }
    return "";
  }


  async delete_supplier(supplier: dataSupplier) {
    console.log("Delete Supplier", supplier);
    let c = confirm(`Do you want to Delete ${supplier.name}?`)
    if (c) {
      showLoader(true);
      await this.firebaseService.deleteDocument(defaultConfig.collections.suppliers.name + "/" + supplier.docId);
      notify("success", `Supplier ${supplier.name} deleted successfully`);
      showLoader(false);
    }
  }

  editSupplierClick(supplier: dataSupplier) {
    console.log("Edit Supplier", supplier);
    supplier.edit = true;
    supplier.edit_productCategory = supplier.productCategory;
    supplier.edit_name = supplier.name;
    supplier.edit_address = supplier.address;
    supplier.edit_phone = supplier.phone;
    supplier.edit_email = supplier.email;
    supplier.edit_contactPerson = supplier.contactPerson;
    supplier.edit_location = supplier.location;
    supplier.edit_businessDescription = supplier.businessDescription;

    this.cdRef.detectChanges();
  }

  cancelUpdateSupplier(supplier: dataSupplier) {
    console.log("Cancel Update Supplier", supplier);
    supplier.edit = false;
    supplier.productCategory = supplier.edit_productCategory ?? supplier.productCategory;
    supplier.name = supplier.edit_name ?? supplier.name;
    supplier.address = supplier.edit_address ?? supplier.address;
    supplier.phone = supplier.edit_phone ?? supplier.phone;
    supplier.email = supplier.edit_email ?? supplier.email;
    supplier.contactPerson = supplier.edit_contactPerson ?? supplier.contactPerson;
    supplier.location = supplier.edit_location ?? supplier.location;
    supplier.businessDescription = supplier.edit_businessDescription ?? supplier.businessDescription;

    this.cdRef.detectChanges();
  }

  async updateSupplier(supplier: dataSupplier) {
    console.log("Update Supplier", supplier);
    // validate Supplier

    let validate: boolean = true;

    // Supplier Name
    if (supplier.name == null || supplier.name == "")
      validate = false;

    // Product Category
    if (supplier.productCategory != null && supplier.productCategory.length == 0)
      validate = false;

    // contactPerson
    if (supplier.contactPerson == null || supplier.contactPerson == "")
      validate = false;

    // phone
    const phoneRegex = /^\d{10}$/;
    if (!supplier.phone || !phoneRegex.test(supplier.phone.toString()))
      validate = false;

    // address
    if (!supplier.address || supplier.address == "")
      validate = false;

    if (validate) {
      showLoader(true);
      // update Supplier

      let _new_supplier: ISupplier = {
        id: supplier.id,
        name: supplier.name,
        productCategory: supplier.productCategory ?? [],
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone ? supplier.phone.toString() : null,
        address: supplier.address,
        location: supplier.location,
        businessDescription: supplier.businessDescription
      }
      await this.firebaseService.updateDocument(defaultConfig.collections.suppliers.name + "/" + supplier.docId, _new_supplier);

      supplier.edit = false;
      this.cdRef.detectChanges();
      showLoader(false);
    }
    else
      notify("error", "Please fill all the mandatory fields");

  }



  private validateSupplier(): boolean {

    let validate: boolean = true;

    // Supplier Name
    if (this.new_supplier.name == null || this.new_supplier.name == "") {
      validate = false;
      this.new_supplier_validate.name = "mb-3 error";
    }
    else {
      this.new_supplier_validate.name = "mb-3";
    }

    console.log();
    // Product Category
    if (this.new_supplier.productCategory.length == 0) {
      validate = false;
      this.new_supplier_validate.productCategory = "mb-3 error";
    }
    else {
      this.new_supplier_validate.productCategory = "mb-3";
    }

    // contactPerson
    if (this.new_supplier.contactPerson == null || this.new_supplier.contactPerson == "") {
      validate = false;
      this.new_supplier_validate.contactPerson = "mb-3 error";
    }
    else {
      this.new_supplier_validate.contactPerson = "mb-3";
    }


    // email
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!this.new_supplier.email || !emailRegex.test(this.new_supplier.email)) {
    //   validate = false;
    //   this.new_supplier_validate.email = "mb-3 error";
    // } else {
    //   this.new_supplier_validate.email = "mb-3";
    // }


    // phone
    const phoneRegex = /^\d{10}$/;
    if (!this.new_supplier.phone || !phoneRegex.test(this.new_supplier.phone)) {
      validate = false;
      this.new_supplier_validate.phone = "mb-3 error";
    } else {
      this.new_supplier_validate.phone = "mb-3";
    }

    // address
    if (!this.new_supplier.address || this.new_supplier.address == "") {
      validate = false;
      this.new_supplier_validate.address = "mb-3 error";
    } else {
      this.new_supplier_validate.address = "mb-3";
    }

    // location
    // if (!this.new_supplier.location || this.new_supplier.location == "") {
    //   validate = false;
    //   this.new_supplier_validate.location = "mb-3 error";
    // } else {
    //   this.new_supplier_validate.location = "mb-3";
    // }

    // businessDescription
    // if (!this.new_supplier.businessDescription || this.new_supplier.businessDescription == "") {
    //   validate = false;
    //   this.new_supplier_validate.businessDescription = "mb-3 error";
    // } else {
    //   this.new_supplier_validate.businessDescription = "mb-3";
    // }



    return validate;
  }

  // addSupplier() {
  //   console.log(this.new_supplier);
  // }
  async addSupplier() {
    console.log("Validating");
    console.log(this.new_supplier);
    console.log(this.new_supplier_validate);

    if (this.validateSupplier()) {
      // add Supplier
      this.new_supplier.id = self.crypto.randomUUID();
      await this.firebaseService.addDocument(defaultConfig.collections.suppliers.name, this.new_supplier);

      // clear New Supplier 
      this.new_supplier = {
        id: null,
        name: null,
        productCategory: [],
        contactPerson: null,
        email: null,
        phone: null,
        address: null,
        location: null,
        businessDescription: null
      };

      this.new_supplier_validate = {
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

      this.cdRef.detectChanges();
      notify("success", "Supplier added successfully");

    }
  }

  // navigateTo(path: string) {
  //   // this.router.navigate(['/dashboard']);
  //   this.router.navigate([path]);
  // }




}
