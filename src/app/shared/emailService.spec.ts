import { TestBed } from '@angular/core/testing';
import { EmailService } from './emailService';

describe('EmailServiceService', () => {
  let service: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
