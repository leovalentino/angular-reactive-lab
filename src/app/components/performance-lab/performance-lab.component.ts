import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import {HeavyTableComponent} from './heavy-table.component';
import {HeavyChartComponent} from './heavy-chart.component';

@Component({
  selector: 'app-performance-lab',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NgOptimizedImage, HeavyTableComponent, HeavyChartComponent],
  templateUrl: './performance-lab.component.html',
  styleUrl: './performance-lab.component.css'
})
export class PerformanceLabComponent {
  currentTime = new Date().toLocaleTimeString();
}
