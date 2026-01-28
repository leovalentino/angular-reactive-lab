import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-child-zonejs',
  standalone: true,
  templateUrl: './child-zonejs.component.html',
  styleUrl: './child-zonejs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildZonejsComponent implements OnChanges {
  @Input() zoneValue = 0;

  private renderCount = 0;

  checkRender(): string {
    this.renderCount++;
    console.log(`%c ChildZonejs checked (render #${this.renderCount})`, 'color: #e74c3c');
    return `Zone.js child rendered ${this.renderCount} times`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zoneValue']) {
      console.log('%c ChildZonejs: Input changed', 'color: #9b59b6; font-weight: bold');
    }
  }
}
