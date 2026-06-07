import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Industry {
  title: string;
  tagline: string;
  revenue: string;
  keyAccounts: string;
  focus: string;
  icon: string;
}

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="module-section comparison-page">
      <div class="section-header">
        <div>
          <h2 class="section-title"><i class="fas fa-columns"></i> Domain Comparison</h2>
          <p class="section-description">Compare common ERP finance workflows across industries and choose the best model for your organization.</p>
        </div>

        <div class="industry-actions">
          <button class="btn" [class.btn-primary]="selectedIndustry === 'hotel'" [class.btn-outline]="selectedIndustry !== 'hotel'" (click)="selectIndustry('hotel')">Hotel</button>
          <button class="btn" [class.btn-primary]="selectedIndustry === 'education'" [class.btn-outline]="selectedIndustry !== 'education'" (click)="selectIndustry('education')">Education</button>
          <button class="btn" [class.btn-primary]="selectedIndustry === 'banking'" [class.btn-outline]="selectedIndustry !== 'banking'" (click)="selectIndustry('banking')">Banking</button>
          <button class="btn" [class.btn-primary]="selectedIndustry === 'manufacturing'" [class.btn-outline]="selectedIndustry !== 'manufacturing'" (click)="selectIndustry('manufacturing')">Manufacturing</button>
        </div>
      </div>

      <div class="domain-comparison">
        <div class="domain-card" *ngFor="let industry of industries" [class.selected]="industry.title.toLowerCase().includes(selectedIndustry)">
          <h3><i class="{{ industry.icon }}"></i> {{ industry.title }}</h3>
          <p class="domain-tagline">{{ industry.tagline }}</p>
          <div class="detail-row">
            <span>Revenue Recognition</span>
            <strong>{{ industry.revenue }}</strong>
          </div>
          <div class="detail-row">
            <span>Key Accounts</span>
            <strong>{{ industry.keyAccounts }}</strong>
          </div>
          <div class="detail-row">
            <span>Accounts Payable Focus</span>
            <strong>{{ industry.focus }}</strong>
          </div>
          <button class="btn btn-primary btn-sm" (click)="applySettings(industry.title)">Apply model</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comparison-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .module-section {
      background: #ffffff;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
      border: 1px solid #e8edf4;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      flex-wrap: wrap;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }

    .section-description {
      margin: 12px 0 0;
      color: #4b5563;
      line-height: 1.7;
      max-width: 560px;
      font-size: 0.98rem;
    }

    .industry-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .btn {
      border: none;
      border-radius: 999px;
      font-weight: 700;
      padding: 12px 22px;
      min-width: 110px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.95rem;
    }

    .btn-outline {
      background: #ffffff;
      color: #1a237e;
      border: 1px solid #c5cee0;
      box-shadow: inset 0 0 0 0 rgba(26, 35, 126, 0.08);
    }

    .btn-primary {
      background: #1a237e;
      color: #ffffff;
      box-shadow: 0 12px 24px rgba(26, 35, 126, 0.16);
    }

    .btn:hover {
      opacity: 0.94;
      transform: translateY(-1px);
    }

    .domain-comparison {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }

    .domain-card {
      background: #f8fbff;
      border-radius: 20px;
      padding: 26px;
      border: 1px solid #dfe7f4;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .domain-card.selected {
      background: #eef2ff;
      border-color: #1a237e;
      transform: translateY(-2px);
    }

    .domain-card h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #1a237e;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .domain-card h3 i {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: rgba(26, 35, 126, 0.12);
      color: #1a237e;
      font-size: 1rem;
    }

    .domain-tagline {
      margin: 0;
      color: #4b5563;
      line-height: 1.75;
      font-size: 0.95rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      color: #475569;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .detail-row strong {
      color: #111827;
      font-weight: 600;
      text-align: right;
      max-width: 65%;
    }

    .btn-sm {
      padding: 10px 18px;
      font-size: 0.9rem;
    }

    @media (max-width: 960px) {
      .section-header {
        flex-direction: column;
        align-items: stretch;
      }

      .industry-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 700px) {
      .domain-card {
        padding: 22px;
      }
    }
  `]
})
export class ComparisonComponent {
  selectedIndustry = 'hotel';

  industries: Industry[] = [
    {
      title: 'Hotel Industry',
      tagline: 'Optimize revenue recognition, multi-location billing, and supplier payments for hospitality operations.',
      revenue: 'Daily room revenue, event bookings',
      keyAccounts: 'Rooms, F&B, Banquets',
      focus: 'Many small vendors (suppliers, services)',
      icon: 'fas fa-hotel'
    },
    {
      title: 'Education Sector',
      tagline: 'Manage tuition, grants, research funding, and fund accounting with education-specific controls.',
      revenue: 'Tuition fees, grants, research funds',
      keyAccounts: 'Fund accounting, grants, research',
      focus: 'Faculty payments, infrastructure',
      icon: 'fas fa-graduation-cap'
    },
    {
      title: 'Banking',
      tagline: 'Support interest income, fee structures, compliance, and interbank account reconciliation.',
      revenue: 'Interest income, fees, commissions',
      keyAccounts: 'Regulatory structure, provisions',
      focus: 'Few large vendors, interbank',
      icon: 'fas fa-university'
    },
    {
      title: 'Manufacturing',
      tagline: 'Track product sales, service contracts, cost centers, and supply chain vendor payments.',
      revenue: 'Product sales, service contracts',
      keyAccounts: 'Cost centers by product line',
      focus: 'Raw material suppliers, MRO',
      icon: 'fas fa-industry'
    }
  ];

  selectIndustry(industry: string) {
    this.selectedIndustry = industry;
  }

  applySettings(title: string) {
    alert(`${title} industry model applied.`);
  }
}
