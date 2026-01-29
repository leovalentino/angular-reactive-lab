import { Routes } from '@angular/router';

export const PERFORMANCE_DETAILS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./performance-details.component').then(m => m.PerformanceDetailsComponent)
  }
];
