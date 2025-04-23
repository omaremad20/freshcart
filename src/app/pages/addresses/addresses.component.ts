import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AddressesService } from '../../core/services/Addresses/addresses.service';
import { details } from './../../core/interfaces/IAddresses/addresses';

@Component({
  selector: 'app-addresses',
  imports: [RouterLink],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit, OnDestroy {
  private _ToastrService = inject(ToastrService);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _AddressesService = inject(AddressesService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  all!: number;
  data!: details[]
  cancelLog!: Subscription;
  cancelRemove!: Subscription;
  loading: boolean = true;
  ngOnInit(): void {
    this.loading = true;
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelLog = this._AddressesService.Getloggeduseraddresses().subscribe({
          next: (res) => {
            this.loading = false;
            this.all = res.results;
            this.data = res.data;
            this._NgxSpinnerService.hide();
          },
          error: (err) => {
            this.loading = false;
            this._NgxSpinnerService.hide();
          }
        })
      }
    }
  }
  removeAddress(addressId: any): void {
    this._NgxSpinnerService.show();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        this.cancelRemove = this._AddressesService.Removeaddress(addressId).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.data = res.data;
            this.all = this.all - 1
            this._ToastrService.success('Address Deleted!', '',
              {
                messageClass: 'messageClassToast',
                toastClass: 'toastClassBG'
              })
          }
        })
      }
    }
  }

  ngOnDestroy(): void {
    this.cancelLog?.unsubscribe();
    this.cancelRemove?.unsubscribe();
  }
}
