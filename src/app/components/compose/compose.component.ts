import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastService } from './../../shared/services/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent {
  @ViewChild('composeModal') composeModalElement!: ElementRef;
  @ViewChild('composeForm') composeForm: any;

  to: string = '';
  cc: string = '';
  bcc: string = '';
  subject: string = '';
  body: string = '';

  showCc = false;
  showBcc = false;

  private modalInstance: any;

  validateEmailTouched: boolean = false;
  validateCcTouched: boolean = false;
  validateBccTouched: boolean = false;
  forceToValidation: boolean = false;

  constructor(private toastService: ToastService) {}

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
  
    Object.values(form.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  
    const isToValid = this.to && this.isValidEmail(this.to);
    const isCcValid = !this.showCc || (this.cc && this.isValidEmail(this.cc));
    const isBccValid = !this.showBcc ? true : (this.bcc && this.isValidEmail(this.bcc)); // 🔥 NEW
    const isSubjectValid = this.subject && this.subject.trim() !== '';
    const isBodyValid = this.body && this.body.trim() !== '';
  
    if (!isToValid || !isCcValid  || !isBccValid || !isSubjectValid || !isBodyValid) {
      this.toastService.show('Please complete all required fields correctly.', 'error');
      return;
    }
  
    console.log('Sending email...');
    console.log('To:', this.to);
    console.log('Cc:', this.cc);
    console.log('Bcc:', this.bcc);
    console.log('Subject:', this.subject);
    console.log('Body:', this.body);
  
    this.toastService.show('Email sent successfully!', 'success');
  
    setTimeout(() => {
      this.modalInstance?.hide();
    }, 500);
  
    form.resetForm();
    this.showCc = false;
    this.showBcc = false;
    this.validateEmailTouched = false;
    this.validateCcTouched = false;
    this.validateBccTouched = false;
    this.forceToValidation = false;
  }  

  resetForm() {
    this.to = '';
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