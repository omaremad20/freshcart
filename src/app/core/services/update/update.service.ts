import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  userToken:any ;
  private _HttpClient = inject(HttpClient) ;
  constructor(@Inject(PLATFORM_ID) private _PLATFORM_ID:any) {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.userToken = {token : sessionStorage.getItem('userToken')} ;
    }
  }
  UpdateLoggeduserdata(updateForm:object):Observable<any> {
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/users/updateMe/` , updateForm , {headers : this.userToken}) ;
  }
  UpdateLoggeduserpassword(passwordForm:object):Observable<any> {
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/users/changeMyPassword` , passwordForm ,{headers : this.userToken}) ;
  }
  VerifyToken():Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/auth/verifyToken` , {headers : this.userToken}) ;
  }
  GetAllUsers():Observable<any> {
  return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/users`) ;
  }
}
