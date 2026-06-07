import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-users"></i>
          User Management
        </div>
        <div class="section-actions">
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> Add User
          </button>
          <button class="btn btn-info">
            <i class="fas fa-user-shield"></i> Roles & Permissions
          </button>
        </div>
      </div>

      <div class="cards-container">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-user"></i>
              Total Users
            </div>
          </div>
          <div class="card-value">25</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-user-check"></i>
              Active Users
            </div>
          </div>
          <div class="card-value">22</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-user-shield"></i>
              Admin Users
            </div>
          </div>
          <div class="card-value">3</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john.doe@company.com</td>
              <td>Administrator</td>
              <td><span class="badge badge-success">Active</span></td>
              <td>2024-01-15 09:30</td>
              <td>
                <button class="btn btn-sm btn-info">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane.smith@company.com</td>
              <td>Accountant</td>
              <td><span class="badge badge-success">Active</span></td>
              <td>2024-01-14 14:20</td>
              <td>
                <button class="btn btn-sm btn-info">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .module-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }

    .section-title {
      font-size: 1.5rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .section-actions {
      display: flex;
      gap: 10px;
    }

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s;
      border: 1px solid #eee;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .card-title {
      font-weight: 600;
      color: var(--dark);
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
      margin: 15px 0;
    }

    .table-container {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #eee;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #f8f9fa;
      padding: 18px 20px;
      text-align: left;
      font-weight: 600;
      color: var(--dark);
      border-bottom: 2px solid #e0e0e0;
      white-space: nowrap;
    }

    td {
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
      vertical-align: middle;
    }

    tr:hover {
      background: #f9f9f9;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge-success {
      background: #e8f5e9;
      color: var(--success);
    }

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

    .btn-info {
      background: var(--info);
      color: white;
    }

    .btn-warning {
      background: var(--warning);
      color: white;
    }
  `]
})
export class UsersComponent {}