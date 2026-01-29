import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heavy-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3>Heavy Chart Component</h3>
      <p>This component simulates a heavy chart library with intensive computations.</p>
      <div class="chart-visualization">
        <div *ngFor="let bar of bars" class="chart-bar" [style.height.px]="bar.height" [style.background]="bar.color">
          <span class="bar-label">{{ bar.value }}</span>
        </div>
      </div>
      <p>Chart loaded at: {{ loadTime }}</p>
    </div>
  `,
  styles: [`
    .chart-container {
      border: 2px solid #3498db;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      background-color: #f8f9fa;
    }
    .chart-visualization {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 4px;
      height: 300px;
      margin: 20px 0;
      padding: 20px;
      background-color: white;
      border-radius: 4px;
    }
    .chart-bar {
      width: 30px;
      border-radius: 4px 4px 0 0;
      transition: height 0.3s;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 8px;
    }
    .bar-label {
      color: white;
      font-weight: bold;
      font-size: 12px;
    }
  `]
})
export class HeavyChartComponent implements OnInit {
  bars: Array<{ height: number; color: string; value: number }> = [];
  loadTime = new Date().toLocaleTimeString();

  ngOnInit() {
    // Simulate heavy computation
    const start = performance.now();
    const dataSize = 10000;
    const tempArray = [];
    
    for (let i = 0; i < dataSize; i++) {
      // Perform some heavy calculations
      const value = Math.sin(i * 0.01) * Math.cos(i * 0.005) * 100;
      tempArray.push(value);
    }
    
    // Process data for visualization
    const sampleSize = 15;
    const step = Math.floor(dataSize / sampleSize);
    
    for (let i = 0; i < sampleSize; i++) {
      const index = i * step;
      const value = Math.abs(tempArray[index]);
      const height = 50 + (value % 200);
      const hue = (i * 30) % 360;
      this.bars.push({
        height,
        color: `hsl(${hue}, 70%, 60%)`,
        value: Math.round(value)
      });
    }
    
    const end = performance.now();
    console.log(`HeavyChartComponent computation took ${(end - start).toFixed(2)} ms`);
  }
}
