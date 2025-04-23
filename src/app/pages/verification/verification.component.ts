import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { error } from 'node:console';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verification',
  imports: [ReactiveFormsModule , FormsModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss'
})
export class VerificationComponent implements OnDestroy{
  private _AuthenticationService = inject(AuthenticationService);
  private _NgxSpinnerService = inject(NgxSpinnerService) ;
  private _Router = inject(Router);
  vaildCode!:boolean ;
  cancelVerfiy!:Subscription
  codeForm:FormGroup = new FormGroup({
    resetCode : new FormControl (null , [Validators.required , Validators.minLength(5) , Validators.maxLength(6) , Validators.pattern(/^\d+$/)])
  })
  verfiy():void {
    if(this.codeForm.valid) {
      this._NgxSpinnerService.show() ;
      this.cancelVerfiy = this._AuthenticationService.VerifyResetCode(this.codeForm.value).subscribe({
        next : (res) => {
          this.vaildCode = true ;
          this._NgxSpinnerService.hide() ;
          this.codeForm.reset() ;
          this._Router.navigate(['/resetpassword']) ;
        } ,
        error : (err) => {
          this.codeForm.reset() ;
          this._NgxSpinnerService.hide() ;
          this.vaildCode = false ;
        }
      }
    )
    }else {
      this.codeForm.markAllAsTouched() ;
    }
  }
  ngOnDestroy(): void {
    this.cancelVerfiy?.unsubscribe();
  }
}
