import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from '../../shared/sidebarService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
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
}
