import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProducts } from '../../core/interfaces/IProducts/iproducts';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/Products/products.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private _ProductsService = inject(ProductsService)
  private _CartService = inject(CartService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private _ToastrService = inject(ToastrService);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _WishlistService = inject(WishlistService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  notLiked: string[] = [];
  allIds: string[] = [];
  heartId: string[] = [];
  wishlistIds: string[] = [];
  cancelRemove!: Subscription;
  cancelLog!: Subscription;
  cancelWish!: Subscription;
  productID!: string;
  specificProductDetails: IProducts = {} as IProducts
  cancelGet!: Subscription;
  cancelAdd!: Subscription;
  cancelActive!: Subscription;
  loading: boolean = true;
  ngOnInit(): void {
    this._NgxSpinnerService.show();
    this.loading = true;
    this.wishListItems();
    this._ActivatedRoute.paramMap.subscribe({
      next: (_p_id) => {
        this.productID = _p_id.get('p_id')!;
      }
    }
    )
    this._ProductsService.GetSpecificProduct(this.productID).subscribe({
      next: (res) => {
        this.loading = false
        this.specificProductDetails = res.data;
        this._NgxSpinnerService.hide();
      },
      error: (err) => {
        this.loading = false;
        this._NgxSpinnerService.hide();
      }
    })
  }
  addToCart() {
    this._NgxSpinnerService.show();
    this._CartService.addProductToCart(this.productID).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this._CartService.numOfCartItems.next(res.numOfCartItems);
        this._ToastrService.success('Item Added !', '',
          {
            messageClass: 'messageClassToast',
            toastClass: 'toastClassBG',
          }
        )
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      }
    })
  }
  addtoWishList(productId: string): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelWish = this._WishlistService.Addproducttowishlist(productId).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            if (!this.wishlistIds.includes(productId)) {
              this.wishlistIds = [...this.wishlistIds, productId];
            }
            this._ToastrService.success('Added To WishList!', '',
              {
                messageClass: 'messageClassToast',
                toastClass: 'toastClassBG',
              }
            )
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        });
      }
    }
  }
  removeItemWishList(productId: string): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelRemove = this._WishlistService.Removeproductfromwishlist(productId).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.wishlistIds = this.wishlistIds.filter(id => id !== productId);
            this._ToastrService.success('Removed From WishList !', '',
              {
                messageClass: 'messageClassToast',
                toastClass: 'toastClassBG',
              }
            )
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        });
      }
    }
  }
  wishListItems(): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelLog = this._WishlistService.Getloggeduserwishlist().subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.heartId = res.data.map((item: any) => item._id);
            this.wishlistIds = [...this.heartId];
            this.notLiked = this.allIds.filter(id => !this.heartId.includes(id));
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        });
      }
    }
  }
  ngOnDestroy(): void {
    this.cancelActive?.unsubscribe();
    this.cancelAdd?.unsubscribe();
    this.cancelGet?.unsubscribe();
    this.cancelLog?.unsubscribe();
    this.cancelWish?.unsubscribe();
    this.cancelRemove?.unsubscribe();
  }
}
