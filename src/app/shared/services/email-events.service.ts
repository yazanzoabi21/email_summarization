import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Email } from '../Interface/email';

@Injectable({
  providedIn: 'root'
})
export class EmailEventsService {
  private emailSentSource = new Subject<void>();
  emailSent$ = this.emailSentSource.asObservable();

  private pendingEmailSource = new Subject<Email>();
  pendingEmail$ = this.pendingEmailSource.asObservable();

  emitEmailSent() {
    this.emailSentSource.next();
  }

  emitPendingEmail(email: Email) {
    this.pendingEmailSource.next(email);
  }
}
