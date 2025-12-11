import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';

import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { Select } from "../shared/select/select";
import { Ipurchase, purchaseProduct } from '../../interface/iproduct';

import { dataPurchase, DataService, dataSupplier } from '../../services/data-service';
import { Subscription } from 'rxjs';
import { defaultConfig } from '../../config/config';
import { c } from "../../../../node_modules/@angular/cdk/a11y-module.d--J1yhM7R";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

declare var showLoader: Function;
declare var notify: Function;

@Component({
  selector: 'app-purchase-list.component',
  imports: [Breadcrumb, Select, CommonModule, FormsModule, RouterLink],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent {


  user: any = null;
  private subscribe_supplier: Subscription | undefined;
  supplierList: dataSupplier[] = [];

  private subscribe_purchase: Subscription | undefined;
  purchaseList: dataPurchase[] = [];

  newPurchase: Ipurchase = {
    supplier: {
      name: null,
      docId: null
    },
    purchaseDate: null,
    purchase: [],
    status: null,
    createdBy: null
  }

  validateNewPurchase = {
    supplier: "form-div"
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private router: Router,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe(authState => {
      if (authState !== null) {
        this.user = authState;
        console.log(authState);
      }
      else {
        this.user = null;
      }

    });
  }




  ngOnInit() {
    showLoader(false);
    // get purchase list
    this.subscribe_purchase = this.dataService.purchase$.subscribe({
      next: (value: dataPurchase[]) => {
        console.log("purchase", value);
        this.purchaseList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    // get supplier list
    this.subscribe_supplier = this.dataService.supplier$.subscribe({
      next: (value: dataSupplier[]) => {
        console.log("supplier", value);
        this.supplierList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }

  ngOnDestroy() {
    if (this.subscribe_supplier) {
      this.subscribe_supplier.unsubscribe();
    }
    if (this.subscribe_purchase) {
      this.subscribe_purchase.unsubscribe();
    }
  }

  validate() {
    let v = true;
    if (this.newPurchase.supplier.docId == null) {
      v = false;
      this.validateNewPurchase.supplier = "form-div error";
    }
    else
      this.validateNewPurchase.supplier = "form-div";

    return v;
  }

  async addPurchase() {
    if (this.validate()) {

      showLoader();

      // get supplier name 
      let s = this.supplierList.filter(item => item.docId == this.newPurchase.supplier.docId);
      if (s.length > 0)
        this.newPurchase.supplier.name = s[0].name;

      this.newPurchase.purchaseDate = new Date();
      this.newPurchase.status = "new";
      this.newPurchase.createdBy = this.user.displayName;


      let doc = await this.firebaseService.addDocument(defaultConfig.collections.purchase.name, this.newPurchase);


      this.newPurchase = {
        supplier: {
          name: null,
          docId: null
        },
        purchaseDate: null,
        purchase: [],
        status: null,
        createdBy: null
      }

      this.validateNewPurchase = {
        supplier: "form-div"
      }

      // this.router.navigate(["/purchase"]);

      this.cdRef.detectChanges();
      notify("success", "Purchase List added successfully. Redirecting to Add Purchase.", 15000);
      showLoader(false);
      this.router.navigate(["/purchase/add_purchase/" + doc.id]);



    }
  }

  async deletePurchase(purchase: dataPurchase) {
    console.log("delete purchase", purchase);

    const confirmDelete = confirm(`Are you sure you want to delete the purchase from supplier "${purchase.supplier.name}"? This action cannot be undone.`);
    if (confirmDelete) {
      showLoader(true);
      await this.firebaseService.deleteDocument(defaultConfig.collections.purchase.name + "/" + purchase.docId);
      this.cdRef.detectChanges();
      notify("success", "Purchase deleted successfully");
      showLoader(false);
      
    }
  }


}
