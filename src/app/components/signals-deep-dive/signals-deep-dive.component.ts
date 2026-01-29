import { Component, signal, computed, effect, untracked, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signals-deep-dive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signals-deep-dive.component.html',
  styleUrl: './signals-deep-dive.component.css'
})
export class SignalsDeepDiveComponent {
  // 1. Dependency Graph Visualization
  signalA = signal(0);
  logEntries: string[] = [];

  // Computed B depends on A
  computedB = computed(() => {
    const a = this.signalA();
    const result = a * 2;
    this.addLog(`Computed B recalculated: ${a} * 2 = ${result}`);
    return result;
  });

  // Computed C depends on A and B
  computedC = computed(() => {
    const a = this.signalA();
    const b = this.computedB();
    const result = a + b;
    this.addLog(`Computed C recalculated: ${a} + ${b} = ${result}`);
    return result;
  });

  // 2. Glitch-Free Test: Diamond Problem
  // Already demonstrated with A -> B and A -> C, and B -> C
  // C depends on both A and B, where B also depends on A

  // 3. Advanced Signal Patterns
  // Untracked example
  untrackedExample = computed(() => {
    const a = this.signalA();
    // Read another signal but don't create a dependency
    const untrackedValue = untracked(() => this.signalA() * 100);
    this.addLog(`Untracked example: a=${a}, untrackedValue=${untrackedValue}`);
    return untrackedValue;
  });

  // Effect with cleanup
  constructor() {
    effect((onCleanup) => {
      const value = this.signalA();
      this.addLog(`Effect triggered: signalA = ${value}`);
      
      // Start an interval
      const intervalId = setInterval(() => {
        console.log(`Interval tick for signalA = ${value}`);
      }, 1000);
      
      // Register cleanup function
      onCleanup(() => {
        clearInterval(intervalId);
        this.addLog(`Cleanup: cleared interval for signalA = ${value}`);
      });
    });
  }

  // Equality function example
  userObject = signal(
    { id: 1, name: 'John Doe' },
    {
      equal: (a, b) => a.id === b.id
    }
  );

  // 4. Performance Profiling: 1000 computed signals
  computedSignals = Array.from({ length: 1000 }, (_, i) => 
    computed(() => {
      // Each depends on signalA in a different way
      return this.signalA() + i;
    })
  );

  // Helper to add log entries
  private addLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logEntries.unshift(`${timestamp}: ${message}`);
    // Keep only last 20 entries
    if (this.logEntries.length > 20) {
      this.logEntries.pop();
    }
  }

  // Update Signal A
  updateSignalA(): void {
    this.signalA.update(val => val + 1);
    this.addLog('Signal A incremented');
  }

  // Update user object with same ID
  updateUserSameId(): void {
    this.userObject.set({ id: 1, name: 'Jane Smith' });
    this.addLog('User object updated with same ID (reference changed, but equal function prevents notification)');
  }

  // Update user object with different ID
  updateUserDifferentId(): void {
    this.userObject.set({ id: 2, name: 'Jane Smith' });
    this.addLog('User object updated with different ID (change detected)');
  }

  // Clear logs
  clearLogs(): void {
    this.logEntries = [];
  }

  // Get a sample of computed signals values
  getSampleComputedValues(): number[] {
    return this.computedSignals.slice(0, 5).map(signal => signal());
  }
}
