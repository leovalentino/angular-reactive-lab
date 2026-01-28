import {ChangeDetectionStrategy, Component, input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-child-signals',
  standalone: true,
  templateUrl: './child-signals.component.html',
  styleUrl: './child-signals.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildSignalsComponent implements OnChanges {
  signalValue = input.required<number>();

  private renderCount = 0;

  checkRender(): string {
    this.renderCount++;
    console.log(`%c ChildSignals checked (render #${this.renderCount})`, 'color: #27ae60');
    return `Signals child rendered ${this.renderCount} times`;
  }

  // Note: ngOnChanges won't fire for signal inputs in Angular 18+
  // We keep it for demonstration purposes
  ngOnChanges(changes: SimpleChanges): void {
    console.log('%c ChildSignals: ngOnChanges (not called for signal inputs)', 'color: #9b59b6; font-style: italic');
  }
}
