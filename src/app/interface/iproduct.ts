export interface onSale {
    discount: number | null;
    validFrom: Date | null;
    validTill: Date | null
}

export interface ImageStore {
    downloadURL: string | null;
    fileName: string;
    folder: string;
}

export interface CategoriesStore {
    categoryIds: string[];
    path: string[];
}

export interface attr {
    attribute: string;
    value: string | number;
}


export interface Iproduct {
    id?: string | null;
    sku: string | null;
    barcode: string | null;
    name: string | null;
    slug: string | null;
    brand: string | null;
    categories: CategoriesStore;
    // path:string | null;
    uom: 'pcs' | 'kg' | 'ltr' | string | null;
    taxRate?: number | null;
    sale: onSale | null;
    image: ImageStore[];
    searchTokens: string[];
    attributes: attr[];

}


export interface InvSupplier {
    name: string | null;
    docId: string | null;
}

export interface Iinventory {
    quantity: number | null;
    purchasePrice: number | null;
    sellingPrice: number | null;
    inventoryDate: Date | null;
    supplier: InvSupplier;
    productName: string | null;
    barcode: string | null;
    productDocId: string | null;
    sale: number;
    returns: number;
    inventoryAdjustment: number;
    currentInventory: number | null;
    MRP:number | null;
}

export interface purchaseProduct {
    docId: string | null;
    productName: string | null;
    barcode: string | null;
    purchasePrice: number | null;
    MRP: number | null;
    quantity: number | null;
    purchaseDate: Date | null;
}


export interface Ipurchase {
    supplier: InvSupplier;
    purchaseDate: Date | null;
    purchase: purchaseProduct[];
    createdBy:string | null;
    status: "new" | "reviewed" | "waiting"| "processed" | null;
}