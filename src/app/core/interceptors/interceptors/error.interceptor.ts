import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Something went wrong. Please try again later.';

      if (error.error instanceof ErrorEvent) {
        // Client-side error (like network)
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Server-side errors
        switch (error.status) {
          case 0:
            errorMessage = 'Failed';
            window.location.reload();
            break;
          case 400:
            errorMessage = 'Failed';
            break;
          case 401:
            errorMessage = 'Failed';
            break;
          case 403:
            errorMessage = 'Failed';
            break;
          case 404:
            errorMessage = 'Failed';
            break;
          case 500:
            errorMessage = 'Failed';
            break;
        }
      }
      toastr.error(errorMessage, '' , {
            messageClass: 'messageClassToast',
            toastClass: 'toastClassBGError'
      });
      return throwError(() => error);
    })
  );
};
