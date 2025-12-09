import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiMethod } from './const';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // Service for making HTTP requests

  constructor(private http: HttpClient) { }

  /**
   * Makes an HTTP request using the specified API endpoint and method.
   * @param api The API endpoint URL.
   * @param method The HTTP method to use (GET, POST, etc.).
   * @param headers Optional HTTP headers.
   * @param data Optional request payload for POST requests.
   * @returns An observable with the HTTP response.
   */
  requestCall(api: string, method: ApiMethod, headers?: any, data?: any) {
    const fullUrl = this.buildUrl(api);
    let response;
    switch (method) {
      case ApiMethod.GET:
        response = this.http.get(`${fullUrl}`, headers)
          .pipe(catchError((error) => this.handleError(error)));
        break;
      case ApiMethod.POST:
        response = this.http.post(`${fullUrl}`, data, headers)
          .pipe(catchError((error) => this.handleError(error)));
        break;
      case ApiMethod.PUT:
        response = this.http.put(`${fullUrl}`, data, headers)
          .pipe(catchError((error) => this.handleError(error)));
        break;
      case ApiMethod.DELETE:
        response = this.http.delete(`${fullUrl}`, headers)
          .pipe(catchError((error) => this.handleError(error)));
        break;
      default:
        throw new Error(`Unsupported API method: ${method}`);
    }
    return response;
  }

  /**
   * Builds a full URL from a possibly relative API path.
   * - If `api` is an absolute URL (starts with http), returns it unchanged.
   * - If `api` starts with '/api', prefixes with environment.apiBaseUrl root.
   * - Otherwise returns as provided (for assets or already-prefixed endpoints).
   */
  private buildUrl(api: string): string {
    if (!api) return api;
    const isAbsolute = /^https?:\/\//i.test(api);
    if (isAbsolute) return api;
    // Handle asset requests
    if (api.startsWith('assets/')) return api;
    // Normalize when using endpoint constants like '/api/v1/...'
    if (api.startsWith('/api')) {
      const base = environment.apiBaseUrl.replace(/\/$/, '');
      const baseHasApiV1 = /\/api\/v1$/i.test(base);
      if (baseHasApiV1) {
        // Strip leading '/api/v1' from the requested path to avoid duplication
        const remainder = api.replace(/^\/api\/v1/i, '');
        return `${base}${remainder}` || base;
      } else {
        // Base doesn't include '/api/v1', just join base + api
        return `${base}${api}`;
      }
    }
    return api;
  }

  /**
   * Handles HTTP errors and returns an observable error.
   * @param error The HTTP error response.
   * @returns An observable that emits the error.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(error.error.message);
      return throwError(() => error);
    } else {
      return throwError(() => error);
    }
  }

}