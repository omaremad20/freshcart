import { RenderMode } from '@angular/ssr';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { checkoutGuardGuard } from './core/guards/checkout-guard.guard';
import { verificationGuard } from './core/guards/verfiy/verification.guard';
import { noAuthGuard } from './core/guards/noauth/no-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: 'Login', component: LoginComponent, title: 'Login' , canActivate : [noAuthGuard]},
      { path: 'Register', loadComponent: () => import('./pages/register/register.component').then((classes) => classes.RegisterComponent), title: 'Register' , canActivate : [noAuthGuard]},
      { path: 'ForgettenPassword' , loadComponent : () => import('./pages/put-email/put-email.component').then((classes) => classes.PutEmailComponent) , title : 'ForgettenPassword'},
      { path: 'verification' , loadComponent : () => import('./pages/verification/verification.component').then((classes) => classes.VerificationComponent) , title : 'VerificationCode', canActivate : [verificationGuard]},
      { path: 'resetpassword' , loadComponent : () => import('./pages/resetpassword/resetpassword.component').then((classes) => classes.ResetpasswordComponent) , title : 'ResetPassword' , canActivate : [verificationGuard]},
    ]
  },
  {
    path: '', component: MainLayoutComponent, children: [
      { path: '', redirectTo: 'Home', title: 'Home', pathMatch: 'full' },
      { path: 'Home', component: HomeComponent, title: 'Home' , canActivate: [authGuard] },
      { path: 'Brands', loadComponent: () => import('./pages/brands/brands.component').then((classes) => classes.BrandsComponent), title: 'Brands'  , canActivate : [authGuard]},
      { path: 'Categories', loadComponent: () => import('./pages/categories/categories.component').then((classes) => classes.CategoriesComponent), title: 'Categories' , canActivate : [authGuard]},
      { path: 'Products', loadComponent: () => import('./pages/products/products.component').then((classes) => classes.ProductsComponent), title: 'Products' , canActivate : [authGuard] },
      { path: 'Cart', loadComponent: () => import('./pages/cart/cart.component').then((classes) => classes.CartComponent), title: 'Cart' , canActivate : [authGuard]},
      { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then((classes) => classes.WishlistComponent), title: 'wishlist' , canActivate : [authGuard]},
      { path: 'uploadaddress', loadComponent: () => import('./pages/upload-address/upload-address.component').then((classes) => classes.UploadAddressComponent), title: 'AddAddress' , canActivate : [authGuard]},
      { path: 'UpdateLoggeduserpassword', loadComponent: () => import('./pages/update-password-login/update-password-login.component').then((classes) => classes.UpdatePasswordLoginComponent), title: 'UpdatePassword' , canActivate : [authGuard]},
      { path: 'updateinfo', loadComponent: () => import('./pages/updatedata/updatedata.component').then((classes) => classes.UpdatedataComponent), title: 'UpdateInformation' , canActivate : [authGuard]},
      { path: 'Dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((classes) => classes.DashboardComponent), title: 'DashBoard' , canActivate : [authGuard]},
      { path: 'Addresses', loadComponent: () => import('./pages/addresses/addresses.component').then((classes) => classes.AddressesComponent), title: 'Addresses' , canActivate : [authGuard]},
      { path: 'allorders', loadComponent: () => import('./pages/allorders/allorders.component').then((classes) => classes.AllordersComponent), title: 'Orders' , canActivate : [authGuard]},
      { path: 'CheckOut/:cartId/:cartOwner', loadComponent: () => import('./pages/check-out/check-out.component').then((classes) => classes.CheckOutComponent), title: 'Check Out' , canActivate : [authGuard , checkoutGuardGuard] },
      { path : 'Product-Details/:p_id' , loadComponent : () => import('./pages/product-details/product-details.component').then( (classes) => classes.ProductDetailsComponent ) , title : 'ProductDetails' , canActivate : [authGuard]} ,
      { path: '**', component: NotFoundComponent, title: 'Error Not Found 404' }
    ]
  },
];
