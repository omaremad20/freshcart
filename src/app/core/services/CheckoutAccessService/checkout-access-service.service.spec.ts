import { TestBed } from '@angular/core/testing';

import { CheckoutAccessServiceService } from './checkout-access-service.service';

describe('CheckoutAccessServiceService', () => {
  let service: CheckoutAccessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutAccessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
