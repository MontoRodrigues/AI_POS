import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ImageCapture } from '../shared/delete_this/image-capture/image-capture';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { dataProduct, DataService } from '../../services/data-service';
import { Subscription } from 'rxjs';




declare var showLoader: Function;

@Component({
  selector: 'app-product',
  imports: [Breadcrumb],
  //imports: [ImageCapture, MatDialogModule, FormsModule, CommonModule, Select, TextDropdown, TextAddTags, TextAddAttr, Breadcrumb],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  @ViewChild(ImageCapture) imgCaptureRef!: ImageCapture;

  private subscribe_product: Subscription | undefined;
  product_list: dataProduct[] = [];

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
  }

  ngOnDestroy() {
    if (this.subscribe_product) {
      this.subscribe_product.unsubscribe();
    }

    // if (this.subscribe_brand) {
    //   this.subscribe_brand();
    // }

    // if (this.subscribe_attr_master) {
    //   this.subscribe_attr_master();
    // }
  }



}
