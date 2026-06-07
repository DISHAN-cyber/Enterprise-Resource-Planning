import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid mt-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>Admin Dashboard</h2>
              <p class="text-muted mb-0">System administration and management</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary" routerLink="/dashboard">
                <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
              </button>
              <button class="btn btn-outline-danger" (click)="logout()">
                <i class="fas fa-sign-out-alt me-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Stats Cards -->
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">1,234</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Active Sessions
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">89</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-user-check fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                    System Health
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">98%</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-heartbeat fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Security Alerts
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">3</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Actions Grid -->
      <div class="row">
        <div class="col-xl-6 col-lg-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">User Management</h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" routerLink="/admin/users">
                  <i class="fas fa-users me-2"></i>Manage Users
                </button>
                <button class="btn btn-outline-secondary">
                  <i class="fas fa-user-plus me-2"></i>Add New User
                </button>
                <button class="btn btn-outline-info">
                  <i class="fas fa-user-shield me-2"></i>Role Management
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-6 col-lg-6 mb-4">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">System Administration</h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-success" routerLink="/admin/audit-logs">
                  <i class="fas fa-history me-2"></i>View Audit Logs
                </button>
                <button class="btn btn-outline-warning">
                  <i class="fas fa-cogs me-2"></i>System Settings
                </button>
                <button class="btn btn-outline-danger">
                  <i class="fas fa-database me-2"></i>Database Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent System Activity -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Recent System Activity</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-15 10:30:00</td>
                      <td>admin@example.com</td>
                      <td>User Login</td>
                      <td>Authentication</td>
                      <td><span class="badge bg-success">Success</span></td>
                    </tr>
                    <tr>
                      <td>2024-01-15 10:25:00</td>
                      <td>user@example.com</td>
                      <td>Password Change</td>
                      <td>User Profile</td>
                      <td><span class="badge bg-success">Success</span></td>
                    </tr>
                    <tr>
                      <td>2024-01-15 10:20:00</td>
                      <td>admin@example.com</td>
                      <td>User Created</td>
                      <td>User Management</td>
                      <td><span class="badge bg-success">Success</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .border-left-primary {
      border-left: 0.25rem solid #4e73df !important;
    }
    .border-left-success {
      border-left: 0.25rem solid #1cc88a !important;
    }
    .border-left-info {
      border-left: 0.25rem solid #36b9cc !important;
    }
    .border-left-warning {
      border-left: 0.25rem solid #f6c23e !important;
    }
    .text-primary {
      color: #5a5c69 !important;
    }
    .text-gray-800 {
      color: #5a5c69 !important;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  userProfile: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
