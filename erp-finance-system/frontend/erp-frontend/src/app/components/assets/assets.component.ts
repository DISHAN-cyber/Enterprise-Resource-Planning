import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-building"></i>
          Fixed Assets
        </div>
        <div class="section-actions">
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Asset
          </button>
          <button class="btn btn-info">
            <i class="fas fa-calculator"></i> Depreciation
          </button>
        </div>
      </div>

      <div class="cards-container">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-dollar-sign"></i>
              Total Assets Value
            </div>
          </div>
          <div class="card-value">$1,250,000</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-chart-line"></i>
              Accumulated Depreciation
            </div>
          </div>
          <div class="card-value">$350,000</div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-list"></i>
              Active Assets
            </div>
          </div>
          <div class="card-value">45</div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Asset Code</th>
              <th>Description</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Accumulated Dep.</th>
              <th>Net Book Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AST-001</td>
              <td>Office Building</td>
              <td>Real Estate</td>
              <td>$500,000</td>
              <td>$50,000</td>
              <td>$450,000</td>
              <td><span class="badge badge-success">Active</span></td>
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
              <td>AST-002</td>
              <td>Company Vehicles</td>
              <td>Transportation</td>
              <td>$150,000</td>
              <td>$30,000</td>
              <td>$120,000</td>
              <td><span class="badge badge-success">Active</span></td>
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
export class AssetsComponent {}