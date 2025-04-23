import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private _HttpClient = inject(HttpClient) ;
  userToken:any ;
  constructor(@Inject(PLATFORM_ID) private _PLATFORM_ID:any) {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.userToken = {token : sessionStorage.getItem('userToken')}
    }else {
      this.userToken = {}
    }
  }
  Getloggeduseraddresses():Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/addresses` , {headers : this.userToken})
  }
  Addaddress(addressForm:object):Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/addresses` , addressForm , {headers : this.userToken})
  }
  Removeaddress(addressId:string):Observable<any> {
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/addresses/${addressId}` , {headers : this.userToken})
  }
  Getspecificaddress(addressId:string):Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/addresses/${addressId}` , {headers : this.userToken})
  }
}
