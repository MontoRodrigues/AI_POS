import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { dataPurchase, DataService } from '../../services/data-service';
import { Subscription } from 'rxjs';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var showLoader: Function;
declare var notify: Function;
showLoader();

@Component({
  selector: 'app-purchase-to-inventory',
  imports: [Breadcrumb, FormsModule, CommonModule],
  templateUrl: './purchase-to-inventory.html',
  styleUrl: './purchase-to-inventory.css'
})
export class PurchaseToInventory {

  docId: string | null = null;

  private subscribe_purchase_ready: Subscription | undefined;
  purchaseReady: boolean = false;

  purchase: dataPurchase | undefined = undefined;
  products:any = {};

  constructor(private router: Router, private route: ActivatedRoute, private firebaseService: FirebaseService, private dataService: DataService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    // on data ready
    this.docId = this.route.snapshot.paramMap.get('docId');
    this.subscribe_purchase_ready = this.dataService.purchaseReady$.subscribe({
      next: (value: boolean) => {
        this.purchaseReady = value;

        // get purchase data
        let p = this.dataService.get_purchase_to_add_inventory(this.docId);
        if (p != null) {
          this.purchase = p;

          let productFilter: (string | null)[] = this.purchase?.purchase.filter(item => item.docId != null).map(item => item.docId);
          let prod =undefined;
          if(productFilter.length>0)
              prod = this.dataService.get_purchase_product(productFilter);

          if(Object.keys(prod).length>0)
            this.products =prod;


          console.log("products:", prod);

          
          console.log("product filter", productFilter);

          console.log("purchase", p);

        }
        showLoader(false);
        this.cdRef.detectChanges();

      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }

}
