import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../shared/enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly _HttpClient = inject(HttpClient) ;
  constructor() { }
  GetAllProducts():Observable<any> {
    return this._HttpClient.get(`${enviroment.baseUrl}/api/v1/products`) ;
  }
  GetSpecificProduct(id:string):Observable<any> {
    return this._HttpClient.get(`${enviroment.baseUrl}/api/v1/products/${id}`)
  }
}
