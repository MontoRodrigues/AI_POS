import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { dataAttributes, dataBrand, dataCategory, dataPurchase, dataPurchaseProduct, DataService, dataSupplier, dataUOM } from '../../services/data-service';
import { filter, Subscription } from 'rxjs';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Iproduct, Iinventory } from '../../interface/iproduct';
import { MatDialog } from '@angular/material/dialog';
import { defaultConfig } from '../../config/config';
import { BarcodeScanner } from '../shared/barcode-scanner/barcode-scanner';
import { TextDropdown } from "../shared/text-dropdown/text-dropdown";
import { Select } from "../shared/select/select";
import { TextAddAttr } from "../shared/text-add-attr/text-add-attr";
import { TextAddTags } from "../shared/text-add-tags/text-add-tags";
import { BarcodeScannerNative } from '../shared/barcode-scanner-native/barcode-scanner-native';
import { BarcodeMultipleSelect } from '../shared/barcode-multiple-select/barcode-multiple-select';



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

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // get the products assigned to the purchase
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
        this.calculateTotal();
        showLoader(false);
        this.cdRef.detectChanges();

      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    // subsccribe Category collection
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
    const dialogRef = this.dialog.open(BarcodeScannerNative, {
      data: null,
      width: '100%',
      panelClass: 'custom-dialogue'
    });

    dialogRef
      // .afterClosed()
      // .pipe(filter((result) => !!result))
      // .subscribe((result: string) => {
      //   console.log("Barcode result");
      //   console.log(result);
      //   this.newProduct.barcode = result;
      //   this.cdRef.detectChanges();
      // });

      .afterClosed()
            .pipe(filter((result) => !!result))
            .subscribe((result: any) => {
              console.log("Barcode result");
              console.log(result);
              // result can be a string, an array of scan results, or an object with rawValue
              if (Array.isArray(result) && result.length === 1) {
                this.newProduct.barcode = result[0]?.rawValue ?? result[0];
                this.cdRef.detectChanges();
              } else if (result.length > 1) {
                // Open Model to select from multiple barcodes
                const multiSelectDialogRef = this.dialog.open(BarcodeMultipleSelect, {
                  data: result,
                  width: '100%',
                  panelClass: 'custom-dialogue'
                });
                multiSelectDialogRef.afterClosed() .pipe(filter((result) => !!result)).subscribe((selectedBarcode: any) => {
                  console.log("Selected Barcode from multiple select:", selectedBarcode);
                  this.newProduct.barcode = selectedBarcode.rawValue;
                  this.cdRef.detectChanges();
                });
              }
              
            });
  }

  // edit Quantity and Purchase Price 

  totalPrice: number = 0;
  totalQuantity: number = 0;

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

  // Add new product or assign an existing product for a purchase. when clicked opens a form overlay
  assign_add_product(d: any, i: number) {
    console.log("index", i);
    console.log(d);


    // set default values for new product form
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
        taxRate: 0,
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



      // if prouct is already assigned update the default value to the product values
      if (d.docId != null) {
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

      this.toggle_over_form();

    }



    console.log(this.newProduct);
  }

  toggle_over_form() {

    if (!this.show_overlay_form)
      this.show_overlay_form = true;
    else
      this.show_overlay_form = false;

    console.log("show overlay", this.show_overlay_form);
  }

  // ----------------Methods for Search existing Product 

  startScannerSearch() {
    const dialogRef = this.dialog.open(BarcodeScannerNative, {
      data: null,
      width: '100%',
      panelClass: 'custom-dialogue'
    });

    dialogRef
      .afterClosed()
      //.pipe(filter((result) => !!result))
      // .subscribe((result: string) => {
      //   console.log("Barcode result");
      //   console.log(result);
      //   this.search_product_input = result;
      //   this.searchProduct();
      //   this.cdRef.detectChanges();
      // });

      .pipe(filter((result) => !!result))
            .subscribe((result: any) => {
              console.log("Barcode result");
              console.log(result);
              // result can be a string, an array of scan results, or an object with rawValue
              if (Array.isArray(result) && result.length === 1) {
                this.search_product_input = result[0]?.rawValue ?? result[0];
                this.searchProduct();
                this.cdRef.detectChanges();
              } else if (result.length > 1) {
                // Open Model to select from multiple barcodes
                const multiSelectDialogRef = this.dialog.open(BarcodeMultipleSelect, {
                  data: result,
                  width: '100%',
                  panelClass: 'custom-dialogue'
                });
                multiSelectDialogRef.afterClosed() .pipe(filter((result) => !!result)).subscribe((selectedBarcode: any) => {
                  console.log("Selected Barcode from multiple select:", selectedBarcode);
                  this.search_product_input = selectedBarcode.rawValue;
                  this.searchProduct();
                  this.cdRef.detectChanges();
                });
              }
              
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

  // asign an existing product to a purchase
  assignExistingProduct(d: any) {
    console.log("existing product", d);
    this.toggle_over_form();

    console.log("purcase product list", this.purchase?.purchase[this.selected_purchase_index]);

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
    this.getProducts(this.purchase!);
    this.cdRef.detectChanges();
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
      this.toggle_over_form();
      // create Id for the product
      this.newProduct.id = self.crypto.randomUUID();

      // add slug for the product name
      if (this.newProduct.name != undefined)
        this.newProduct.slug = this.newProduct.name?.toLocaleLowerCase().replaceAll(" ", "_");

      // add category details
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
      this.newProduct.image = [];
      this.newProduct.image.push(this.selected_purchase.image);



      console.log(this.newProduct);


      if (this.purchase != null) {
        this.purchase.purchase[this.selected_purchase_index].barcode = this.newProduct.barcode;
        this.purchase.purchase[this.selected_purchase_index].productName = this.newProduct.name;
        this.purchase.purchase[this.selected_purchase_index].new_prod_value = this.newProduct;
      }





      notify("success", "Product added but not saved. It will be saved when you submit the main form", 5000);

      this.cdRef.detectChanges();





    }
  }

  // inventory variable
  newInventory: Iinventory = {
    quantity: null,
    purchasePrice: null,
    sellingPrice: null,
    inventoryDate: new Date(),
    supplier: {
      name: null,
      docId: null
    },
    productName: null,
    barcode: null,
    productDocId: null,
    sale: 0,
    returns: 0,
    currentInventory: 0,
    MRP: null
  };

  async add_purchase_to_inventory() {

    // validate that all purchase items have a product assigned and Selling price is updated
    console.log("purchase before submit", this.purchase);
    console.log("Product at submit", this.products);

    // validate purchase items
    let v: boolean = true;
    if (this.purchase) {
      for (let i = 0; i < this.purchase.purchase.length; i++) {
        let p = this.purchase.purchase[i];
        if (p.sellingPrice == null || p.sellingPrice == 0) {
          v = false;
          notify("error", `Please update the Selling Price for the product ${p.productName}`, 5000);
          break;
        }
        if (p.new == false && (p.docId == null || p.docId == undefined)) {
          v = false;
          notify("error", `Please assign a product for the purchase item ${p.productName}`, 5000);
          break;
        }
        if (p.new == true && (p.new_prod_value == null || p.new_prod_value == undefined)) {
          v = false;
          notify("error", `Please add product details for the new product ${p.productName}`, 5000);
          break;
        }

        p.edit = false;
        p.editPurchasePrice = null;
        p.editQuantity = null;
        p.editMRP = null;
      }


      if (v) {
        let c = confirm(`Do you want to push the purchase to inventory;`)
        if (c) {
          showLoader();
          // Loop through the purchase items and add to inventory and also add new products to product collection
          for (let i = 0; i < this.purchase.purchase.length; i++) {
            let p = this.purchase.purchase[i];

            // add the new product to the product collection
            if (p.new == true && p.new_prod_value != null) {

              // add product to product collection
              let doc = await this.firebaseService.addDocument(this.conf.collections.products.name, p.new_prod_value);

              // add brand to brand collection if not exists
              if (!this.brandList.some(item => p.new_prod_value?.brand?.toLocaleLowerCase() == item.name.toLocaleLowerCase())) {
                this.firebaseService.addDocument(this.conf.collections.brand.name, { "name": p.new_prod_value.brand }).then();
              }

              // update the inventory details in the purchase item
              this.newInventory = {
                quantity: p.quantity,
                purchasePrice: p.purchasePrice,
                sellingPrice: p.sellingPrice ?? 0,
                inventoryDate: new Date(),
                supplier: this.purchase.supplier,
                productName: p.new_prod_value.name,
                barcode: p.new_prod_value.barcode,
                productDocId: doc.id,
                sale: 0,
                returns: 0,
                currentInventory: p.quantity,
                MRP: p.MRP
              }
            }

            // updte inventory for existing product
            if (p.new == false && p.docId != null) {
              this.newInventory = {
                quantity: p.quantity,
                purchasePrice: p.purchasePrice,
                sellingPrice: p.sellingPrice ?? 0,
                inventoryDate: new Date(),
                supplier: this.purchase.supplier,
                productName: this.products[p.docId].name,
                barcode: p.barcode,
                productDocId: p.docId,
                sale: 0,
                returns: 0,
                currentInventory: p.quantity,
                MRP: p.MRP
              }
            }

            // push inventory to document collection
            let doc1 = await this.firebaseService.addDocument(this.conf.collections.products.name + "/" + this.newInventory.productDocId + "/inventory", this.newInventory);
          }

          // update the purchase document
          this.purchase.status = "processed";
          await this.firebaseService.updateDocument(defaultConfig.collections.purchase.name + "/" + this.purchase.docId, this.purchase);

          this.cdRef.detectChanges();
          notify("success", "Purchase Scucessfully moved to Inventory", 5000);

          showLoader(false);

        }
      }
      else {
        console.log("purchase validation failed");
      }
    }

  }

  

}
