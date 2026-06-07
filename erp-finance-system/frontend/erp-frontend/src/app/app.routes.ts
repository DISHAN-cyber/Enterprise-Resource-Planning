import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'coa', loadComponent: () => import('./components/coa/coa.component').then(m => m.CoaComponent) },
      { path: 'gl', loadComponent: () => import('./components/gl/gl.component').then(m => m.GlComponent) },
      { path: 'ap', loadComponent: () => import('./components/ap/ap.component').then(m => m.ApComponent) },
      { path: 'ar', loadComponent: () => import('./components/ar/ar.component').then(m => m.ArComponent) },
      { path: 'assets', loadComponent: () => import('./components/assets/assets.component').then(m => m.AssetsComponent) },
      { path: 'bank', loadComponent: () => import('./components/bank/bank.component').then(m => m.BankComponent) },
      { path: 'budget', loadComponent: () => import('./components/budget/budget.component').then(m => m.BudgetComponent) },
      { path: 'reports', loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'users', loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent) },
      { path: 'setup', loadComponent: () => import('./components/setup/setup.component').then(m => m.SetupComponent) },
      { path: 'comparison', loadComponent: () => import('./components/comparison/comparison.component').then(m => m.ComparisonComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'settings', loadComponent: () => import('./components/setup/setup.component').then(m => m.SetupComponent) },
      { path: 'change-password', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },

  { path: '**', redirectTo: '/dashboard' }
];