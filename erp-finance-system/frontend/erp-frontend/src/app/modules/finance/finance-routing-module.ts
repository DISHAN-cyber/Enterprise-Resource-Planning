import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceShellComponent } from './finance-shell/finance-shell';
import { ErpFinanceComponent } from './pages/erp-finance/erp-finance.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: FinanceShellComponent },
  { path: 'profile', component: FinanceShellComponent },
  { path: 'settings', component: FinanceShellComponent },
  { path: 'change-password', component: FinanceShellComponent },
  { path: 'coa', component: FinanceShellComponent },
  { path: 'gl', component: FinanceShellComponent },
  { path: 'ap', component: FinanceShellComponent },
  { path: 'ar', component: FinanceShellComponent },
  { path: 'assets', component: FinanceShellComponent },
  { path: 'bank', component: FinanceShellComponent },
  { path: 'budget', component: FinanceShellComponent },
  { path: 'reports', component: FinanceShellComponent },
  { path: 'users', component: FinanceShellComponent },
  { path: 'setup', component: FinanceShellComponent },
  { path: 'comparison', component: FinanceShellComponent },
  { path: 'erp-custom', component: ErpFinanceComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule {}