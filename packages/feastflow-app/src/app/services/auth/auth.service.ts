import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpService } from '../http/http.service';
import { ApiMethod, PostURL } from '../http/const';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private roleKey = 'ff.role';
  private roleIdKey = 'ff.roleId';
  private accessKey = 'ff.accessToken';
  private refreshKey = 'ff.refreshToken';

  private refreshing = false;
  private refreshSubject = new BehaviorSubject<boolean>(false);

  constructor(private httpService: HttpService) {}

  // Simple local auth state for guarded routing
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role.toUpperCase());
  }

  logout(): void {
    const refresh = this.getRefreshToken();
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.roleIdKey);
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    if (refresh) {
      // Use shared HttpService and endpoint constants
      this.httpService.requestCall(
        PostURL.POST_LOGOUT,
        ApiMethod.POST,
        { headers: { 'Content-Type': 'text/plain' } },
        refresh
      ).subscribe({ next: () => {}, error: () => {} });
    }
  }

  // Tokens
  getAccessToken(): string | null { return localStorage.getItem(this.accessKey); }
  getRefreshToken(): string | null { return localStorage.getItem(this.refreshKey); }

  // API
  login(payload: { email: string; password: string }): Observable<any> {
    return this.httpService.requestCall(
      PostURL.POST_LOGIN,
      ApiMethod.POST,
      {},
      payload
    ).pipe(tap((res: any) => this.storeTokens(res)));
  }

  register(payload: { email: string; password: string; name?: string; phoneNumber?: string }): Observable<void> {
    return this.httpService.requestCall(
      PostURL.POST_REGISTER,
      ApiMethod.POST,
      {},
      payload
    ).pipe(map(() => void 0));
  }

  refresh(): Observable<any> {
    const refresh = this.getRefreshToken();
    if (!refresh) return throwError(() => new Error('Missing refresh token'));
    this.refreshing = true;
    this.refreshSubject.next(true);
    return this.httpService.requestCall(
      PostURL.POST_REFRESH,
      ApiMethod.POST,
      { headers: { 'Content-Type': 'text/plain' } },
      refresh
    ).pipe(
      tap((res: any) => this.storeTokens(res)),
      tap(() => { this.refreshing = false; this.refreshSubject.next(false); })
    );
  }

  isRefreshing(): boolean { return this.refreshing; }
  onRefresh(): Observable<boolean> { return this.refreshSubject.asObservable(); }

  private storeTokens(res: any) {
    const access = res?.token ? String(res.token) : null;
    const refresh = res?.refreshToken ? String(res.refreshToken) : null;

    if (access) {
      localStorage.setItem(this.accessKey, access);
      // Try to decode JWT payload to extract role/roleId if present in the token
      try {
        const parts = access.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          const roleFromToken = payload.role || payload.Role || payload.roles?.[0];
          const roleIdFromToken = payload.roleId || payload.roleID || payload.RoleId;
          if (roleFromToken && !res?.role) {
            localStorage.setItem(this.roleKey, String(roleFromToken).toUpperCase());
          }
          if (roleIdFromToken && !res?.roleId) {
            localStorage.setItem(this.roleIdKey, String(roleIdFromToken));
          }
        }
      } catch { /* ignore decode errors */ }
    }

    if (refresh) localStorage.setItem(this.refreshKey, refresh);
    if (res?.role) localStorage.setItem(this.roleKey, String(res.role).toUpperCase());
    if (res?.roleId) localStorage.setItem(this.roleIdKey, String(res.roleId));
  }
}
