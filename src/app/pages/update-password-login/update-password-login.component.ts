import { error } from 'node:console';
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UpdateService } from '../../core/services/update/update.service';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-update-password-login',
  imports: [ReactiveFormsModule, FormsModule , RouterLink],
  templateUrl: './update-password-login.component.html',
  styleUrl: './update-password-login.component.scss'
})
export class UpdatePasswordLoginComponent implements OnDestroy {
  private _UpdateService = inject(UpdateService);
  private _PLATFORM_ID = inject(PLATFORM_ID);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private _ToastrService = inject(ToastrService);
  private _AuthenticationService = inject(AuthenticationService) ;
  private _Router = inject(Router) ;
  inncorrectPassword: boolean = false;
  errorMsg!: string;
  changedBefore!: boolean;
  passwordVisibility: { [key: string]: boolean } = {};
  cancelUpdate!: Subscription;
  passwordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+{};:,<.>]{8,32}/), Validators.minLength(8), Validators.maxLength(32)]),
    rePassword: new FormControl(null, [Validators.required, Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+{};:,<.>]{8,32}/), Validators.minLength(8), Validators.maxLength(32)]),
  }, { validators: [this.compare] })
  compare(fGroup: AbstractControl): any {
    return fGroup.get('password')?.value === fGroup.get('rePassword')?.value ? null : { missMatch: true };
  }
  updatePassword(): void {
    if (this.passwordForm.valid) {
      this._NgxSpinnerService.show();
      if (isPlatformBrowser(this._PLATFORM_ID)) {
        if (sessionStorage.getItem('userToken')) {
          this.cancelUpdate = this._UpdateService.UpdateLoggeduserpassword(this.passwordForm.value).subscribe({
            next: (res) => {
              this.inncorrectPassword = false;
              this._NgxSpinnerService.hide();
              this.logout() ;
              this._ToastrService.success('Password Changed Successfully !', '',
                {
                  messageClass: 'messageClassToast',
                  toastClass: 'toastClassBG'
                }
              )
              this.passwordForm.reset();
            },
            error: (err) => {
              this._NgxSpinnerService.hide() ;
              this.inncorrectPassword = true ;
            }
          })
        }
      }
    } else {
      this._NgxSpinnerService.hide();
      this.passwordForm.markAllAsTouched();
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
  togglePassword(controlName: string): void {
    this.passwordVisibility[controlName] = !this.passwordVisibility[controlName];
  }
  ngOnDestroy(): void {
    this.cancelUpdate?.unsubscribe();
  }
}
