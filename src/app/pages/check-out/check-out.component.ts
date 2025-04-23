import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { details } from '../../core/interfaces/IAddresses/addresses';
import { AddressesService } from '../../core/services/Addresses/addresses.service';
import { CheckoutAccessServiceService } from '../../core/services/CheckoutAccessService/checkout-access-service.service';
import { CartService } from '../../core/services/cart/cart.service';
import { OrdersService } from '../../core/services/orders/orders.service';

@Component({
  selector: 'app-check-out',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent implements OnInit, OnDestroy {
  private _OrdersService = inject(OrdersService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);
  private _CheckoutAccessServiceService = inject(CheckoutAccessServiceService)
  private _CartService = inject(CartService)
  private _PLATFORM_ID = inject(PLATFORM_ID);
  private _AddressesService = inject(AddressesService);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  cartId!: string;
  cartOwner!: string;
  all!: number;
  data!: details[]
  cancelLog!: Subscription;
  cancelRemove!: Subscription;
  cancelActive!: Subscription;
  cancelActiveTwo!: Subscription;
  cancelCreate!: Subscription;
  cancelCheckOut!: Subscription;
  btnClicked: boolean = false;
  showSection: boolean = false;
  detailsValue!: string;
  phoneValue!: string;
  cityValue!: string;
  cancelAddresses!: Subscription;
  cancelSpec!: Subscription;
  ngOnInit(): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelAddresses = this._AddressesService.Getloggeduseraddresses().subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.all = res.results;
            this.data = res.data;
          }, error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
      }
    }
    this.cancelActive = this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        this.cartId = param.get('cartId')!;
      }
    })
    this.cancelActiveTwo = this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        this.cartOwner = param.get('cartOwner')!;
      }
    })
  }
  checkOutForm: FormGroup = new FormGroup({
    details: new FormControl(this.detailsValue || null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
    phone: new FormControl(this.phoneValue || null, [Validators.required, Validators.pattern(/^(\+20|0)1[0125]\d{8}$/)]),
    city: new FormControl(this.cityValue || null, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    payment: new FormControl(null, Validators.required)
  })
  checkOut(): void {
    const selectedPayment = this.checkOutForm.get('payment')?.value;
    const { payment, ...rest } = this.checkOutForm.value;
    const formData = { ...rest };
    if (this.checkOutForm.valid) {
      if (selectedPayment === 'visa') {
        this._NgxSpinnerService.show();
        this.cancelCheckOut = this._OrdersService.checkOutSession(this.cartId, formData).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.checkOutForm.reset();
            if (res.status === 'success') {
              window.open(res.session.url, '_self')
              this._CartService.numOfCartItems.next(0);
              this._ToastrService.success('Order Placed Successfully !', '',
                {
                  messageClass: 'messageClassToast',
                  toastClass: 'toastClassBG'
                }
              )
            }
          }, error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
      } else if (selectedPayment === 'cash') {
        this._NgxSpinnerService.show();
        this.cancelCreate = this._OrdersService.createCashOrder(this.cartId, formData).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.success('Order Placed Successfully !', '',
              {
                messageClass: 'messageClassToast',
                toastClass: 'toastClassBG'
              }
            )
            this.checkOutForm.reset();
            this._Router.navigateByUrl('/allorders');
            this._CartService.numOfCartItems.next(0);
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
      }
    } else {
      this.checkOutForm.markAllAsTouched();
    }
  }
  chooseCliked(): void {
    if (this.btnClicked) {
      if (isPlatformBrowser(this._PLATFORM_ID)) {
        const el = document.querySelector('.animeError');
        if (el) {
          el.classList.add('hide');
          setTimeout(() => {
            this.btnClicked = false;
          }, 500);
        }
      }
    } else {
      this.btnClicked = true;
    }
  }
  selectAddress(addressId: any): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelSpec = this._AddressesService.Getspecificaddress(addressId).subscribe({
          next: (res) => {
            this.btnClicked = false;
            this.detailsValue = res.data.details;
            this.phoneValue = res.data.phone;
            this.cityValue = res.data.city;
            this.checkOutForm.patchValue({
              details: this.detailsValue,
              phone: this.phoneValue,
              city: this.cityValue
            });
            this._NgxSpinnerService.hide();
          }, error: (err) => {
            this._NgxSpinnerService.hide();
          }
        })
      }
    }
  }
  ngOnDestroy(): void {
    this._CheckoutAccessServiceService.resetAccess();
    this.cancelActive?.unsubscribe();
    this.cancelActiveTwo?.unsubscribe();
    this.cancelCreate?.unsubscribe();
    this.cancelCheckOut?.unsubscribe();
    this.cancelSpec?.unsubscribe();
    this.cancelAddresses?.unsubscribe();
  }
}
