import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../shared/enviroment/enviroment';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private verificationAllowed = false;

  setVerificationAllowed(status: boolean) {
    this.verificationAllowed = status;
  }

  canAccessVerification(): boolean {
    return this.verificationAllowed;
  }
  isLoggedIn(): boolean {
    let ok: boolean = false;
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      ok = !!sessionStorage.getItem('userToken');
    }
    return ok;
  }


  private _PLATFORM_ID = inject(PLATFORM_ID)
  constructor(private _HttpClient:HttpClient) { }
  userInformation!:any ;
  userName!:string ;
  userToken:any ;
  decodeToken() {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      if(sessionStorage.getItem('userToken') !== null || undefined) {
        this.userToken = sessionStorage.getItem('userToken') ! ;
        this.userInformation = jwtDecode(sessionStorage.getItem('userToken')!) ;
        this.userName = this.userInformation.name ;
      }
    }
  }
  signUp(registerForm:object):Observable<any> {
    return this._HttpClient.post(`${enviroment.baseUrl}/api/v1/auth/signup` , registerForm) ;
  }
  signIn(loginForm:object):Observable<any> {
    return this._HttpClient.post(`${enviroment.baseUrl}/api/v1/auth/signin` , loginForm) ;
  }
  //reset
  ForgotPassword(emailForm:object):Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords` , emailForm) ;
  }
  VerifyResetCode(resetCode:object):Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode` , resetCode) ;
  }
  ResetPassword(resetForm:object):Observable<any> {
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/auth/resetPassword` , resetForm) ;
  }



}
