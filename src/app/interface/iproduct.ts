export interface onSale {
    discount: number;
    validTill: Date
}

export interface ImageStore {
    downloadURL: string | null;
    fileName: string;
    folder: string;
}

export interface attr{
    type:string;
    value:string | number;
}

export interface Iproduct {
    id?: string | null;
    sku: string | null;
    barcode: string | null;
    name: string | null;
    slug: string | null;
    brand: string | null;
    categoryIds: string[];
    path:string | null;
    uom: 'pcs' | 'kg' | 'ltr' | string | null;
    taxRate?: number | null;
    sale?: onSale | null;
    image: ImageStore | null;
    searchTokens: string[];
    attributes: attr[];
}
