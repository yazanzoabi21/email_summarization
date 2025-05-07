import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SentEmail } from '../Interface/sent-email';

const STORAGE_KEY = 'sentEmails';

@Injectable({
  providedIn: 'root'
})
export class SentService {
  private sentEmailsSubject = new BehaviorSubject<SentEmail[]>(this.loadSentEmails());
  sentEmails$ = this.sentEmailsSubject.asObservable();

  addSentEmail(email: SentEmail) {
    const currentEmails = this.sentEmailsSubject.getValue();
    const updatedEmails = [...currentEmails, email];
    this.sentEmailsSubject.next(updatedEmails);
    this.saveSentEmails(updatedEmails);
  }

  private saveSentEmails(emails: SentEmail[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  }

  private loadSentEmails(): SentEmail[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
