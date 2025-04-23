import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-resetpassword',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent implements OnDestroy {
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _AuthenticationService = inject(AuthenticationService);
  private _ToastrService = inject(ToastrService);
  private _PLATFORM_ID = inject(PLATFORM_ID) ;
  userEmail!:string ;
  vaildEmail!: boolean;
  showErrorMessage:boolean = false ;
  passwordVisibility: { [key: string]: boolean } = {};
  cancelReset!: Subscription;
  updatePasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+{};:,<.>]{8,32}/), Validators.minLength(8), Validators.maxLength(32)])
  })
  update(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      if(sessionStorage.getItem('userEmail')) {
        this.userEmail = sessionStorage.getItem('userEmail') ! ;
        if(this.userEmail === this.updatePasswordForm.get('email')?.value) {
          if (this.updatePasswordForm.valid) {
            this._NgxSpinnerService.show()
            this.cancelReset = this._AuthenticationService.ResetPassword(this.updatePasswordForm.value).subscribe({
              next: (res) => {
                this.vaildEmail = true;
                this._NgxSpinnerService.hide();
                this._ToastrService.success('Password Updated Successfully', '', {
                  messageClass: 'messageClassToast',
                  toastClass: 'toastClassBG'
                })
                this.updatePasswordForm.reset();
              },
              error: (err) => {
                this.vaildEmail = false;
                this._NgxSpinnerService.hide();
                this.updatePasswordForm.reset();
              }
            })
          } else {
            this.updatePasswordForm.markAllAsTouched();
          }
        }else if (this.userEmail !== this.updatePasswordForm.get('email')?.value) {
          this.showErrorMessage = true
        }
      }else if (!sessionStorage.getItem('userEmail')) {
        if (this.updatePasswordForm.valid) {
          this._NgxSpinnerService.show()
          this.cancelReset = this._AuthenticationService.ResetPassword(this.updatePasswordForm.value).subscribe({
            next: (res) => {
              this.vaildEmail = true;
              this._NgxSpinnerService.hide();
              this._ToastrService.success('Password Updated Successfully', '', {
                messageClass: 'messageClassToast',
                toastClass: 'toastClassBG'
              })
              this.updatePasswordForm.reset();
            },
            error: (err) => {
              this.vaildEmail = false;
              this._NgxSpinnerService.hide();
              this.updatePasswordForm.reset();
            }
          })
        } else {
          this.updatePasswordForm.markAllAsTouched();
        }
      }
    }

  }
  togglePassword(controlName: string): void {
    this.passwordVisibility[controlName] = !this.passwordVisibility[controlName];
  }
  ngOnDestroy(): void {
    this.cancelReset?.unsubscribe();
  }
}
