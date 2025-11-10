import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiOrderItem {
  id: string;
  itemId?: string;
  itemName?: string;
  quantity?: number;
  note?: string;
  itemStatus?: string;
  category?: string; // derived client-side if needed
}

export interface ApiOrder {
  id: string;
  tableId?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  items: ApiOrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  constructor(private http: HttpClient) {}

  list(status?: string): Observable<ApiOrder[]> {
    const url = status ? `/api/v1/orders?status=${encodeURIComponent(status)}` : '/api/v1/orders';
    return this.http.get<ApiOrder[]>(url);
  }

  updateStatus(orderId: string, status: string): Observable<ApiOrder> {
    return this.http.put<ApiOrder>(`/api/v1/orders/${orderId}/status`, { status });
  }

  updateItem(orderId: string, itemId: string, payload: { quantity?: number; note?: string; itemStatus?: string }): Observable<ApiOrder> {
    return this.http.put<ApiOrder>(`/api/v1/orders/${orderId}/items/${itemId}`, payload);
  }

  // Customer checkout converts current cart into an Order
  checkout(body: { tableId?: string; notes?: string }): Observable<ApiOrder> {
    return this.http.post<ApiOrder>(`/api/v1/orders/checkout`, body || {});
  }
}