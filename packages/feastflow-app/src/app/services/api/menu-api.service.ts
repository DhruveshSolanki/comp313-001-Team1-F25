import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiMenuItem {
  itemId: string;
  itemName: string;
  itemDescription?: string;
  price?: number;
  category?: string;
  warnings?: string[];
  ingredients?: string[];
}

@Injectable({ providedIn: 'root' })
export class MenuApiService {
  constructor(private http: HttpClient) {}

  list(): Observable<ApiMenuItem[]> {
    return this.http.get<ApiMenuItem[]>(`/api/v1/restaurantmenu`);
  }

  add(item: Partial<ApiMenuItem>): Observable<ApiMenuItem> {
    return this.http.post<ApiMenuItem>(`/api/v1/restaurantmenu`, item);
  }

  update(item: Partial<ApiMenuItem> & { itemId: string }): Observable<ApiMenuItem> {
    return this.http.put<ApiMenuItem>(`/api/v1/restaurantmenu`, item);
  }

  delete(itemId: string): Observable<ApiMenuItem> {
    return this.http.delete<ApiMenuItem>(`/api/v1/restaurantmenu/${itemId}`);
  }
}