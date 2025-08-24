export interface CategoryAncestor {
    id: string;
    name: string;
    slug: string;
}

export interface ImageDetails {
    downloadURL: string | null;
    fileName: string | null;
    folder: string | null;
}

export interface Icategory {
    id: string | null;
    name: string | null;
    slug: string | null;
    parentDocID: string | null;
    ancestors: CategoryAncestor[];
    level: string | null;
    path: any[] | null;
    catImage?: ImageDetails | null;
}
