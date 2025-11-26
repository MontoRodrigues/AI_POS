import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dataInventory, dataProduct, dataPurchase, dataPurchaseProduct, DataService } from '../../services/data-service';
import { filter, Subscription } from 'rxjs';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BarcodeScanner } from '../shared/barcode-scanner/barcode-scanner';
import { purchaseProduct } from '../../interface/iproduct';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { defaultConfig } from '../../config/config';
import { NoopTreeKeyManager } from '@angular/cdk/a11y';
import { image_upload_result, ImageUpload } from "../shared/image-upload/image-upload";
import { SwitchBtn } from "../shared/switch-btn/switch-btn";

declare var showLoader: Function;
declare var notify: Function;
showLoader();

@Component({
  selector: 'app-purchase-add',
  imports: [Breadcrumb, CommonModule, FormsModule, ImageUpload, SwitchBtn],
  templateUrl: './purchase-add.html',
  styleUrl: './purchase-add.css'
})
export class PurchaseAdd {

  dialog = inject(MatDialog);

  purchaseProduct: dataPurchaseProduct = {
    new: false,
    docId: null,
    productName: null,
    barcode: null,
    purchasePrice: null,
    MRP: null,
    quantity: null,
    purchaseDate: null,
    previousPurchasePrice: null,
    PreviousMRP: null,
    currentInventory: null,
    image: null,
    reviewed: false,
    edit: false,
    editPurchasePrice: null,
    editQuantity: null
  }

  validatePurchaseProduct = {
    purchasePrice: "form-div",
    MRP: "form-div",
    quantity: "form-div",
    image: "form-div",
    productName: "form-div",
  }


  product: dataProduct | undefined = undefined;
  image: image_upload_result | undefined = undefined;



  docId: string | null = null;
  purchase: dataPurchase | undefined = undefined;

  private subscribe_purchase_ready: Subscription | undefined;
  purchaseReady: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private firebaseService: FirebaseService, private dataService: DataService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    // on data ready
    this.docId = this.route.snapshot.paramMap.get('docId');
    this.subscribe_purchase_ready = this.dataService.purchaseReady$.subscribe({
      next: (value: boolean) => {
        this.purchaseReady = value;
        // get purchase data
        let p = this.dataService.get_purchase(this.docId);
        if (p != null)
          this.purchase = p;

        this.calculateTotal();
        // else {
        //   notify("error", "Invalid id. Please go back");
        //   // this.router.navigate(["/purchase"]);
        // }
        console.log("Purchase", this.purchase);
        showLoader(false);
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }

  ngOnDestroy() {
    if (this.subscribe_purchase_ready) {
      this.subscribe_purchase_ready.unsubscribe();
    }
  }

  // start scanning for barcode 
  startScanner() {
    const dialogRef = this.dialog.open(BarcodeScanner, {
      data: null,
      width: '100%',
      panelClass: 'custom-dialogue'
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe((result: string) => {
        console.log("Barcode result");
        console.log(result);
        this.purchaseProduct.barcode = result;

        this.searchBarcode();
      });
  }

  searchBarcode() {
    console.log("Search", this.purchaseProduct.barcode);
    if (this.purchaseProduct.barcode == null || this.purchaseProduct.barcode == "") {
      notify("error", "Please enter teh Barcode to search", 1000);
      return;
    }
    else {
      //lets search the bar code
      let p = this.dataService.get_product_for_barcode(this.purchaseProduct.barcode);
      if (p != null) {
        this.product = p;

        this.purchaseProduct.docId = p.docId;
        this.purchaseProduct.productName = p.name;
        this.purchaseProduct.MRP = p.MRP;
        this.purchaseProduct.purchasePrice = p.purchasePrice;
        this.purchaseProduct.previousPurchasePrice = p.purchasePrice;
        this.purchaseProduct.PreviousMRP = p.MRP;
        this.purchaseProduct.currentInventory = p.currentInventory;

      }

      this.cdRef.detectChanges();

      console.log(p);

    }

  }

  // get the uploaded Image
  onImageSelected(e: image_upload_result) {
    this.image = e;
    console.log("image result", e);
  }


  calculateTotal() {
    let tp = 0;
    let tq = 0;
    if (this.purchase) {
      this.purchase.purchase.forEach(e => {


        let p = 0, q = 0;
        if (e.purchasePrice)
          p = e.purchasePrice;
        if (e.quantity)
          q = e.quantity;
        tp += p * q;
        tq += q;

      });
    }
    this.totalPrice = tp;
    this.totalQuantity = tq;
  }

  calculateLineTotal(a:any,b:any){
    return a*b;
  }


  totalPrice: number = 0;
  totalQuantity: number = 0;

  async deletePurchaseProduct(index: number) {
    if (this.purchase) {
      let c = confirm(`Do you want delete ${this.purchase.purchase[index].productName}`)
      if (c) {
        this.purchase.purchase.splice(index, 1);
        await this.firebaseService.updateDocument(defaultConfig.collections.purchase.name + "/" + this.docId, this.purchase);
        this.calculateTotal();
        this.cdRef.detectChanges();
        notify("success", "Deleted purchase successfully");
      }
    }
  }
  editPurchaseProduct(d: dataPurchaseProduct) {
    console.log(d);
    d.edit = true;
    d.editPurchasePrice = d.purchasePrice;
    d.editQuantity = d.quantity;
    d.editMRP = d.MRP;
  }

  cancelEditPurchaseProduct(d: dataPurchaseProduct) {
    console.log(d);
    d.edit = false;
    if (d.editPurchasePrice)
      d.purchasePrice = d.editPurchasePrice;
    if (d.editQuantity)
      d.quantity = d.editQuantity;
    if (d.editMRP)
      d.MRP = d.editMRP;

    d.editPurchasePrice = null;
    d.editQuantity = null;
    d.editMRP = null;
  }

  async savePurchaseProduct(d: dataPurchaseProduct) {
    let c = confirm(`Do you want to save the changed values; Purchase Price: from ${d.editPurchasePrice} to ${d.purchasePrice} and Quantity: from ${d.editQuantity} to ${d.quantity}`)
    if (c) {
      d.edit = false;
      d.editPurchasePrice = null;
      d.editQuantity = null;
      await this.firebaseService.updateDocument(defaultConfig.collections.purchase.name + "/" + this.docId, this.purchase);
      this.calculateTotal();
      this.cdRef.detectChanges();
      notify("success", "Updated purchase successfully");
    }
  }


  // needs to be coded
  FindProduct() {
    console.log("Find Product", this.purchaseProduct.barcode);
  }


  validate() {

    let v: boolean = true;
    ///------------validate Product
    // validate Product Name
    if (this.purchaseProduct.purchasePrice == null || this.purchaseProduct.purchasePrice == 0) {
      v = false;
      this.validatePurchaseProduct.purchasePrice = "form-div error";
    }
    else
      this.validatePurchaseProduct.purchasePrice = "form-div";


    if (this.purchaseProduct.MRP == null) {
      v = false;
      this.validatePurchaseProduct.MRP = "form-div error";
    }
    else
      this.validatePurchaseProduct.MRP = "form-div";

    if (this.purchaseProduct.quantity == null) {
      v = false;
      this.validatePurchaseProduct.quantity = "form-div error";
    }
    else
      this.validatePurchaseProduct.quantity = "form-div";


    if (this.image == null) {
      v = false;
      this.validatePurchaseProduct.image = "form-div error";
    }
    else
      this.validatePurchaseProduct.image = "form-div";

    // product Name 
    if (this.purchaseProduct.new && (this.purchaseProduct.productName == null || this.purchaseProduct.productName == "")) {
      v = false;
      this.validatePurchaseProduct.productName = "form-div error";
    }
    else
      this.validatePurchaseProduct.productName = "form-div";


    // check for duplicate products
    if (this.purchase && this.purchaseProduct.new == false) {
      let p = this.purchase.purchase.filter(item => item.docId == this.purchaseProduct.docId);
      console.log("fileting Product", p);
      if (p.length > 0) {
        v = false;
        notify("error", "Product already exists in your list.")
      }
      else if (!v) {
        notify("error", "Please complete the form.", 1000);
      }
    }
    else if (!v)
      notify("error", "Please complete the form.", 1000);

    return v;

  }
  // add purchase product to the list
  async addPurchaseProduct() {
    console.log(this.purchaseProduct);
    if (this.validate()) {
      showLoader();
      // Adding Date to the current purchase 
      this.purchaseProduct.purchaseDate = new Date();
      console.log("new purchase", this.purchaseProduct);


      if (this.image) {
        let img_name = self.crypto.randomUUID() + ".png";
        let img_path = defaultConfig.image_path.Purchase + "/" + img_name;
        let img_url = await this.firebaseService.uploadImage(this.image.blob, img_path);
        this.purchaseProduct.image = {
          downloadURL: img_url,
          fileName: img_name,
          folder: defaultConfig.image_path.Product
        };
      }


      // if Product is new the clean values for the below 
      if (this.purchaseProduct.new) {
        this.purchaseProduct.docId = null;
        this.purchaseProduct.previousPurchasePrice = null;
        this.purchaseProduct.PreviousMRP = null;
        this.purchaseProduct.currentInventory = null;
        this.purchaseProduct.barcode = null;
      }

      this.purchaseProduct.editPurchasePrice = null;
      this.purchaseProduct.editQuantity = null;

      // lets add the product to the list
      if (this.purchase) {
        this.purchase.purchase.push(this.purchaseProduct);
        this.calculateTotal();
        // update firebase document

       
        
        await this.firebaseService.updateDocument(defaultConfig.collections.purchase.name + "/" + this.docId, this.purchase);

        // set Default Values
        this.purchaseProduct = {
          new: false,
          docId: null,
          productName: null,
          barcode: null,
          purchasePrice: null,
          MRP: null,
          quantity: null,
          purchaseDate: null,
          previousPurchasePrice: null,
          PreviousMRP: null,
          currentInventory: null,
          image: null,
          reviewed: false,
          edit: false,
          editPurchasePrice: null,
          editQuantity: null
        };
        this.product = undefined;
        this.image = undefined;
        this.validatePurchaseProduct = {
          purchasePrice: "form-div",
          MRP: "form-div",
          quantity: "form-div",
          image: "form-div",
          productName: "form-div",
        };

        this.cdRef.detectChanges();
        notify("success", "Product added to the list.");

        showLoader(false);


      }

      showLoader(false);

    }

  }

  async validateClosePurchase() {
    let v: boolean = true;
    showLoader();
    if (this.purchase) {
      showLoader();
      for (let i = 0; i < this.purchase.purchase.length; i++) {
        if (this.purchase.purchase[i].reviewed == false)
          v = false;
      }


      if (v == true) {
        this.purchase.status = "reviewed";
        let c = confirm(`Do you want to Validate and Close the Purchase List. You will not be able to add any more items to it.`)
        if (c) {
          await this.firebaseService.updateDocument(defaultConfig.collections.purchase.name + "/" + this.docId, this.purchase);
          notify("success", "Purchase validated successfully. redirecting to Purchase List.");
          showLoader(false);
          this.router.navigate(["/purchase"]);
        }
      }
      else
        notify("error", "Please click and validate each product.");
    }

    showLoader(false);
  }

  get_image_url(docId: string | null): string {
    return this.dataService.get_product_image(docId);
  }
}
