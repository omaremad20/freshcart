  import { HttpClient } from '@angular/common/http';
  import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
  import { Observable } from 'rxjs';
  import { enviroment } from '../../../shared/enviroment/enviroment';
  import { isPlatformBrowser } from '@angular/common';

  @Injectable({
    providedIn: 'root'
  })
  export class WishlistService {
    private _HttpClient = inject(HttpClient) ;
    userToken:any ;
    constructor(@Inject(PLATFORM_ID) private _PLATFORM_ID:any) {
      if(isPlatformBrowser(this._PLATFORM_ID)) {
        this.userToken = {token : sessionStorage.getItem('userToken')}
      }
    }
    Addproducttowishlist(productId:any):Observable<any> {
      return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/wishlist` ,  { productId: productId }, {headers : this.userToken})
    }
    Removeproductfromwishlist(productId:any):Observable<any> {
      return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}` , {headers : this.userToken})
    }
    Getloggeduserwishlist():Observable<any> {
      return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/wishlist` , {headers : this.userToken}) ;
    }
  }
