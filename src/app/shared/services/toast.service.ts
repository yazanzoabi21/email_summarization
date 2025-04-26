import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toast: NgToastService) {}

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 4000): void {
    switch (type) {
      case 'success':
        this.toast.success(message, 'Success', duration);
        break;
      case 'error':
        this.toast.danger(message, 'Error', duration);
        break;
      case 'warning':
        this.toast.warning(message, 'Warning', duration);
        break;
      case 'info':
      default:
        this.toast.info(message, 'Info', duration);
        break;
    }
  }
}
