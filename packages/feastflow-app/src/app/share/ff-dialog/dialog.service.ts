import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface DialogOptions {
  title?: string;
  width?: string;
  data?: any;
  closeOnBackdrop?: boolean;
}

export interface DialogState {
  open: boolean;
  title?: string;
  width?: string;
  template?: TemplateRef<any> | null;
  context?: any;
  closeOnBackdrop?: boolean;
}

export class DialogRef<T = any> {
  constructor(private _closeFn: (result?: T) => void, private _afterClosed: Subject<T | undefined>) {}
  close(result?: T) { this._closeFn(result); }
  afterClosed(): Observable<T | undefined> { return this._afterClosed.asObservable(); }
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private stateSubject = new BehaviorSubject<DialogState>({ open: false });
  state$ = this.stateSubject.asObservable();

  private currentAfterClosed?: Subject<any>;

  open<T = any>(template: TemplateRef<any>, options?: DialogOptions): DialogRef<T> {
    this.currentAfterClosed = new Subject<T | undefined>();
    const ref = new DialogRef<T>((result?: T) => this.close(result), this.currentAfterClosed);

    this.stateSubject.next({
      open: true,
      title: options?.title,
      width: options?.width,
      template,
      context: options?.data,
      closeOnBackdrop: options?.closeOnBackdrop ?? true
    });

    return ref;
  }

  close<T = any>(result?: T) {
    this.stateSubject.next({ open: false });
    if (this.currentAfterClosed) {
      this.currentAfterClosed.next(result);
      this.currentAfterClosed.complete();
      this.currentAfterClosed = undefined;
    }
  }
}
