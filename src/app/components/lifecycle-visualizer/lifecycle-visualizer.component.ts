import {
  Component,
  Input,
  OnInit,
  OnChanges,
  DoCheck,
  AfterViewInit,
  OnDestroy,
  signal,
  SimpleChanges,
  inject,
  afterEveryRender,
  afterNextRender
} from '@angular/core';

@Component({
  selector: 'app-lifecycle-visualizer',
  standalone: true,
  imports: [],
  templateUrl: './lifecycle-visualizer.component.html',
  styleUrl: './lifecycle-visualizer.component.css'
})
export class LifecycleVisualizerComponent implements
  OnInit, OnChanges, DoCheck, AfterViewInit, OnDestroy {

  // Input signal to trigger ngOnChanges
  @Input({ required: true }) triggerSignal = signal(0);

  // Counter signal
  counter = signal(0);

  // Timer reference
  private timerId: any = null;

  constructor() {
    console.log('%c constructor: Component class instantiated', 'color: #4CAF50; font-weight: bold');

    // afterRender hook - runs after every change detection cycle
    afterEveryRender(() => {
      console.log('%c afterRender: Runs after every render', 'color: #00BCD4; font-weight: bold');
    });

    // afterNextRender hook - runs only once after the next render
    afterNextRender(() => {
      console.log('%c afterNextRender: Runs once after the next render', 'color: #E91E63; font-weight: bold');
    });
  }

  ngOnInit(): void {
    console.log('%c ngOnInit: Component initialized', 'color: #2196F3; font-weight: bold');

    // Start a timer to demonstrate ngOnDestroy
    this.timerId = setInterval(() => {
      console.log('%c Timer tick', 'color: #FF9800');
    }, 3000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('%c ngOnChanges: Input changes detected', 'color: #9C27B0; font-weight: bold');
    console.log('Changes:', changes);
  }

  ngDoCheck(): void {
    console.log('%c ngDoCheck: Change detection cycle', 'color: #FF5722; font-weight: bold');
  }

  ngAfterViewInit(): void {
    console.log('%c ngAfterViewInit: Template view initialized', 'color: #009688; font-weight: bold');
  }

  ngOnDestroy(): void {
    console.log('%c ngOnDestroy: Component being destroyed', 'color: #F44336; font-weight: bold');

    // Clear the timer to prevent memory leaks
    if (this.timerId) {
      clearInterval(this.timerId);
      console.log('%c Timer cleared', 'color: #F44336');
    }
  }

  // Method to increment counter
  incrementCounter(): void {
    this.counter.update(value => value + 1);
    console.log('%c Counter incremented', 'color: #3F51B5');
  }

  // Method to update trigger signal
  updateTrigger(): void {
    this.triggerSignal.update(value => value + 1);
  }
}
