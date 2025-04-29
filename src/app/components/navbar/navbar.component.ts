// src/app/components/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Account } from '../../shared/Interface/account';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  accounts: Account[] = [];  // List of accounts
  showAddModal = false;
  newAccount: Account = { name: '', email: '', isCurrent: false };
  newPassword = '';
  formErrors = { email: '', password: '', name: '' };
  isSidebarVisible = false;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    // Load accounts from localStorage if available
    const savedAccounts = localStorage.getItem('accounts');
    if (savedAccounts) {
      this.accounts = JSON.parse(savedAccounts);
    }
  }

  get currentAccount(): Account {
    return this.accounts.find(acc => acc.isCurrent) || { name: 'No account', email: 'No email available', isCurrent: false };
  }

  openAddAccountModal() {
    this.newAccount = { name: '', email: '', isCurrent: false };
    this.newPassword = '';
    this.clearErrors();
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  validateForm(): boolean {
    this.clearErrors();
    let isValid = true;

    if (!this.newAccount.email) {
      this.formErrors.email = 'Email is required.';
      isValid = false;
    } else if (!this.validateEmailFormat(this.newAccount.email)) {
      this.formErrors.email = 'Email format is invalid.';
      isValid = false;
    }

    if (!this.newPassword) {
      this.formErrors.password = 'Password is required.';
      isValid = false;
    } else if (this.newPassword.length < 6) {
      this.formErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    if (!this.newAccount.name) {
      this.formErrors.name = 'Full Name is required.';
      isValid = false;
    }

    return isValid;
  }

  validateEmailFormat(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  clearErrors() {
    this.formErrors = { email: '', password: '', name: '' };
  }

  submitNewAccount() {
    if (this.validateForm()) {
      if (this.accounts.length === 0) {
        this.newAccount.isCurrent = true;
      }
  
      this.accounts.push({ ...this.newAccount });
      this.updateLocalStorage();
  
      this.showAddModal = false;
      this.toastService.show('Account added successfully!', 'success');
    }
  }

  switchAccount(account: Account) {
    this.accounts.forEach(acc => acc.isCurrent = false);
    account.isCurrent = true;
    this.updateLocalStorage();
    this.toastService.show(`Switched to ${account.name}`, 'info');
  }

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
    console.log('Sidebar visibility:', this.isSidebarVisible);
  }

  logout() {
    const index = this.accounts.findIndex(acc => acc.isCurrent);
    if (index !== -1) {
      const [loggedOutAccount] = this.accounts.splice(index, 1);
      this.updateLocalStorage();
      this.toastService.show(`Logged out from ${loggedOutAccount.name}`, 'success');
      if (this.accounts.length > 0) {
        this.accounts[0].isCurrent = true;
        this.updateLocalStorage();
      }
    }
  }

  private updateLocalStorage(): void {
    localStorage.setItem('accounts', JSON.stringify(this.accounts));
  }
}
