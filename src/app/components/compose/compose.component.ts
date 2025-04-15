import { Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})
export class ComposeComponent {
  openModal() {
    const modalElement = document.getElementById('composeModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}
