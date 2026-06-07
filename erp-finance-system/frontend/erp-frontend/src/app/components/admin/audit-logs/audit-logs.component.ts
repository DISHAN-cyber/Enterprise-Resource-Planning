import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid mt-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>Audit Logs</h2>
              <p class="text-muted mb-0">System activity and security event logs</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary">
                <i class="fas fa-download me-2"></i>Export Logs
              </button>
              <button class="btn btn-outline-secondary" routerLink="/admin">
                <i class="fas fa-arrow-left me-2"></i>Back to Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-3">
                  <label for="dateFrom" class="form-label">From Date</label>
                  <input type="date" class="form-control" id="dateFrom">
                </div>
                <div class="col-md-3">
                  <label for="dateTo" class="form-label">To Date</label>
                  <input type="date" class="form-control" id="dateTo">
                </div>
                <div class="col-md-2">
                  <label for="user" class="form-label">User</label>
                  <input type="text" class="form-control" id="user" placeholder="User email">
                </div>
                <div class="col-md-2">
                  <label for="action" class="form-label">Action</label>
                  <select class="form-select" id="action">
                    <option value="">All Actions</option>
                    <option value="LOGIN">Login</option>
                    <option value="LOGOUT">Logout</option>
                    <option value="CREATE">Create</option>
                    <option value="UPDATE">Update</option>
                    <option value="DELETE">Delete</option>
                    <option value="VIEW">View</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <div class="d-grid">
                    <button class="btn btn-outline-primary">Filter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">Audit Logs ({{ auditLogs.length }})</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Status</th>
                      <th>Severity</th>
                      <th>IP Address</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let log of auditLogs">
                      <td>{{ log.timestamp }}</td>
                      <td>{{ log.userEmail }}</td>
                      <td>
                        <span class="badge"
                              [class]="getActionBadgeClass(log.action)">
                          {{ log.action }}
                        </span>
                      </td>
                      <td>{{ log.resource }}</td>
                      <td>
                        <span class="badge"
                              [class]="getStatusBadgeClass(log.status)">
                          {{ log.status | titlecase }}
                        </span>
                      </td>
                      <td>
                        <span class="badge"
                              [class]="getSeverityBadgeClass(log.severity)">
                          {{ log.severity | titlecase }}
                        </span>
                      </td>
                      <td>{{ log.ipAddress }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-info"
                                (click)="showDetails(log)"
                                title="View Details">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <nav aria-label="Audit log pagination" class="mt-3">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1">Previous</a>
                  </li>
                  <li class="page-item active">
                    <a class="page-link" href="#">1</a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">2</a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">3</a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Modal (simplified) -->
      <div *ngIf="selectedLog" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Audit Log Details</h5>
              <button type="button" class="btn-close" (click)="closeDetails()"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Timestamp:</strong> {{ selectedLog.timestamp }}</p>
                  <p><strong>User:</strong> {{ selectedLog.userEmail }}</p>
                  <p><strong>Action:</strong> {{ selectedLog.action }}</p>
                  <p><strong>Resource:</strong> {{ selectedLog.resource }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Status:</strong> {{ selectedLog.status | titlecase }}</p>
                  <p><strong>Severity:</strong> {{ selectedLog.severity | titlecase }}</p>
                  <p><strong>IP Address:</strong> {{ selectedLog.ipAddress }}</p>
                  <p><strong>User Agent:</strong> {{ selectedLog.userAgent }}</p>
                </div>
              </div>
              <div *ngIf="selectedLog.details" class="mt-3">
                <strong>Details:</strong>
                <pre class="bg-light p-2 rounded">{{ selectedLog.details }}</pre>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeDetails()">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuditLogsComponent implements OnInit {
  auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-01-15 10:30:00',
      userId: '1',
      userEmail: 'admin@example.com',
      action: 'LOGIN',
      resource: 'Authentication',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'low',
      details: 'User logged in successfully from web application'
    },
    {
      id: '2',
      timestamp: '2024-01-15 10:25:00',
      userId: '2',
      userEmail: 'user@example.com',
      action: 'UPDATE',
      resource: 'User Profile',
      resourceId: '2',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'success',
      severity: 'low',
      details: 'User updated profile information'
    },
    {
      id: '3',
      timestamp: '2024-01-15 10:20:00',
      userId: '1',
      userEmail: 'admin@example.com',
      action: 'CREATE',
      resource: 'User',
      resourceId: '3',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'medium',
      details: 'Admin created new user account'
    },
    {
      id: '4',
      timestamp: '2024-01-15 10:15:00',
      userId: '3',
      userEmail: 'hacker@example.com',
      action: 'LOGIN',
      resource: 'Authentication',
      ipAddress: '10.0.0.1',
      userAgent: 'Unknown',
      status: 'failure',
      severity: 'high',
      details: 'Failed login attempt - invalid credentials'
    }
  ];

  selectedLog: AuditLog | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT':
        return 'bg-info';
      case 'CREATE':
        return 'bg-success';
      case 'UPDATE':
        return 'bg-warning';
      case 'DELETE':
        return 'bg-danger';
      case 'VIEW':
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'success':
        return 'bg-success';
      case 'failure':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  getSeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'low':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'high':
        return 'bg-danger';
      case 'critical':
        return 'bg-dark';
      default:
        return 'bg-secondary';
    }
  }

  showDetails(log: AuditLog): void {
    this.selectedLog = log;
  }

  closeDetails(): void {
    this.selectedLog = null;
  }
}
