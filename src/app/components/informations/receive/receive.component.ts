import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailService } from '../../../shared/services/email.service';
import { SentService } from '../../../shared/services/sent.service';
import { ReceivedEmailWithReplies } from '../../../shared/Interface/received-email-with-replies';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
})
export class ReceiveComponent implements OnInit {
  @Output() refreshRequested = new EventEmitter<void>();
  @Output() totalItemsChanged = new EventEmitter<number>();
  @Output() loadingFinished = new EventEmitter<void>();

  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 25;

  // allEmails: ReceivedEmail[] = [];
  // emails: ReceivedEmail[] = [];
  allEmails: ReceivedEmailWithReplies[] = [];
  emails: ReceivedEmailWithReplies[] = [];

  isLoading: boolean = true;
  error: string | null = null;

  // selectedEmail: ReceivedEmail | null = null;
  selectedEmail: ReceivedEmailWithReplies | null = null;
  showReplyForm = false;
  replyBody: string = '';

  showSummary: boolean = false;
  summaryText: string = '';

  isReplyInvalid: boolean = false;

  constructor(
    private emailService: EmailService,
    private sentService: SentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchReceiveEmails();
  }

  fetchReceiveEmails(): void {
    this.isLoading = true;

    this.emailService.getReceiverEmails().subscribe((receivedEmails) => {
      this.emailService.getEmailsWithReplies().subscribe({
        next: (emailsWithReplies: ReceivedEmailWithReplies[]) => {
          this.allEmails = emailsWithReplies
            .sort(
              (a, b) =>
                new Date(b.received_at).getTime() -
                new Date(a.received_at).getTime()
            )
            .map((email) => ({
              ...email,
              body: email.body ? this.cleanHtml(email.body) : '',
              time: email.received_at
                ? new Date(email.received_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-',
              replies: (email.replies ?? [])
                .sort(
                  (a, b) =>
                    new Date(a.replied_at).getTime() -
                    new Date(b.replied_at).getTime()
                )
                .map((reply) => ({
                  ...reply,
                  time: reply.replied_at
                    ? new Date(reply.replied_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-',
                })),
            }));

          this.totalItemsChanged.emit(this.allEmails.length);
          this.loadingFinished.emit();
          this.updateDisplayedEmails();
          this.isLoading = false;
        },
      });
    });
  }

  cleanHtml(raw: string): string {
    // Remove leading/trailing whitespace and tabs
    const trimmed = raw.trim().replace(/\t+/g, '');

    // If full HTML document, extract only the body content
    const match = trimmed.match(/<body[^>]*>((.|[\n\r])*)<\/body>/i);
    if (match && match[1]) {
      return match[1]; // return only the body content
    }

    return trimmed; // fallback: use cleaned raw string
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

  openEmail(email: ReceivedEmailWithReplies) {
    this.selectedEmail = email;
    this.showReplyForm = false;

    console.log('📩 Email body content:', email.body);

    if (!email.isRead && email.email_id) {
      this.emailService
        .markReceivedEmailAsRead(email.email_id, true)
        .subscribe({
          next: () => {
            email.isRead = true;
          },
        });
    }
  }

  sendReply() {
    if (!this.replyBody.trim()) {
      this.isReplyInvalid = true;
      this.toastService.show('Reply cannot be empty!', 'error');
      return;
    }

    this.isReplyInvalid = false;

    if (this.selectedEmail) {
      const replyPayload = {
        recipient: this.extractEmailAddress(this.selectedEmail.from),
        subject: `Re: ${this.selectedEmail.subject}`,
        body: this.replyBody,
        thread_id: this.selectedEmail.thread_id,
        message_id: this.selectedEmail.message_id,
      };

      this.emailService.replyToEmail(replyPayload).subscribe({
        next: (response) => {
          const newReply = {
            id: response.message_id || Date.now(),
            sender: 'You',
            recipient: replyPayload.recipient,
            subject: replyPayload.subject,
            body: replyPayload.body,
            replied_at: new Date().toISOString(),
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            original_message_id: this.selectedEmail?.message_id || '',
          };

          if (!this.selectedEmail!.replies) {
            this.selectedEmail!.replies = [];
          }
          this.selectedEmail!.replies.push(newReply);

          this.selectedEmail!.replies.sort((a, b) => {
            return (
              new Date(a.replied_at).getTime() -
              new Date(b.replied_at).getTime()
            );
          });

          if (this.selectedEmail!.email_id) {
            this.emailService
              .markReceivedEmailAsRead(this.selectedEmail!.email_id, true)
              .subscribe({
                next: () => {
                  this.selectedEmail!.isRead = true;
                  const emailInList = this.emails.find(
                    (e) => e.email_id === this.selectedEmail!.email_id
                  );
                  if (emailInList) {
                    emailInList.isRead = true;
                  }
                },
              });
          }

          this.sentService.addSentEmail({
            recipient: replyPayload.recipient,
            subject: replyPayload.subject,
            body: replyPayload.body,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });

          this.fetchReceiveEmails();
          this.toastService.show('Reply sent successfully!', 'success');
          this.closeModal();
          this.replyBody = '';
        },
      });
    }
  }

  extractEmailAddress(fullFrom: string): string {
    const match = fullFrom.match(/<(.*?)>/);
    return match ? match[1] : fullFrom;
  }

  closeModal() {
    this.selectedEmail = null;
    this.resetReplyForm();
  }

  resetReplyForm(): void {
    this.replyBody = '';
    this.showReplyForm = false;
    this.showSummary = false;
    this.summaryText = '';
    this.isReplyInvalid = false;
  }

  toggleRead(email: ReceivedEmailWithReplies, event: MouseEvent): void {
    event.stopPropagation(); // Prevent modal open

    const newStatus = !email.isRead;
    email.isRead = newStatus; // update locally for instant feedback

    // Persist to backend
    if (email.email_id) {
      this.emailService
        .markReceivedEmailAsRead(email.email_id, newStatus)
        .subscribe({
          next: () => {
            console.log(
              `Email ${email.email_id} marked as ${
                newStatus ? 'read' : 'unread'
              }`
            );
          },
          error: () => {
            // Optionally revert on failure
            email.isRead = !newStatus;
            this.toastService.show('Failed to update read status.', 'error');
          },
        });
    }
  }

  summarizeEmail() {
    this.showSummary = true;
    this.showReplyForm = false;

    const content =
      this.selectedEmail?.body || this.selectedEmail?.snippet || '';
    const plainText = content.replace(/<[^>]+>/g, '');
    const words = plainText.split(' ');
    this.summaryText =
      words.length > 20 ? words.slice(0, 20).join(' ') + '...' : plainText;
  }

  toggleReplyForm() {
    this.showReplyForm = !this.showReplyForm;
  }

  toggleSummary() {
    if (!this.showSummary) {
      const content =
        this.selectedEmail?.body || this.selectedEmail?.snippet || '';
      const plainText = content.replace(/<[^>]+>/g, '');
      const words = plainText.split(' ');
      this.summaryText =
        words.length > 20 ? words.slice(0, 20).join(' ') + '...' : plainText;
    }
    this.showSummary = !this.showSummary;
  }

  onReplyInputChange() {
    if (this.replyBody.trim().length > 0) {
      this.isReplyInvalid = false;
    }
  }
}
