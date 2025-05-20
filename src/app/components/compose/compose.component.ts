import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ToastService } from './../../shared/services/toast.service';
import { EmailService } from '../../shared/services/email.service';
import { EmailEventsService } from './../../shared/services/email-events.service';
import { Email } from '../../shared/Interface/email';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent {
  @ViewChild('composeModal') composeModalElement!: ElementRef;
  @ViewChild('composeForm') composeForm: any;
  @Output() emailSent = new EventEmitter<void>();

  recipient: string = '';
  cc: string = '';
  bcc: string = '';
  subject: string = '';
  body: string = '';
  isSending: boolean = false;

  showCc = false;
  showBcc = false;

  private modalInstance: any;

  validateEmailTouched: boolean = false;
  validateCcTouched: boolean = false;
  validateBccTouched: boolean = false;
  forceToValidation: boolean = false;

  constructor(
    private toastService: ToastService,
    private emailService: EmailService,
    private emailEventsService: EmailEventsService,
    private router: Router
  ) {}

  openModal() {
    setTimeout(() => {
      const modalElement = this.composeModalElement?.nativeElement;
      if (modalElement) {
        this.modalInstance = new bootstrap.Modal(modalElement);
        this.modalInstance.show();

        modalElement.addEventListener('hidden.bs.modal', () => this.resetForm(), { once: true });
      }
    });
  }

  onSubmit(form: any): void {
  this.forceToValidation = true;
  Object.values(form.controls).forEach((control: any) => control.markAsTouched());

  const isToValid = this.recipient && this.isValidEmail(this.recipient);
  const isCcValid = !this.showCc || (this.cc && this.isValidEmail(this.cc));
  const isBccValid = !this.showBcc || (this.bcc && this.isValidEmail(this.bcc));
  const isSubjectValid = this.subject && this.subject.trim() !== '';
  const isBodyValid = this.body && this.body.trim() !== '';

  if (!isToValid || !isCcValid || !isBccValid || !isSubjectValid || !isBodyValid) {
    this.toastService.show('Please complete all required fields correctly.', 'error');
    return;
  }

  this.isSending = true;

  const pendingEmail: Email = {
    id: Date.now(),
    sender: 'You',
    sender_email: 'zohbiyazan@gmail.com',
    recipient: this.recipient,
    recipient_email: this.recipient,
    subject: this.subject,
    preview: this.body.slice(0, 100),
    cc: this.cc,
    bcc: this.bcc,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'pending',
    isRead: false,
    isStarred: false,
    body: this.body,
  };

  this.emailEventsService.emitPendingEmail(pendingEmail);

  // ✅ Close the modal & emit event immediately (before sending)
  this.modalInstance?.hide();
  this.emailSent.emit();

  // ✅ Continue sending in the background
  this.emailService.sendEmail(pendingEmail).subscribe({
    next: () => {
      this.toastService.show('Email sent successfully!', 'success');
      this.emailEventsService.emitEmailSent();
    },
    error: (error) => {
      this.toastService.show('Failed to send email. Please try again.', 'error');
      console.error(error);
    },
    complete: () => {
      this.isSending = false;
      form.resetForm();
      this.resetForm();
    }
  });
}

  resetForm() {
    this.recipient = '';
    this.cc = '';
    this.bcc = '';
    this.subject = '';
    this.body = '';
    this.showCc = false;
    this.showBcc = false;
    this.validateEmailTouched = false;
    this.validateCcTouched = false;
    this.validateBccTouched = false;
    this.forceToValidation = false;

    if (this.composeForm) {
      this.composeForm.resetForm();
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
  }
}