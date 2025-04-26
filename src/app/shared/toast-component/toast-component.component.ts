import { Component } from '@angular/core';
import { ToasterPosition } from 'ng-angular-popup';

@Component({
  selector: 'app-toast-component',
  templateUrl: './toast-component.component.html',
  styleUrl: './toast-component.component.scss'
})
export class ToastComponentComponent {
  ToasterPosition = ToasterPosition; 
}
