import { Component, OnInit } from '@angular/core';
import { EmailService } from '../../../shared/services/email.service';
import { RepliedEmail } from '../../../shared/Interface/replied-email';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit {
  repliedEmails: RepliedEmail[] = [];
  selectedEmail: RepliedEmail | null = null;

  isLoading: boolean = false;

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.fetchRepliedEmails();
  }

  fetchRepliedEmails(): void {
    this.isLoading = true;
    this.emailService.getRepliedEmails().subscribe({
      next: (replies: RepliedEmail[]) => {
        this.repliedEmails = replies.map(reply => ({
          ...reply,
          time: reply.time || new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        this.isLoading = false;
      }
    });
  }

  openEmailDetail(email: RepliedEmail): void {
    this.selectedEmail = email;
  }

  backToList(): void {
    this.selectedEmail = null;
  }
}
