import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AddressesService } from '../../core/services/Addresses/addresses.service';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { CartService } from '../../core/services/cart/cart.service';
import { OrdersService } from '../../core/services/orders/orders.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _AuthenticationService = inject(AuthenticationService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly _Router = inject(Router);
  private _AddressesService = inject(AddressesService);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _OrdersService = inject(OrdersService);
  private _WishlistService = inject(WishlistService);
  private _CartService = inject(CartService);
  countCart!: number;
  countAddresses!: number;
  countOrders!: number;
  countWish!: number;
  userName!: string;
  userId!: string;
  cancelCart!: Subscription;
  cancelAddress!: Subscription;
  cancelOrder!: Subscription;
  cancelWish!: Subscription;
  ngOnInit(): void {
    this._NgxSpinnerService.show();
    this._AuthenticationService.decodeToken();
    this.userName = this._AuthenticationService.userName;
    this.cancelCart = this._CartService.numOfCartItems.subscribe({
      next: (value) => {
        this.countCart = value;
      },
    })
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.userId = sessionStorage.getItem('userId')!;
        this.cancelAddress = this._AddressesService.Getloggeduseraddresses().subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.countAddresses = res.results;
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
        this.cancelOrder = this._OrdersService.getUserOrders(this.userId).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.countOrders = res.length;
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
        this.cancelWish = this._WishlistService.Getloggeduserwishlist().subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.countWish = res.count;
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
      }
    }
  }
  logout(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      sessionStorage.removeItem('userToken');
      if (!sessionStorage.getItem('userToken')) {
        this._AuthenticationService.userInformation = null;
        this._AuthenticationService.userName = null!;
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('phone') ;
        this._Router.navigate(['/Login']);
      }
    }
  }
  ngOnDestroy(): void {
    this.cancelAddress?.unsubscribe();
    this.cancelCart?.unsubscribe();
    this.cancelOrder?.unsubscribe();
    this.cancelWish?.unsubscribe();
  }
}
