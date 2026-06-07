import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <!-- Toggle Sidebar Button -->
    <button class="toggle-sidebar" id="toggleSidebar" aria-label="Toggle navigation" type="button" (click)="toggleSidebar()">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar -->
    <nav class="sidebar" id="sidebar" [class.active]="sidebarActive" aria-label="ERP navigation">
      <div class="sidebar-header">
        <h2><i class="fas fa-calculator"></i> ERP Finance</h2>
      </div>
      <ul class="sidebar-menu">
        <li><a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-home"></i> Dashboard</a></li>
        <li><a routerLink="/coa" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-list-alt"></i> Chart of Accounts</a></li>
        <li><a routerLink="/gl" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-book"></i> General Ledger</a></li>
        <li><a routerLink="/ap" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-file-invoice-dollar"></i> Accounts Payable <span class="badge new">5</span></a></li>
        <li><a routerLink="/ar" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-hand-holding-usd"></i> Accounts Receivable <span class="badge new">12</span></a></li>
        <li><a routerLink="/assets" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-building"></i> Fixed Assets</a></li>
        <li><a routerLink="/bank" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-university"></i> Bank & Reconciliation</a></li>
        <li><a routerLink="/budget" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-chart-line"></i> Budgeting</a></li>
        <li><a routerLink="/reports" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-chart-bar"></i> Financial Reports</a></li>
        <li><a routerLink="/users" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-users-cog"></i> User Management</a></li>
        <li><a routerLink="/setup" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-cogs"></i> Module Setup</a></li>
        <li><a routerLink="/comparison" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeSidebarOnMobile()"><i class="fas fa-columns"></i> Domain Comparison</a></li>
      </ul>
    </nav>

    <!-- Main Content -->
    <main class="main-content" id="mainContent">
      <!-- Top Bar -->
      <div class="topbar">
        <div class="page-title">
          <h1 id="pageTitle">{{ pageTitle }}</h1>
          <div class="subtitle" id="domainBadge">{{ domainBadge }}</div>
        </div>
        <div class="user-actions">
          <div class="notification" aria-label="Notifications" role="button" tabindex="0" (click)="toggleNotifications()">
            <i class="fas fa-bell"></i>
            <span class="notification-badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
          </div>
          <select class="form-control filter-dropdown" id="domainSelector" [(ngModel)]="selectedDomain" (change)="changeDomain($event)">
            <option value="general">General Business</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="retail">Retail</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="nonprofit">Non-Profit</option>
          </select>
          <div class="user-profile" aria-label="User menu" role="button" tabindex="0" (click)="showUserMenu()">
            <div class="user-avatar">{{ userInitials }}</div>
            <div class="user-info">
              <h4>{{ userProfile?.firstName }} {{ userProfile?.lastName }}</h4>
              <p>{{ userProfile?.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <router-outlet></router-outlet>
      </div>
    </main>

    <!-- User Menu Dropdown -->
    <div id="userMenu" *ngIf="showUserMenuDropdown" class="user-menu-dropdown">
      <div class="user-menu-header">
        <div class="user-menu-title">{{ userProfile?.firstName }} {{ userProfile?.lastName }}</div>
        <div class="user-menu-email">{{ userProfile?.email }}</div>
      </div>
      <div class="user-menu-list">
        <button type="button" class="user-menu-item" (click)="navigateToProfile()">
          <i class="fas fa-user user-menu-icon"></i>
          My Profile
        </button>
        <button type="button" class="user-menu-item" (click)="navigateToSettings()">
          <i class="fas fa-cog user-menu-icon"></i>
          Settings
        </button>
        <button type="button" class="user-menu-item" (click)="navigateToChangePassword()">
          <i class="fas fa-lock user-menu-icon"></i>
          Change Password
        </button>
        <div class="user-menu-divider"></div>
        <button type="button" class="user-menu-item logout-item" (click)="logout()">
          <i class="fas fa-sign-out-alt user-menu-icon"></i>
          Logout
        </button>
      </div>
    </div>

    <!-- Notifications Panel -->
    <div id="notificationsPanel" *ngIf="showNotifications" class="notifications-panel">
      <div class="notifications-header">
        <h3>Notifications</h3>
      </div>
      <div id="notificationsList" class="notifications-list">
        <div *ngFor="let notification of notifications" class="notification-item">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-body">{{ notification.message }}</div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
      </div>
      <div class="notifications-footer">
        <button class="btn btn-outline" (click)="clearAllNotifications()">Clear All</button>
      </div>
    </div>
  `,
  styles: [`
    :root {
      --primary: #1a237e;
      --secondary: #283593;
      --accent: #3949ab;
      --success: #2e7d32;
      --warning: #f57c00;
      --danger: #d32f2f;
      --info: #0288d1;
      --light: #f5f5f5;
      --dark: #212121;
      --sidebar-width: 280px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background: #f0f2f5;
      color: #333;
      display: flex;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background: linear-gradient(180deg, var(--primary) 0%, #0d1b6b 100%);
      color: white;
      height: 100vh;
      position: fixed;
      overflow-y: auto;
      transition: transform 0.3s;
      z-index: 1000;
      box-shadow: 3px 0 15px rgba(0,0,0,0.1);
    }

    .sidebar-header {
      padding: 25px 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: rgba(0,0,0,0.1);
    }

    .sidebar-header h2 {
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-weight: 600;
    }

    .sidebar-menu {
      list-style: none;
      padding: 20px 0;
    }

    .sidebar-menu li {
      margin-bottom: 2px;
    }

    .sidebar-menu a {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      display: flex;
      align-items: center;
      padding: 14px 25px;
      transition: all 0.3s;
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }

    .sidebar-menu a:hover {
      background: rgba(255,255,255,0.1);
      color: white;
      padding-left: 30px;
    }

    .sidebar-menu a.active {
      background: var(--accent);
      color: white;
      border-left: 4px solid #00bcd4;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
    }

    .sidebar-menu a.active:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: #00bcd4;
    }

    .sidebar-menu i {
      width: 25px;
      margin-right: 15px;
      font-size: 1.1rem;
    }

    .badge {
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: auto;
    }

    .badge.new {
      background: #ff4081;
      color: white;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      padding: 0;
      transition: margin-left 0.3s;
      min-height: 100vh;
    }

    /* Topbar */
    .topbar {
      background: white;
      padding: 0 30px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .page-title h1 {
      color: var(--primary);
      font-size: 1.8rem;
      font-weight: 600;
    }

    .page-title .subtitle {
      color: #666;
      font-size: 0.9rem;
      background: #f0f2f5;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .notification {
      position: relative;
      cursor: pointer;
      padding: 10px;
      border-radius: 50%;
      transition: background 0.3s;
    }

    .notification:hover {
      background: #f5f5f5;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--danger);
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notifications-panel {
      position: fixed;
      top: 70px;
      right: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.1);
      z-index: 1000;
      width: min(360px, calc(100vw - 40px));
      max-height: 420px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .notifications-header,
    .notifications-footer {
      padding: 18px 20px;
      border-bottom: 1px solid #eee;
      background: #fafafa;
    }

    .notifications-footer {
      border-top: 1px solid #eee;
      border-bottom: none;
      text-align: center;
    }

    .notifications-header h3 {
      margin: 0;
      color: var(--primary);
      font-size: 1rem;
    }

    .notifications-list {
      padding: 15px;
      overflow-y: auto;
      flex: 1 1 auto;
    }

    .notification-item {
      padding: 14px 0;
      border-bottom: 1px solid #eee;
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }

    .notification-body {
      font-size: 0.92rem;
      color: #666;
      margin-bottom: 6px;
    }

    .notification-time {
      font-size: 0.8rem;
      color: #999;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 8px 15px;
      border-radius: 30px;
      transition: background 0.3s;
    }

    .user-profile:hover {
      background: #f5f5f5;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
    }

    .user-info h4 {
      font-weight: 600;
      color: #333;
    }

    .user-info p {
      font-size: 0.85rem;
      color: #666;
    }

    .user-menu-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .user-menu-item {
      width: 100%;
      background: transparent;
      border: none;
      text-align: left;
      color: #333;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
      font-size: 0.95rem;
    }

    .user-menu-item:hover {
      background: #f5f5f5;
      color: #111;
    }

    .user-menu-icon {
      width: 20px;
      min-width: 20px;
      text-align: center;
      color: inherit;
    }

    .user-menu-divider {
      border-top: 1px solid #eee;
      margin: 8px 0;
    }

    .logout-item {
      color: #d32f2f;
    }

    .logout-item:hover {
      background: #ffebee;
    }

    .user-menu-dropdown {
      position: fixed;
      top: 70px;
      right: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 220px;
      overflow: hidden;
    }

    .user-menu-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
      background: #fafafa;
    }

    .user-menu-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .user-menu-email {
      font-size: 0.9rem;
      color: #666;
    }

    /* Content Area */
    .content-area {
      padding: 30px;
    }

    /* Buttons */
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.85rem;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--secondary);
      transform: translateY(-2px);
    }

    .btn-success {
      background: var(--success);
      color: white;
    }

    .btn-warning {
      background: var(--warning);
      color: white;
    }

    .btn-danger {
      background: var(--danger);
      color: white;
    }

    .btn-info {
      background: var(--info);
      color: white;
    }

    .btn-outline {
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-outline:hover {
      background: var(--primary);
      color: white;
    }

    /* Forms */
    .form-control {
      width: 100%;
      padding: 14px 18px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .form-control:focus {
      border-color: var(--accent);
      outline: none;
      box-shadow: 0 0 0 3px rgba(57, 73, 171, 0.1);
    }

    .filter-dropdown {
      min-width: 180px;
      max-width: 240px;
    }

    /* Toggle Sidebar Button */
    .toggle-sidebar {
      display: none;
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: var(--primary);
      color: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.active {
        transform: translateX(0);
      }
      .main-content {
        margin-left: 0;
      }
      .toggle-sidebar {
        display: flex;
      }
    }

    @media (max-width: 768px) {
      .content-area {
        padding: 15px;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  sidebarActive = false;
  showUserMenuDropdown = false;
  showNotifications = false;
  selectedDomain = 'general';
  pageTitle = 'Finance Dashboard';
  domainBadge = 'General Business';
  notificationCount = 5;
  userInitials = 'A';
  userProfile: any = null;

  notifications = [
    { title: 'Invoice Due', message: 'Invoice #1234 is due in 3 days', time: '2 hours ago' },
    { title: 'Payment Received', message: 'Payment of $5,000 received', time: '4 hours ago' },
    { title: 'Budget Alert', message: 'Marketing budget 80% utilized', time: '1 day ago' },
    { title: 'New User', message: 'John Doe joined the system', time: '2 days ago' },
    { title: 'System Update', message: 'Database backup completed', time: '3 days ago' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    effect(() => {
      const user = this.authService.currentUser();
      this.userProfile = user;
      this.userInitials = (user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '') || 'A';
    });
  }

  ngOnInit() {
    // Update page title based on current route
    this.updatePageTitle();
    this.router.events.subscribe(() => {
      this.updatePageTitle();
    });
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  closeSidebarOnMobile() {
    if (typeof window !== 'undefined' && window.innerWidth <= 1200) {
      this.sidebarActive = false;
    }
  }

  showUserMenu() {
    this.showUserMenuDropdown = !this.showUserMenuDropdown;
    this.showNotifications = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenuDropdown = false;
  }

  changeDomain(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedDomain = target.value;
    this.updateDomainBadge();
  }

  updateDomainBadge() {
    const domains = {
      'general': 'General Business',
      'manufacturing': 'Manufacturing',
      'retail': 'Retail',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'nonprofit': 'Non-Profit'
    };
    this.domainBadge = domains[this.selectedDomain as keyof typeof domains] || 'General Business';
  }

  updatePageTitle() {
    const url = this.router.url;
    const titles: { [key: string]: string } = {
      '/dashboard': 'Finance Dashboard',
      '/coa': 'Chart of Accounts',
      '/gl': 'General Ledger',
      '/ap': 'Accounts Payable',
      '/ar': 'Accounts Receivable',
      '/assets': 'Fixed Assets',
      '/bank': 'Bank & Reconciliation',
      '/budget': 'Budgeting',
      '/reports': 'Financial Reports',
      '/users': 'User Management',
      '/profile': 'My Profile',
      '/setup': 'Module Setup',
      '/settings': 'System Settings',
      '/change-password': 'Change Password',
      '/comparison': 'Domain Comparison'
    };

    this.pageTitle = titles[url] || 'Finance Dashboard';
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
    this.showUserMenuDropdown = false;
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
    this.showUserMenuDropdown = false;
  }

  navigateToChangePassword() {
    this.router.navigate(['/change-password']);
    this.showUserMenuDropdown = false;
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notificationCount = 0;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
}