import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LifecycleVisualizerComponent } from './components/lifecycle-visualizer/lifecycle-visualizer.component';
import { ChangeDetectionLabComponent } from './components/change-detection-lab/change-detection-lab.component';
import { ObservableLabComponent } from './components/observable-lab/observable-lab.component';
import { ComparisonLabComponent } from './components/comparison-lab/comparison-lab.component';
import { AdvancedPromiseLabComponent } from './components/advanced-promise-lab/advanced-promise-lab.component';
import { MappingOperatorsLabComponent } from './components/mapping-operators-lab/mapping-operators-lab.component';
import { SubjectLabComponent } from './components/subject-lab/subject-lab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ProductListComponent, 
    LifecycleVisualizerComponent, 
    ChangeDetectionLabComponent,
    ObservableLabComponent,
    ComparisonLabComponent,
    AdvancedPromiseLabComponent,
    MappingOperatorsLabComponent,
    SubjectLabComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'product-management';
  triggerSignal = signal(0);
}
