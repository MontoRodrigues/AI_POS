import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PurchaseListComponent } from './components/purchase-list/purchase-list.component';
import { AuthGuard } from './services/auth.guard';
import { SupplierList } from './components/supplier-list/supplier-list';
import { Category } from './components/category/category';
import { Product } from './components/product/product';




export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'purchase', component: PurchaseListComponent, canActivate: [AuthGuard] },
    { path: 'supplier', component: SupplierList, canActivate: [AuthGuard] },
    { path: 'category', component: Category, canActivate: [AuthGuard] },
    { path: 'products', component: Product, canActivate: [AuthGuard] }
];
