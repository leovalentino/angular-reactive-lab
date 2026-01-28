import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, map, filter, interval, take } from 'rxjs';

@Component({
  selector: 'app-comparison-lab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-lab.component.html',
  styleUrl: './comparison-lab.component.css'
})
export class ComparisonLabComponent {
  // Promise Lab
  promiseLogs = signal<string[]>([]);
  promiseStatus = signal<'idle' | 'pending' | 'fulfilled' | 'rejected' | 'cancelled'>('idle');
  private promiseInstance: any = null;

  // Observable Lab
  observableLogs = signal<string[]>([]);
  observableStatus = signal<'idle' | 'subscribed' | 'completed' | 'cancelled'>('idle');
  observableValues = signal<number[]>([]);
  private observableSubscription: Subscription | null = null;

  // Single vs Multiple
  singleValueLogs = signal<string[]>([]);
  multipleValueLogs = signal<string[]>([]);
  multipleValues = signal<number[]>([]);

  // Operators
  operatorLogs = signal<string[]>([]);
  operatorValues = signal<number[]>([]);
  private operatorSubscription: Subscription | null = null;

  // Promise Lab Methods
  createPromise(): void {
    this.promiseLogs.set([]);
    this.promiseStatus.set('pending');
    this.addPromiseLog('Creating new Promise...');
    this.addPromiseLog('Promise execution starts IMMEDIATELY upon creation (Eager)');
    
    this.promiseInstance = new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.addPromiseLog('Promise Execution Started (after 2 seconds)');
        this.addPromiseLog('Promise resolved with value: 42');
        this.promiseStatus.set('fulfilled');
        resolve();
      }, 2000);
      
      // Note: We can't cancel this natively
      // Store timeoutId if we wanted to implement custom cancellation
    });
    
    // Even without .then(), the promise is already executing
    this.addPromiseLog('Promise created and already executing in background');
  }

  tryCancelPromise(): void {
    if (this.promiseStatus() === 'pending') {
      this.addPromiseLog('Attempting to cancel Promise...');
      this.addPromiseLog('ERROR: Promises cannot be cancelled natively!');
      this.addPromiseLog('The setTimeout will still run after 2 seconds');
      this.promiseStatus.set('cancelled');
    } else {
      this.addPromiseLog('No pending promise to cancel');
    }
  }

  // Observable Lab Methods
  createObservable(): void {
    this.observableLogs.set([]);
    this.observableValues.set([]);
    this.observableStatus.set('idle');
    this.addObservableLog('Creating new Observable...');
    this.addObservableLog('NOTHING happens yet (Lazy)');
    this.addObservableLog('Observable will only execute when subscribed');
  }

  subscribeObservable(): void {
    if (this.observableStatus() === 'subscribed') {
      this.addObservableLog('Already subscribed');
      return;
    }
    
    this.observableLogs.set([]);
    this.observableValues.set([]);
    this.addObservableLog('Subscribing to Observable...');
    this.observableStatus.set('subscribed');
    
    this.observableSubscription = new Observable<number>(observer => {
      this.addObservableLog('Observable Execution Started (after subscribe)');
      
      const timeoutId = setTimeout(() => {
        this.addObservableLog('Emitting value: 100');
        observer.next(100);
        observer.complete();
        this.observableStatus.set('completed');
        this.addObservableLog('Observable completed');
      }, 2000);
      
      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        this.addObservableLog('Observable cleanup: timeout cleared');
      };
    }).subscribe({
      next: value => {
        this.observableValues.update(values => [...values, value]);
      },
      error: err => {
        this.addObservableLog(`Error: ${err}`);
      },
      complete: () => {
        this.addObservableLog('Subscription completed');
      }
    });
  }

  cancelObservable(): void {
    if (this.observableSubscription) {
      this.addObservableLog('Cancelling Observable via unsubscribe()...');
      this.observableSubscription.unsubscribe();
      this.observableSubscription = null;
      this.observableStatus.set('cancelled');
      this.addObservableLog('Observable successfully cancelled');
    } else {
      this.addObservableLog('No active subscription to cancel');
    }
  }

  // Single vs Multiple Methods
  demonstrateSingleValue(): void {
    this.singleValueLogs.set([]);
    this.addSingleLog('Creating Promise (single value)...');
    
    const promise = new Promise<number>(resolve => {
      setTimeout(() => {
        resolve(42);
      }, 1000);
    });
    
    promise.then(value => {
      this.addSingleLog(`Promise resolved with single value: ${value}`);
      this.addSingleLog('Promise is DONE - cannot emit more values');
    });
  }

  demonstrateMultipleValues(): void {
    this.multipleValueLogs.set([]);
    this.multipleValues.set([]);
    this.addMultipleLog('Creating Observable (multiple values)...');
    
    const observable = interval(500).pipe(
      take(5)
    );
    
    const subscription = observable.subscribe({
      next: value => {
        this.multipleValues.update(values => [...values, value]);
        this.addMultipleLog(`Observable emitted value #${value + 1}`);
      },
      complete: () => {
        this.addMultipleLog('Observable completed after 5 emissions');
      }
    });
    
    // Auto-unsubscribe after some time
    setTimeout(() => {
      subscription.unsubscribe();
    }, 3000);
  }

  // Operators Methods
  demonstrateOperators(): void {
    this.operatorLogs.set([]);
    this.operatorValues.set([]);
    this.addOperatorLog('Creating Observable with operators...');
    
    if (this.operatorSubscription) {
      this.operatorSubscription.unsubscribe();
    }
    
    this.operatorSubscription = interval(300).pipe(
      take(10),
      map(value => value * 2),
      filter(value => value % 3 === 0)
    ).subscribe({
      next: value => {
        this.operatorValues.update(values => [...values, value]);
        this.addOperatorLog(`Transformed value: ${value}`);
      },
      complete: () => {
        this.addOperatorLog('Operator demonstration completed');
      }
    });
  }

  cancelOperatorDemo(): void {
    if (this.operatorSubscription) {
      this.operatorSubscription.unsubscribe();
      this.operatorSubscription = null;
      this.addOperatorLog('Operator demonstration cancelled');
    }
  }

  // Helper methods for logging
  private addPromiseLog(message: string): void {
    this.promiseLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addObservableLog(message: string): void {
    this.observableLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addSingleLog(message: string): void {
    this.singleValueLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addMultipleLog(message: string): void {
    this.multipleValueLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addOperatorLog(message: string): void {
    this.operatorLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  // Cleanup
  ngOnDestroy(): void {
    if (this.observableSubscription) {
      this.observableSubscription.unsubscribe();
    }
    if (this.operatorSubscription) {
      this.operatorSubscription.unsubscribe();
    }
  }
}
