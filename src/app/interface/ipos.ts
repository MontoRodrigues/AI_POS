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

export interface CategoryPath{
    name:string,
    docId: string;
    selectable:boolean;
}

// Product

//--Products
export interface iProductCategory {
  categoryIds: string[];
  path: string[];
}

export interface iDiscount {
  discount: number | null;
  validFrom: Date | null;
  validTill: Date | null
}

export interface iProductAttributes {
  attribute: string;
  value: string | number;
}

export interface iProduct {
  docId: string | null;
  id?: string | null;
  sku: string | null;
  barcode: string | null;
  name: string | null;
  slug: string | null;
  brand: string | null;
  categories: iProductCategory;
  uom: string | null;
  taxRate?: number | null;
  sale: iDiscount | null;
  image: imageStore[];
  searchTokens: string[];
  attributes: iProductAttributes[];
}