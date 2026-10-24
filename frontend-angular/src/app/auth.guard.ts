import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    return (await authService.isAuthenticated())
      ? true
      : router.createUrlTree(['/login']);
  } catch {
    return router.createUrlTree(['/login']);
  }
};