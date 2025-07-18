// Angular imports
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

// Service imports
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Service injections
  const authService = inject(AuthService);

  // Verify if the token is still active
  authService.verifyToken();

  // Get the token
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
