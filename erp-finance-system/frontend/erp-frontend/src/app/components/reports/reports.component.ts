import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-chart-bar"></i>
          Financial Reports
        </div>
        <div class="section-actions">
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> Custom Report
          </button>
          <button class="btn btn-info">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <div class="report-icon">
            <i class="fas fa-balance-scale"></i>
          </div>
          <div class="report-content">
            <h3>Balance Sheet</h3>
            <p>Assets, liabilities, and equity statement</p>
            <button class="btn btn-outline">Generate</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="report-content">
            <h3>Income Statement</h3>
            <p>Revenue, expenses, and profit/loss</p>
            <button class="btn btn-outline">Generate</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <i class="fas fa-cash-register"></i>
          </div>
          <div class="report-content">
            <h3>Cash Flow Statement</h3>
            <p>Operating, investing, and financing activities</p>
            <button class="btn btn-outline">Generate</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="report-content">
            <h3>Trial Balance</h3>
            <p>Account balances and verification</p>
            <button class="btn btn-outline">Generate</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="report-content">
            <h3>AR Aging Report</h3>
            <p>Accounts receivable by age</p>
            <button class="btn btn-outline">Generate</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="report-content">
            <h3>AP Aging Report</h3>
            <p>Accounts payable by age</p>
            <button class="btn btn-outline">Generate</button>
          </div>
        </div>
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

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
    }

    .report-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.3s;
      border: 1px solid #eee;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .report-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .report-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .report-content {
      flex: 1;
    }

    .report-content h3 {
      margin: 0 0 10px 0;
      color: var(--dark);
      font-size: 1.2rem;
    }

    .report-content p {
      margin: 0 0 15px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
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

    .btn-outline {
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-outline:hover {
      background: var(--primary);
      color: white;
    }
  `]
})
export class ReportsComponent {}