import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="details-container">
      <h3>Lazy Loaded Details Component</h3>
      <p>This component was loaded via Angular's lazy loading routing.</p>
      <p>Check the Network tab in DevTools to see the separate chunk being loaded when you clicked the link.</p>
      <ul>
        <li>Reduced initial bundle size</li>
        <li>Faster initial page load</li>
        <li>Better user experience</li>
      </ul>
    </div>
  `,
  styles: [`
    .details-container {
      border: 2px dashed #3498db;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      background-color: #e8f4fc;
    }
  `]
})
export class PerformanceDetailsComponent {}
