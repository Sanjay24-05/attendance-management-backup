import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRole, AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data?.['roles'] as AppRole[] | undefined) ?? [];

  if (allowedRoles.includes(authService.currentRole)) {
    return true;
  }

  router.navigate([authService.currentRole === 'Employee' ? '/leave-request' : '/dashboard']);
  return false;
};
