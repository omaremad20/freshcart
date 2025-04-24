import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from '../../core/interfaces/IProducts/iproducts';
import { CartService } from '../../core/services/cart/cart.service';
import { CheckoutAccessServiceService } from '../../core/services/CheckoutAccessService/checkout-access-service.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { Data } from './../../core/interfaces/IProducts/iproducts';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  private _CartService = inject(CartService);
  private _ToastrService = inject(ToastrService);
  private _WishlistService = inject(WishlistService);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _CheckoutAccessServiceService = inject(CheckoutAccessServiceService);
  private _Router = inject(Router);
  private _PLATFORM_ID = inject(PLATFORM_ID) ;
  data!: Data;
  cartId!: string;
  cartOwner!: string;
  productsData!: Product[]
  totalCartPice: number = 0;
  userToken: any;
  cancelLogged!: Subscription;
  cancelAdd!: Subscription;
  cancelRemove!: Subscription;
  cancelDelete!: Subscription;
  cancelUpdate!: Subscription;
  loading: boolean = true;
  ngOnInit(): void {
    this.loading = true;
    this._NgxSpinnerService.show();
    this.cancelLogged = this._CartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.totalCartPice = res.data.totalCartPrice;
        this.data = res.data;
        this.productsData = this.data.products;
        this.cartOwner = res.data.cartOwner;
        this.cartId = res.cartId ;
        if(isPlatformBrowser(this._PLATFORM_ID)) {
          if(sessionStorage.getItem('userToken')) {
            sessionStorage.setItem('cartId' , this.cartId) ;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
  }
  Addproducttowishlist(productId: string): void {
    this._NgxSpinnerService.show();
    this.cancelAdd = this._WishlistService.Addproducttowishlist(productId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.success('Added To Wishlist !', '', {
          messageClass: 'messageClassToast',
          toastClass: 'toastClassBG'
        })
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
    this._NgxSpinnerService.show();
    this.cancelRemove = this._CartService.removeSpecificCartItem(productId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.productsData = res.data.products
        this.totalCartPice = res.data.totalCartPrice;
        this._CartService.numOfCartItems.next(res.numOfCartItems)
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
  }
  deleteProductFromCart(productId: string) {
    this._NgxSpinnerService.show();
    this.cancelRemove = this._CartService.removeSpecificCartItem(productId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.success('Item Removed !', '', {
          messageClass: 'messageClassToast',
          toastClass: 'toastClassBG'
        })
        this.productsData = res.data.products
        this.totalCartPice = res.data.totalCartPrice;
        this._CartService.numOfCartItems.next(res.numOfCartItems)
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
  }
  updateItemQun(productId: string, count: any) {
    this._NgxSpinnerService.show()
    this.cancelUpdate = this._CartService.updateCartProductQuantity(productId, count).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.totalCartPice = res.data.totalCartPrice
        this.productsData = res.data.products
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      },
    })
  }
  deleteAll() {
    this._NgxSpinnerService.show();
    this.cancelDelete = this._CartService.clearUserCart().subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.productsData.length = 0
        this.totalCartPice = 0
        this._CartService.numOfCartItems.next(0)
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
  }
  goToCheckOut(): void {
    this._CheckoutAccessServiceService.allowAccess();
    this._Router.navigate(['/CheckOut'])
  }
  ngOnDestroy(): void {
    this.cancelLogged?.unsubscribe();
    this.cancelAdd?.unsubscribe();
    this.cancelRemove?.unsubscribe();
    this.cancelDelete?.unsubscribe();
    this.cancelUpdate?.unsubscribe();
  }
}
