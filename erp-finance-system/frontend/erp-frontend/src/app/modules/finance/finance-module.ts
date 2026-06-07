import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FinanceRoutingModule } from './finance-routing-module';
import { FinanceShellComponent } from './finance-shell/finance-shell';

@NgModule({
  imports: [CommonModule, FormsModule, FinanceShellComponent, FinanceRoutingModule],
})
export class FinanceModule {}
