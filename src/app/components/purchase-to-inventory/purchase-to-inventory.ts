import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { dataAttributes, dataBrand, dataCategory, dataPurchase, DataService, dataSupplier, dataUOM } from '../../services/data-service';
import { filter, Subscription } from 'rxjs';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Iproduct } from '../../interface/iproduct';
import { MatDialog } from '@angular/material/dialog';
import { defaultConfig } from '../../config/config';
import { BarcodeScanner } from '../shared/barcode-scanner/barcode-scanner';
import { TextDropdown } from "../shared/text-dropdown/text-dropdown";
import { Select } from "../shared/select/select";
import { TextAddAttr } from "../shared/text-add-attr/text-add-attr";
import { TextAddTags } from "../shared/text-add-tags/text-add-tags";

declare var showLoader: Function;
declare var notify: Function;
declare var toggle_tabs: Function;
showLoader();

@Component({
  selector: 'app-purchase-to-inventory',
  imports: [Breadcrumb, FormsModule, CommonModule, TextDropdown, Select, TextAddAttr, TextAddTags],
  templateUrl: './purchase-to-inventory.html',
  styleUrl: './purchase-to-inventory.css'
})
export class PurchaseToInventory {


  dialog = inject(MatDialog);
  conf = defaultConfig;

  category_doc_id: string | null = null;

  private subscribe_category: Subscription | undefined;
  category_list: dataCategory[] = [];

  private subscribe_supplier: Subscription | undefined;
  supplierList: dataSupplier[] = [];

  private subscribe_brand: Subscription | undefined;
  brandList: dataBrand[] = [];

  private subscribe_attr: Subscription | undefined;
  attrList: dataAttributes[] = [];

  private subscribe_uom: Subscription | undefined;
  uomList: dataUOM[] = [];

  newProduct: Iproduct = {
    id: null,
    sku: null,
    barcode: null,
    name: null,
    slug: null,
    brand: null,
    categories: {
      categoryIds: [],
      path: []
    },
    uom: null,
    taxRate: 5,
    sale: null,
    image: [],
    searchTokens: [],
    attributes: [],
  };

  validateNewProduct = {
    name: "form-div",
    sku: "form-div",
    barcode: "form-div",
    brand: "form-div",
    uom: "form-div",
    categories: "form-div",
    image: "form-div",
    searchTokens: "form-div",
    attributes: "form-div",
  };

  // Search Product
  show_overlay_form: boolean = false;
  search_product_input: string | null = null;
  search_product_list: any[] = [];
  selected_purchase: any = null;
  selected_purchase_index: number = 0;

  docId: string | null = null;

  private subscribe_purchase_ready: Subscription | undefined;
  purchaseReady: boolean = false;

  purchase: dataPurchase | undefined = undefined;
  products: any = {};

  constructor(private router: Router, private route: ActivatedRoute, private firebaseService: FirebaseService, private dataService: DataService, private cdRef: ChangeDetectorRef) {

  }

  getProducts(p: dataPurchase) {
    // get the product filter
    let productFilter: (string | null)[] | undefined = p?.purchase.filter(item => item.docId != null).map(item => item.docId);
    let prod = undefined;
    if (productFilter && productFilter.length > 0) {
      // get the products with inventory
      prod = this.dataService.get_purchase_product(productFilter);
      this.products = prod;
      if (Object.keys(prod).length > 0) {
        // update the selling price and last inventory
        for (let i = 0; i < p.purchase.length; i++) {
          let docId = p.purchase[i].docId;
          if (docId && docId != null && prod.hasOwnProperty(docId) && prod[docId].inventory.length > 0) {
            p.purchase[i].latestInventory = prod[docId].inventory[0];
            p.purchase[i].sellingPrice = prod[docId].inventory[0].sellingPrice;
          }
        }
      }
    }



    console.log("product filter", productFilter);
    console.log("products:", prod);
  }

  ngOnInit() {
    // on data ready get the purchase and related Product 
    this.docId = this.route.snapshot.paramMap.get('docId');
    this.subscribe_purchase_ready = this.dataService.purchaseReady$.subscribe({
      next: (value: boolean) => {
        this.purchaseReady = value;

        // get purchase data
        let p: dataPurchase = this.dataService.get_purchase_to_add_inventory(this.docId);
        this.purchase = p;
        if (p != null) {

          this.getProducts(p);
          console.log("purchase", p);

        }
        showLoader(false);
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

    // subscribe Supplier collection 
    this.subscribe_supplier = this.dataService.supplier$.subscribe({
      next: (value: dataSupplier[]) => {
        console.log("supplier", value);
        this.supplierList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    // subscribe Brand collection 
    this.subscribe_brand = this.dataService.brand$.subscribe({
      next: (value: dataBrand[]) => {
        console.log("brand", value);
        this.brandList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });


    // subscribe Attribute collection 
    this.subscribe_attr = this.dataService.attributes$.subscribe({
      next: (value: dataAttributes[]) => {
        console.log("attribute", value);
        this.attrList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    // subscribe uom collection 
    this.subscribe_uom = this.dataService.uom$.subscribe({
      next: (value: dataUOM[]) => {
        console.log("UOM", value);
        this.uomList = value;
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

    if (this.subscribe_category) {
      this.subscribe_category.unsubscribe();
    }

    if (this.subscribe_brand) {
      this.subscribe_brand.unsubscribe();
    }

    if (this.subscribe_supplier) {
      this.subscribe_supplier.unsubscribe();
    }

    if (this.subscribe_attr) {
      this.subscribe_attr.unsubscribe();
    }

    if (this.subscribe_uom) {
      this.subscribe_uom.unsubscribe();
    }
  }

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
        this.newProduct.barcode = result;
        this.cdRef.detectChanges();
      });
  }

  // ----------------Search Product 
  startScannerSearch() {
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
        this.search_product_input = result;
        this.searchProduct();
        this.cdRef.detectChanges();
      });
  }

  searchProduct() {
    if (this.search_product_input != null && this.search_product_input!.trim() != "") {
      this.search_product_list = this.dataService.get_product_by_filter(this.search_product_input);
      console.log(this.search_product_list);
    }
  }

  get_all_product_list() {
    this.search_product_list = this.dataService.get_products_list();
    console.log(this.search_product_list);
  }

  toggle_over_form() {

    if (!this.show_overlay_form)
      this.show_overlay_form = true;
    else
      this.show_overlay_form = false;

    console.log("show overlay", this.show_overlay_form);
  }

  // Add new product or assign an existing product for a purchase 
  assign_add_product(d: any, i: number) {
    console.log("index", i);
    console.log(d);



    if (d != null) {
      this.selected_purchase = d;
      this.selected_purchase_index = i;

      this.newProduct = {
        id: null,
        sku: null,
        barcode: null,
        name: d.productName,
        slug: null,
        brand: null,
        categories: {
          categoryIds: [],
          path: []
        },
        uom: null,
        taxRate: 5,
        sale: null,
        image: [],
        searchTokens: [],
        attributes: [],
      };


      this.validateNewProduct = {
        name: "form-div",
        sku: "form-div",
        barcode: "form-div",
        brand: "form-div",
        uom: "form-div",
        categories: "form-div",
        image: "form-div",
        searchTokens: "form-div",
        attributes: "form-div",
      };

      this.category_doc_id = null;

      this.toggle_over_form();

    }

    if (d != null && d.docId != null) {
      let prod = this.products[d.docId];

      this.newProduct = {
        id: prod.id,
        sku: prod.sku,
        barcode: prod.barcode,
        name: d.productName,
        slug: prod.slug,
        brand: prod.brand,
        categories: prod.categories,
        uom: prod.uom,
        taxRate: prod.taxRate,
        sale: prod.sale,
        image: prod.image,
        searchTokens: prod.searchTokens,
        attributes: prod.attributes,
      };
      if (prod.categories.categoryIds.length > 0)
        this.category_doc_id = prod.categories.categoryIds[prod.categories.categoryIds.length - 1];


    }

    console.log(this.newProduct);
  }

  // asign an existing product to a purchase
  assignExistingProduct(d: any) {
    console.log(d);
    this.toggle_over_form();

    console.log(this.purchase?.purchase[this.selected_purchase_index]);

    //PreviousMRP, barcode, currentInventory, docId, latestInventory, previousPurchasePrice, productName, sellingPrice
    if (this.purchase != null) {
      this.purchase.purchase[this.selected_purchase_index].barcode = d.barcode;
      this.purchase.purchase[this.selected_purchase_index].docId = d.docId;
      this.purchase.purchase[this.selected_purchase_index].productName = d.name;

      if (d.inventory.length > 0) {
        this.purchase.purchase[this.selected_purchase_index].sellingPrice = d.inventory[0].sellingPrice;
        this.purchase.purchase[this.selected_purchase_index].previousPurchasePrice = d.inventory[0].purchasePrice;
        this.purchase.purchase[this.selected_purchase_index].latestInventory = d.inventory[0];
        this.purchase.purchase[this.selected_purchase_index].PreviousMRP = d.inventory[0].purchasePrice
        this.purchase.purchase[this.selected_purchase_index].currentInventory = d.inventory.reduce((acc: number, obj: any) => acc + obj.currentInventory, 0);
        this.purchase.purchase[this.selected_purchase_index].new = false;
      }
    }



  }

  validateForm() {
    let v: boolean = true;
    ///------------validate Product
    // validate Product Name
    if (this.newProduct.name == null) {
      v = false;
      this.validateNewProduct.name = "form-div error";
    }
    else
      this.validateNewProduct.name = "form-div";


    // validate Product SKU
    if (this.newProduct.sku == null) {
      v = false;
      this.validateNewProduct.sku = "form-div error";
    }
    else
      this.validateNewProduct.sku = "form-div";

    // validate Product barcode
    if (this.newProduct.barcode == null) {
      v = false;
      this.validateNewProduct.barcode = "form-div error";
    }
    else
      this.validateNewProduct.barcode = "form-div";

    // validate Product brand
    if (this.newProduct.brand == null) {
      v = false;
      this.validateNewProduct.brand = "form-div error";
    }
    else
      this.validateNewProduct.brand = "form-div";


    // validate Product barcode
    if (this.newProduct.barcode == null) {
      v = false;
      this.validateNewProduct.barcode = "form-div error";
    }
    else
      this.validateNewProduct.barcode = "form-div";


    // validate Product barcode
    if (this.newProduct.barcode == null) {
      v = false;
      this.validateNewProduct.barcode = "form-div error";
    }
    else
      this.validateNewProduct.barcode = "form-div";

    // validate Product Category
    if (this.category_doc_id == null) {
      v = false;
      this.validateNewProduct.categories = "form-div error";
    }
    else
      this.validateNewProduct.categories = "form-div";


    // validate Product UOM
    if (this.newProduct.uom == null) {
      v = false;
      this.validateNewProduct.uom = "form-div error";
    }
    else
      this.validateNewProduct.uom = "form-div";

    // attributes
    if (this.newProduct.attributes.length == 0) {
      v = false;
      this.validateNewProduct.attributes = "form-div error";
    }
    else
      this.validateNewProduct.attributes = "form-div";

    // search tokens
    if (this.newProduct.searchTokens.length == 0) {
      v = false;
      this.validateNewProduct.searchTokens = "form-div error";
    }
    else
      this.validateNewProduct.searchTokens = "form-div";



    console.log("validated", v);
    return v;
  }

  addNewProduct() {

    this.validateForm();
    if (this.validateForm()) {
      showLoader();



      // create Id for the product
      this.newProduct.id = self.crypto.randomUUID();

      // add slug for the product name
      if (this.newProduct.name != undefined)
        this.newProduct.slug = this.newProduct.name?.toLocaleLowerCase().replaceAll(" ", "_");

      let c = this.category_list.filter(item => item.docId == this.category_doc_id)
      console.log(c);
      if (c.length > 0) {
        // get the ancestors for as category ID
        let categoryIds: string[] = c[0].ancestors.filter(() => true);
        // add current category in the category id lists
        categoryIds.push(c[0].docId);
        // get the path for the category
        let path: string[] = c[0].path.filter(() => true);
        // add the product name to the path
        if (this.newProduct.name)
          path.push(this.newProduct.name)
        // add it to the new product variable to be added to the DB
        this.newProduct.categories.categoryIds = categoryIds;
        this.newProduct.categories.path = path;
      }

      // add images
      // if()
      console.log(this.newProduct);
      


      // this.cdRef.detectChanges();
      notify("success", "Product added Successfully.", 5000);
      showLoader(false);

      console.log(this.newProduct);

    }
  }

}
