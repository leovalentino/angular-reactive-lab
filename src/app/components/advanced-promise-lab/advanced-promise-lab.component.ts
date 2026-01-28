import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PromiseResult {
  id: number;
  status: 'pending' | 'fulfilled' | 'rejected';
  value?: any;
  reason?: string;
}

@Component({
  selector: 'app-advanced-promise-lab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advanced-promise-lab.component.html',
  styleUrl: './advanced-promise-lab.component.css'
})
export class AdvancedPromiseLabComponent {
  // Promise.all results
  allResults = signal<any[]>([]);
  allStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Promise.allSettled results
  allSettledResults = signal<PromiseResult[]>([]);
  allSettledStatus = signal<'idle' | 'loading' | 'complete'>('idle');
  
  // Promise.race results
  raceResult = signal<string>('');
  raceStatus = signal<'idle' | 'racing' | 'timeout' | 'success'>('idle');
  
  // Retry mechanism
  retryLogs = signal<string[]>([]);
  retryStatus = signal<'idle' | 'retrying' | 'success' | 'failed'>('idle');
  retryAttempts = signal(0);
  
  // Event loop visualization
  eventLoopLogs = signal<string[]>([]);

  // Simulate API calls
  private simulateApiCall(name: string, delay: number, shouldFail = false): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error(`${name} failed after ${delay}ms`));
        } else {
          resolve({ data: `${name} data`, timestamp: new Date().toISOString() });
        }
      }, delay);
    });
  }

  // 1. Promise.all - Fetch All Essential
  async fetchAllEssential(): Promise<void> {
    this.allStatus.set('loading');
    this.allResults.set([]);
    
    try {
      const [user, roles] = await Promise.all([
        this.simulateApiCall('User API', 1000),
        this.simulateApiCall('Roles API', 1500)
      ]);
      
      this.allResults.set([user, roles]);
      this.allStatus.set('success');
    } catch (error) {
      this.allStatus.set('error');
      this.allResults.set([{ error: (error as Error).message }]);
    }
  }

  // 2. Promise.allSettled - Fetch Status
  async fetchStatus(): Promise<void> {
    this.allSettledStatus.set('loading');
    this.allSettledResults.set([
      { id: 1, status: 'pending' },
      { id: 2, status: 'pending' },
      { id: 3, status: 'pending' },
      { id: 4, status: 'pending' }
    ]);
    
    const promises = [
      this.simulateApiCall('Service A', 800),
      this.simulateApiCall('Service B', 1200, true), // This one fails
      this.simulateApiCall('Service C', 600),
      this.simulateApiCall('Service D', 2000, true) // This one also fails
    ];
    
    const results = await Promise.allSettled(promises);
    
    const mappedResults: PromiseResult[] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          id: index + 1,
          status: 'fulfilled',
          value: result.value
        };
      } else {
        return {
          id: index + 1,
          status: 'rejected',
          reason: result.reason.message
        };
      }
    });
    
    this.allSettledResults.set(mappedResults);
    this.allSettledStatus.set('complete');
  }

  // 3. Promise.race - Timeout Race
  async timeoutRace(): Promise<void> {
    this.raceStatus.set('racing');
    this.raceResult.set('');
    
    const fetchPromise = this.simulateApiCall('Slow API', 5000);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 2 seconds')), 2000);
    });
    
    try {
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      this.raceResult.set(`Success: ${JSON.stringify(result)}`);
      this.raceStatus.set('success');
    } catch (error) {
      this.raceResult.set(`Timeout: ${(error as Error).message}`);
      this.raceStatus.set('timeout');
    }
  }

  // 4. Retry Mechanism
  async retryMock(): Promise<void> {
    this.retryStatus.set('retrying');
    this.retryLogs.set([]);
    this.retryAttempts.set(0);
    
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      this.retryAttempts.set(attempts);
      this.addRetryLog(`Attempt ${attempts}/${maxAttempts}...`);
      
      try {
        // Simulate an API that fails twice then succeeds
        if (attempts < 3) {
          await this.simulateApiCall('Unreliable API', 500, true);
        } else {
          const result = await this.simulateApiCall('Unreliable API', 500);
          this.addRetryLog(`Success on attempt ${attempts}: ${JSON.stringify(result)}`);
          this.retryStatus.set('success');
          return;
        }
      } catch (error) {
        this.addRetryLog(`Failed on attempt ${attempts}: ${(error as Error).message}`);
        if (attempts === maxAttempts) {
          this.retryStatus.set('failed');
          this.addRetryLog('Max attempts reached. Giving up.');
        }
      }
    }
  }

  // 5. Event Loop Visualization
  demonstrateEventLoop(): void {
    this.eventLoopLogs.set([]);
    
    this.addEventLoopLog('1. Synchronous code starts');
    
    // Microtask (Promise)
    Promise.resolve().then(() => {
      this.addEventLoopLog('3. Microtask (Promise.then) executed');
    });
    
    // Macrotask (setTimeout)
    setTimeout(() => {
      this.addEventLoopLog('5. Macrotask (setTimeout) executed');
    }, 0);
    
    // Another microtask
    Promise.resolve().then(() => {
      this.addEventLoopLog('4. Another microtask executed');
    });
    
    this.addEventLoopLog('2. Synchronous code ends');
    
    // Immediate execution
    queueMicrotask(() => {
      this.addEventLoopLog('Microtask from queueMicrotask executed (after Promises)');
    });
  }

  // Helper methods
  private addRetryLog(message: string): void {
    this.retryLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  private addEventLoopLog(message: string): void {
    this.eventLoopLogs.update(logs => [...logs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }

  // Clear methods
  clearAllResults(): void {
    this.allResults.set([]);
    this.allStatus.set('idle');
  }

  clearAllSettledResults(): void {
    this.allSettledResults.set([]);
    this.allSettledStatus.set('idle');
  }

  clearRaceResults(): void {
    this.raceResult.set('');
    this.raceStatus.set('idle');
  }

  clearRetryLogs(): void {
    this.retryLogs.set([]);
    this.retryStatus.set('idle');
    this.retryAttempts.set(0);
  }

  clearEventLoopLogs(): void {
    this.eventLoopLogs.set([]);
  }
}
