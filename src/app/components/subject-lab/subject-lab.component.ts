import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  Subject, 
  BehaviorSubject, 
  ReplaySubject, 
  AsyncSubject 
} from 'rxjs';

interface SubjectLog {
  timestamp: string;
  message: string;
  type: 'emission' | 'subscription' | 'completion';
  value?: any;
}

@Component({
  selector: 'app-subject-lab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subject-lab.component.html',
  styleUrl: './subject-lab.component.css'
})
export class SubjectLabComponent implements OnDestroy {
  // Subject instances
  private subject = new Subject<number>();
  private behaviorSubject = new BehaviorSubject<number>(0);
  private replaySubject = new ReplaySubject<number>(2);
  private asyncSubject = new AsyncSubject<number>();

  // Subscriptions
  private subjectSubscriptions: any[] = [];
  private behaviorSubscriptions: any[] = [];
  private replaySubscriptions: any[] = [];
  private asyncSubscriptions: any[] = [];

  // Logs for each subject type
  subjectLogs = signal<SubjectLog[]>([]);
  behaviorLogs = signal<SubjectLog[]>([]);
  replayLogs = signal<SubjectLog[]>([]);
  asyncLogs = signal<SubjectLog[]>([]);

  // Values for late subscribers
  subjectLateValues = signal<number[]>([]);
  behaviorLateValues = signal<number[]>([]);
  replayLateValues = signal<number[]>([]);
  asyncLateValues = signal<number[]>([]);

  // Live emissions
  subjectEmissions = signal<number[]>([]);
  behaviorEmissions = signal<number[]>([]);
  replayEmissions = signal<number[]>([]);
  asyncEmissions = signal<number[]>([]);

  // Track if subjects are completed
  isSubjectCompleted = signal(false);
  isBehaviorCompleted = signal(false);
  isReplayCompleted = signal(false);
  isAsyncCompleted = signal(false);

  constructor() {
    // Set up initial subscriptions to track emissions
    this.setupSubject();
    this.setupBehaviorSubject();
    this.setupReplaySubject();
    this.setupAsyncSubject();
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subjectSubscriptions.forEach(sub => sub.unsubscribe());
    this.behaviorSubscriptions.forEach(sub => sub.unsubscribe());
    this.replaySubscriptions.forEach(sub => sub.unsubscribe());
    this.asyncSubscriptions.forEach(sub => sub.unsubscribe());
  }

  private addLog(logsSignal: any, log: SubjectLog): void {
    logsSignal.update((currentLogs: SubjectLog[]) => [...currentLogs, log]);
  }

  private getTimestamp(): string {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3 
    });
  }

  // Subject methods
  private setupSubject(): void {
    const sub = this.subject.subscribe(value => {
      this.subjectEmissions.update(emissions => [...emissions, value]);
      this.addLog(this.subjectLogs, {
        timestamp: this.getTimestamp(),
        message: `Emitted: ${value}`,
        type: 'emission',
        value
      });
    });
    this.subjectSubscriptions.push(sub);
  }

  emitSubject(): void {
    if (this.isSubjectCompleted()) return;
    const randomValue = Math.floor(Math.random() * 100) + 1;
    this.subject.next(randomValue);
  }

  subscribeToSubject(): void {
    if (this.isSubjectCompleted()) return;
    const sub = this.subject.subscribe(value => {
      this.subjectLateValues.update(values => [...values, value]);
      this.addLog(this.subjectLogs, {
        timestamp: this.getTimestamp(),
        message: `Late subscriber received: ${value}`,
        type: 'subscription',
        value
      });
    });
    this.subjectSubscriptions.push(sub);
  }

  completeSubject(): void {
    this.subject.complete();
    this.isSubjectCompleted.set(true);
    this.addLog(this.subjectLogs, {
      timestamp: this.getTimestamp(),
      message: 'Subject completed',
      type: 'completion'
    });
  }

  // BehaviorSubject methods
  private setupBehaviorSubject(): void {
    const sub = this.behaviorSubject.subscribe(value => {
      this.behaviorEmissions.update(emissions => [...emissions, value]);
      this.addLog(this.behaviorLogs, {
        timestamp: this.getTimestamp(),
        message: `Emitted: ${value}`,
        type: 'emission',
        value
      });
    });
    this.behaviorSubscriptions.push(sub);
  }

  emitBehaviorSubject(): void {
    if (this.isBehaviorCompleted()) return;
    const randomValue = Math.floor(Math.random() * 100) + 1;
    this.behaviorSubject.next(randomValue);
  }

  subscribeToBehaviorSubject(): void {
    if (this.isBehaviorCompleted()) return;
    const sub = this.behaviorSubject.subscribe(value => {
      this.behaviorLateValues.update(values => [...values, value]);
      this.addLog(this.behaviorLogs, {
        timestamp: this.getTimestamp(),
        message: `Late subscriber received: ${value}`,
        type: 'subscription',
        value
      });
    });
    this.behaviorSubscriptions.push(sub);
  }

  completeBehaviorSubject(): void {
    this.behaviorSubject.complete();
    this.isBehaviorCompleted.set(true);
    this.addLog(this.behaviorLogs, {
      timestamp: this.getTimestamp(),
      message: 'BehaviorSubject completed',
      type: 'completion'
    });
  }

  // ReplaySubject methods
  private setupReplaySubject(): void {
    const sub = this.replaySubject.subscribe(value => {
      this.replayEmissions.update(emissions => [...emissions, value]);
      this.addLog(this.replayLogs, {
        timestamp: this.getTimestamp(),
        message: `Emitted: ${value}`,
        type: 'emission',
        value
      });
    });
    this.replaySubscriptions.push(sub);
  }

  emitReplaySubject(): void {
    if (this.isReplayCompleted()) return;
    const randomValue = Math.floor(Math.random() * 100) + 1;
    this.replaySubject.next(randomValue);
  }

  subscribeToReplaySubject(): void {
    if (this.isReplayCompleted()) return;
    const sub = this.replaySubject.subscribe(value => {
      this.replayLateValues.update(values => [...values, value]);
      this.addLog(this.replayLogs, {
        timestamp: this.getTimestamp(),
        message: `Late subscriber received: ${value}`,
        type: 'subscription',
        value
      });
    });
    this.replaySubscriptions.push(sub);
  }

  completeReplaySubject(): void {
    this.replaySubject.complete();
    this.isReplayCompleted.set(true);
    this.addLog(this.replayLogs, {
      timestamp: this.getTimestamp(),
      message: 'ReplaySubject completed',
      type: 'completion'
    });
  }

  // AsyncSubject methods
  private setupAsyncSubject(): void {
    const sub = this.asyncSubject.subscribe(value => {
      this.asyncEmissions.update(emissions => [...emissions, value]);
      this.addLog(this.asyncLogs, {
        timestamp: this.getTimestamp(),
        message: `Emitted: ${value}`,
        type: 'emission',
        value
      });
    });
    this.asyncSubscriptions.push(sub);
  }

  emitAsyncSubject(): void {
    if (this.isAsyncCompleted()) return;
    const randomValue = Math.floor(Math.random() * 100) + 1;
    this.asyncSubject.next(randomValue);
  }

  subscribeToAsyncSubject(): void {
    if (this.isAsyncCompleted()) return;
    const sub = this.asyncSubject.subscribe(value => {
      this.asyncLateValues.update(values => [...values, value]);
      this.addLog(this.asyncLogs, {
        timestamp: this.getTimestamp(),
        message: `Late subscriber received: ${value}`,
        type: 'subscription',
        value
      });
    });
    this.asyncSubscriptions.push(sub);
  }

  completeAsyncSubject(): void {
    this.asyncSubject.complete();
    this.isAsyncCompleted.set(true);
    this.addLog(this.asyncLogs, {
      timestamp: this.getTimestamp(),
      message: 'AsyncSubject completed',
      type: 'completion'
    });
  }

  // Reset methods
  resetSubject(): void {
    this.subject.complete();
    this.subject = new Subject<number>();
    this.subjectSubscriptions.forEach(sub => sub.unsubscribe());
    this.subjectSubscriptions = [];
    this.subjectLogs.set([]);
    this.subjectLateValues.set([]);
    this.subjectEmissions.set([]);
    this.isSubjectCompleted.set(false);
    this.setupSubject();
  }

  resetBehaviorSubject(): void {
    this.behaviorSubject.complete();
    this.behaviorSubject = new BehaviorSubject<number>(0);
    this.behaviorSubscriptions.forEach(sub => sub.unsubscribe());
    this.behaviorSubscriptions = [];
    this.behaviorLogs.set([]);
    this.behaviorLateValues.set([]);
    this.behaviorEmissions.set([]);
    this.isBehaviorCompleted.set(false);
    this.setupBehaviorSubject();
  }

  resetReplaySubject(): void {
    this.replaySubject.complete();
    this.replaySubject = new ReplaySubject<number>(2);
    this.replaySubscriptions.forEach(sub => sub.unsubscribe());
    this.replaySubscriptions = [];
    this.replayLogs.set([]);
    this.replayLateValues.set([]);
    this.replayEmissions.set([]);
    this.isReplayCompleted.set(false);
    this.setupReplaySubject();
  }

  resetAsyncSubject(): void {
    this.asyncSubject.complete();
    this.asyncSubject = new AsyncSubject<number>();
    this.asyncSubscriptions.forEach(sub => sub.unsubscribe());
    this.asyncSubscriptions = [];
    this.asyncLogs.set([]);
    this.asyncLateValues.set([]);
    this.asyncEmissions.set([]);
    this.isAsyncCompleted.set(false);
    this.setupAsyncSubject();
  }
}
