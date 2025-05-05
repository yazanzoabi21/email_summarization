import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmailService } from '../../../shared/services/email.service';
import { Email } from '../../../shared/Interface/email';

@Component({
  selector: 'app-primary',
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.scss']
})
export class PrimaryComponent implements OnInit {
  @Output() emailClicked = new EventEmitter<Email>();

  emails: Email[] = [];
  selectedEmails: Email[] = [];

  constructor(private emailService: EmailService) {}

  ngOnInit() {
    this.loadEmails();
  }

  loadEmails() {
    this.emailService.getEmails().subscribe({
      next: (emails) => {
        this.emails = emails;
      },
      error: (error) => {
        console.error('Error fetching emails:', error);
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
