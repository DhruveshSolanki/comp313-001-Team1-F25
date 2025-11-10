import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowed: string[] = route.data['roles'] || [];
    // Try stored role first
    let role = (this.auth.getRole() || '').toString().trim().toUpperCase();
    // Fallback: decode role from JWT if storage is missing/out-of-sync
    if (!role) {
      const token = this.auth.getAccessToken();
      if (token && token.split('.').length === 3) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const claimRole = (payload?.role || payload?.roles || payload?.authorities || '').toString();
          role = claimRole.trim().toUpperCase();
        } catch { /* ignore decode errors */ }
      }
    }
    if (!this.auth.isLoggedIn()) return this.router.parseUrl('/login');
    if (allowed.length === 0 || allowed.includes(role)) return true;
    // Fallback route based on role
    switch (role) {
      case 'CUSTOMER': return this.router.parseUrl('/customer-home');
      case 'MANAGER':
      case 'ADMIN': return this.router.parseUrl('/home');
      case 'CHEF':
      case 'SERVER': return this.router.parseUrl('/restaurant-staff');
      default: return this.router.parseUrl('/login');
    }
  }
}
