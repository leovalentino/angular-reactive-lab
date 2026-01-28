import { Component, signal } from '@angular/core';
import { ChildZonejsComponent } from '../child-zonejs/child-zonejs.component';
import { ChildSignalsComponent } from '../child-signals/child-signals.component';

@Component({
  selector: 'app-parent-cd',
  standalone: true,
  imports: [ChildZonejsComponent, ChildSignalsComponent],
  templateUrl: './parent-cd.component.html',
  styleUrl: './parent-cd.component.css'
})
export class ParentCdComponent {
  // For Zone.js child
  zoneInput = 0;

  // For Signals child
  signalInput = signal(0);

  // Counter for empty clicks
  clickCount = 0;

  // Method to handle empty click
  onEmptyClick(): void {
    this.clickCount++;
    this.zoneInput = this.clickCount;
    console.log('%c Parent: Empty click (Zone.js triggers CD)', 'color: #e74c3c; font-weight: bold');
  }

  // Method to increment signal
  incrementSignal(): void {
    this.signalInput.update(value => value + 1);
    console.log('%c Parent: Signal incremented', 'color: #27ae60; font-weight: bold');
  }
}
