import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private auth: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = this.auth.getAccessToken();
		const withAuth = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

		return next.handle(withAuth).pipe(
			catchError((err: any) => {
				const is401 = err instanceof HttpErrorResponse && err.status === 401;
				const hasRefresh = !!this.auth.getRefreshToken();
				if (is401 && hasRefresh) {
					if (!this.auth.isRefreshing()) {
						return this.auth.refresh().pipe(
							switchMap(() => {
								const newToken = this.auth.getAccessToken();
								const retried = newToken ? withAuth.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }) : withAuth;
								return next.handle(retried);
							})
						);
					}
					// wait until refresh finishes
					return this.auth.onRefresh().pipe(
						filter(flag => !flag),
						take(1),
						switchMap(() => {
							const newToken = this.auth.getAccessToken();
							const retried = newToken ? withAuth.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }) : withAuth;
							return next.handle(retried);
						})
					);
				}
				return throwError(() => err);
			})
		);
	}
}
