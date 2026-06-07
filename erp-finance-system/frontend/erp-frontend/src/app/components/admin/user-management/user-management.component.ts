import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid mt-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>User Management</h2>
              <p class="text-muted mb-0">Manage system users and their permissions</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary">
                <i class="fas fa-plus me-2"></i>Add New User
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
                  <label for="search" class="form-label">Search</label>
                  <input type="text" class="form-control" id="search" placeholder="Search by name or email">
                </div>
                <div class="col-md-2">
                  <label for="role" class="form-label">Role</label>
                  <select class="form-select" id="role">
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                    <option value="ACCOUNTANT">Accountant</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label for="status" class="form-label">Status</label>
                  <select class="form-select" id="status">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <button class="btn btn-outline-primary w-100">Filter</button>
                </div>
                <div class="col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <button class="btn btn-outline-secondary w-100">Clear</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">Users ({{ users.length }})</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users">
                      <td>{{ user.firstName }} {{ user.lastName }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span class="badge"
                              [class]="getRoleBadgeClass(user.role)">
                          {{ user.role }}
                        </span>
                      </td>
                      <td>
                        <span class="badge"
                              [class]="getStatusBadgeClass(user.status)">
                          {{ user.status | titlecase }}
                        </span>
                      </td>
                      <td>{{ user.lastLoginAt || 'Never' }}</td>
                      <td>{{ user.createdAt }}</td>
                      <td>
                        <div class="btn-group btn-group-sm" role="group">
                          <button class="btn btn-outline-primary" title="Edit User">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-outline-info" title="View Details">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button class="btn btn-outline-warning" title="Reset Password">
                            <i class="fas fa-key"></i>
                          </button>
                          <button class="btn"
                                  [class]="user.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'"
                                  [title]="user.status === 'active' ? 'Suspend User' : 'Activate User'">
                            <i class="fas" [class]="user.status === 'active' ? 'fa-ban' : 'fa-check'"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <nav aria-label="User pagination" class="mt-3">
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
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Admin',
      role: 'ADMIN',
      status: 'active',
      lastLoginAt: '2024-01-15 10:30:00',
      createdAt: '2024-01-01 09:00:00'
    },
    {
      id: '2',
      email: 'user@example.com',
      firstName: 'Jane',
      lastName: 'User',
      role: 'USER',
      status: 'active',
      lastLoginAt: '2024-01-14 15:45:00',
      createdAt: '2024-01-02 11:30:00'
    },
    {
      id: '3',
      email: 'accountant@example.com',
      firstName: 'Bob',
      lastName: 'Accountant',
      role: 'ACCOUNTANT',
      status: 'inactive',
      createdAt: '2024-01-03 14:20:00'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-danger';
      case 'ACCOUNTANT':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'inactive':
        return 'bg-warning';
      case 'suspended':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
