import { Component, OnInit } from '@angular/core';
import { EmailService } from '../../../shared/services/email.service';
import { ReceivedEmail } from '../../../shared/Interface/received-email';
import { SentService } from '../../../shared/services/sent.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
  emails: ReceivedEmail[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  selectedEmail: ReceivedEmail | null = null;
  showReplyForm = false;
  replyBody: string = '';

  constructor(private emailService: EmailService, private sentService: SentService) {}

  ngOnInit(): void {
    this.fetchReceiveEmails();
  }

  fetchReceiveEmails() {
    this.isLoading = true;
    this.emailService.getReceiverEmails().subscribe({
      next: (emails) => {
        this.emails = emails;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load received emails.';
        this.isLoading = false;
      }
    });
  }

  openEmail(email: ReceivedEmail) {
    this.selectedEmail = email;
    this.showReplyForm = false;
  }

  sendReply() {
    if (this.selectedEmail) {
      const replyPayload = {
        recipient: this.extractEmailAddress(this.selectedEmail.from),
        subject: `Re: ${this.selectedEmail.subject}`,
        body: this.replyBody,
        thread_id: this.selectedEmail.thread_id,
        message_id: this.selectedEmail.message_id
      };
  
      this.emailService.replyToEmail(replyPayload).subscribe({
        next: () => {
          // 🆕 Add to SentService
          this.sentService.addSentEmail({
            recipient: replyPayload.recipient,
            subject: replyPayload.subject,
            body: replyPayload.body,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
  
          alert('Reply sent successfully!');
          this.closeModal();
        },
        error: (error) => {
          alert('Failed to send reply.');
        }
      });
    }
  }  

  extractEmailAddress(fullFrom: string): string {
    const match = fullFrom.match(/<(.*?)>/);
    return match ? match[1] : fullFrom;
  }

  closeModal() {
    this.selectedEmail = null;
    this.replyBody = '';
    this.showReplyForm = false;
  }
}
