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
  isSending: boolean = false;

  showManualReplyForm: boolean = false;
  showAutoReplyForm: boolean = false;

  showEmailDetails: boolean = false;
  modalVisible: boolean = false;

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

    // Step 1: Get base receiver emails (can be used later if needed)
    this.emailService.getReceiverEmails().subscribe({
      next: () => {
        // Step 2: Get grouped emails with replies
        this.emailService.getEmailsWithReplies().subscribe({
          next: (threadedEmails: {
            [threadId: string]: ReceivedEmailWithReplies[];
          }) => {
            this.allEmails = Object.values(threadedEmails)
              .flat()
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
                summaryText: email.summary || '',
                replies: this.buildReplyTree(
                  this.deduplicateReplies(email.replies ?? []).map((reply) => ({
                    ...reply,
                    time: reply.replied_at
                      ? new Date(reply.replied_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-',
                  }))
                ),
              }));

            this.totalItemsChanged.emit(this.allEmails.length);
            this.loadingFinished.emit();
            this.updateDisplayedEmails();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('❌ Failed to load replies:', err);
            this.toastService.show('Failed to load email replies.', 'error');
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('❌ Failed to load received emails:', err);
        this.toastService.show('Failed to load received emails.', 'error');
        this.isLoading = false;
      },
    });
  }

  deduplicateReplies(replies: any[]): any[] {
    const seen = new Set<string>();
    return replies.filter((reply) => {
      const key = `${reply.body}-${reply.replied_at}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  buildReplyTree(replies: any[]): any[] {
    const replyMap = new Map<string, any>();
    const rootReplies: any[] = [];

    replies.forEach((reply) => {
      reply.children = [];
      replyMap.set(reply.id || reply.replied_at, reply);
    });

    replies.forEach((reply) => {
      const parentId = reply.parent_message_id;
      const parent = replyMap.get(parentId);
      if (parent) {
        parent.children.push(reply);
      } else {
        rootReplies.push(reply); // top-level reply
      }
    });

    return rootReplies;
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
    this.selectedEmail = {
      ...email,
      replies: this.buildReplyTree(
        this.deduplicateReplies(email.replies ?? [])
      ),
    };
    this.showReplyForm = false;
    this.showEmailDetails = true;
    this.modalVisible = false;

    if (!email.isRead && email.email_id) {
      this.emailService
        .markReceivedEmailAsRead(email.email_id, true)
        .subscribe({
          next: () => {
            email.isRead = true;
          },
        });
    }

    this.showEmailDetails = true;
  }

  sendReply() {
    if (!this.replyBody.trim()) {
      this.isReplyInvalid = true;
      this.toastService.show('Reply cannot be empty!', 'error');
      return;
    }

    this.isReplyInvalid = false;
    this.isSending = true;

    if (!this.selectedEmail) return;

    const replyPayload = {
      recipient: this.extractEmailAddress(this.selectedEmail.from),
      subject: `Re: ${this.selectedEmail.subject}`,
      body: this.replyBody,
      thread_id: this.selectedEmail.thread_id,
      message_id: this.selectedEmail.message_id,
      parent_message_id: this.selectedEmail.message_id,
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

        this.selectedEmail!.replies = this.selectedEmail!.replies || [];
        this.selectedEmail!.replies.push(newReply);
        this.selectedEmail!.replies.sort(
          (a, b) =>
            new Date(a.replied_at).getTime() - new Date(b.replied_at).getTime()
        );

        if (this.selectedEmail!.email_id) {
          this.emailService
            .markReceivedEmailAsRead(this.selectedEmail!.email_id, true)
            .subscribe({
              next: () => {
                this.selectedEmail!.isRead = true;
                const emailInList = this.emails.find(
                  (e) => e.email_id === this.selectedEmail!.email_id
                );
                if (emailInList) emailInList.isRead = true;
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

        // ✅ Close the modal only after success
        this.closeModal();

        // ✅ Then show toast
        this.toastService.show('Reply sent successfully!', 'success');
      },
      error: () => {
        this.toastService.show('Failed to send reply.', 'error');
      },
      complete: () => {
        this.isSending = false;
        this.replyBody = '';
      },
    });
  }

  triggerAutoReply(): void {
    this.showAutoReplyForm = !this.showAutoReplyForm;
    this.showManualReplyForm = false;

    if (this.showAutoReplyForm) {
      const content =
        this.selectedEmail?.body || this.selectedEmail?.snippet || '';
      const plainText = content.replace(/<[^>]+>/g, '');
      const words = plainText.split(' ');

      this.replyBody =
        words.length > 10
          ? `Thanks for your message about "${words
              .slice(0, 10)
              .join(' ')}..." — I'll get back to you soon.`
          : `Thanks for your message — I'll get back to you shortly.`;
    } else {
      this.replyBody = '';
    }

    this.isReplyInvalid = false;
  }

  extractEmailAddress(fullFrom: string): string {
    const match = fullFrom.match(/<(.*?)>/);
    return match ? match[1] : fullFrom;
  }

  closeModal() {
    this.selectedEmail = null;
    this.resetReplyForm();
    this.showManualReplyForm = false;
    this.showAutoReplyForm = false;
  }

  resetReplyForm(): void {
    this.replyBody = '';
    this.showReplyForm = false;
    this.showManualReplyForm = false;
    this.showAutoReplyForm = false;
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

  summarizeEmail(): void {
    this.showReplyForm = false;

    // If summary is visible, resummarize
    if (this.showSummary) {
      this.generateSummary(); // re-generate summary if already open
    } else {
      this.showSummary = true;
      this.generateSummary(); // generate initially
    }
  }

  generateSummary(): void {
    const content =
      this.selectedEmail?.body || this.selectedEmail?.snippet || '';
    const plainText = content.replace(/<[^>]+>/g, '');
    this.summaryText = 'Summarizing...';

    this.emailService
      .summarizeEmail(plainText, this.selectedEmail!.email_id)
      .subscribe({
        next: (res) => {
          this.summaryText = res.summary;

          // ✅ Update UI state
          if (this.selectedEmail) {
            this.selectedEmail.summary = res.summary;
            this.selectedEmail.summaryText = res.summary; // <-- ✅ Add this line

            const emailInList = this.emails.find(
              (e) => e.email_id === this.selectedEmail?.email_id
            );
            if (emailInList) {
              emailInList.summary = res.summary;
              emailInList.summaryText = res.summary; // <-- ✅ Add this too for full UI consistency
            }
          }
        },
        error: (err) => {
          this.toastService.show('Failed to summarize email.', 'error');
          this.summaryText = 'Summary could not be generated.';
        },
      });
  }

  closeSummary(): void {
    this.showSummary = false;
    this.summaryText = '';
  }

  getSenderName(from: string): string {
    const match = from.match(/^(.*?)</);
    return match ? match[1].trim() : from;
  }

  getOnlyEmail(from: string): string {
    const match = from.match(/<(.*?)>/);
    return match ? `<${match[1].trim()}>` : from;
  }

  toggleReplyForm(): void {
    this.showManualReplyForm = !this.showManualReplyForm;
    this.showAutoReplyForm = false;

    if (this.showManualReplyForm) {
      this.replyBody = '';
    } else {
      this.replyBody = '';
    }

    this.isReplyInvalid = false;
  }

  onReplyInputChange() {
    if (this.replyBody.trim().length > 0) {
      this.isReplyInvalid = false;
    }
  }

  toggleDetail(email: ReceivedEmailWithReplies) {
    this.selectedEmail = email;
    this.showEmailDetails = true;
  }

  goBackToTable() {
    this.showEmailDetails = false;
    this.selectedEmail = null;
    this.modalVisible = false;
  }

  openCustomModal(event: MouseEvent, email: ReceivedEmailWithReplies) {
    event.stopPropagation();
    this.selectedEmail = {
      ...email,
      replies: this.buildReplyTree(
        this.deduplicateReplies(email.replies ?? [])
      ),
    };

    this.modalVisible = true;

    // ✅ Check if email already has summary
    if (email.summary) {
      this.showSummary = true;
      this.summaryText = email.summary;
    } else {
      this.showSummary = false;
      this.summaryText = '';
    }

    // Reset reply states
    this.showReplyForm = false;
    this.showManualReplyForm = false;
    this.showAutoReplyForm = false;
  }

  closeCustomModal() {
    this.modalVisible = false;
  }
}
