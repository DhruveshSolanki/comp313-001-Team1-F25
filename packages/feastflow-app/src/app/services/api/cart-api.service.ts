import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiCartItem {
  id: string;
  menuItemId: string;
  name?: string;
  quantity: number;
  note?: string;
  price?: number;
}

export interface ApiCart {
  id: string;
  customerEmail: string;
  items: ApiCartItem[];
  totalPrice?: number;
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  constructor(private http: HttpClient) {}

  getMyCart(): Observable<ApiCart> {
    return this.http.get<ApiCart>(`/api/v1/cart/me`);
  }

  addItem(menuItemId: string, quantity = 1, note?: string): Observable<ApiCart> {
    return this.http.post<ApiCart>(`/api/v1/cart/me/items`, { menuItemId, quantity, note });
  }

  updateItem(cartItemId: string, quantity: number, note?: string): Observable<ApiCart> {
    return this.http.put<ApiCart>(`/api/v1/cart/me/items/${cartItemId}`, { quantity, note });
  }

  removeItem(cartItemId: string): Observable<ApiCart> {
    return this.http.delete<ApiCart>(`/api/v1/cart/me/items/${cartItemId}`);
  }

  clear(): Observable<ApiCart> {
    return this.http.delete<ApiCart>(`/api/v1/cart/me`);
  }
}