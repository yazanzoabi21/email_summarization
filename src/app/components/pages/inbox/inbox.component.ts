// inbox.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {
  activeTab = 'primary';

  markAllAsRead() {
    console.log('Mark all as read clicked');
  }
  
  selectAll() {
    console.log('Select all clicked');
  }
  
  selectNone() {
    console.log('Select none clicked');
  }
  
  selectRead() {
    console.log('Select read clicked');
  }
  
  selectUnread() {
    console.log('Select unread clicked');
  }
  
  refresh() {
    console.log('Refresh clicked');
  }
}