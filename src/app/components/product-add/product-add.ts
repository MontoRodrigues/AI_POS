import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { where, orderBy, limit } from 'firebase/firestore';
import { defaultConfig } from '../../config/config';
import { Iinventory, Iproduct, onSale } from '../../interface/iproduct';
import { FormsModule } from '@angular/forms';
import { TextDropdown } from "../shared/text-dropdown/text-dropdown";
import { Select } from '../shared/select/select';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { BarcodeScanner } from '../shared/barcode-scanner/barcode-scanner';
import { filter, Subscription } from 'rxjs';
import { TextAddAttr } from "../shared/text-add-attr/text-add-attr";
import { TextAddTags } from "../shared/text-add-tags/text-add-tags";
import { image_upload_result, ImageUpload } from "../shared/image-upload/image-upload";

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { provideNativeDateAdapter } from '@angular/material/core';
import { dataAttributes, dataBrand, dataCategory, DataService, dataSupplier, dataUOM } from '../../services/data-service';
import { BarcodeScannerNative } from '../shared/barcode-scanner-native/barcode-scanner-native';
import { BarcodeMultipleSelect } from '../shared/barcode-multiple-select/barcode-multiple-select';

declare var showLoader: Function;
declare var notify: Function;

@Component({
  selector: 'app-product-add',
  providers: [provideNativeDateAdapter()],
  imports: [Breadcrumb, FormsModule, TextDropdown, Select, MatDialogModule, TextAddAttr, TextAddTags, ImageUpload, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './product-add.html',
  styleUrl: './product-add.css'
})
export class ProductAdd {
  dialog = inject(MatDialog);
  conf = defaultConfig;


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

  // newProduct: Iproduct = {
  //   "id": null,
  //   "sku": "paul",
  //   "barcode": "2123",
  //   "name": "monto",
  //   "slug": null,
  //   "brand": "Nike",
  //   "categories": {
  //     "categoryIds": [
  //       "jZzBBroY4W0SXoC2XNM8",
  //       "CwdjaYYjr3hVrU6B3oZc"
  //     ],
  //     "path": [
  //       "Beauty",
  //       "Self Care",
  //       "monto"
  //     ]
  //   },
  //   "uom": "NumSize",
  //   "taxRate": 5,
  //   "sale": null,
  //   "image": [],
  //   "searchTokens": [
  //     "motp"
  //   ],
  //   "attributes": [
  //     {
  //       "attribute": "Color",
  //       "value": "red"
  //     }
  //   ]
  // }

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
    inventoryAdjustment: 0,
    currentInventory: 0,
  
    MRP: null
  };

  validateNewInventory = {
    quantity: "form-div",
    purchasePrice: "form-div",
    sellingPrice: "form-div",
    supplier: "form-div",
    MRP: "form-div"
  };

  newProduct_Sale: onSale = {
    discount: null,
    validFrom: null,
    validTill: null
  }

  validate_newProduct_Sale = {
    discount: "form-div",
    validRange: "form-div"
  }

  imageList: image_upload_result[] = [];

  category_doc_id: string | null = null;

  getDataFromCollection(snapshot: any): any[] {
    let p: any = []
    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      p.push(d);
    });
    return p;
  }

  // get the uploaded Image
  onImageSelected(e: image_upload_result) {
    this.imageList.push(e);
    console.log("image result", e);
  }

  deleteImage(index: number) {
    this.imageList.splice(index, 1);
  }
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit() {

    showLoader(false);
    //subscribe Category collection 

    this.subscribe_category = this.dataService.category$.subscribe({
      next: (value: dataCategory[]) => {
        console.log("category", value);
        this.category_list = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
    // this.subscribe_category = this.firebaseService.subscribeToCollection(defaultConfig.collections.category.name, (snapshot) => {
    //   let p = this.getDataFromCollection(snapshot);
    //   for (let x = 0, l = p.length; x < l; x++)
    //     p[x]["pathString"] = p[x].path.join("/");

    //   this.category_list = p;
    //   this.cdRef.detectChanges();
    //   console.log("category",this.category_list);
    // }, [orderBy('path')]);


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
    // this.subscribe_supplier = this.firebaseService.subscribeToCollection(defaultConfig.collections.suppliers.name, (snapshot) => {
    //   this.supplierList = this.getDataFromCollection(snapshot);
    //   this.cdRef.detectChanges();
    //   console.log("supplier:", this.supplierList);
    // }, [orderBy('name')]);

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

    // this.subscribe_brand = this.firebaseService.subscribeToCollection(defaultConfig.collections.brand.name, (snapshot) => {
    //   this.brandList = this.getDataFromCollection(snapshot);
    //   this.cdRef.detectChanges();
    //   console.log("brand:", this.brandList);
    // }, [orderBy('name')]);

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


    // this.subscribe_attr = this.firebaseService.subscribeToCollection(defaultConfig.collections.attribute.name, (snapshot) => {
    //   this.attrList = this.getDataFromCollection(snapshot);
    //   this.cdRef.detectChanges();
    //   console.log("attribute:", this.attrList);
    // }, [orderBy('type')]);


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


    // this.subscribe_uom = this.firebaseService.subscribeToCollection(defaultConfig.collections.uom.name, (snapshot) => {
    //   let p = this.getDataFromCollection(snapshot);
    //   for (let x = 0, l = p.length; x < l; x++)
    //     p[x]["showText"] = p[x].type + ":" + p[x].measure;

    //   this.uomList = p;
    //   this.cdRef.detectChanges();
    //   console.log("uom:", this.uomList);
    // }, [orderBy('type')]);

    showLoader(false);

  }

  ngOnDestroy() {
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
  // start scanning for barcode 
  startScanner() {

    const dialogRef = this.dialog.open(BarcodeScannerNative, {
      //const dialogRef = this.dialog.open(BarcodeScanner, {
      data: null,
      width: '100%',
      panelClass: 'custom-dialogue'
    });

    dialogRef
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


    // ---------validate Inventory 

    // validate Supplier
    if (this.newInventory.supplier.docId == null) {
      v = false;
      this.validateNewInventory.supplier = "form-div error";
    }
    else
      this.validateNewInventory.supplier = "form-div";


    // validate quantity
    if (this.newInventory.quantity == null) {
      v = false;
      this.validateNewInventory.quantity = "form-div error";
    }
    else
      this.validateNewInventory.quantity = "form-div";


    // validate purchase price
    if (this.newInventory.purchasePrice == null) {
      v = false;
      this.validateNewInventory.purchasePrice = "form-div error";
    }
    else
      this.validateNewInventory.purchasePrice = "form-div";



    // validate selling price
    if (this.newInventory.sellingPrice == null) {
      v = false;
      this.validateNewInventory.sellingPrice = "form-div error";
    }
    else
      this.validateNewInventory.sellingPrice = "form-div";

    // validate MRP
    if (this.newInventory.MRP == null) {
      v = false;
      this.validateNewInventory.MRP = "form-div error";
    }
    else
      this.validateNewInventory.MRP = "form-div";


    //------- validate sales
    // validate discount
    if (this.newProduct_Sale.validFrom != null && (this.newProduct_Sale.discount == null || this.newProduct_Sale.discount == 0)) {
      v = false;
      this.validate_newProduct_Sale.discount = "form-div error";
    }
    else
      this.validate_newProduct_Sale.discount = "form-div";

    // validate date Range
    if (this.newProduct_Sale.discount != null && (this.newProduct_Sale.validFrom == null || this.newProduct_Sale.validTill == null)) {
      v = false;
      this.validate_newProduct_Sale.validRange = "form-div error";
    }
    else
      this.validate_newProduct_Sale.validRange = "form-div";

    console.log("validated", v);
    return v;
  }
  // add product
  async addNewProduct() {
    console.log("We are here");

    console.log("new sales", this.newProduct_Sale);
    if (this.validateForm()) {
      showLoader();

      //Add new product ID
      this.newProduct.id = self.crypto.randomUUID();

      if (this.newProduct.name != undefined)
        this.newProduct.slug = this.newProduct.name?.toLocaleLowerCase().replaceAll(" ", "_");

      // ---------Computing Categories 
      // get the select category doc
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


      //-----------process Image
      // empty previous images
      this.newProduct.image = [];
      //check if any image is added. If not then add the default image to the list 
      if (this.imageList.length == 0) {
        this.newProduct.image.push(defaultConfig.default_images.product);
      }
      else {
        // loop through the image list and upload it to storage and update the image variable for the product
        for (let x = 0, l = this.imageList.length; x < l; x++) {
          if (this.imageList[x].blob != undefined) {
            let img_name = self.crypto.randomUUID() + ".png";
            let img_path = defaultConfig.image_path.Product + "/" + img_name;
            let img_url = await this.firebaseService.uploadImage(this.imageList[x].blob, img_path);
            this.newProduct.image.push({
              downloadURL: img_url,
              fileName: img_name,
              folder: defaultConfig.image_path.Product
            });
          }
        }

      }

      // add Sale
      console.log("sale", this.newProduct_Sale);
      if (this.newProduct_Sale.discount != null && this.newProduct_Sale.discount != 0)
        this.newProduct.sale = this.newProduct_Sale;





      //--------------Upload Data to fire store 

      // add to products collection 
      let doc = await this.firebaseService.addDocument(this.conf.collections.products.name, this.newProduct);


      // -------inventory 

      this.newInventory.productName = this.newProduct.name;
      this.newInventory.barcode = this.newProduct.barcode;
      this.newInventory.currentInventory = this.newInventory.quantity;

      // add supplier name
      let s = this.supplierList.filter(item => item.docId == this.newInventory.supplier.docId);
      if (s.length > 0)
        this.newInventory.supplier.name = s[0].name;
      this.newInventory.productDocId = doc.id; // update this once Product doc is created

      let doc1 = await this.firebaseService.addDocument(this.conf.collections.products.name + "/" + doc.id + "/inventory", this.newInventory);

      console.log(doc.id);
      console.log(doc1.id);

      // Check for rand name. If new then add to list otherwise get the brand name from the list for consistency 
      if (!this.brandList.some(item => this.newProduct.brand?.toLocaleLowerCase() == item.name.toLocaleLowerCase())) {
        // add to brand collection 
        this.firebaseService.addDocument(this.conf.collections.brand.name, { "name": this.newProduct.brand }).then();
      }

      // -------------reset the form 

      this.newProduct = {
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


      this.newInventory = {
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
        inventoryAdjustment: 0,
        currentInventory: 0,
        MRP: 0
      };

      this.validateNewInventory = {
        quantity: "form-div",
        purchasePrice: "form-div",
        sellingPrice: "form-div",
        supplier: "form-div",
        MRP: "form-div"
      };

      this.newProduct_Sale = {
        discount: null,
        validFrom: null,
        validTill: null
      }

      this.validate_newProduct_Sale = {
        discount: "form-div",
        validRange: "form-div"
      }

      this.cdRef.detectChanges();
      notify("success", "Product added Successfully.", 5000);

      showLoader(false);
      console.log(this.newInventory)
      console.log(this.newProduct_Sale)
      console.log(this.newProduct);
      console.log(this.category_doc_id);


    }

  }



}
