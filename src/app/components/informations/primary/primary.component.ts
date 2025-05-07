import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailService } from '../../../shared/services/email.service';
import { Email } from '../../../shared/Interface/email';
import { EmailEventsService } from '../../../shared/services/email-events.service';

@Component({
  selector: 'app-primary',
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.scss']
})
export class PrimaryComponent implements OnInit {
  @Output() emailClicked = new EventEmitter<Email>();
  @Input() emails: Email[] = [];

  allEmails: Email[] = [];
  selectedEmails: Email[] = [];

  isLoading: boolean = true;

  constructor(private emailService: EmailService, private emailEventsService: EmailEventsService) {}

  ngOnInit() {
    this.fetchEmails();
  
    this.emailEventsService.emailSent$.subscribe(() => {
      this.fetchEmails();
    });
  
    this.emailEventsService.pendingEmail$.subscribe((pendingEmail) => {
      this.emails.unshift(pendingEmail);
    });
  }

  fetchEmails() {
    this.isLoading = true;
    this.emailService.getEmails().subscribe({
      next: (emails) => {
        this.emails = emails;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  toggleStar(email: Email, event: Event) {
    event.stopPropagation();
    // If you want to toggle starred emails you can manually change:
    email.isStarred = !email.isStarred;
  }

  toggleEmailSelection(email: Email, event: Event) {
    event.stopPropagation();
    const index = this.selectedEmails.indexOf(email);
    if (index === -1) {
      this.selectedEmails.push(email);
    } else {
      this.selectedEmails.splice(index, 1);
    }
  }

  archiveEmail(email: Email) {
    console.log('Archive', email);
  }

  deleteEmail(email: Email) {
    console.log('Delete', email);
  }

  markEmailAsRead(email: Email) {
    console.log('Mark as Read', email);
  }

  onEmailClick(email: Email) {
    this.emailClicked.emit(email);
  }

  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    button.appendChild(circle);
  }
}
