import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @ViewChild('compose') composeComponent!: any;
  @Input() isCollapsed: boolean= false;
  @Output() composeSent = new EventEmitter<void>();

  constructor() {}

  // toggleSidebar() {
  //   this.isCollapsed = !this.isCollapsed;
  // }

  openComposeModal() {
    this.composeComponent.openModal();
  }

  handleComposeSent() {
    this.composeSent.emit(); // 🔁 Forward to InboxComponent
  }
}
