import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LifecycleVisualizerComponent } from './components/lifecycle-visualizer/lifecycle-visualizer.component';
import { ChangeDetectionLabComponent } from './components/change-detection-lab/change-detection-lab.component';
import { ObservableLabComponent } from './components/observable-lab/observable-lab.component';
import { ComparisonLabComponent } from './components/comparison-lab/comparison-lab.component';
import { AdvancedPromiseLabComponent } from './components/advanced-promise-lab/advanced-promise-lab.component';
import { MappingOperatorsLabComponent } from './components/mapping-operators-lab/mapping-operators-lab.component';
import { SubjectLabComponent } from './components/subject-lab/subject-lab.component';
import {PerformanceLabComponent} from './components/performance-lab/performance-lab.component';
import { SignalsDeepDiveComponent } from './components/signals-deep-dive/signals-deep-dive.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ProductListComponent,
    LifecycleVisualizerComponent,
    ChangeDetectionLabComponent,
    ObservableLabComponent,
    ComparisonLabComponent,
    AdvancedPromiseLabComponent,
    MappingOperatorsLabComponent,
    SubjectLabComponent,
    PerformanceLabComponent,
    SignalsDeepDiveComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'product-management';
  triggerSignal = signal(0);
  
  // Active tab management
  activeTab = signal<string>('signals');
  
  // List of available labs
  labs = [
    { id: 'signals', name: 'Signals Deep Dive', component: SignalsDeepDiveComponent },
    { id: 'performance', name: 'Performance Lab', component: PerformanceLabComponent },
    { id: 'subject', name: 'Subject Lab', component: SubjectLabComponent },
    { id: 'mapping', name: 'Mapping Operators', component: MappingOperatorsLabComponent },
    { id: 'promise', name: 'Advanced Promise', component: AdvancedPromiseLabComponent },
    { id: 'comparison', name: 'Promise vs Observable', component: ComparisonLabComponent },
    { id: 'change-detection', name: 'Change Detection', component: ChangeDetectionLabComponent },
    { id: 'observable', name: 'Observable Lab', component: ObservableLabComponent },
    { id: 'product', name: 'Product List', component: ProductListComponent },
    { id: 'lifecycle', name: 'Lifecycle Visualizer', component: LifecycleVisualizerComponent }
  ];

  // Function to set active tab
  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}
