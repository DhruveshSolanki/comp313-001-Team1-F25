import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string; // access token
  expiresIn: number;
  role: string;
  refreshToken: string;
  refreshExpiresIn: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessKey = 'ff.accessToken';
  private readonly refreshKey = 'ff.refreshToken';
  private readonly roleKey = 'ff.role';

  private refreshing = false;
  private refreshSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', req).pipe(
      tap(res => this.storeTokens(res))
    );
  }

  register(payload: { email: string; password: string; name?: string; phoneNumber?: string }): Observable<void> {
    return this.http.post<void>('/api/auth/register', payload);
  }

  refresh(): Observable<LoginResponse> {
    const refresh = this.getRefreshToken();
    if (!refresh) return throwError(() => new Error('Missing refresh token'));
    this.refreshing = true;
    this.refreshSubject.next(true);
    return this.http.post('/api/auth/refresh', refresh, { responseType: 'json' as const, headers: { 'Content-Type': 'text/plain' } }).pipe(
      tap((res: any) => this.storeTokens(res as LoginResponse)),
      tap(() => { this.refreshing = false; this.refreshSubject.next(false); })
    );
  }

  isRefreshing(): boolean { return this.refreshing; }
  onRefresh(): Observable<boolean> { return this.refreshSubject.asObservable(); }

  getAccessToken(): string | null { return localStorage.getItem(this.accessKey); }
  getRefreshToken(): string | null { return localStorage.getItem(this.refreshKey); }
  getRole(): string | null { return localStorage.getItem(this.roleKey); }

  isLoggedIn(): boolean { return !!this.getAccessToken(); }

  logout(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.roleKey);
    // Fire-and-forget call to backend logout (optional); ignore errors for stateless design
    try { this.http.post('/api/auth/logout', this.getRefreshToken() || '', { headers: { 'Content-Type': 'text/plain' } }).subscribe({ next: () => {}, error: () => {} }); } catch {}
  }

  private storeTokens(res: LoginResponse) {
    localStorage.setItem(this.accessKey, res.token);
    localStorage.setItem(this.refreshKey, res.refreshToken);
    localStorage.setItem(this.roleKey, res.role);
  }
}
