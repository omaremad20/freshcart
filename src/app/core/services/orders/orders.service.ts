import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../shared/enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private _HttpClient = inject(HttpClient) ;
  userToken:any ;
  constructor(@Inject(PLATFORM_ID) private _PLATFORM_ID:any) {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.userToken = {token : sessionStorage.getItem('userToken')}
    }
  }
  createCashOrder(cartId:string , orderForm:object):Observable<any> {
    return this._HttpClient.post (
      `${enviroment.baseUrl}/api/v1/orders/${cartId}`
      , {shippingAddress : orderForm}
      , {headers : this.userToken}
    )
  }
  getUserOrders(userId:string):Observable<any> {
    return this._HttpClient.get (`${enviroment.baseUrl}/api/v1/orders/user/${userId}`)
  }
  checkOutSession(cartId:string , orderForm:object):Observable<any> {
    return this._HttpClient.post (
      `${enviroment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${enviroment.domain}`
      , {shippingAddress : orderForm} ,
      {headers : this.userToken}
    )
  }

}
