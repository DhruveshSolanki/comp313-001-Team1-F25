import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getAccessToken();
    const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next.handle(cloned).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401 && this.auth.getRefreshToken()) {
          if (!this.auth.isRefreshing()) {
            return this.auth.refresh().pipe(
              switchMap(() => {
                const newToken = this.auth.getAccessToken();
                const retried = newToken ? cloned.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }) : cloned;
                return next.handle(retried);
              })
            );
          } else {
            return this.auth.onRefresh().pipe(
              filter(r => !r),
              take(1),
              switchMap(() => {
                const newToken = this.auth.getAccessToken();
                const retried = newToken ? cloned.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }) : cloned;
                return next.handle(retried);
              })
            );
          }
        }
        return throwError(() => err);
      })
    );
  }
}
