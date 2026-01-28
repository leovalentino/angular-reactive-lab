import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  Subject,
  interval,
  of,
  combineLatest,
  forkJoin,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  map,
  tap,
  takeUntil,
  finalize
} from 'rxjs';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-observable-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './observable-lab.component.html',
  styleUrl: './observable-lab.component.css'
})
export class ObservableLabComponent {
  private destroyRef = inject(DestroyRef);

  // Search Stream
  searchTerm = signal('');
  searchResults = signal<string[]>([]);
  searchLogs = signal<string[]>([]);
  isCancelling = signal(false);
  private searchSubject = new Subject<string>();

  // Interval Stream
  intervalCounter = signal(0);
  intervalLogs = signal<string[]>([]);
  intervalActive = signal(false);
  private intervalSubscription: any = null;

  // Combined Stream
  userPreference = signal('default');
  apiData = signal<any>(null);
  combinedResult = signal<any>(null);
  combinedLogs = signal<string[]>([]);

  // Manual subscription example
  manualSubscriptionActive = signal(false);
  manualSubscriptionLogs = signal<string[]>([]);
  private manualSubject = new Subject<void>();

  constructor() {
    // Setup search stream with AbortController
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => {
        this.addSearchLog(`Searching for: "${term}"`);
      }),
      switchMap(term => {
        if (!term.trim()) {
          return of([]);
        }
        // Create a new AbortController for each request
        const controller = new AbortController();
        const signal = controller.signal;
        
        // Show cancelling indicator briefly
        this.isCancelling.set(true);
        setTimeout(() => this.isCancelling.set(false), 300);
        
        // Return an observable that uses fetch with abort signal
        return new Observable<string[]>(observer => {
          // Simulate a real API call with fetch
          fetch(`https://jsonplaceholder.typicode.com/posts?q=${term}`, { signal })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(posts => {
              // Extract titles from posts
              const results = posts.slice(0, 3).map((post: any) => 
                `Post ${post.id}: ${post.title.substring(0, 30)}...`
              );
              observer.next(results);
              observer.complete();
            })
            .catch(error => {
              if (error.name === 'AbortError') {
                this.addSearchLog('Network request aborted by browser');
                // Don't emit error, just complete without emitting next
                observer.complete();
              } else {
                observer.error(error);
              }
            });
          
          // Return cleanup function that aborts the request when unsubscribed
          return () => {
            if (!signal.aborted) {
              controller.abort();
              this.addSearchLog('Previous request cancelled via switchMap');
            }
          };
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: results => {
        this.searchResults.set(results);
        this.addSearchLog(`Found ${results.length} results`);
      },
      error: err => {
        this.addSearchLog(`Search error: ${err}`);
      },
      complete: () => {
        this.addSearchLog('Search stream completed');
      }
    });

    // Setup combined stream
    combineLatest([
      toObservable(this.userPreference),
      this.fetchMockApi()
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ([pref, data]) => {
        this.combinedResult.set({ preference: pref, apiData: data });
      }
    });
  }

  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  startInterval(): void {
    if (this.intervalActive()) return;

    this.intervalActive.set(true);
    this.intervalCounter.set(0);
    this.addIntervalLog('Interval started');

    this.intervalSubscription = interval(1000).pipe(
      take(10),
      map(count => count + 1),
      tap(count => {
        this.intervalCounter.set(count);
        this.addIntervalLog(`Tick ${count}`);
      }),
      finalize(() => {
        this.intervalActive.set(false);
        this.addIntervalLog('Interval completed');
      })
    ).subscribe({
      complete: () => {
        this.addIntervalLog('Interval stream completed');
      },
      error: err => {
        this.addIntervalLog(`Interval error: ${err}`);
      }
    });
  }

  cancelInterval(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalActive.set(false);
      this.addIntervalLog('Interval cancelled manually');
    }
  }

  startManualSubscription(): void {
    if (this.manualSubscriptionActive()) return;

    this.manualSubscriptionActive.set(true);
    this.addManualLog('Manual subscription started');

    const subscription = interval(500).pipe(
      takeUntil(this.manualSubject),
      tap(count => {
        this.addManualLog(`Manual emission ${count + 1}`);
      }),
      finalize(() => {
        this.manualSubscriptionActive.set(false);
        this.addManualLog('Manual subscription cleaned up');
      })
    ).subscribe();

    // Store subscription for cleanup in ngOnDestroy
    // In a real scenario, we'd need to manage this
    // For demo, we'll use the manualSubject to cancel
  }

  cancelManualSubscription(): void {
    this.manualSubject.next();
    this.manualSubject.complete();
    // Reset subject for next time
    this.manualSubject = new Subject<void>();
    this.addManualLog('Manual subscription cancelled via takeUntil');
  }

  changePreference(pref: string): void {
    this.userPreference.set(pref);
    this.addCombinedLog(`Preference changed to: ${pref}`);
  }

  private fetchMockApi(): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const data = {
          timestamp: new Date().toISOString(),
          message: 'Mock API response'
        };
        observer.next(data);
        observer.complete();
      }, 1000);
    });
  }

  private addSearchLog(message: string): void {
    this.searchLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addIntervalLog(message: string): void {
    this.intervalLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addCombinedLog(message: string): void {
    this.combinedLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addManualLog(message: string): void {
    this.manualSubscriptionLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchResults.set([]);
    this.searchLogs.set([]);
  }

  clearIntervalLogs(): void {
    this.intervalLogs.set([]);
  }

  clearCombinedLogs(): void {
    this.combinedLogs.set([]);
  }

  clearManualLogs(): void {
    this.manualSubscriptionLogs.set([]);
  }
}
