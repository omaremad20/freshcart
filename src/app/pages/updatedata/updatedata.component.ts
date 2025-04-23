import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UpdateService } from '../../core/services/update/update.service';

@Component({
  selector: 'app-updatedata',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './updatedata.component.html',
  styleUrl: './updatedata.component.scss'
})
export class UpdatedataComponent implements OnDestroy {
  private _UpdateService = inject(UpdateService);
  private _ToastrService = inject(ToastrService);
  private _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  userEmail!: string;
  userName!: string;
  exist!: boolean;
  phoneValue!: string;
  cancelUpdate!: Subscription;
  showErrorMessage: boolean = false;
  updateForm: FormGroup = new FormGroup({
    name: new FormControl(isPlatformBrowser(this._PLATFORM_ID) ? sessionStorage.getItem('userName') || null : null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
    email: new FormControl(isPlatformBrowser(this._PLATFORM_ID) ? sessionStorage.getItem('userEmail') || null : null, [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(254)]),
    phone: new FormControl(isPlatformBrowser(this._PLATFORM_ID) ? sessionStorage.getItem('phone') || null : null, [Validators.required, Validators.pattern(/^(\+20|0)1[0125]\d{8}$/)])
  })
  updateData(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      if (sessionStorage.getItem('userToken')) {
        if (this.updateForm.get('email')?.value === sessionStorage.getItem('userEmail') && this.updateForm.valid) {
          this.showErrorMessage = true;
        } else if (this.updateForm.get('email')?.value !== sessionStorage.getItem('userEmail')) {
          this.showErrorMessage = false;
          if (this.updateForm.valid) {
            this._NgxSpinnerService.show();
            if (isPlatformBrowser(this._PLATFORM_ID)) {
              if (sessionStorage.getItem('userToken')) {
                this.cancelUpdate = this._UpdateService.UpdateLoggeduserdata(this.updateForm.value).subscribe({
                  next: (res) => {
                    this.phoneValue = this.updateForm.get('phone')?.value;
                    sessionStorage.setItem('phone', this.phoneValue);
                    this.exist = false;
                    this.showErrorMessage = false;
                    this.userEmail = res.user.email;
                    sessionStorage.setItem('userEmail', this.userEmail);
                    this.userName = res.user.name;
                    sessionStorage.setItem('userName', this.userName);
                    this._ToastrService.success('Data Updated Successfully !', '',
                      {
                        messageClass: 'messageClassToast',
                        toastClass: 'toastClassBG'
                      })
                    this._NgxSpinnerService.hide()
                  },
                  error: (err) => {
                    this.showErrorMessage = false;
                    this.exist = true;
                    this._NgxSpinnerService.hide();
                  }
                })
              }
            }
          } else {
            this.updateForm.markAllAsTouched();
            this.updateForm.reset();
          }
        }
      }
    }

  }
  ngOnDestroy(): void {
    this.cancelUpdate?.unsubscribe();
  }
}
