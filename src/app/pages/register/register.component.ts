import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy{
  emailExsitMsg!:string ;
  isLoading:boolean = false ;
  passwordVisiable:boolean = false ;
  cancelAuth!:Subscription ;
  private readonly _AuthenticationService = inject(AuthenticationService) ;
  private readonly _Router = inject(Router) ;
  private _NgxSpinnerService = inject(NgxSpinnerService) ;
  private _ToastrService = inject(ToastrService)
  registerForm : FormGroup = new FormGroup({
    name : new  FormControl (null , [Validators.required , Validators.minLength(3) , Validators.maxLength(16)]) ,
    email : new FormControl (null , [Validators.required , Validators.email , Validators.maxLength(254) , Validators.minLength(4)]) ,
    password : new FormControl (null , [Validators.required , Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+{};:,<.>]{8,32}/) , Validators.minLength(8) , Validators.maxLength(32)]) ,
    rePassword : new FormControl (null , [Validators.required]) ,
    phone : new FormControl (null , [Validators.required , Validators.pattern(/^(\+20|0)1[0125]\d{8}$/)]) ,
  }, {validators : [this.compare]} ) ;
  compare(fGroup:AbstractControl):any {
    return fGroup.get('password')?.value === fGroup.get('rePassword')?.value ? null : {missMatch : true} ;
  }
  register():void {
    this._NgxSpinnerService.show() ;
    if(this.registerForm.valid) {
      this.isLoading = true ;
      this._AuthenticationService.signUp(this.registerForm.value).subscribe({
        next : (res) => {
          this._NgxSpinnerService.hide() ;
          this.registerForm.reset() ;
          this.emailExsitMsg = '' ;
          this._Router.navigate(['/Login'])
          this.isLoading = false ;
          this._ToastrService.success('Successfull !', '',
            {
              messageClass: 'messageClassToast',
              toastClass: 'toastClassBG'
            }
          )
        } ,
        error : (err) => {
          this._NgxSpinnerService.hide() ;
          this.emailExsitMsg = err.error.message
          this.isLoading = false ;
        }
      })
    }else {
      this._NgxSpinnerService.hide() ;
      this.registerForm.markAllAsTouched()
      this.isLoading = false ;
    }
  }
  showPassword():void {
    this.passwordVisiable = !this.passwordVisiable ;
  }
  ngOnDestroy(): void {
    this.cancelAuth?.unsubscribe() ;
  }
}
