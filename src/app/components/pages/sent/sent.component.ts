import { Component } from '@angular/core';
import { SentService } from '../../../shared/services/sent.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrl: './sent.component.scss'
})
export class SentComponent {
  sentEmails: any[] = [];

  constructor(private sentService: SentService) {}

  ngOnInit(): void {
    this.sentService.sentEmails$.subscribe(emails => {
      this.sentEmails = emails;
    });
  }
}
