import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiReservation {
  id: string;
  tableId: string;
  customerEmail: string;
  reservationTime: string;
  numberOfGuests: number;
  specialRequest?: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationsApiService {
  constructor(private http: HttpClient) {}

  listAll(): Observable<ApiReservation[]> {
    return this.http.get<ApiReservation[]>(`/api/v1/reservations`);
  }

  updateStatus(id: string, status: string): Observable<ApiReservation> {
    return this.http.put<ApiReservation>(`/api/v1/reservations/${id}/status`, { status });
  }
}