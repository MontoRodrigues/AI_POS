import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ImageCapture } from '../shared/delete_this/image-capture/image-capture';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { dataInventory, dataProduct, DataService } from '../../services/data-service';
import { Subscription } from 'rxjs';
import { defaultConfig } from '../../config/config';




declare var showLoader: Function;

@Component({
  selector: 'app-product',
  imports: [Breadcrumb, RouterLink],
  //imports: [ImageCapture, MatDialogModule, FormsModule, CommonModule, Select, TextDropdown, TextAddTags, TextAddAttr, Breadcrumb],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  @ViewChild(ImageCapture) imgCaptureRef!: ImageCapture;

  private subscribe_product: Subscription | undefined;
  product_list: dataProduct[] = [];

  private subscribe_inventory: Subscription | undefined;
  inventory_list: any = {};

  // delete 



  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit() {
    showLoader(false);
    this.subscribe_product = this.dataService.product$.subscribe({
      next: (value: dataProduct[]) => {
        console.log("service product", value);
        this.product_list = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    this.subscribe_inventory = this.dataService.inventory$.subscribe({
      next: (value: dataInventory[]) => {
        this.inventory_list = {};
        for (let inv of value) {
          if (inv.productDocId != null) {
            if (!this.inventory_list.hasOwnProperty(inv.productDocId))
              this.inventory_list[inv.productDocId] = [];
            this.inventory_list[inv.productDocId].push(inv);
          }
        }
        console.log("service Inventory", this.inventory_list);
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }

  ngOnDestroy() {
    if (this.subscribe_product) {
      this.subscribe_product.unsubscribe();
    }
    if (this.subscribe_inventory) {
      this.subscribe_inventory.unsubscribe();
    }
  }

  get_inventory_count(docId: string | null): number {
    if (this.inventory_list.hasOwnProperty(docId) && docId != null) {
      let total = 0;
      for (let inv of this.inventory_list[docId]) {
        total += inv.quantity;
      }
      return total;
    }
    return 0;
  }

  get_inventory_selling_price(docId: string | null): number {
    if (this.inventory_list.hasOwnProperty(docId) && docId != null) {
      return this.inventory_list[docId][0].sellingPrice;
    }
    return 0;
  }

  navigateTo(path: string) {
    console.log("navigate to ", path);
    this.router.navigate([path]);
  }

  async delete_product(p:dataProduct){
    console.log(p);
     let c = confirm(`Do you want to Delete the product;`)
        if (c) {
           await this.firebaseService.deleteDocument(defaultConfig.collections.products.name + "/" + p.docId);
           
        }
  }
}
