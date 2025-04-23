import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProducts } from '../../core/interfaces/IProducts/iproducts';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {
  private _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  private _PLATFORM_ID = inject(PLATFORM_ID)
  private _CartService = inject(CartService);
  productsData!: IProducts[];
  wishListItems!: number;
  cancelLog!: Subscription;
  cancelRemove!: Subscription;
  cancelGet!: Subscription;
  cancelAdd!: Subscription;
  cancelRemoveTwo!: Subscription
  cancelLogTwo!: Subscription;
  loading: boolean = true;
  ngOnInit(): void {
    this.loading = true;
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelLog = this._WishlistService.Getloggeduserwishlist().subscribe({
          next: (res) => {
            this.loading = false;
            this._NgxSpinnerService.hide();
            this.wishListItems = res.count;
            this.productsData = res.data
          }, error: (err) => {
            this.loading = false;
            this._NgxSpinnerService.hide();
          }
        })
      }
    }
  }
  Removeproductfromwishlist(productId: any): void {
    this._NgxSpinnerService.show();
    this.cancelRemove = this._WishlistService.Removeproductfromwishlist(productId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.success('Item Removed !', '', {
          messageClass: 'messageClassToast',
          toastClass: 'toastClassBG'
        })
        this.cancelGet = this._WishlistService.Getloggeduserwishlist().subscribe({
          next: (res) => {
            this.wishListItems = res.count;
            this.productsData = res.data;
          }, error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
      }, error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
  }
  addToCart(productId: string): void {
    this._NgxSpinnerService.show();
    this.cancelAdd = this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        --this.wishListItems;
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._ToastrService.success('Item Added !', '',
          {
            messageClass: 'messageClassToast',
            toastClass: 'toastClassBG'
          }
        )
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
    this._WishlistService.Removeproductfromwishlist(productId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this._WishlistService.Getloggeduserwishlist().subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.productsData = res.data
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
      }, error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
  }
  ngOnDestroy(): void {
    this.cancelAdd?.unsubscribe();
    this.cancelGet?.unsubscribe();
    this.cancelLog?.unsubscribe();
    this.cancelLogTwo?.unsubscribe();
    this.cancelRemove?.unsubscribe();
    this.cancelRemoveTwo?.unsubscribe();
  }
}
