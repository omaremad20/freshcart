import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private _HttpClient = inject(HttpClient) ;
  GetAllBrands():Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/brands`) ;
  }
  constructor() { }
}
