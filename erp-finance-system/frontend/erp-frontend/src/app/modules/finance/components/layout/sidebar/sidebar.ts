import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  @Input() sidebarOpen = false;
  @Output() closed = new EventEmitter<void>();

  menuItems = [
    { path: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: 'coa', icon: 'fas fa-list-alt', label: 'Chart of Accounts' },
    { path: 'gl', icon: 'fas fa-book', label: 'General Ledger' },
    { path: 'ap', icon: 'fas fa-file-invoice-dollar', label: 'Accounts Payable', badge: '5' },
    { path: 'ar', icon: 'fas fa-hand-holding-usd', label: 'Accounts Receivable', badge: '12' },
    { path: 'assets', icon: 'fas fa-building', label: 'Fixed Assets' },
    { path: 'bank', icon: 'fas fa-university', label: 'Bank & Reconciliation' },
    { path: 'budget', icon: 'fas fa-chart-line', label: 'Budgeting' },
    { path: 'reports', icon: 'fas fa-chart-bar', label: 'Financial Reports' },
    { path: 'users', icon: 'fas fa-users-cog', label: 'User Management' },
    { path: 'setup', icon: 'fas fa-cogs', label: 'Module Setup' },
    { path: 'comparison', icon: 'fas fa-columns', label: 'Domain Comparison' }
  ];

  closeSidebar(): void {
    if (this.sidebarOpen) {
      this.closed.emit();
    }
  }
}

