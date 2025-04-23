import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutAccessServiceService {
  private accessAllowed = false;

  allowAccess() {
    this.accessAllowed = true;
  }

  canAccess(): boolean {
    return this.accessAllowed;
  }

  resetAccess() {
    this.accessAllowed = false;
  }
  constructor() { }
}
