import { Component, OnInit, ViewChild } from '@angular/core';
import { Email } from '../../../shared/Interface/email';
import { trigger, transition, style, animate } from '@angular/animations';
import { PrimaryComponent } from '../../informations/primary/primary.component';
import { ReceiveComponent } from '../../informations/receive/receive.component';

@Component({
  selector: 'app-starred',
  templateUrl: './starred.component.html',
  styleUrls: ['./starred.component.scss'],
  animations: [
    trigger('fadeSlideAnimation', [
      transition('inbox => email', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition('email => inbox', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class StarredComponent implements OnInit {
  @ViewChild(PrimaryComponent) primaryComponent!: PrimaryComponent;
  @ViewChild(ReceiveComponent) receiveComponent!: ReceiveComponent;

  activeTab = 'composed';
  selectedEmail: Email | null = null;
  currentPage = 1;
  itemsPerPage = 25;
  totalItems = 0;
  paginationLoading = false;
  
  selectedEmails: Email[] = [];

  constructor() {}

  ngOnInit(): void {}

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.paginationLoading = true;
      this.currentPage++;
      setTimeout(() => this.refresh(), 300);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.paginationLoading = true;
      this.currentPage--;
      setTimeout(() => this.refresh(), 300);
    }
  }

  switchTab(tab: string) {
    if (this.activeTab !== tab) {
      this.paginationLoading = true;
      this.activeTab = tab;
      setTimeout(() => this.refresh(), 100);
    }
  }

  refresh() {
    if (this.activeTab === 'composed') {
      this.primaryComponent?.refresh();
    } else if (this.activeTab === 'receives') {
      this.receiveComponent?.refresh();
    }
    this.paginationLoading = false;
  }

  openEmail(email: Email) {
    this.selectedEmail = email;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeEmail() {
    this.selectedEmail = null;
  }

  archiveSelectedEmails() {
    console.log('Archive selected:', this.selectedEmails);
  }

  deleteSelectedEmails() {
    console.log('Delete selected:', this.selectedEmails);
  }

  markSelectedAsRead() {
    console.log('Mark selected as read:', this.selectedEmails);
  }
}
