import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowed: string[] = (route.data?.['roles'] as string[]) || [];
    const role = (this.auth.getRole() || '').toUpperCase();

    if (!this.auth.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }
    if (allowed.length === 0 || allowed.includes(role)) {
      return true;
    }

    // redirect to a sensible home by role
    const target = role === 'CUSTOMER' ? '/customer-home'
      : (role === 'SERVER' || role === 'CHEF') ? '/restaurant-staff'
      : (role === 'MANAGER') ? '/system-manager'
      : '/home';
    return this.router.createUrlTree([target]);
  }
}
