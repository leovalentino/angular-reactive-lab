import { Component } from '@angular/core';
import { ParentCdComponent } from '../parent-cd/parent-cd.component';

@Component({
  selector: 'app-change-detection-lab',
  standalone: true,
  imports: [ParentCdComponent],
  templateUrl: './change-detection-lab.component.html',
  styleUrl: './change-detection-lab.component.css'
})
export class ChangeDetectionLabComponent {
  title = 'Change Detection Lab';
}
