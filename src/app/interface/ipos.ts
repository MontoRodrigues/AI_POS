

// Image store for Category
export interface imageStore {
  downloadURL: string | null;
  fileName: string;
  folder: string;
}

// Category
export interface categoryStore {
  id: string | null;
  docId: string;
  name: string;
  slug: string;
  parentDocID: string | null;
  ancestors: string[];
  level: string;
  path: string[];
  catImage?: imageStore;
  pathString: string;
}

export interface categoryObject {
  [key: string]: categoryStore;
}

export interface CategoryPath {
  name: string,
  docId: string;
  selectable: boolean;
}

// Product

//--Products
export interface iProductCategory {
  categoryIds: string[];
  path: string[];
}

export interface iDiscount {
  discount: number;
  validFrom: Date;
  validTill: Date;
}

export interface iProductAttributes {
  attribute: string;
  value: string;
}

export interface iSupplierReference {
  name: string | null;
  docId: string | null;
}

export interface iInventory {
  docId: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  inventoryDate: Date;
  supplier: iSupplierReference;
  productName: string;
  barcode: string;
  productDocId: string;
  sale: number;
  returns: number;
  inventoryAdjustment: number;
  currentInventory: number;
  MRP: number;
}

export interface iInventoryObject {
  [key: string]: iInventory[];
}


export interface iProduct {
  docId: string;
  id?: string | null;
  sku: string | null;
  barcode: string;
  name: string | null;
  slug: string | null;
  brand: string | null;
  categories: iProductCategory;
  uom: string;
  taxRate: number;
  sale: iDiscount | null;
  image: imageStore[];
  searchTokens: string[];
  attributes: iProductAttributes[];
  inventory: iInventory[] | null;
}

export interface iCustomer {
  docId: string;
  name: string;
  phoneNumber: string;
}

export interface iCartItem extends iProduct {

  quantity: number;
  unitPrice: number;
  discount: number;
  inventoryID: string;
  inventoryIndex: number;
}

export interface iInventoryChoice {
  product: iProduct;
  index: number | null;
}

export interface iCartPrice {
  originalPrice: number;
  price: number;
  discountAmount: number | null;
  taxAmount: number;
}

export interface iPaymentSummary {
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
}

export interface iSaleProduct {
  productDocId: string;
  inventoryDocId: string;
  quantity: number;
  originalAmount: number;
  amount: number
  taxAmount: number;
  taxPer: number;
  discountPer: number;
  discountAmount: number;
}

export interface iPaymentDetails {
  receivedAmount: number;
  changeReturned?: number | null;
  transactionId?: string | null;  
}

export interface iSale {
  products: iSaleProduct[];
  paymentMethod: 'CASH' | 'UPI';
  paymentDetails: iPaymentDetails;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  createdBy: string;
  createdOn: Date;
  orderId: string;
  customerDocId:string | null;

}