import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { AuthGuard } from './services/auth.guard';
import { SupplierList } from './components/supplier-list/supplier-list';
import { Category } from './components/category/category';
import { Product } from './components/product/product';
import { ProductAdd } from './components/product-add/product-add';
import { PurchaseAdd } from './components/purchase-add/purchase-add';
import { PurchaseToInventory } from './components/purchase-to-inventory/purchase-to-inventory';
import { ProductEdit } from './components/product-edit/product-edit';

import { Uom } from './components/uom/uom';
import { Pos } from './components/pos/pos';
import { Pos1 } from './components/pos1/pos1';
import { Brand } from './components/brand/brand';




export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', title: 'Home', component: HomeComponent, canActivate: [AuthGuard] },    
    { path: 'supplier', component: SupplierList, canActivate: [AuthGuard] },
    { path: 'category', component: Category, canActivate: [AuthGuard] },
    { path: 'uom', component: Uom, canActivate: [AuthGuard] },
     { path: 'brand', component: Brand, canActivate: [AuthGuard] },
    { path: 'products', component: Product, canActivate: [AuthGuard] },
    { path: 'products/add_product', component: ProductAdd, canActivate: [AuthGuard] },
    { path: 'products/edit/:docId', component: ProductEdit, canActivate: [AuthGuard] },
    { path: 'purchase', component: PurchaseListComponent, canActivate: [AuthGuard] },
    { path: 'purchase/add_purchase/:docId', component: PurchaseAdd, canActivate: [AuthGuard] },
    { path: 'purchase/purchase_inventory/:docId', component: PurchaseToInventory, canActivate: [AuthGuard] },
    { path: 'pos', component: Pos, canActivate: [AuthGuard] },
    { path: 'pos1', component: Pos1, canActivate: [AuthGuard] },

];

