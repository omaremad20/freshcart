import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-put-email',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './put-email.component.html',
  styleUrl: './put-email.component.scss'
})

export class PutEmailComponent implements OnDestroy {
  private _PLATFORM_ID = inject(PLATFORM_ID) ;
  private _AuthenticationService = inject(AuthenticationService);
  private _ToastrService = inject(ToastrService);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _Router = inject(Router)
  emailNotFound!: boolean;
  cancelForget!: Subscription;
  userEmail!:string ;
  showErrorMessage:boolean = false;
  emailForm: FormGroup = new FormGroup({
    email: new FormControl(isPlatformBrowser(this._PLATFORM_ID) ? sessionStorage.getItem('userEmail') || null : null, [Validators.required, Validators.email])
  })
  sendCode(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      if(sessionStorage.getItem('userEmail')) {
        this.userEmail = sessionStorage.getItem('userEmail') !;
        if(this.userEmail !== this.emailForm.get('email')?.value) {
          this.showErrorMessage = true ;
        }else if (this.userEmail === this.emailForm.get('email')?.value) {
          if (this.emailForm.valid) {
            this._NgxSpinnerService.show();
            this.cancelForget = this._AuthenticationService.ForgotPassword(this.emailForm.value).subscribe({
              next: (res) => {
                this._AuthenticationService.setVerificationAllowed(true);
                this.emailNotFound = false;
                this._NgxSpinnerService.hide();
                this._ToastrService.success('Verification Code Sent Successfully', '',
                  {
                    messageClass: 'messageClassToast',
                    toastClass: 'toastClassBG'
                  }
                )
                this.emailForm.reset();
                this._Router.navigate(['/verification'])
              },
              error: (err) => {
                this.emailNotFound = true;
                this._NgxSpinnerService.hide();
                this.emailForm.reset();
              }
            })
          }
        }
      }else if(!sessionStorage.getItem('userEmail')) {
        if (this.emailForm.valid) {
          this._NgxSpinnerService.show();
          this.cancelForget = this._AuthenticationService.ForgotPassword(this.emailForm.value).subscribe({
            next: (res) => {
              this._AuthenticationService.setVerificationAllowed(true);
              this.emailNotFound = false;
              this._NgxSpinnerService.hide();
              this._ToastrService.success('Verification Code Sent Successfully', '',
                {
                  messageClass: 'messageClassToast',
                  toastClass: 'toastClassBG'
                }
              )
              this.emailForm.reset();
              this._Router.navigate(['/verification'])
            },
            error: (err) => {
              this.emailNotFound = true;
              this._NgxSpinnerService.hide();
              this.emailForm.reset();
            }
          })
        }
      }
    }
  }
  ngOnDestroy(): void {
    this.cancelForget?.unsubscribe()
  }
}
