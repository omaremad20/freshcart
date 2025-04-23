import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Orders } from '../../core/interfaces/IOrders/orders';
import { OrdersService } from '../../core/services/orders/orders.service';

@Component({
  selector: 'app-allorders',
  imports: [RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit, OnDestroy {
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  private _OrdersService = inject(OrdersService);
  userId!: string;
  orders: Orders[] = [];
  cancelOrders!: Subscription;
  loading:boolean = true ;
  ngOnInit(): void {
    this.loading = true ;
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userId')) {
        this.userId = sessionStorage.getItem('userId')!;
        this.cancelOrders = this._OrdersService.getUserOrders(this.userId).subscribe({
          next: (res) => {
            this.loading = false ;
            this._NgxSpinnerService.hide();
            this.orders = res
          },
          error: (err) => {
            this.loading = false ;
            this._NgxSpinnerService.hide() ;
          }
        })
      }
    }
  }
  ngOnDestroy(): void {
    this.cancelOrders?.unsubscribe() ;
  }
}
