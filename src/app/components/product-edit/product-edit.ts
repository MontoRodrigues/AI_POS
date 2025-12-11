import { ChangeDetectorRef, Component } from '@angular/core';
import { Breadcrumb } from '../shared/breadcrumb/breadcrumb';
import { dataAttributes, dataBrand, dataCategory, dataImageStore, dataProduct, DataService, dataSupplier, dataUOM } from '../../services/data-service';
import { FirebaseService } from '../../services/firebase.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from '../shared/select/select';
import { TextDropdown } from '../shared/text-dropdown/text-dropdown';
import { ImageUpload } from '../shared/image-upload/image-upload';
import { TextAddTags } from '../shared/text-add-tags/text-add-tags';
import { TextAddAttr } from '../shared/text-add-attr/text-add-attr';
import { Iinventory, Iproduct, onSale } from '../../interface/iproduct';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { defaultConfig } from '../../config/config';
import { DatePipe, DecimalPipe } from '@angular/common';

declare var showLoader: Function;
declare var notify: Function;


export type image_upload_model = {
  blob: Blob | null;
  imageUrl: string;
  type: string;
  original: dataImageStore | null;
};

@Component({
  selector: 'app-product-edit',
  providers: [provideNativeDateAdapter()],
  imports: [DatePipe, DecimalPipe, Breadcrumb, FormsModule, TextDropdown, Select, MatDialogModule, TextAddAttr, TextAddTags, ImageUpload, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEdit {


  // Data Subscriptions
  private subscribe_data_ready: Subscription | undefined;
  dataReady: boolean = false;

  private subscribe_category: Subscription | undefined;
  category_list: dataCategory[] = [];

  private subscribe_brand: Subscription | undefined;
  brandList: dataBrand[] = [];

  private subscribe_uom: Subscription | undefined;
  uomList: dataUOM[] = [];

  private subscribe_attr: Subscription | undefined;
  attrList: dataAttributes[] = [];

  private subscribe_supplier: Subscription | undefined;
  supplierList: dataSupplier[] = [];

  conf = defaultConfig;

  // Editing Product Doc ID
  docId: string | null = null;
  // Editing Product Data
  product: dataProduct | null = null;

  category_doc_id: string | null = null;


  imageList: image_upload_model[] = [];




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

  newProduct_Sale: onSale = {
    discount: null,
    validFrom: null,
    validTill: null
  }

  validate_newProduct_Sale = {
    discount: "form-div",
    validRange: "form-div"
  }


  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private dataService: DataService, private cdRef: ChangeDetectorRef) { }

  updateImageList() {
    if (this.product != null) {
      this.imageList = [];
      for (let img in this.product.image) {
        this.imageList.push({
          blob: null,
          imageUrl: this.product.image[img].downloadURL ? this.product.image[img].downloadURL : '',
          type: "existing",
          original: this.product.image[img]
        });
      }
    }
  }
  ngOnInit() {
    this.docId = this.route.snapshot.paramMap.get('docId');
    this.subscribe_data_ready = this.dataService.purchaseReady$.subscribe({
      next: (value: boolean) => {
        this.dataReady = value;
        if (this.dataReady && this.docId) {
          this.product = this.dataService.get_product_by_docId(this.docId);
          console.log('Loaded product for editing:', this.product);
          if (this.product != null) {
            this.category_doc_id = this.product.categories.categoryIds[0];
            if (this.product.sale) {
              this.newProduct_Sale.discount = this.product.sale.discount;
              this.newProduct_Sale.validFrom = this.product.sale.validFrom;
              this.newProduct_Sale.validTill = this.product.sale.validTill;
            }

            console.log("sales", this.newProduct_Sale);
            this.updateImageList();

            console.log("image list", this.imageList);

          }
          this.cdRef.detectChanges();
        }
      }
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

    // Category Subscription
    this.subscribe_category = this.dataService.category$.subscribe({
      next: (value: dataCategory[]) => {
        console.log("category", value);
        this.category_list = value;
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

  deleteImage(index: number) {
    this.imageList.splice(index, 1);
  }

  onImageSelected(e: any) {
    this.imageList.push({
      blob: e.blob,
      imageUrl: e.imageUrl,
      type: "new",
      original: null
    });
    console.log("image result", e);
  }

  startScanner() {

  }

  validateForm() {
    let v: boolean = true;
    ///------------validate Product

    if (this.product == null) {
      notify("Product data is not loaded properly.", "error");
      return false;
    }
    else {
      // validate Product Name
      if (this.product.name == null) {
        v = false;
        this.validateNewProduct.name = "form-div error";
      }
      else
        this.validateNewProduct.name = "form-div";


      // validate Product SKU
      if (this.product.sku == null) {
        v = false;
        this.validateNewProduct.sku = "form-div error";
      }
      else
        this.validateNewProduct.sku = "form-div";

      // validate Product barcode
      if (this.product.barcode == null) {
        v = false;
        this.validateNewProduct.barcode = "form-div error";
      }
      else
        this.validateNewProduct.barcode = "form-div";

      // validate Product brand
      if (this.product.brand == null) {
        v = false;
        this.validateNewProduct.brand = "form-div error";
      }
      else
        this.validateNewProduct.brand = "form-div";


      // validate Product Category
      if (this.category_doc_id == null) {
        v = false;
        this.validateNewProduct.categories = "form-div error";
      }
      else
        this.validateNewProduct.categories = "form-div";


      // validate Product UOM
      if (this.product.uom == null) {
        v = false;
        this.validateNewProduct.uom = "form-div error";
      }
      else
        this.validateNewProduct.uom = "form-div";

      // attributes
      if (this.product.attributes.length == 0) {
        v = false;
        this.validateNewProduct.attributes = "form-div error";
      }
      else
        this.validateNewProduct.attributes = "form-div";

      // search tokens
      if (this.product.searchTokens.length == 0) {
        v = false;
        this.validateNewProduct.searchTokens = "form-div error";
      }
      else
        this.validateNewProduct.searchTokens = "form-div";



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
    }
    console.log("validated", v);
    return v;
  }

  async updateProduct() {
    console.log("updating product");
    // validate form

    if (this.validateForm() && this.product != null) {
      showLoader(true);

      // Category List update
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
        if (this.product.name)
          path.push(this.product.name)
        // add it to the new product variable to be added to the DB
        this.product.categories.categoryIds = categoryIds;
        this.product.categories.path = path;
      }

      // images
      let updated_image_list: dataImageStore[] = [];
      for (let e of this.imageList) {
        if (e.type == "existing" && e.original != null)
          updated_image_list.push(e.original);
        else if (e.type == "new" && e.blob != null) {

          let img_name = self.crypto.randomUUID() + ".png";
          let img_path = defaultConfig.image_path.Product + "/" + img_name;

          let img_url = await this.firebaseService.uploadImage(e.blob, img_path);
          updated_image_list.push({
            downloadURL: img_url,
            fileName: img_name,
            folder: defaultConfig.image_path.Product
          });
        }
      }
      this.product.image = updated_image_list;


      // sales
      if (this.newProduct_Sale.discount != null && this.newProduct_Sale.validFrom != null && this.newProduct_Sale.validTill != null) {
        this.product.sale = {
          discount: this.newProduct_Sale.discount,
          validFrom: this.newProduct_Sale.validFrom,
          validTill: this.newProduct_Sale.validTill
        };
      }
      else
        this.product.sale = null;
      console.log("final product to be updated", this.product);

      let newProduct:Iproduct = {
        id: this.product.id,
        sku: this.product.sku,
        barcode: this.product.barcode,
        name: this.product.name,
        slug: this.product.slug,
        brand: this.product.brand,
        categories:this.product.categories,
        uom: this.product.uom,
        taxRate: this.product.taxRate,
        sale: this.product.sale,
        image: this.product.image,
        searchTokens: this.product.searchTokens,
        attributes: this.product.attributes,
      };

      await this.firebaseService.updateDocument(this.conf.collections.products.name + "/" + this.docId, newProduct);

      this.updateImageList();
      this.cdRef.detectChanges();
      showLoader(false);
      notify("success", "Product updated successfully.");
    }


  }

  editInventoryClick(inv: any) {
    inv.edit = true;
    inv['editInventoryAdjustment'] = parseInt(inv.inventoryAdjustment);
    inv['editSellingPrice'] = parseInt(inv.sellingPrice);
    inv['editMRP'] = parseInt(inv.MRP);
    console.log("edit inventory", inv);
    this.cdRef.detectChanges();
  }

  cancelEditInventory(inv: any) {
    inv.edit = false;
    inv.inventoryAdjustment = inv['editInventoryAdjustment'];
    inv.sellingPrice = inv['editSellingPrice'];
    inv.MRP = inv['editMRP'];

    console.log("edit inventory", inv);
    this.cdRef.detectChanges();
  }

  async updateInventory(inv: any) {
    console.log("Update inventory", inv);

    // validate
    let isValid = true;
    if (inv.sellingPrice == null || inv.sellingPrice <= 0) {
      isValid = false;
      notify("Please enter a valid Selling Price.", "error");
    }

    if (inv.MRP == null || inv.MRP <= 0) {
      isValid = false;
      notify("Please enter a valid MRP.", "error");
    }

    if (inv.inventoryAdjustment == null || isNaN(inv.inventoryAdjustment)) {
      isValid = false;
      notify("Please enter a valid Inventory Adjustment.", "error");
    }

    if (inv.inventoryAdjustment + inv.sale + inv.returns > inv.quantity) {
      isValid = false;
      notify("Inventory Adjustment + Sales + Returns cannot exceed quantity.", "error");
    }

    if (isValid) {
      showLoader(true);
      let c = false;
      if (inv.inventoryAdjustment != inv['editInventoryAdjustment']) {
        c = confirm(`Do you want update the Adjusted Inventory Quantity;`)
      }

      if (inv.sellingPrice != inv['editSellingPrice']) {
        c = confirm(`Do you want update the Selling Price;`)
      }
      if (inv.MRP != inv['editMRP']) {
        c = confirm(`Do you want update the MRP;`)
      }
      if (c) {
        inv.edit = false;
        inv.currentInventory = inv.quantity - (inv.sale + inv.returns + inv.inventoryAdjustment);

        let newInventory: Iinventory = {
          quantity: inv.quantity,
          purchasePrice: inv.purchasePrice,
          sellingPrice: inv.sellingPrice,
          inventoryDate: inv.inventoryDate,
          supplier: inv.supplier,
          productName: inv,
          barcode: inv.barcode,
          productDocId: inv.productDocId,
          sale: inv.sale,
          returns: inv.returns,
          inventoryAdjustment: inv.inventoryAdjustment,
          currentInventory: inv.current,
          MRP: inv.MRP
        };

        await this.firebaseService.updateDocument(this.conf.collections.products.name + "/" + this.docId + "/inventory/" + inv.docId, newInventory);

        await this.firebaseService.updateDocument(this.conf.collections.products.name + "/" + this.docId , this.product);

        this.cdRef.detectChanges();
        notify("Inventory updated successfully.", "success");

      }

      showLoader(false);

    }


  }
}
