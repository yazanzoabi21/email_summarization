import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('compose') composeComponent!: any;

  title = 'email-summarization';
  showSessionExpiredModal = false;

  isCollapsed: boolean = false;

  constructor(
    public router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.checkSessionExpiration();
    this.handleResize(window.innerWidth); 
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.handleResize(event.target.innerWidth);
  }

  handleResize(width: number) {
    if (width < 768) {
      this.isCollapsed = true; // ✅ Collapse automatically
    } else {
      this.isCollapsed = false; // ✅ Expand automatically
    }
  }

  checkSessionExpiration() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const exp = decoded.exp;
        const now = Math.floor(Date.now() / 1000);
        if (now >= exp) {
          this.logout();
        } else {
          const timeout = (exp - now) * 1000;
          setTimeout(() => {
            this.logout();
          }, timeout);
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  logout() {
    console.log('Logging out...');
    localStorage.clear();
    sessionStorage.clear();
    this.toastService.show('Your session has expired.', 'error');
    this.showSessionExpiredModal = true;
  }

  confirmSessionExpired() {
    this.showSessionExpiredModal = false;
    this.router.navigate(['/login']);
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  handleComposeSent(){
    if (this.router.url.includes('/inbox')) {}
  }
}
