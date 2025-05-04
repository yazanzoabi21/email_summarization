import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { Account } from '../Interface/account';
import { Login } from '../Interface/login';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addUser(account: Account): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(environment.apiUrl + 'users/', account, { headers });
  }

  login(loginRequest: Login): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(environment.apiUrl + 'users/login', loginRequest, { headers });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/`);
  }

  checkEmail(email: string): Observable<{ email_exists: boolean }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ email_exists: boolean }>(`${this.apiUrl}users/check-email`, { email }, { headers });
  }

  decodeAndStoreToken(token: string): void {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    sessionStorage.setItem('userInfo', JSON.stringify({
      token: token,
      expiresAt: decodedToken.exp
    }));
  }

  getTokenExpiration(): number | null {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.expiresAt;
    }
    return null;
  }

  clearSession(): void {
    sessionStorage.removeItem('userInfo');
  }
}
