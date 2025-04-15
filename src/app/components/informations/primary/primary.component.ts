import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../../shared/emailService';

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
}

@Component({
  selector: 'app-primary',
  templateUrl: './primary.component.html',
  styleUrl: './primary.component.scss'
})
export class PrimaryComponent implements OnInit {
  emails: Email[] = [];
  starredEmails: Email[] = [];

  constructor(private emailService: EmailService){}
  
  ngOnInit() {
    this.loadEmails();
  }
  
  loadEmails() {
    this.emails = [
      {
        id: 1,
        sender: 'Shweta Gupta',
        subject: 'Final call: Yazan Zoabi, Your Application will be processed',
        preview: 'Hey Yazan Zoabi, you are eligible to Apply for this Job Chat and...',
        time: '6:32 PM',
        isRead: false,
        isStarred: false
      },
      {
        id: 2,
        sender: 'Alibaba',
        subject: 'Hi Zohbi, popular finds for you',
        preview: 'Discover hot products loved by retailers',
        time: '6:54 AM',
        isRead: false,
        isStarred: false
      }
    ];
    this.emailService.setEmails(this.emails);
  }

  toggleStar(email: Email, event: Event) {
    event.stopPropagation();
    this.emailService.toggleStar(email);
  }

  toggleEmailSelection(event: Event) {
    event.stopPropagation();
  }
}