import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Email } from '../Interface/email';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ReceivedEmail } from '../Interface/received-email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  getEmails(): Observable<Email[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    return this.http.get<Email[]>(environment.apiUrl + 'email/list', { headers });
  }

  sendEmail(email: Email): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token before sending email:', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(environment.apiUrl + 'email/send', email, { headers });
  }

  // receive email
  getReceiverEmails(): Observable<ReceivedEmail[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    return this.http.get<ReceivedEmail[]>(environment.apiUrl + 'email/receive', { headers });
  }

  // reply email
  replyToEmail(replyData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    return this.http.post<any>(environment.apiUrl + 'email/reply', replyData, { headers });
  }
  
}
