import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Email } from '../../../shared/Interface/email';
import { trigger, transition, style, animate } from '@angular/animations';
import { EmailService } from '../../../shared/services/email.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
  animations: [
    trigger('fadeSlideAnimation', [
      transition('inbox => email', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition('email => inbox', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class InboxComponent implements OnInit {
  activeTab = 'primary';
  selectedEmailsExist = false;
  selectedEmail: Email | null = null
  scrollPosition = 0;

  selectedEmails: Email[] = [];

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    // this.emailService.selectedEmails$.subscribe((emails) => {
    //   this.selectedEmails = emails;
    // });
  }

  markAllAsRead() {
    console.log('Mark all as read clicked');
  }
  
  selectAll() {
    console.log('Select all clicked');
  }
  
  selectNone() {
    console.log('Select none clicked');
  }
  
  selectRead() {
    console.log('Select read clicked');
  }
  
  selectUnread() {
    console.log('Select unread clicked');
  }
  
  refresh() {
    console.log('Refresh clicked');
  }

  openEmail(email: Email) {
    this.scrollPosition = window.scrollY;
    this.selectedEmail = email;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }  

  closeEmail() {
    this.selectedEmail = null;
    setTimeout(() => {
      window.scrollTo({ top: this.scrollPosition, behavior: 'smooth' });
    }, 100);
  }

  archiveSelectedEmails() {
    console.log('Archive these emails:', this.selectedEmails);
    // your archive logic
  }
  
  deleteSelectedEmails() {
    console.log('Delete these emails:', this.selectedEmails);
    // your delete logic
  }
  
  markSelectedAsRead() {
    console.log('Mark as read these emails:', this.selectedEmails);
    // your mark as read logic
  }  
}