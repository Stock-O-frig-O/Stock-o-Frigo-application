// Angular imports
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Local imports
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  // Service injection
  const authService = inject(AuthService);
  const route = inject(Router);

  // Return true if the user is log in
  if (authService.isLoggedIn()) {
    return true;
  } else {
    route.navigate(['/login']);
    return false;
  }
};
