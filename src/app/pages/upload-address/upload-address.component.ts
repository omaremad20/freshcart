import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateService } from '../../core/services/update/update.service';
import { AddressesService } from '../../core/services/Addresses/addresses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-address',
  imports: [ReactiveFormsModule , FormsModule],
  templateUrl: './upload-address.component.html',
  styleUrl: './upload-address.component.scss'
})
export class UploadAddressComponent implements OnInit , OnDestroy{
  private _AddressesService = inject(AddressesService) ;
  private _NgxSpinnerService = inject(NgxSpinnerService) ;
  private _ToastrService = inject(ToastrService) ;
  private readonly _PLATFORM_ID = inject(PLATFORM_ID) ;
  cancelAdd!:Subscription ;
  addressForm:FormGroup = new FormGroup({
    name : new FormControl(null , [Validators.required , Validators.maxLength(32) , Validators.minLength(3)]) ,
    details : new FormControl(null , [Validators.required , Validators.maxLength(255) , Validators.minLength(3)]) ,
    phone : new FormControl(null , [Validators.required , Validators.pattern(/^(\+20|0)1[0125]\d{8}$/)]) ,
    city : new FormControl(null , [Validators.required , Validators.maxLength(32) , Validators.minLength(3)])
  })
  ngOnInit(): void {

  }
  upload():void {
    this._NgxSpinnerService.show() ;
    if(this.addressForm.valid) {
      if(isPlatformBrowser(this._PLATFORM_ID)) {
        if(sessionStorage.getItem('userToken')) {
          this.cancelAdd = this._AddressesService.Addaddress(this.addressForm.value).subscribe({
            next : (res) => {
              this._NgxSpinnerService.hide() ;
              this._ToastrService.success('Address Added !' , '',
                {
                messageClass:'messageClassToast' ,
                toastClass:'toastClassBG'
              }
              )
              this.addressForm.reset() ;
            } ,
            error : (err) => {
              this._ToastrService.error('Failed')
              this._NgxSpinnerService.hide() ;
            }
          })
        }
      }
    }else {
      this.addressForm.markAllAsTouched() ;
      this._NgxSpinnerService.hide() ;
    }
  }
  ngOnDestroy(): void {
    this.cancelAdd?.unsubscribe() ;
  }
}
