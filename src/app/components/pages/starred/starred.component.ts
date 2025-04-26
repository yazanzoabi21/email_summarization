import { Component, OnInit } from '@angular/core';
import { Email, EmailService } from '../../../shared/emailService';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-starred',
  templateUrl: './starred.component.html',
  styleUrls: ['./starred.component.scss'],
  animations: [
    trigger('fadeSlideAnimation', [
      transition('inbox => email', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition('email => inbox', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('250ms ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ])
  ]
})
export class StarredComponent implements OnInit {
  starredEmails: Email[] = [];
  selectedEmail: Email | null = null;

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.emailService.getStarredEmails().subscribe((emails) => {
      this.starredEmails = emails;
    });
  }

  toggleStar(email: Email, event: Event): void {
    event.stopPropagation();
    this.emailService.toggleStar(email);
  }

  toggleEmailSelection(event: Event): void {
    event.stopPropagation();
  }

  onEmailClick(email: Email) {
    this.selectedEmail = email;
  }
  
  closeEmail() {
    this.selectedEmail = null;
  }

  archiveEmail(email: Email): void {
    console.log('Archiving email:', email);
    // Add logic to archive email if needed
  }

  deleteEmail(email: Email): void {
    console.log('Deleting email:', email);
    this.starredEmails = this.starredEmails.filter(e => e.id !== email.id);
  }

  markEmailAsRead(email: Email): void {
    console.log('Marking as read:', email);
    email.isRead = true;
  }
}
