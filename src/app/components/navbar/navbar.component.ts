import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Account } from '../../shared/Interface/account';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  @Output() sidebarToggled = new EventEmitter<void>();

  accounts: Account[] = [];
  isSidebarVisible = false;
  isAccountListOpen = true;

  showLoginModal = false;
  reactivateAccount: Account | null = null;
  reactivatePassword = '';
  reactivateError = '';

  isSidebarOpen = true;
  // isCollapsed = false;

  showAccountSelectionOnLogout = false;
  loggedOutAccount: Account | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadAccounts();
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    this.listenForLoginMessages();
  }

  private loadAccounts(): void {
    const savedAccounts = localStorage.getItem('accounts');
    this.accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
  }

  private updateLocalStorage(): void {
    localStorage.setItem('accounts', JSON.stringify(this.accounts));
  }

  get currentAccount(): Account {
    return this.accounts.find(acc => acc.isCurrent) || { full_name: 'No account', email: 'No email available', password: '', isCurrent: false };
  }

  toggleSidebar(): void {
    this.sidebarToggled.emit();
  }

  toggleAccountList(): void {
    this.isAccountListOpen = !this.isAccountListOpen;
  }

  openLoginInNewTab(): void {
    window.open('/login', '_blank');
  }

  handleAccountClick(account: Account): void {
    if (account.isCurrent) return;
    account.isLoggedOut ? this.openReactivateModal(account) : this.switchAccount(account);
  }

  switchAccount(account: Account): void {
    this.accounts.forEach(acc => acc.isCurrent = false);
    account.isCurrent = true;
    this.updateLocalStorage();
    this.toastService.show(`Switched to ${account.email}`, 'info');
  }

  logout(): void {
    const currentAccount = this.currentAccount;
    if (!currentAccount || currentAccount.full_name === 'No account') return;
  
    const otherAccounts = this.accounts.filter(acc => acc.email !== currentAccount.email && !acc.isLoggedOut);
    if (otherAccounts.length > 0) {
      this.showAccountSelectionOnLogout = true;
      this.loggedOutAccount = currentAccount;
    } else {
      currentAccount.isCurrent = false;
      currentAccount.isLoggedOut = true;
      this.updateLocalStorage();
      this.toastService.show(`Logged out successfully`, 'success');
    }
  }  

  cancelAccountSelection(): void {
    if (this.loggedOutAccount) {
      this.loggedOutAccount.isCurrent = true;
      this.updateLocalStorage();
    }
    this.showAccountSelectionOnLogout = false;
    this.toastService.show('No account is currently logged in', 'info');
  }

  selectAccountAfterLogout(account: Account): void {
    if (this.loggedOutAccount) {
      this.loggedOutAccount.isCurrent = false;
      this.loggedOutAccount.isLoggedOut = true;
    }
    account.isCurrent = true;
    account.isLoggedOut = false;
    this.updateLocalStorage();
    this.showAccountSelectionOnLogout = false;
    this.toastService.show(`Switched to ${account.email}`, 'success');
  }

  openReactivateModal(account: Account): void {
    this.reactivateAccount = account;
    this.reactivatePassword = '';
    this.reactivateError = '';
    this.showLoginModal = true;
  }

  cancelReactivate(): void {
    this.showLoginModal = false;
    this.toastService.show('No account is currently logged in', 'info');
  }

  submitReactivate(): void {
    if (!this.reactivatePassword.trim()) {
      this.reactivateError = 'Password is required.';
      return;
    }
    if (this.reactivateAccount) {
      this.accounts.forEach(acc => acc.isCurrent = false);
      this.reactivateAccount.isCurrent = true;
      this.reactivateAccount.isLoggedOut = false;
      this.updateLocalStorage();
      this.showLoginModal = false;
      this.toastService.show(`Logged in to ${this.reactivateAccount.email}`, 'success');
    }
  }

  private listenForLoginMessages(): void {
    window.addEventListener('message', (event) => {
      if (event.data === 'login-success') {
        this.loadAccounts();
        const current = this.currentAccount;
        this.toastService.show(
          current ? `Logged in as ${current.email}` : 'Logged in successfully',
          'success'
        );
      }
    });
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'newAccount' && event.newValue) {
      const newAccount: Account = JSON.parse(event.newValue);
      if (!this.accounts.some(acc => acc.email === newAccount.email)) {
        this.accounts.forEach(acc => acc.isCurrent = false);
        newAccount.isCurrent = true;
        this.accounts.push(newAccount);
        this.updateLocalStorage();
      }
      localStorage.removeItem('newAccount');
    }
  }
}
