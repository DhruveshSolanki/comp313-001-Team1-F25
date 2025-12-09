import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastMessage, ToastService } from '../../services/toast.service';

@Component({
  selector: 'ff-toast-container',
  templateUrl: './ff-toast-container.component.html',
  styleUrls: ['./ff-toast-container.component.css']
})
export class FfToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private sub?: Subscription;

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toast.events$.subscribe(t => this.enqueue(t));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private enqueue(t: ToastMessage) {
    this.toasts = [...this.toasts, t];
    const delay = t.delay ?? 2500;
    setTimeout(() => this.dismiss(t.id), delay);
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter(x => x.id !== id);
  }

  cssFor(t: ToastMessage): string {
    switch (t.type) {
      case 'success': return 'text-bg-success';
      case 'error': return 'text-bg-danger';
      case 'warning': return 'text-bg-warning';
      default: return 'text-bg-info';
    }
  }

  closeBtnClass(t: ToastMessage): string {
    // Use a white close button on dark backgrounds
    const dark = t.type === 'success' || t.type === 'error' || t.type === 'info';
    return dark ? 'btn-close-white' : '';
  }
}
