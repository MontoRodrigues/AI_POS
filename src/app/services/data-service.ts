import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject, flatMap, Observable } from 'rxjs';
import { orderBy } from 'firebase/firestore';
import { defaultConfig } from '../config/config';
import { Iproduct } from '../interface/iproduct';


// ----------------data interface



export interface dataImageStore {
  downloadURL: string | null;
  fileName: string;
  folder: string;
}

export interface dataProductAttributes {
  attribute: string;
  value: string | number;
}

//--Products
export interface dataProductCategory {
  categoryIds: string[];
  path: string[];
}

export interface dataDiscount {
  discount: number | null;
  validFrom: Date | null;
  validTill: Date | null
}

export interface dataProduct {
  docId: string | null;

  id?: string | null;
  sku: string | null;
  barcode: string | null;
  name: string | null;
  slug: string | null;
  brand: string | null;
  categories: dataProductCategory;
  // path:string | null;
  uom: 'pcs' | 'kg' | 'ltr' | string | null;
  taxRate?: number | null;
  sale: dataDiscount | null;
  image: dataImageStore[];
  searchTokens: string[];
  attributes: dataProductAttributes[];
  currentInventory?: number | null;
  purchasePrice?: number | null;
  MRP?: number | null;
  inventory?: dataInventory[];
}

export interface dataCategory {
  id: string | null;
  docId: string;
  name: string;
  slug: string;
  parentDocID: string | null;
  ancestors: string[];
  level: string;
  path: string[];
  catImage?: dataImageStore;
  pathString: string;
  edit?: boolean;
  editName?: string;
  editParentDocID?: string | null;
}

export interface dataSupplier {
  productCategory: string[] | null;
  name: string | null;
  address: string;
  phone: number | null;
  email: string | null;
  id: string | null;
  contactPerson: string | null;
  location: string | null;
  businessDescription: string | null;
  docId: string;
  edit?: boolean;
  edit_productCategory?: string[] | null;
  edit_name?: string | null;
  edit_address?: string;
  edit_phone?: number | null;
  edit_email?: string | null;
  edit_contactPerson?: string | null;
  edit_location?: string | null;
  edit_businessDescription?: string | null;
}

export interface dataBrand {
  name: string;
  docId: string;
  edit?: boolean;
  edit_name: string | null;
}

export interface dataAttributes {
  attribute: string;
  type: string;
  valueExample: string | null;
  docId: string;
}

export interface dataUOM {
  type: string;
  abbr: string;
  measure: string;
  docId: string;
  showText: string;
  edit?: boolean;
  edit_type?: string;
  edit_abbr?: string;
  edit_measure?: string;
}

// purchase 
export interface dataSupplierReference {
  name: string | null;
  docId: string | null;
}
export interface dataPurchaseProduct {
  new: boolean;
  docId: string | null;
  productName: string | null;
  barcode: string | null;
  purchasePrice: number | null;
  MRP: number | null;
  quantity: number | null;
  purchaseDate: Date | null;
  previousPurchasePrice: number | null;
  PreviousMRP: number | null;
  currentInventory: number | null;
  image: dataImageStore | null;
  reviewed: boolean;

  edit?: boolean;
  editPurchasePrice?: number | null;
  editMRP?: number | null;
  editQuantity?: number | null;

  sellingPrice?: number | null;
  latestInventory?: dataInventory | null;
  new_prod_value?: Iproduct | null;

}


export interface dataPurchase {
  supplier: dataSupplierReference;
  purchaseDate: Date | null;
  purchase: dataPurchaseProduct[];
  docId: string | null;
  selected: boolean;
  createdBy: string | null;
  status: "new" | "reviewed" | "waiting" | "processed" | null;
}


export interface dataInventory {
  docId: string | null;
  quantity: number | null;
  purchasePrice: number | null;
  sellingPrice: number | null;
  inventoryDate: Date | null;
  supplier: dataSupplierReference;
  productName: string | null;
  barcode: string | null;
  productDocId: string | null;
  sale: number;
  returns: number;
  inventoryAdjustment: number;
  currentInventory: number;
  edit?: boolean;
  editInventoryAdjustment?: number | null;
  editSellingPrice?: number | null;
  editMRP?: number | null;
  MRP?: number | null; // remove optional for production
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // product Observable
  private _product = new BehaviorSubject<dataProduct[]>([]);
  private fb_subscribe_product: any;
  product$: Observable<dataProduct[]> = this._product.asObservable();

  // category Observable
  private _category = new BehaviorSubject<dataCategory[]>([]);
  private fb_subscribe_category: any;
  category$: Observable<dataCategory[]> = this._category.asObservable();

  // Supplier Observable
  private _suppler = new BehaviorSubject<dataSupplier[]>([]);
  private fb_subscribe_suppler: any;
  supplier$: Observable<dataSupplier[]> = this._suppler.asObservable();

  // brand Observable
  private _brand = new BehaviorSubject<dataBrand[]>([]);
  private fb_subscribe_brand: any;
  brand$: Observable<dataBrand[]> = this._brand.asObservable();

  // attributes Observable
  private _attributes = new BehaviorSubject<dataAttributes[]>([]);
  private fb_subscribe_attributes: any;
  attributes$: Observable<dataAttributes[]> = this._attributes.asObservable();

  // uom Observable
  private _uom = new BehaviorSubject<dataUOM[]>([]);
  private fb_subscribe_uom: any;
  uom$: Observable<dataUOM[]> = this._uom.asObservable();

  // purchase Observable
  private _purchase = new BehaviorSubject<dataPurchase[]>([]);
  private fb_subscribe_purchase: any;
  purchase$: Observable<dataPurchase[]> = this._purchase.asObservable();

  private _purchaseReady = new BehaviorSubject<boolean>(false);
  purchaseReady$: Observable<boolean> = this._purchaseReady.asObservable();
  count = 0;


  private _inventory = new BehaviorSubject<dataInventory[]>([]);
  private fb_subscribe_inventory: any;
  inventory$: Observable<dataInventory[]> = this._inventory.asObservable();



  constructor(private firebaseService: FirebaseService) {


    // subscribe to firebase Inventory Group Collection
    this.fb_subscribe_inventory = this.firebaseService.subscribeToCollectionGroup(defaultConfig.collections.inventory.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);

      for (let x = 0, l = p.length; x < l; x++) {
        p[x]["inventoryDate"] = new Date(p[x].inventoryDate.seconds * 1000 + p[x].inventoryDate.nanoseconds / 1000000);
      }

      p = p.sort((a, b) => {
        return b.inventoryDate - a.inventoryDate;
      });
      console.log("inventory", p);
      this._inventory.next(p);
      this.checkDataReady();
    }, [orderBy('inventoryDate', 'desc')]);


    // subscribe to firebase purchaseList Collection
    this.fb_subscribe_purchase = this.firebaseService.subscribeToCollection(defaultConfig.collections.purchase.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        p[x]["selected"] = false;
        p[x]["purchaseDate"] = new Date(p[x].purchaseDate.seconds * 1000 + p[x].purchaseDate.nanoseconds / 1000000); // p[x].type + ":" + p[x].measure;
        for (let i = 0; i < p[x].purchase.length; i++) {
          p[x].purchase[i]["purchaseDate"] = new Date(p[x].purchase[i].purchaseDate.seconds * 1000 + p[x].purchase[i].purchaseDate.nanoseconds / 1000000);
        }
      }
      this._purchase.next(p);
      this.checkDataReady();
    }, [orderBy('purchaseDate', "desc")]);


    // subscribe to firebase UOM Collection
    this.fb_subscribe_uom = this.firebaseService.subscribeToCollection(defaultConfig.collections.uom.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        p[x]["showText"] = p[x].type + ":" + p[x].measure;
        p[x]["edit"] = false;
        p[x]["edit_type"] = null;
        p[x]["edit_abbr"] = null;
        p[x]["edit_measure"] = null;
      }
      this._uom.next(p);
    }, [orderBy('type')]);

    // subscribe to firebase attribute Collection
    this.fb_subscribe_attributes = this.firebaseService.subscribeToCollection(defaultConfig.collections.attribute.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      this._attributes.next(p);
    }, [orderBy('type')]);

    // subscribe to firebase Brand Collection
    this.fb_subscribe_brand = this.firebaseService.subscribeToCollection(defaultConfig.collections.brand.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        p[x]["edit"] = false;
        p[x]["edit_name"] = null;
      }
      this._brand.next(p);
    }, [orderBy('name')]);

    // subscribe to firebase Supplier Collection
    this.fb_subscribe_suppler = this.firebaseService.subscribeToCollection(defaultConfig.collections.suppliers.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        p[x]["edit"] = false;
        p[x]["edit_productCategory"] = null;
        p[x]["edit_name"] = null;
        p[x]["edit_address"] = null;
        p[x]["edit_phone"] = null;
        p[x]["edit_email"] = null;
        p[x]["edit_contactPerson"] = null;
        p[x]["edit_location"] = null;
        p[x]["edit_businessDescription"] = null;
      }

      this._suppler.next(p);
    }, [orderBy('name')]);

    // subscribe to firebase Products Collection
    this.fb_subscribe_product = this.firebaseService.subscribeToCollection(defaultConfig.collections.products.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        if (p[x]["sale"] != null) {
          p[x]["sale"].validFrom = p[x]["sale"].validFrom != null ? new Date(p[x]["sale"].validFrom.seconds * 1000 + p[x]["sale"].validFrom.nanoseconds / 1000000) : null;
          p[x]["sale"].validTill = p[x]["sale"].validTill != null ? new Date(p[x]["sale"].validTill.seconds * 1000 + p[x]["sale"].validTill.nanoseconds / 1000000) : null;
        }
      }


      this._product.next(p);
      this.checkDataReady();
    }, [orderBy('name')]);

    // subscribe to firebase category Collection
    this.fb_subscribe_category = this.firebaseService.subscribeToCollection(defaultConfig.collections.category.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        p[x]["editName"] = p[x].name;
        p[x]["editParentDocID"] = p[x].parentDocID;
        p[x]["edit"] = false;
        // if (p[x].path == null)
        //   p[x]["path"] = [p[x].name]
        p[x]["pathString"] = p[x].path.join("/");
      }
      this._category.next(p);
    }, [orderBy('name')]);
  }

  getDataFromCollection(snapshot: any): any[] {
    let p: any = []
    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      p.push(d);
    });
    return p;
  }

  checkDataReady() {
    this.count++;
    if (this.count >= 3 && !this._purchaseReady.value)
      this._purchaseReady.next(true);
  }

  // get data methods
  get_purchase(docId: string | null) {
    let d = this._purchase.value.filter(item => item.docId == docId);
    if (d.length > 0) {
      for (let i = 0; i < d[0].purchase.length; i++) {
        d[0].purchase[i]["editPurchasePrice"] = null;
        d[0].purchase[i]["editMRP"] = null;
        d[0].purchase[i]["editQuantity"] = null;
        d[0].purchase[i]["edit"] = false;
      }
      return d[0]
    }
    else
      return null;
  }

  // get data methods
  get_purchase_to_add_inventory(docId: string | null) {
    let d: any = this._purchase.value.filter(item => item.docId == docId);
    if (d.length > 0) {
      for (let i = 0; i < d[0].purchase.length; i++) {
        d[0].purchase[i]["sellingPrice"] = null;
        d[0].purchase[i]["latestInventory"] = null;
        d[0].purchase[i]["editPurchasePrice"] = null;
        d[0].purchase[i]["editMRP"] = null;
        d[0].purchase[i]["editQuantity"] = null;
        d[0].purchase[i]["edit"] = false;
        d[0].purchase[i]["new_prod_value"] = null;
      }
      return d[0]
    }
    else
      return null;
  }

  // get data methods
  get_purchase_product(docId: (string | null)[] | null) {
    let p: any = this._product.value.filter(item => { let d = docId?.filter(i => i == item.docId); return d != undefined && d.length > 0 });
    let _p: any = {};
    if (p.length > 0) {
      for (let i = 0; i < p.length; i++) {
        p[i]["inventory"] = this._inventory.value.filter(item => item.productDocId == p[i].docId)
        p[i]["inventory"] = p[i]["inventory"].sort((a: any, b: any) => b.inventoryDate - a.inventoryDate);
        _p[p[i].docId] = p[i];
      }
      return _p;
    }
    else
      return null;
  }

  get_product_for_barcode(barcode: string) {
    let d = this._product.value.filter(item => item.barcode == barcode);
    let i = this._inventory.value.filter(item => item.barcode == barcode);
    let p: any | undefined = undefined;

    console.log("filtered Inv", i);
    if (d.length > 0) {
      p = d[0];
      if (i.length > 0) {
        i = i.sort((a: any, b: any) => {
          return b.inventoryDate - a.inventoryDate;
        })

        p["currentInventory"] = 0;
        i.forEach(e => {
          p["currentInventory"] += e.currentInventory;
        });

        p["purchasePrice"] = i[0].purchasePrice;
        p["MRP"] = i[0].MRP;


      }

      return p
    }
    else
      return null;
  }

  //get product Images
  get_product_image(docId: string | null): string {
    let d = this._product.value.filter(item => item.docId == docId);
    if (d.length > 0)
      return d[0].image[0].downloadURL != null ? d[0].image[0].downloadURL : "/images/product_default_image.jpg";
    else
      return "/images/product_default_image.jpg";
  }

  //// get inventory details
  // get_inventory_for_barcode(barcode: string) {
  //   let d = this._inventory.value.filter(item => item.barcode == barcode);
  //   if (d.length > 0)
  //     return d
  //   else
  //     return null;
  // }

  // Search Product 

  get_product_by_filter(f: string) {
    let p = this._product.value.filter((item) => {
      //---------exact search
      if (item.name?.trim().toLowerCase() == f.trim().toLowerCase() || item.barcode?.trim().toLowerCase() == f.trim().toLowerCase() || item.brand?.trim().toLowerCase() == f)
        return true;

      if (item.searchTokens.filter(i => i == f).length > 0)
        return true;

      // partial match 
      if (item.name!.trim().toLowerCase().includes(f.trim().toLowerCase()) || item.barcode!.trim().toLowerCase().includes(f.trim().toLowerCase()) || item.brand!.trim().toLowerCase().includes(f.trim().toLowerCase()))
        return true;

      if (item.searchTokens.filter(i => i.trim().toLowerCase().includes(f.trim().toLowerCase())).length > 0)
        return true;

      return false;
    });

    console.log("filtered Products", p);
    if (p.length > 0) {

      for (let i = 0; i < p.length; i++) {
        p[i]["inventory"] = this._inventory.value.filter(item => item.productDocId == p[i].docId)
        p[i]["inventory"] = p[i]["inventory"]?.sort((a: any, b: any) => b.inventoryDate - a.inventoryDate);

      }
    }

    return p;
  }

  get_products_list() {
    let p = this._product.value;
    if (p.length > 0) {

      for (let i = 0; i < p.length; i++) {
        p[i]["inventory"] = this._inventory.value.filter(item => item.productDocId == p[i].docId)
        p[i]["inventory"] = p[i]["inventory"]?.sort((a: any, b: any) => b.inventoryDate - a.inventoryDate);

      }
    }
    return p;
  }

  get_product_by_docId(docId: string | null) {
    let d: any = JSON.parse(JSON.stringify(this._product.value.filter(item => item.docId == docId)));

    if (d.length > 0) {
      let i = this._inventory.value.filter(item => item.productDocId == d[0].docId);
      if (i.length > 0) {
        for (let x = 0; x < i.length; x++) {
          if (!i[x].hasOwnProperty('inventoryAdjustment'))
            i[x]['inventoryAdjustment'] = 0;
          i[x]['edit'] = false;
          i[x]['editInventoryAdjustment'] = null;
          i[x]['editSellingPrice'] = null;
          i[x]['editMRP'] = null;
        }

        i = i.sort((a: any, b: any) => {
          return b.inventoryDate - a.inventoryDate;
        })
      }
      d[0]["inventory"] = this._inventory.value.filter(item => item.productDocId == d[0].docId)
      d[0]["inventory"] = d[0]["inventory"]?.sort((a: any, b: any) => b.inventoryDate - a.inventoryDate);

      return d[0];
    }
    else
      return null;

  }
  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.fb_subscribe_uom)
      this.fb_subscribe_uom();

    if (this.fb_subscribe_attributes)
      this.fb_subscribe_attributes();

    if (this.fb_subscribe_brand)
      this.fb_subscribe_brand();

    if (this.fb_subscribe_suppler)
      this.fb_subscribe_suppler();


    if (this.fb_subscribe_product)
      this.fb_subscribe_product();


    if (this.fb_subscribe_category)
      this.fb_subscribe_category();

    if (this.fb_subscribe_purchase)
      this.fb_subscribe_purchase();

    if (this.fb_subscribe_inventory)
      this.fb_subscribe_inventory();

  }

}
