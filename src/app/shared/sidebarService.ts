import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSidebarOpen = new BehaviorSubject<boolean>(true);
  isOpen$ = this.isSidebarOpen.asObservable();

  toggleSidebar(): void {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }

  openSidebar(): void {
    this.isSidebarOpen.next(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.next(false);
  }
}
