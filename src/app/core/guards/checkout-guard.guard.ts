import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CheckoutAccessServiceService } from '../services/CheckoutAccessService/checkout-access-service.service';

export const checkoutGuardGuard: CanActivateFn = (route, state) => {
  const accessService = inject(CheckoutAccessServiceService);
  const router = inject(Router);

  if (accessService.canAccess()) {
    return true;
  } else {
    router.navigate(['/Cart']);
    return false;
  }
};
