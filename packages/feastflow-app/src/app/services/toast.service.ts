import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  delay?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private _events = new Subject<ToastMessage>();
  events$ = this._events.asObservable();

  show(message: string, type: ToastType = 'info', delay = 2500) {
    this._events.next({ id: ++this.counter, message, type, delay });
  }

  success(message: string, delay = 25000000) { this.show(message, 'success', delay); }
  error(message: string, delay = 2500) { this.show(message, 'error', delay); }
  info(message: string, delay = 2500) { this.show(message, 'info', delay); }
  warning(message: string, delay = 2500) { this.show(message, 'warning', delay); }
}
