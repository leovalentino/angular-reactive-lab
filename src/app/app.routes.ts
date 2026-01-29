import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'performance',
    loadComponent: () => import('./components/performance-lab/performance-lab.component').then(m => m.PerformanceLabComponent),
    children: [
      {
        path: 'details',
        loadChildren: () => import('./components/performance-lab/performance-details.routes').then(m => m.PERFORMANCE_DETAILS_ROUTES)
      }
    ]
  }
];

// Note: We need to create performance-details.routes.ts
