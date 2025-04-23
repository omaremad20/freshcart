import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ICategories } from '../../core/interfaces/ICategories/icategories';
import { IProducts } from '../../core/interfaces/IProducts/iproducts';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/Products/products.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';

@Component({
  selector: 'app-products',
  imports: [SearchPipe, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  private _ToastrService = inject(ToastrService);
  private _ProductsService = inject(ProductsService);
  private _WishlistService = inject(WishlistService);
  private _CartService = inject(CartService);
  private _AuthenticationService = inject(AuthenticationService)
  userToken!: string;
  notLiked: string[] = [];
  allIds: string[] = [];
  heartId: string[] = [];
  wishlistIds: string[] = [];
  searchKey: string = ''
  idObservableProducts!: Subscription;
  productsData!: IProducts[];
  idObservableCategories!: Subscription;
  categoriesData!: ICategories[];
  userName!: string;
  productId!: string;
  loading: boolean = true;
  cancelLog!: Subscription;
  cancelAdd!: Subscription;
  cancelRemove!: Subscription;
  cancelWish!: Subscription;
  ngOnInit(): void {
    this.loading = true;
    this._NgxSpinnerService.show();
    this.wishListItems();
    this._AuthenticationService.decodeToken();
    this.userName = this._AuthenticationService.userName;
    this.idObservableProducts = this._ProductsService.GetAllProducts().subscribe({
      next: (res) => {
        this.loading = false;
        this._NgxSpinnerService.hide();
        this.productsData = res.data
      },
      error: (err) => {
        this.loading = false;
        this._NgxSpinnerService.hide();
      }
    });
  }
  addToCart(productId: any): void {
    this._NgxSpinnerService.show();
    this.cancelAdd = this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
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
                toastClass: 'toastClassBG'
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
  addtoWishList(productId: string): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelWish = this._WishlistService.Addproducttowishlist(productId).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.success('Added To WishList !', '',
              {
                messageClass: 'messageClassToast',
                toastClass: 'toastClassBG'
              }
            )
            if (!this.wishlistIds.includes(productId)) {
              this.wishlistIds = [...this.wishlistIds, productId];
            }
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
    this.idObservableCategories?.unsubscribe();
    this.cancelLog?.unsubscribe();
    this.cancelAdd?.unsubscribe();
    this.cancelRemove?.unsubscribe();
    this.idObservableProducts?.unsubscribe();
    this.cancelWish?.unsubscribe();
  }
}
