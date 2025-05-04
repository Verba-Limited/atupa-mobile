// toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum ToastType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface Toast {
  type: ToastType;
  message: string;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();
  private nextId = 0;

  constructor() {}

  show(message: string, type: ToastType): void {
    const toast: Toast = {
      type,
      message,
      id: this.nextId++,
    };

    this.toasts.push(toast);
    this.toastSubject.next([...this.toasts]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      this.dismiss(toast.id);
    }, 3000);
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.toastSubject.next([...this.toasts]);
  }

  showSuccess(message: string): void {
    this.show(message, ToastType.SUCCESS);
  }

  showInfo(message: string): void {
    this.show(message, ToastType.INFO);
  }

  showWarning(message: string): void {
    this.show(message, ToastType.WARNING);
  }

  showError(message: string): void {
    this.show(message, ToastType.ERROR);
  }
}