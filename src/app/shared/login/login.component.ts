import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Account } from '../Interface/account';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  newAccount: Account = { email: '', password: '', full_name: '' };
  isSignIn: boolean = true;
  confirmPassword: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  emailError: boolean = false;
  passwordError: boolean = false;

  successfullyAddedEmail: boolean = false;
  emailExistsAnimation: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService
  ) {}

  submitLogin() {
    this.emailError = false;
    this.passwordError = false;
  
    let errorMessages: string[] = [];
  
    if (!this.newAccount.email.trim()) {
      this.emailError = true;
      errorMessages.push('Email');
    } else if (!this.validateEmail(this.newAccount.email)) {
      this.emailError = true;
      this.toastService.show('Email must be valid.', 'error');
      return;
    }
  
    if (!this.newAccount.password.trim()) {
      this.passwordError = true;
      errorMessages.push('Password');
    }
  
    if (errorMessages.length > 0) {
      const errorMessage = errorMessages.join(' and ') + ' required.';
      this.toastService.show(errorMessage, 'error');
      return;
    }
  
    this.loginService.checkEmail(this.newAccount.email).subscribe({
      next: (response) => {
        if (!response.email_exists) {
          return this.toastService.show('This email does not exist.', 'error');
        }
  
        const loginRequest = {
          email: this.newAccount.email,
          password: this.newAccount.password,
        };
  
        this.loginService.login(loginRequest).subscribe({
          next: (res) => {
            this.toastService.show('Login successful!', 'success');

            localStorage.setItem('token', res.token);
            localStorage.setItem('loginStatus', 'success');
            localStorage.setItem('loggedUser', JSON.stringify(res.user));

            const expireAt = new Date();
            expireAt.setMinutes(expireAt.getMinutes() + 1435); // 23h55min = 1435 min
            localStorage.setItem('expireAt', expireAt.toISOString());
  
            const savedAccounts = localStorage.getItem('accounts');
            let accounts: Account[] = savedAccounts ? JSON.parse(savedAccounts) : [];
            const existingAccount = accounts.find(acc => acc.email === res.user.email);
  
            if (!existingAccount) {
              accounts.forEach(acc => acc.isCurrent = false);
              accounts.push({
                email: res.user.email,
                full_name: res.user.full_name || '',
                password: '',
                isCurrent: true,
              });
            } else {
              accounts.forEach(acc => acc.isCurrent = acc.email === res.user.email);
            }
            localStorage.setItem('accounts', JSON.stringify(accounts));
  
            if (window.opener) {
              window.opener.postMessage('login-success', '*');
              window.close();
            } else {
              this.router.navigate(['/']);
            }
          },
          error: () => {
            this.toastService.show('Invalid email or password.', 'error');
          }
        });
  
      },
      error: () => {
        this.toastService.show('Error checking email. Please try again.', 'error');
      }
    });
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  onEmailInputChange() {
    if (this.newAccount.email.trim() && this.emailError) {
      this.emailError = false;
    }
  }
  
  onPasswordInputChange() {
    if (this.newAccount.password.trim() && this.passwordError) {
      this.passwordError = false;
    }
  }

  submitCreateAccount() {
    if (!this.newAccount.full_name.trim()) {
      this.toastService.show('Full name is required.', 'error');
      return;
    }
    if (!this.newAccount.email.trim()) {
      this.toastService.show('Email is required.', 'error');
      return;
    }
    if (!this.validateEmail(this.newAccount.email)) {
      this.toastService.show('Email must be valid.', 'error');
      return;
    }
    if (!this.newAccount.password.trim()) {
      this.toastService.show('Password is required.', 'error');
      return;
    }
    if (this.newAccount.password.length < 6) {
      this.toastService.show('Password must be at least 6 characters.', 'error');
      return;
    }
    if (this.newAccount.password !== this.confirmPassword) {
      this.toastService.show('Passwords do not match.', 'error');
      return;
    }
  
    this.loginService.checkEmail(this.newAccount.email).subscribe({
      next: (res) => {
        if (res.email_exists) {
          this.toastService.show('This email already exists.', 'info');
          this.emailExistsAnimation = true;
          setTimeout(() => {
            this.emailExistsAnimation = false;
          }, 2000);
          return;
        }
  
        this.loginService.addUser(this.newAccount).subscribe({
          next: (res) => {
            this.toastService.show('Account created successfully!', 'success');
            localStorage.setItem('loginStatus', 'success');
            this.successfullyAddedEmail = true;
          },
          error: () => {
            this.toastService.show('Account creation failed. Try again.', 'error');
          }
        });
      },
      error: () => {
        this.toastService.show('Error checking email. Please try again.', 'error');
      }
    });
  }  

  addAnotherEmail() {
    this.successfullyAddedEmail = false;
    this.isSignIn = false;
    this.newAccount = { email: '', password: '', full_name: '' };
    this.confirmPassword = '';
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }
  
  goToLogin() {
    this.successfullyAddedEmail = false;
    this.isSignIn = true;
    this.newAccount = { email: '', password: '', full_name: '' };
    this.confirmPassword = '';
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }

  toggleForm() {
    this.isSignIn = !this.isSignIn;

    this.newAccount = { email: '', password: '', full_name: '' };
    this.confirmPassword = '';
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
