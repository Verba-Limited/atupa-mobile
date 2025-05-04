// toast.component.ts
import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, Toast, ToastType } from './../services/toast.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ToastComponent implements OnInit, OnDestroy, AfterViewInit {
  toasts: Toast[] = [];
  private subscription!: Subscription;
  @ViewChildren('toastElement') toastElements!: QueryList<ElementRef>;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      const hadNoToasts = this.toasts.length === 0;
      this.toasts = toasts;
      
      // If we just added a toast when there were none, focus it after render
      if (hadNoToasts && toasts.length > 0) {
        setTimeout(() => this.focusLatestToast(), 100);
      }
    });
  }
  
  ngAfterViewInit() {
    this.toastElements.changes.subscribe(() => {
      if (this.toasts.length > 0) {
        this.focusLatestToast();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
  
  private focusLatestToast() {
    const toastElements = document.querySelectorAll('.toast');
    if (toastElements.length > 0) {
      const latestToast = toastElements[toastElements.length - 1] as HTMLElement;
      if (latestToast) {
        latestToast.focus();
      }
    }
  }

  getTitle(type: ToastType): string {
    switch (type) {
      case ToastType.SUCCESS:
        return 'Success';
      case ToastType.INFO:
        return 'Info';
      case ToastType.WARNING:
        return 'Warning';
      case ToastType.ERROR:
        return 'Error';
      default:
        return '';
    }
  }
}