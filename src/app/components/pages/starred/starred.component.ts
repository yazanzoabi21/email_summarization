import { Component } from '@angular/core';
import { Email, EmailService } from '../../../shared/emailService';

@Component({
  selector: 'app-starred',
  templateUrl: './starred.component.html',
  styleUrl: './starred.component.scss'
})
export class StarredComponent {
  starredEmails: Email[] = [];

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.emailService.getStarredEmails().subscribe((emails) => {
      this.starredEmails = emails;
    });
  }

  toggleStar(email: Email, event: Event) {
    event.stopPropagation();
    this.emailService.toggleStar(email);
  }

  toggleEmailSelection(event: Event) {
    event.stopPropagation();
  }
}
