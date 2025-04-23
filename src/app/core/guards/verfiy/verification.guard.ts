import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../services/Authentication/authentication.service';

export const verificationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.canAccessVerification()) {
    return true;
  } else {
    router.navigate(['/ForgettenPassword']);
    return false;
  }
};
