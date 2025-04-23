import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from '../Authentication/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class CartService  {
  private _HttpClient = inject(HttpClient) ;
  private _PLATFORM_ID_= inject(PLATFORM_ID) ;
  private _AuthenticationService = inject(AuthenticationService) ;
  numOfCartItems:BehaviorSubject<number> = new BehaviorSubject(0) ;
  userToken:any;
  constructor(@Inject(PLATFORM_ID) private _PLATFORM_ID:object) {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.userToken = {token : sessionStorage.getItem('userToken')} ;
    }else {
      this.userToken = {};
    }
  }
  getLoggedUserCart():Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/cart' , {headers :  this.userToken})
  }
  addProductToCart(productId:any):Observable<any> {
    if(isPlatformBrowser(this._PLATFORM_ID_)) {
      this.userToken = {token : sessionStorage.getItem('userToken')} ;
    }
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/cart' , {productId : productId} ,  {headers : this.userToken} )
  }

  removeSpecificCartItem(productId:string):Observable<any> {
    if(isPlatformBrowser(this._PLATFORM_ID_)) {
      this.userToken = {token : sessionStorage.getItem('userToken')} ;
    }
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}` , {headers : this.userToken})
  }
  updateCartProductQuantity(productId:string , count:any):Observable<any> {
    if(isPlatformBrowser(this._PLATFORM_ID_)) {
      this.userToken = {token : sessionStorage.getItem('userToken')} ;
    }
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`  , count , { headers: this.userToken }) ;
  }
  clearUserCart():Observable<any> {
    return this._HttpClient.delete('https://ecommerce.routemisr.com/api/v1/cart' , {headers : this.userToken}) ;
  }
}
