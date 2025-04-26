import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  private allEmails: Email[] = [];
  private starredEmails$ = new BehaviorSubject<Email[]>([]);
  private selectedEmailsSubject = new BehaviorSubject<Email[]>([]);

  selectedEmails$ = this.selectedEmailsSubject.asObservable();

  setEmails(emails: Email[]) {
    this.allEmails = emails;
    this.updateStarred();
  }

  toggleStar(email: Email) {
    email.isStarred = !email.isStarred;
    this.updateStarred();
  }

  getStarredEmails() {
    return this.starredEmails$.asObservable();
  }

  private updateStarred() {
    const starred = this.allEmails.filter(email => email.isStarred);
    this.starredEmails$.next(starred);
  }

  updateSelectedEmails(emails: Email[]) {
    this.selectedEmailsSubject.next(emails);
  }
}
