import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ICategories } from '../../core/interfaces/ICategories/icategories';
import { IProducts } from '../../core/interfaces/IProducts/iproducts';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { CartService } from '../../core/services/cart/cart.service';
import { CategoriesService } from '../../core/services/Categories/categories.service';
import { ProductsService } from '../../core/services/Products/products.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
@Component({
  selector: 'app-home',
  imports: [CarouselModule, SearchPipe, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private _ProductsService = inject(ProductsService);
  private _CategoriesService = inject(CategoriesService);
  private _AuthenticationService = inject(AuthenticationService);
  private _CartService = inject(CartService);
  private _ToastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService);
  private _WishlistService = inject(WishlistService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  userToken!: string;
  notLiked: string[] = [];
  allIds: string[] = [];
  heartId: string[] = [];
  wishlistIds: string[] = [];
  searchKey: string = ''
  productsData!: IProducts[];
  categoriesData!: ICategories[];
  userName!: string;
  productId!: string;
  idObservableCategories!: Subscription;
  idObservableProducts!: Subscription;
  cancelAdd!: Subscription;
  cancelRemove!: Subscription;
  cancelLog!: Subscription;
  cancelWish!: Subscription;
  ngOnInit(): void {
    this._NgxSpinnerService.show();
    this.wishListItems();
    this._AuthenticationService.decodeToken();
    this.userName = this._AuthenticationService.userName;
    this.idObservableProducts = this._ProductsService.GetAllProducts().subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.productsData = res.data
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      },
    });
    this.idObservableCategories = this._CategoriesService.GetAllCategories().subscribe({
      next: (res) => {
        this.categoriesData = res.data
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
      },
    })
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
  addtoWishList(productId: string): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelWish = this._WishlistService.Addproducttowishlist(productId).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.success('Added To Wishlist !', '', {
              messageClass: 'messageClassToast',
              toastClass: 'toastClassBG'
            })
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
  removeItemWishList(productId: string): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelRemove = this._WishlistService.Removeproductfromwishlist(productId).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.success('Removed From WishList !', '', {
              messageClass: 'messageClassToast',
              toastClass: 'toastClassBG'
            })
            this.wishlistIds = this.wishlistIds.filter(id => id !== productId);
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
    this.idObservableProducts?.unsubscribe();
    this.idObservableCategories?.unsubscribe();
    this.cancelAdd?.unsubscribe();
    this.cancelRemove?.unsubscribe();
    this.cancelWish?.unsubscribe();
    this.cancelLog?.unsubscribe();
  }
  CategorieSilderOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    autoplayTimeout: 2000,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<span class = "nextStyle">Prev</span>', '<span class = "nextStyle">Next</span>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1280: {
        items: 6
      }
    },
    nav: true
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 4000,
    dots: false,
    navSpeed: 700,
    navText: ['Prev', 'Next'],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: true
  }
}
