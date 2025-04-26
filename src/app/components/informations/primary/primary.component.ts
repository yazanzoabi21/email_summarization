import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../../shared/emailService';
import { Email } from '../../../shared/Interface/email';

@Component({
  selector: 'app-primary',
  templateUrl: './primary.component.html',
  styleUrl: './primary.component.scss'
})
export class PrimaryComponent implements OnInit {
  @Output() emailClicked = new EventEmitter<Email>();

  emails: Email[] = [];
  starredEmails: Email[] = [];
  selectedEmails: Email[] = [];

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
        preview: 'Hey Yazan Zoabi, you are eligible to Apply for this Job Chat and your application will be processed',
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
      },
      {
        id: 3,
        sender: 'Alibaba',
        subject: 'Final call: Yazan Zoabi, Your Application will be processed',
        preview: 'Discover hot products loved by retailers, Hey Yazan Zoabi, you are eligible to Apply for this Job Chat and your application will be processed',
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

  toggleEmailSelection(email: Email, event: Event) {
    event.stopPropagation();
    
    const index = this.selectedEmails.indexOf(email);
    if (index === -1) {
      this.selectedEmails.push(email);
    } else {
      this.selectedEmails.splice(index, 1);
    }
  
    this.emailService.updateSelectedEmails(this.selectedEmails);
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