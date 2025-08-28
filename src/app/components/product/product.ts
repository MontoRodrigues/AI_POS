import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ImageCapture } from '../shared/image-capture/image-capture';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BarcodeScanner } from '../shared/barcode-scanner/barcode-scanner';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Iproduct } from '../../interface/iproduct';
import { AppDefaultConfig } from '../../config/config';
import { Select } from '../shared/select/select';
import { where, orderBy, limit } from 'firebase/firestore';
import { TextDropdown } from '../shared/text-dropdown/text-dropdown';
import { TextAddTags } from '../shared/text-add-tags/text-add-tags';
import { TextAddAttr } from '../shared/text-add-attr/text-add-attr';
import { Breadcrumb } from "../shared/breadcrumb/breadcrumb";


declare var toggle_left_slide_model: Function;
declare var toggle_loader: Function;

@Component({
  selector: 'app-product',
  imports: [MatDialogModule, FormsModule, CommonModule, Breadcrumb],
    //imports: [ImageCapture, MatDialogModule, FormsModule, CommonModule, Select, TextDropdown, TextAddTags, TextAddAttr, Breadcrumb],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  @ViewChild(ImageCapture) imgCaptureRef!: ImageCapture;

  dialog = inject(MatDialog);
  conf = new AppDefaultConfig();
  //barcode: string | null = null;

  // collection to subscribe & subscribe to Category List 
  private subscribe_category: any;
  // existing category list 
  category_list: any[] = [];
  // category list DDL
  categoryDDLList: any[] = [];

  //brand collection & brand Subscribe variable
  private subscribe_brand: any;
  brandList: any[] = [];

  // attribute list and subscribe variable
  private subscribe_attr_master: any;
  attr_master_list: any[] = [];

  // Product list and subscribe variable
  private subscribe_product: any;
  product_list: any[] = [];

  image_blob: Blob | undefined = undefined;

  category_doc_id: string | null = null; // "eV1l1cg8baq50BT6ELn2";//null;

  // newProduct: Iproduct = {
  //   id: null,
  //   sku: "red Tshirt",
  //   barcode: "123",
  //   name: "TShirt",
  //   slug: null,
  //   brand: "Nike",
  //   categoryIds: [],
  //   uom: "pcs",
  //   taxRate: 0,
  //   sale: null,
  //   image: null,
  //   searchTokens: ['tag1', 'tag2'],
  //   attributes: [{ type: 'color', value: 'red' }],
  // }

  newProduct: Iproduct = {
    id: null,
    sku: null,
    barcode: null,
    name: null,
    slug: null,
    brand: null,
    categoryIds: [],
    path: null,
    uom: null,
    taxRate: 0,
    sale: null,
    image: null,
    searchTokens: [],
    attributes: []
  };

  validateNewProduct = {
    name: "mb-3",
    sku: "mb-3",
    barcode: "mb-3",
    brand: "mb-3",
    uom: "mb-3",
    categoryIds: false,
    image: "mb-3",
    searchTokens: "mb-3",
    attributes: "mb-3",
  }

  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    const constrain: any[] = [
      orderBy('path')
    ];

    // this.subscribe_category = this.firebaseService.subscribeToCollection(this.conf.collections.category.name, (snapshot) => {
    //   this.category_list = [];
    //   let p: any = []

    //   snapshot.forEach(doc => {
    //     p.push({ docId: doc.id, data: doc.data() });
    //   });

    //   this.category_list = p;
    //   let cddl = this.category_list.map((item: any) => { return { "value": item.docId, "text": item.data.path.join('/') } });
    //   this.categoryDDLList = cddl;

    //   this.cdRef.detectChanges();
    //   console.log(this.category_list);
    // }, constrain);

    // this.subscribe_brand = this.firebaseService.subscribeToCollection(this.conf.collections.brand.name, (snapshot) => {
    //   this.brandList = [];
    //   let p: any = []

    //   snapshot.forEach(doc => {
    //     p.push(doc.data()["name"]);
    //   });
    //   this.brandList = p;
    //   this.cdRef.detectChanges();
    //   console.log(this.brandList);
    // }, [
    //   orderBy('name')
    // ]);

    // this.subscribe_attr_master = this.firebaseService.subscribeToCollection(this.conf.collections.attribute.name, (snapshot) => {
    //   this.attr_master_list = [];
    //   let p: any = []

    //   snapshot.forEach(doc => {
    //     p.push(doc.data()["name"]);
    //   });
    //   this.attr_master_list = p;
    //   this.cdRef.detectChanges();
    //   console.log(this.attr_master_list);
    // }, [
    //   orderBy('name')
    // ]);

    this.subscribe_product = this.firebaseService.subscribeToCollection(this.conf.collections.products.name, (snapshot) => {
      this.product_list = [];
      let p: any = []

      snapshot.forEach(doc => {
        p.push({ docId: doc.id, data: doc.data() });
      });

      this.product_list = p;



      this.cdRef.detectChanges();
      console.log(this.product_list);
    }, constrain);

  }

  ngOnDestroy() {
    if (this.subscribe_category) {
      this.subscribe_category();
    }

    if (this.subscribe_brand) {
      this.subscribe_brand();
    }

    if (this.subscribe_attr_master) {
      this.subscribe_attr_master();
    }
  }

  // event from Select controller once a Category is selected 
  getParentCategory(d: any) {
    console.log("DDL Change");
    console.log(d);
    this.category_doc_id = d.value;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onImageUpload(e: any) {
    console.log("image received");
    console.log(e.type);
    this.image_blob = e;
  }

  openScanner() {
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

  private validate(): boolean {
    let v: boolean = true;
    // Product Name
    if (this.newProduct.name == null) {
      v = false;
      this.validateNewProduct.name = "mb-3 error";
    }
    else {
      this.validateNewProduct.name = "mb-3";
    }

    // Product SKU
    if (this.newProduct.sku == null) {
      v = false;
      this.validateNewProduct.sku = "mb-3 error";
    }
    else {
      this.validateNewProduct.sku = "mb-3";
    }

    // Product Barcode
    if (this.newProduct.barcode == null) {
      v = false;
      this.validateNewProduct.barcode = "mb-3 error";
    }
    else {
      this.validateNewProduct.barcode = "mb-3";
    }

    // Product Brand
    if (this.newProduct.brand == null) {
      v = false;
      this.validateNewProduct.brand = "mb-3 error";
    }
    else {
      this.validateNewProduct.brand = "mb-3";
    }

    // Product UOM
    if (this.newProduct.uom == null) {
      v = false;
      this.validateNewProduct.uom = "mb-3 error";
    }
    else {
      this.validateNewProduct.uom = "mb-3";
    }

    // Product Category
    if (this.category_doc_id == null) {
      v = false;
      this.validateNewProduct.categoryIds = true;
    }
    else {
      this.validateNewProduct.categoryIds = false;
    }

    // Product Image
    if (this.image_blob == undefined) {
      this.validateNewProduct.image = "mb-3 error";
    }
    else {
      this.validateNewProduct.image = "mb-3";
    }
    return v;
  }

  async addProduct() {
    console.log(this.newProduct);
    if (this.validate()) {

      toggle_loader("Please wait while we add the category");

      // add new ID
      this.newProduct.id = self.crypto.randomUUID();

      // Add Slug as lower case Name and replacing all spaces with _
      if (this.newProduct.name != undefined)
        this.newProduct.slug = this.newProduct.name?.toLocaleLowerCase().replaceAll(" ", "_");

      // categories
      let category = this.category_list.filter((d: any) => { return d.docId == this.category_doc_id });
      if (category.length > 0) {
        this.newProduct.categoryIds = category[0].data.ancestors;
        this.newProduct.categoryIds.push(category[0].docId);
        this.newProduct.path = category[0].data.path;
      }

      // image 
      let image_url: string | null = null;
      if (this.image_blob == undefined) {
        this.newProduct.image = this.conf.default_images.product;
      }
      else {
        // Upholding Image and getting the URL
        let imagePath = this.conf.image_path.Product + "/" + this.newProduct.id + ".png";
        if (this.image_blob != undefined)
          image_url = await this.firebaseService.uploadImage(this.image_blob, imagePath);
        this.newProduct.image = {
          downloadURL: image_url,
          fileName: this.newProduct.id + ".png",
          folder: this.conf.image_path.Product
        };
      }

      // check if new brand is added 
      console.log("Brand Check for :", this.newProduct.brand);
      console.log(this.brandList);
      console.log(this.brandList.some(item => this.newProduct.brand?.toLocaleLowerCase() == item.toLocaleLowerCase()));







      // add to products collection 
      // upload doc to firebase
      this.firebaseService.addDocument(this.conf.collections.products.name, this.newProduct).then();

      // Check for rand name. If new then add to list otherwise get the brand name from the list for consistency 
      if (!this.brandList.some(item => this.newProduct.brand?.toLocaleLowerCase() == item.toLocaleLowerCase())) {
        // add to brand collection 
        this.firebaseService.addDocument(this.conf.collections.brand.name, { "name": this.newProduct.brand }).then();
      }
      // check for new Attributes and if new add to collection else get it form the list for consistency 
      for (let x = 0, l = this.newProduct.attributes.length; x < l; x++) {
        if (!this.attr_master_list.some(item => this.newProduct.attributes[x].type?.toLocaleLowerCase() == item.toLocaleLowerCase())) {
          this.firebaseService.addDocument(this.conf.collections.attribute.name, { "name": this.newProduct.attributes[x].type }).then();
        }
      }

      // reset form 
      // reset image controller
      this.imgCaptureRef.resetState();

      this.newProduct = {
        id: null,
        sku: null,
        barcode: null,
        name: null,
        slug: null,
        brand: null,
        categoryIds: [],
        path: null,
        uom: null,
        taxRate: 0,
        sale: null,
        image: null,
        searchTokens: [],
        attributes: [],
      }

      this.validateNewProduct = {
        name: "mb-3",
        sku: "mb-3",
        barcode: "mb-3",
        brand: "mb-3",
        uom: "mb-3",
        categoryIds: false,
        image: "mb-3",
        searchTokens: "mb-3",
        attributes: "mb-3",
      }


      this.image_blob = undefined;

      this.category_doc_id = null;

      this.cdRef.detectChanges();

      toggle_left_slide_model();
      toggle_loader("");

      console.log(this.newProduct);

    }
  }

}
