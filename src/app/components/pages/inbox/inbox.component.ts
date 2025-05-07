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
  selectedEmail: Email | null = null;
  scrollPosition = 0;

  allEmails: Email[] = [];
  emails: Email[] = [];

  currentPage = 1;
  itemsPerPage = 25;
  totalItems = 0;

  selectedEmails: Email[] = [];

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.loadEmails();
  }

  loadEmails() {
    this.emailService.getEmails().subscribe({
      next: (emails) => {
        this.allEmails = emails;
        this.totalItems = emails.length;
        this.updateDisplayedEmails();
      },
      error: (error) => {
        console.error('Error fetching emails:', error);
      }
    });
  }

  updateDisplayedEmails() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.emails = this.allEmails.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.updateDisplayedEmails();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedEmails();
    }
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
  }
  
  deleteSelectedEmails() {
    console.log('Delete these emails:', this.selectedEmails);
  }
  
  markSelectedAsRead() {
    console.log('Mark as read these emails:', this.selectedEmails);
  }
}
