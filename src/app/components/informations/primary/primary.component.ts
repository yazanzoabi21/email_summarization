import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailService } from '../../../shared/services/email.service';
import { Email } from '../../../shared/Interface/email';
import { EmailEventsService } from '../../../shared/services/email-events.service';
import { ReceivedEmailWithReplies } from '../../../shared/Interface/received-email-with-replies';

@Component({
  selector: 'app-primary',
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.scss'],
})
export class PrimaryComponent implements OnInit {
  @Output() emailClicked = new EventEmitter<Email>();
  @Output() refreshRequested = new EventEmitter<void>();
  @Output() totalItemsChanged = new EventEmitter<number>();
  @Output() loadingFinished = new EventEmitter<void>();

  @Input() emails: Email[] = [];
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 25;

  allEmails: Email[] = [];
  selectedEmails: Email[] = [];
  selectedEmail: Email | null = null;

  isLoading: boolean = true;

  constructor(
    private emailService: EmailService,
    private emailEventsService: EmailEventsService
  ) {}

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
        // Fetch reply threads and map count
        this.emailService.getEmailsWithReplies().subscribe({
          next: (threads: ReceivedEmailWithReplies[]) => {
            const replyCountMap: Record<string, number> = {};

            for (const thread of threads) {
              if (thread.thread_id) {
                replyCountMap[thread.thread_id] = thread.replies?.length || 0;
              }
            }

            // Assign counts and convert 'sent_at' to ISO date if available
            this.allEmails = emails.map((email) => ({
              ...email,
              replyCount: email.thread_id ? replyCountMap[email.thread_id] || 0 : 0,
              subject: email.subject || '',
              preview: email.preview || '',
              sender: email.sender || '',
              sender_email: email.sender_email || '',
              recipient: email.recipient || '',
              recipient_email: email.recipient_email || '',
              status: email.status || 'unsent',
              time: email.time || '',
              date: email.date || '-',
              // sent_at: email.sent_at ?? undefined,
            }));

            this.totalItemsChanged.emit(this.allEmails.length);
            this.loadingFinished.emit();
            this.updateDisplayedEmails();
            this.isLoading = false;
          },
        });
      },
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
    this.fetchEmails();
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
    console.log('Archive email:', email);
  }

  deleteEmail(email: Email) {
    console.log('Delete email:', email);
  }

  // markEmailAsRead(email: Email) {
  //   email.isRead = true;
  // }

  // onEmailClick(email: Email) {
  //   if (!email.isRead) {
  //     this.emailService.markEmailAsRead(email.id, true).subscribe({
  //       next: () => {
  //         email.isRead = true;
  //         this.selectedEmail = email;
  //         this.emailClicked.emit(email);
  //       }
  //     });
  //   } else {
  //     this.selectedEmail = email;
  //     this.emailClicked.emit(email);
  //   }
  // }

  onEmailClick(email: Email) {
    this.selectedEmail = email;
    this.emailClicked.emit(email);
  }

  // toggleReadStatus(email: Email, event: Event) {
  //   event.stopPropagation();

  //   const newStatus = !email.isRead;
  //   this.emailService.markEmailAsRead(email.id, newStatus).subscribe({
  //     next: () => {
  //       email.isRead = newStatus;
  //       console.log(`Email marked as ${newStatus ? 'read' : 'unread'}`);
  //     },
  //     error: err => console.error('Failed to toggle read status', err)
  //   });
  // }

  toggleStar(email: Email, event: Event) {
    event.stopPropagation();
    const newStatus = !email.isStarred;

    this.emailService.starred(email.id, newStatus).subscribe({
      next: () => {
        email.isStarred = newStatus;
        console.log(`Email ${newStatus ? 'starred' : 'unstarred'}`);
      },
      error: (err) => console.error('Failed to toggle star status', err),
    });
  }

  goBackToTable() {
    this.selectedEmail = null;
  }

  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.clientX - button.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      event.clientY - button.getBoundingClientRect().top - radius
    }px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  }

  extractNameAndEmail(full: string): string {
    const match = full.match(/^(.*?)\s*<(.+?)>$/);
    if (match) {
      return `${match[1]} (${match[2]})`;
    }
    return full; // fallback if no name is provided
  }
}
