import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../core/services/Authentication/authentication.service';
@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly _AuthenticationService = inject(AuthenticationService);
  private _NgxSpinnerService = inject(NgxSpinnerService);
  private readonly _Router = inject(Router);
  incorrecDataMessage!: string;
  atChar: string = '@';
  isLoading: boolean = false;
  userToken!: string;
  userInformation!: any;
  userName!: string;
  userEmail!: string;
  passwordVisable: boolean = false;
  cancelLogin!: Subscription
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email , Validators.maxLength(254) , Validators.minLength(4)]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+{};:,<.>]{8,32}/), Validators.maxLength(32), Validators.minLength(8)]),
  })
  login(): void {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this._NgxSpinnerService.show();
      this.cancelLogin = this._AuthenticationService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          sessionStorage.setItem('userToken', res.token);
          sessionStorage.setItem('userEmail', this.loginForm.get('email')?.value);
          sessionStorage.setItem('userName', res.user.name);
          this._AuthenticationService.userToken = res.token;
          this._AuthenticationService.decodeToken();
          this.isLoading = false;
          this._Router.navigate(['/Home']);
          this.userName = this._AuthenticationService.userName;
          this.userInformation = this._AuthenticationService.userInformation;
          sessionStorage.setItem('userId', this.userInformation.id);
          this.incorrecDataMessage = '';
          this.loginForm.reset();
          this._NgxSpinnerService.hide()
        },
        error: (err) => {
          this.isLoading = false;
          this.incorrecDataMessage = err.error.message
          this._NgxSpinnerService.hide();
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
      this._NgxSpinnerService.hide();
    }
  }
  showPassword(): void {
    this.passwordVisable = !this.passwordVisable
  }
}

