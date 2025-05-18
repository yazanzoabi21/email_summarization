import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Email } from '../Interface/email';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ReceivedEmail } from '../Interface/received-email';
import { RepliedEmail } from '../Interface/replied-email';
import { ReceivedEmailWithReplies } from '../Interface/received-email-with-replies';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  getEmails(): Observable<Email[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Email[]>(environment.apiUrl + 'email/list', {
      headers,
    });
  }

  sendEmail(email: Email): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token before sending email:', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(environment.apiUrl + 'email/send', email, {
      headers,
    });
  }

  // receive email
  getReceiverEmails(): Observable<ReceivedEmail[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ReceivedEmail[]>(
      environment.apiUrl + 'email/receive',
      { headers }
    );
  }

  // add this method to EmailService
  getEmailsWithReplies(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<ReceivedEmailWithReplies[]>(
      environment.apiUrl + 'email/threads', 
      { headers }
    );
  }

  // reply email
  replyToEmail(replyData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(environment.apiUrl + 'email/reply', replyData, {
      headers,
    });
  }

  getRepliedEmails(): Observable<RepliedEmail[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<RepliedEmail[]>(`${environment.apiUrl}email/replies`, {
      headers,
    });
  }

  markReceivedEmailAsRead(emailId: string, isRead: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = { is_read: isRead };

    return this.http.put(
      `${environment.apiUrl}email/receive/mark-as-read/${emailId}`,
      body,
      { headers }
    );
  }

  // starred
  starred(id: number, isStarred: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = { is_starred: isStarred };
    return this.http.put(`${environment.apiUrl}email/starred/${id}`, body, {
      headers,
    });
  }

  getStarredEmails(): Observable<Email[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Email[]>(`${environment.apiUrl}email/starred`, {
      headers,
    });
  }
}
