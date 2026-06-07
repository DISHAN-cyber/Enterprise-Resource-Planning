import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-cogs"></i>
          System Setup
        </div>
      </div>

      <div class="setup-grid">
        <div class="setup-card">
          <div class="setup-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="setup-content">
            <h3>Company Information</h3>
            <p>Configure company details and settings</p>
            <button class="btn btn-outline">Configure</button>
          </div>
        </div>

        <div class="setup-card">
          <div class="setup-icon">
            <i class="fas fa-calendar"></i>
          </div>
          <div class="setup-content">
            <h3>Fiscal Year Setup</h3>
            <p>Set fiscal year and accounting periods</p>
            <button class="btn btn-outline">Configure</button>
          </div>
        </div>

        <div class="setup-card">
          <div class="setup-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="setup-content">
            <h3>Currency Settings</h3>
            <p>Configure currencies and exchange rates</p>
            <button class="btn btn-outline">Configure</button>
          </div>
        </div>

        <div class="setup-card">
          <div class="setup-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="setup-content">
            <h3>Security Settings</h3>
            <p>Configure security and access controls</p>
            <button class="btn btn-outline">Configure</button>
          </div>
        </div>

        <div class="setup-card">
          <div class="setup-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="setup-content">
            <h3>Data Backup</h3>
            <p>Configure backup and recovery settings</p>
            <button class="btn btn-outline">Configure</button>
          </div>
        </div>

        <div class="setup-card">
          <div class="setup-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="setup-content">
            <h3>Email Settings</h3>
            <p>Configure email notifications and templates</p>
            <button class="btn btn-outline">Configure</button>
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

    .setup-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
    }

    .setup-card {
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

    .setup-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .setup-icon {
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

    .setup-content {
      flex: 1;
    }

    .setup-content h3 {
      margin: 0 0 10px 0;
      color: var(--dark);
      font-size: 1.2rem;
    }

    .setup-content p {
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
export class SetupComponent {}