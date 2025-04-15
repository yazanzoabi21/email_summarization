import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SidebarService } from '../../shared/sidebarService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('compose') composeComponent!: any;

  isCollapsed = false;
  private sub!: Subscription;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sub = this.sidebarService.isOpen$.subscribe((isOpen) => {
      this.isCollapsed = !isOpen;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openComposeModal() {
    this.composeComponent.openModal();
  }
}
