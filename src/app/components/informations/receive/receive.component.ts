// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { EmailService } from '../../../shared/services/email.service';
// import { ReceivedEmail } from '../../../shared/Interface/received-email';
// import { SentService } from '../../../shared/services/sent.service';

// @Component({
//   selector: 'app-receive',
//   templateUrl: './receive.component.html',
//   styleUrls: ['./receive.component.scss']
// })
// export class ReceiveComponent implements OnInit {
//   @Output() refreshRequested = new EventEmitter<void>();
//   @Output() totalItemsChanged = new EventEmitter<number>();
//   @Output() loadingFinished = new EventEmitter<void>();

//   @Input() currentPage: number = 1;
//   @Input() itemsPerPage: number = 25;

//   allEmails: ReceivedEmail[] = [];
//   emails: ReceivedEmail[] = [];

//   isLoading: boolean = true;
//   error: string | null = null;

//   selectedEmail: ReceivedEmail | null = null;
//   showReplyForm = false;
//   replyBody: string = '';

//   constructor(private emailService: EmailService, private sentService: SentService) {}

//   ngOnInit(): void {
//     this.fetchReceiveEmails();
//   }

//   fetchReceiveEmails() {
//     this.isLoading = true;
//     this.emailService.getReceiverEmails().subscribe({
//       next: (emails) => {
//         this.allEmails = emails;
//         this.totalItemsChanged.emit(emails.length);
//         this.loadingFinished.emit();
//         this.updateDisplayedEmails();
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.error = 'Failed to load received emails.';
//         this.loadingFinished.emit();
//         this.isLoading = false;
//       }
//     });
//   }

//   updateDisplayedEmails() {
//     const start = (this.currentPage - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     this.emails = this.allEmails.slice(start, end);
//   }
  
//   ngOnChanges() {
//     this.updateDisplayedEmails();
//   }  

//   refresh() {
//     this.refreshRequested.emit();
//     this.fetchReceiveEmails();
//   }

//   openEmail(email: ReceivedEmail) {
//     this.selectedEmail = email;
//     this.showReplyForm = false;
//   }

//   sendReply() {
//     if (this.selectedEmail) {
//       const replyPayload = {
//         recipient: this.extractEmailAddress(this.selectedEmail.from),
//         subject: `Re: ${this.selectedEmail.subject}`,
//         body: this.replyBody,
//         thread_id: this.selectedEmail.thread_id,
//         message_id: this.selectedEmail.message_id
//       };
  
//       this.emailService.replyToEmail(replyPayload).subscribe({
//         next: () => {
//           // 🆕 Add to SentService
//           this.sentService.addSentEmail({
//             recipient: replyPayload.recipient,
//             subject: replyPayload.subject,
//             body: replyPayload.body,
//             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//           });
  
//           alert('Reply sent successfully!');
//           this.closeModal();
//         },
//         error: (error) => {
//           alert('Failed to send reply.');
//         }
//       });
//     }
//   }  

//   extractEmailAddress(fullFrom: string): string {
//     const match = fullFrom.match(/<(.*?)>/);
//     return match ? match[1] : fullFrom;
//   }

//   closeModal() {
//     this.selectedEmail = null;
//     this.replyBody = '';
//     this.showReplyForm = false;
//   }
// }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailService } from '../../../shared/services/email.service';
import { ReceivedEmail } from '../../../shared/Interface/received-email';
import { SentService } from '../../../shared/services/sent.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
  @Output() refreshRequested = new EventEmitter<void>();
  @Output() totalItemsChanged = new EventEmitter<number>();
  @Output() loadingFinished = new EventEmitter<void>();

  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 25;

  allEmails: ReceivedEmail[] = [];
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

  // fetchReceiveEmails() {
  //   this.isLoading = true;
  //   this.emailService.getReceiverEmails().subscribe({
  //     next: (emails) => {
  //       this.allEmails = emails;
  //       this.totalItemsChanged.emit(emails.length);
  //       this.loadingFinished.emit();
  //       this.updateDisplayedEmails();
  //       this.isLoading = false;
  //     },
  //     error: () => {
  //       this.error = 'Failed to load received emails.';
  //       this.loadingFinished.emit();
  //       this.isLoading = false;
  //     }
  //   });
  // }

  fetchReceiveEmails() {
    this.isLoading = true;
    this.emailService.getReceiverEmails().subscribe({
      next: (emails) => {
        this.allEmails = emails.sort((a, b) => {
          const dateA = new Date(a.received_at || a.time);
          const dateB = new Date(b.received_at || b.time);
          return dateB.getTime() - dateA.getTime();
        });
  
        this.totalItemsChanged.emit(this.allEmails.length);
        this.loadingFinished.emit();
        this.updateDisplayedEmails();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load received emails.';
        this.loadingFinished.emit();
        this.isLoading = false;
      }
    });
  }  

  updateDisplayedEmails() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.emails = this.allEmails.slice(start, end);
  }

  ngOnChanges() {
    this.updateDisplayedEmails();
  }

  refresh() {
    this.refreshRequested.emit();
    this.fetchReceiveEmails();
  }

  openEmail(email: ReceivedEmail) {
    this.selectedEmail = email;
    this.showReplyForm = false;
  
    if (!email.isRead) {
      this.emailService.markReceivedEmailAsRead(email.email_id, true).subscribe(
        response => {
          email.isRead = true;
          this.selectedEmail = email;
          this.showReplyForm = false;
        }
      );
    }
  }   

  // toggleReadStatus(email: ReceivedEmail, event: Event) {
  //   event.stopPropagation();

  //   const newStatus = !email.isRead;
  //   this.emailService.markReceivedEmailAsRead(email.id, newStatus).subscribe({
  //     next: () => {
  //       email.isRead = newStatus;
  //       console.log(`Email marked as ${newStatus ? 'read' : 'unread'}`);
  //     },
  //     error: err => console.error('Failed to toggle read status', err)
  //   });
  // }

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
          this.sentService.addSentEmail({
            recipient: replyPayload.recipient,
            subject: replyPayload.subject,
            body: replyPayload.body,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });

          alert('Reply sent successfully!');
          this.closeModal();
        },
        error: () => {
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
