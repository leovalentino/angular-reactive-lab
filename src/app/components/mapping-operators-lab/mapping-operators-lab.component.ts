import { Component, signal, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Observable,
  Subject,
  interval,
  of,
  map,
  switchAll,
  concatAll,
  mergeAll,
  exhaustAll,
  combineLatestAll,
  withLatestFrom,
  startWith,
  take,
  tap,
  delay,
  BehaviorSubject
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-mapping-operators-lab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapping-operators-lab.component.html',
  styleUrl: './mapping-operators-lab.component.css'
})
export class MappingOperatorsLabComponent {
  private destroyRef = inject(DestroyRef);

  // Higher-Order All Operators
  allOperatorsLogs = signal<string[]>([]);
  allOperatorsValues = signal<string[]>([]);
  private outerSubject = new Subject<Observable<string>>();

  // Join & Start Operators
  joinStartLogs = signal<string[]>([]);
  joinStartValues = signal<string[]>([]);
  private primarySubject = new Subject<void>();
  protected secondarySignal = signal(0);

  // Comparison: switchMap vs map + switchAll
  comparisonLogs = signal<string[]>([]);
  comparisonValues = signal<string[]>([]);

  // combineLatestAll demonstration
  combineAllLogs = signal<string[]>([]);
  combineAllValues = signal<string[]>([]);
  private combineAllOuter = new Subject<Observable<number>>();

  constructor() {
    this.setupAllOperators();
    this.setupJoinStartOperators();
    this.setupCombineLatestAll();
  }

  // Setup Higher-Order All Operators
  private setupAllOperators(): void {
    // Each operator will be demonstrated separately when buttons are clicked
  }

  // Setup Join & Start Operators
  private setupJoinStartOperators(): void {
    // Secondary stream: background interval
    interval(1500).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(value => {
        this.secondarySignal.set(value);
        this.addJoinStartLog(`Secondary stream emitted: ${value}`);
      })
    ).subscribe();
  }

  // Setup combineLatestAll
  private setupCombineLatestAll(): void {
    this.combineAllOuter.pipe(
      combineLatestAll(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: values => {
        this.addCombineAllLog(`combineLatestAll emitted: [${values.join(', ')}]`);
        this.combineAllValues.update(v => [...v, `[${values.join(', ')}]`]);
      },
      complete: () => {
        this.addCombineAllLog('combineLatestAll completed');
      }
    });
  }

  // Higher-Order All Operators Methods
  demonstrateSwitchAll(): void {
    this.clearAllOperators();
    this.addAllOperatorsLog('Starting switchAll demonstration...');
    this.addAllOperatorsLog('Creating outer stream that emits inner observables');

    const outer$ = new Subject<Observable<string>>();

    outer$.pipe(
      switchAll(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: value => {
        this.addAllOperatorsLog(`Inner stream response: ${value}`);
        this.allOperatorsValues.update(v => [...v, value]);
      },
      complete: () => {
        this.addAllOperatorsLog('switchAll completed');
      }
    });

    // Emit three inner observables with delays
    this.addAllOperatorsLog('Outer stream emitting inner observable #1 (delayed 1s)');
    outer$.next(
      of('Inner 1 - Result A').pipe(delay(1000))
    );

    setTimeout(() => {
      this.addAllOperatorsLog('Outer stream emitting inner observable #2 (delayed 2s)');
      outer$.next(
        of('Inner 2 - Result B').pipe(delay(2000))
      );
    }, 500);

    setTimeout(() => {
      this.addAllOperatorsLog('Outer stream emitting inner observable #3 (delayed 1s)');
      outer$.next(
        of('Inner 3 - Result C').pipe(delay(1000))
      );
      setTimeout(() => {
        outer$.complete();
      }, 1500);
    }, 1000);
  }

  demonstrateConcatAll(): void {
    this.clearAllOperators();
    this.addAllOperatorsLog('Starting concatAll demonstration...');
    this.addAllOperatorsLog('concatAll processes inner observables sequentially');

    const outer$ = new Subject<Observable<string>>();

    outer$.pipe(
      concatAll(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: value => {
        this.addAllOperatorsLog(`Inner stream response: ${value}`);
        this.allOperatorsValues.update(v => [...v, value]);
      },
      complete: () => {
        this.addAllOperatorsLog('concatAll completed');
      }
    });

    // Emit inner observables
    this.addAllOperatorsLog('Outer stream emitting inner observable #1 (delayed 1s)');
    outer$.next(
      of('Inner 1 - Result A').pipe(delay(1000))
    );

    this.addAllOperatorsLog('Outer stream emitting inner observable #2 (delayed 0.5s)');
    outer$.next(
      of('Inner 2 - Result B').pipe(delay(500))
    );

    this.addAllOperatorsLog('Outer stream emitting inner observable #3 (delayed 0.3s)');
    outer$.next(
      of('Inner 3 - Result C').pipe(delay(300))
    );

    setTimeout(() => {
      outer$.complete();
    }, 2500);
  }

  demonstrateMergeAll(): void {
    this.clearAllOperators();
    this.addAllOperatorsLog('Starting mergeAll demonstration...');
    this.addAllOperatorsLog('mergeAll processes inner observables concurrently');

    const outer$ = new Subject<Observable<string>>();

    outer$.pipe(
      mergeAll(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: value => {
        this.addAllOperatorsLog(`Inner stream response: ${value}`);
        this.allOperatorsValues.update(v => [...v, value]);
      },
      complete: () => {
        this.addAllOperatorsLog('mergeAll completed');
      }
    });

    // Emit inner observables with different delays
    this.addAllOperatorsLog('Outer stream emitting inner observable #1 (delayed 2s)');
    outer$.next(
      of('Inner 1 - Result A').pipe(delay(2000))
    );

    this.addAllOperatorsLog('Outer stream emitting inner observable #2 (delayed 1s)');
    outer$.next(
      of('Inner 2 - Result B').pipe(delay(1000))
    );

    this.addAllOperatorsLog('Outer stream emitting inner observable #3 (delayed 0.5s)');
    outer$.next(
      of('Inner 3 - Result C').pipe(delay(500))
    );

    setTimeout(() => {
      outer$.complete();
    }, 2500);
  }

  demonstrateExhaustAll(): void {
    this.clearAllOperators();
    this.addAllOperatorsLog('Starting exhaustAll demonstration...');
    this.addAllOperatorsLog('exhaustAll ignores new inner observables while current is active');

    const outer$ = new Subject<Observable<string>>();

    outer$.pipe(
      exhaustAll(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: value => {
        this.addAllOperatorsLog(`Inner stream response: ${value}`);
        this.allOperatorsValues.update(v => [...v, value]);
      },
      complete: () => {
        this.addAllOperatorsLog('exhaustAll completed');
      }
    });

    // Emit inner observables
    this.addAllOperatorsLog('Outer stream emitting inner observable #1 (delayed 2s)');
    outer$.next(
      of('Inner 1 - Result A').pipe(delay(2000))
    );

    // These should be ignored
    setTimeout(() => {
      this.addAllOperatorsLog('Outer stream emitting inner observable #2 (ignored)');
      outer$.next(
        of('Inner 2 - Result B').pipe(delay(500))
      );
    }, 500);

    setTimeout(() => {
      this.addAllOperatorsLog('Outer stream emitting inner observable #3 (ignored)');
      outer$.next(
        of('Inner 3 - Result C').pipe(delay(500))
      );
    }, 1000);

    // This one should be processed after first completes
    setTimeout(() => {
      this.addAllOperatorsLog('Outer stream emitting inner observable #4 (processed after #1)');
      outer$.next(
        of('Inner 4 - Result D').pipe(delay(500))
      );
      setTimeout(() => {
        outer$.complete();
      }, 1000);
    }, 2500);
  }

  // Join & Start Operators Methods
  demonstrateWithLatestFrom(): void {
    this.clearJoinStart();
    this.addJoinStartLog('Starting withLatestFrom demonstration...');
    this.addJoinStartLog('Primary stream (button clicks) combined with Secondary stream (background interval)');

    this.primarySubject.pipe(
      withLatestFrom(of(this.secondarySignal()).pipe(
        tap(() => this.addJoinStartLog('Grabbing latest from secondary stream'))
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ([_, secondaryValue]) => {
        const message = `Primary click with latest secondary value: ${secondaryValue}`;
        this.addJoinStartLog(message);
        this.joinStartValues.update(v => [...v, message]);
      }
    });

    // Trigger a few clicks
    this.addJoinStartLog('Triggering primary click #1');
    this.primarySubject.next();

    setTimeout(() => {
      this.addJoinStartLog('Triggering primary click #2');
      this.primarySubject.next();
    }, 1000);

    setTimeout(() => {
      this.addJoinStartLog('Triggering primary click #3');
      this.primarySubject.next();
    }, 3000);
  }

  demonstrateStartWith(): void {
    this.clearJoinStart();
    this.addJoinStartLog('Starting startWith demonstration...');
    this.addJoinStartLog('Stream will immediately emit "Loading..." then actual data');

    const data$ = of('Actual Data Arrived').pipe(
      delay(2000),
      startWith('Loading...')
    );

    data$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: value => {
        this.addJoinStartLog(`Emitted: ${value}`);
        this.joinStartValues.update(v => [...v, value]);
      },
      complete: () => {
        this.addJoinStartLog('startWith demonstration completed');
      }
    });
  }

  // Comparison Methods
  demonstrateSwitchMapVsSwitchAll(): void {
    this.clearComparison();
    this.addComparisonLog('Comparing switchMap vs map + switchAll');
    this.addComparisonLog('Both should produce similar results but with different patterns');

    // Using switchMap
    this.addComparisonLog('--- Using switchMap ---');
    const source1$ = interval(1000).pipe(take(3));

    source1$.pipe(
      tap(val => this.addComparisonLog(`Outer value: ${val}`)),
      map(val => of(`Processed ${val}`).pipe(delay(500))),
      switchAll(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: value => {
        this.addComparisonLog(`switchAll result: ${value}`);
        this.comparisonValues.update(v => [...v, `switchAll: ${value}`]);
      }
    });

    // Using map + switchAll (equivalent to switchMap)
    setTimeout(() => {
      this.addComparisonLog('--- Using map + switchAll (same as switchMap) ---');
      const source2$ = interval(1000).pipe(take(3));

      source2$.pipe(
        tap(val => this.addComparisonLog(`Outer value: ${val}`)),
        map(val => of(`Processed ${val}`).pipe(delay(500))),
        switchAll(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: value => {
          this.addComparisonLog(`map+switchAll result: ${value}`);
          this.comparisonValues.update(v => [...v, `map+switchAll: ${value}`]);
        }
      });
    }, 4000);
  }

  // combineLatestAll demonstration
  demonstrateCombineLatestAll(): void {
    this.clearCombineAll();
    this.addCombineAllLog('Starting combineLatestAll demonstration...');
    this.addCombineAllLog('Outer stream must complete before combineLatestAll starts');

    // Emit three inner observables
    this.addCombineAllLog('Outer stream emitting inner observable #1 (emits after 1s)');
    this.combineAllOuter.next(
      of(10).pipe(delay(1000))
    );

    this.addCombineAllLog('Outer stream emitting inner observable #2 (emits after 0.5s)');
    this.combineAllOuter.next(
      of(20).pipe(delay(500))
    );

    this.addCombineAllLog('Outer stream emitting inner observable #3 (emits after 0.8s)');
    this.combineAllOuter.next(
      of(30).pipe(delay(800))
    );

    // Complete the outer stream
    setTimeout(() => {
      this.addCombineAllLog('Outer stream completing - now combineLatestAll will start');
      this.combineAllOuter.complete();
    }, 1200);
  }

  // Helper methods for logging
  private addAllOperatorsLog(message: string): void {
    this.allOperatorsLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addJoinStartLog(message: string): void {
    this.joinStartLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addComparisonLog(message: string): void {
    this.comparisonLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addCombineAllLog(message: string): void {
    this.combineAllLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  // Clear methods
  clearAllOperators(): void {
    this.allOperatorsLogs.set([]);
    this.allOperatorsValues.set([]);
  }

  clearJoinStart(): void {
    this.joinStartLogs.set([]);
    this.joinStartValues.set([]);
  }

  clearComparison(): void {
    this.comparisonLogs.set([]);
    this.comparisonValues.set([]);
  }

  clearCombineAll(): void {
    this.combineAllLogs.set([]);
    this.combineAllValues.set([]);
  }
}
