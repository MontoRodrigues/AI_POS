export interface ISupplier {
    id?: string | null;
    name: string | null;
    productCategory:string[];
    contactPerson: string | null;    
    email: string | null;
    phone: number | null;
    address: string | null;
    location:string | null;
    businessDescription:string | null;
}
