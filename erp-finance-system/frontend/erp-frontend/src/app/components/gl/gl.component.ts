import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JournalEntry {
  id: number;
  date: string;
  description: string;
  reference: string;
  status: 'Draft' | 'Posted' | 'Voided';
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
}

interface JournalLine {
  id: number;
  accountId: number;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  balance: number;
}

@Component({
  selector: 'app-gl',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="module-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-book"></i>
          General Ledger
        </div>
        <div class="section-actions">
          <button class="btn btn-primary" (click)="showJournalModal()">
            <i class="fas fa-plus"></i> New Journal Entry
          </button>
          <button class="btn btn-success" (click)="postAllEntries()">
            <i class="fas fa-check-double"></i> Post All Entries
          </button>
          <button class="btn btn-info" (click)="runMonthEndClose()">
            <i class="fas fa-calendar-check"></i> Month-End Close
          </button>
        </div>
      </div>

      <!-- Metrics Cards -->
      <div class="cards-container">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-file-alt"></i>
              Total Entries
            </div>
          </div>
          <div class="card-value">{{ journalEntries.length }}</div>
          <div class="card-trend positive">
            <i class="fas fa-arrow-up"></i> This Month
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-clock"></i>
              Draft Entries
            </div>
          </div>
          <div class="card-value">{{ getEntriesByStatus('Draft').length }}</div>
          <div class="card-trend warning">
            <i class="fas fa-exclamation-triangle"></i> Pending
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-check"></i>
              Posted Entries
            </div>
          </div>
          <div class="card-value">{{ getEntriesByStatus('Posted').length }}</div>
          <div class="card-trend positive">
            <i class="fas fa-check-circle"></i> Completed
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-balance-scale"></i>
              Trial Balance
            </div>
          </div>
          <div class="card-value">{{ formatCurrency(getTrialBalanceTotal()) }}</div>
          <div class="card-trend" [class]="getTrialBalanceStatus() === 'balanced' ? 'positive' : 'negative'">
            <i class="fas" [class]="getTrialBalanceStatus() === 'balanced' ? 'fa-balance-scale' : 'fa-exclamation-triangle'"></i>
            {{ getTrialBalanceStatus() === 'balanced' ? 'Balanced' : 'Out of Balance' }}
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" class="form-control" placeholder="Search entries..." [(ngModel)]="searchTerm" (input)="searchJournals()">
        </div>
        <select class="form-control filter-dropdown" [(ngModel)]="filterStatus" (change)="filterJournals()">
          <option value="">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Posted">Posted</option>
          <option value="Voided">Voided</option>
        </select>
        <input type="date" class="form-control" [(ngModel)]="filterDateFrom" (change)="filterJournals()">
        <input type="date" class="form-control" [(ngModel)]="filterDateTo" (change)="filterJournals()">
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <div class="tab" [class.active]="activeTab === 'entries'" (click)="activeTab = 'entries'">Journal Entries</div>
        <div class="tab" [class.active]="activeTab === 'trial'" (click)="activeTab = 'trial'">Trial Balance</div>
        <div class="tab" [class.active]="activeTab === 'ledger'" (click)="activeTab = 'ledger'">Account Ledger</div>
      </div>

      <!-- Journal Entries Tab -->
      <div class="tab-content" [class.active]="activeTab === 'entries'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Status</th>
                <th>Total Debit</th>
                <th>Total Credit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let entry of filteredEntries">
                <td>{{ formatDate(entry.date) }}</td>
                <td>{{ entry.reference }}</td>
                <td>{{ entry.description }}</td>
                <td><span class="badge" [class]="getStatusBadgeClass(entry.status)">{{ entry.status }}</span></td>
                <td>{{ formatCurrency(entry.totalDebit) }}</td>
                <td>{{ formatCurrency(entry.totalCredit) }}</td>
                <td>
                  <button class="btn btn-sm btn-info" (click)="viewJournalEntry(entry.id)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-warning" *ngIf="entry.status === 'Draft'" (click)="postJournalEntry(entry.id)">
                    <i class="fas fa-check"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" *ngIf="entry.status === 'Draft'" (click)="deleteJournalEntry(entry.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Trial Balance Tab -->
      <div class="tab-content" [class.active]="activeTab === 'trial'">
        <div class="trial-balance-container">
          <div class="trial-balance-header">
            <h3>Trial Balance as of {{ formatDate(getCurrentDate()) }}</h3>
            <div class="trial-balance-summary">
              <div class="summary-item">
                <span class="label">Total Debits:</span>
                <span class="value">{{ formatCurrency(getTrialBalanceDebits()) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total Credits:</span>
                <span class="value">{{ formatCurrency(getTrialBalanceCredits()) }}</span>
              </div>
              <div class="summary-item" [class]="getTrialBalanceStatus() === 'balanced' ? 'balanced' : 'unbalanced'">
                <span class="label">Difference:</span>
                <span class="value">{{ formatCurrency(getTrialBalanceDifference()) }}</span>
              </div>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Debit Balance</th>
                  <th>Credit Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let account of trialBalanceAccounts">
                  <td>{{ account.code }}</td>
                  <td>{{ account.name }}</td>
                  <td>{{ account.debitBalance > 0 ? formatCurrency(account.debitBalance) : '-' }}</td>
                  <td>{{ account.creditBalance > 0 ? formatCurrency(account.creditBalance) : '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Account Ledger Tab -->
      <div class="tab-content" [class.active]="activeTab === 'ledger'">
        <div class="ledger-controls">
          <select class="form-control" [(ngModel)]="selectedAccountId" (change)="loadAccountLedger()">
            <option value="">Select Account</option>
            <option *ngFor="let account of accounts" [value]="account.id">{{ account.code }} - {{ account.name }}</option>
          </select>
        </div>
        <div class="table-container" *ngIf="selectedAccountId">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of ledgerTransactions">
                <td>{{ formatDate(transaction.date) }}</td>
                <td>{{ transaction.reference }}</td>
                <td>{{ transaction.description }}</td>
                <td>{{ transaction.debit > 0 ? formatCurrency(transaction.debit) : '-' }}</td>
                <td>{{ transaction.credit > 0 ? formatCurrency(transaction.credit) : '-' }}</td>
                <td>{{ formatCurrency(transaction.balance) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Journal Entry Modal -->
    <div class="modal" [class.active]="showJournalModalFlag">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingEntry ? 'Edit Journal Entry' : 'Create Journal Entry' }}</h3>
          <button class="close-btn" (click)="closeJournalModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form #journalForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date *</label>
                <input type="date" class="form-control" [(ngModel)]="journalFormData.date" name="date" required>
              </div>
              <div class="form-group">
                <label class="form-label">Reference</label>
                <input type="text" class="form-control" [(ngModel)]="journalFormData.reference" name="reference" placeholder="JE-001">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Description *</label>
              <input type="text" class="form-control" [(ngModel)]="journalFormData.description" name="description" required>
            </div>

            <!-- Journal Lines -->
            <div class="journal-lines">
              <div class="lines-header">
                <h4>Journal Lines</h4>
                <button class="btn btn-sm btn-primary" (click)="addJournalLine()">
                  <i class="fas fa-plus"></i> Add Line
                </button>
              </div>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Description</th>
                      <th>Debit</th>
                      <th>Credit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let line of journalFormData.lines; let i = index">
                      <td>
                        <select class="form-control" [(ngModel)]="line.accountId" [name]="'account' + i" (change)="updateAccountInfo(line, i)" required>
                          <option value="">Select Account</option>
                          <option *ngFor="let account of accounts" [value]="account.id">{{ account.code }} - {{ account.name }}</option>
                        </select>
                      </td>
                      <td>
                        <input type="text" class="form-control" [(ngModel)]="line.description" [name]="'desc' + i">
                      </td>
                      <td>
                        <input type="number" class="form-control" [(ngModel)]="line.debit" [name]="'debit' + i" (input)="updateDebitCredit()" step="0.01" min="0">
                      </td>
                      <td>
                        <input type="number" class="form-control" [(ngModel)]="line.credit" [name]="'credit' + i" (input)="updateDebitCredit()" step="0.01" min="0">
                      </td>
                      <td>
                        <button class="btn btn-sm btn-danger" (click)="removeJournalLine(i)">
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" class="text-right"><strong>Totals:</strong></td>
                      <td><strong>{{ formatCurrency(totalDebit) }}</strong></td>
                      <td><strong>{{ formatCurrency(totalCredit) }}</strong></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeJournalModal()">Cancel</button>
          <button class="btn btn-primary" (click)="saveJournalEntry()" [disabled]="!isJournalBalanced()">
            {{ editingEntry ? 'Update Entry' : 'Save Entry' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Journal Entry Modal -->
    <div class="modal" [class.active]="showViewModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Journal Entry Details</h3>
          <button class="close-btn" (click)="closeViewModal()">&times;</button>
        </div>
        <div class="modal-body" *ngIf="viewingEntry">
          <div class="entry-details">
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">{{ formatDate(viewingEntry.date) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Reference:</span>
              <span class="value">{{ viewingEntry.reference }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Description:</span>
              <span class="value">{{ viewingEntry.description }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value"><span class="badge" [class]="getStatusBadgeClass(viewingEntry.status)">{{ viewingEntry.status }}</span></span>
            </div>
          </div>

          <div class="journal-lines-view">
            <h4>Journal Lines</h4>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Account Code</th>
                    <th>Account Name</th>
                    <th>Description</th>
                    <th>Debit</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let line of viewingEntry.lines">
                    <td>{{ line.accountCode }}</td>
                    <td>{{ line.accountName }}</td>
                    <td>{{ line.description }}</td>
                    <td>{{ line.debit > 0 ? formatCurrency(line.debit) : '-' }}</td>
                    <td>{{ line.credit > 0 ? formatCurrency(line.credit) : '-' }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="text-align: right; font-weight: 600;">Total Debit:</td>
                    <td style="font-weight: 600;">{{ formatCurrency(viewingEntry.totalDebit) }}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align: right; font-weight: 600;">Total Credit:</td>
                    <td></td>
                    <td style="font-weight: 600;">{{ formatCurrency(viewingEntry.totalCredit) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeViewModal()">Close</button>
          <button class="btn btn-warning" *ngIf="viewingEntry?.status === 'Draft'" (click)="editJournalEntry(viewingEntry!.id)">
            <i class="fas fa-edit"></i> Edit
          </button>
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

    .card-trend {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      gap: 5px;
    }

    .card-trend.positive {
      color: var(--success);
    }

    .card-trend.warning {
      color: var(--warning);
    }

    .search-filter {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-box i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .search-box input {
      padding-left: 45px;
    }

    .filter-dropdown {
      width: 200px;
    }

    .tabs {
      display: flex;
      border-bottom: 2px solid #eee;
      margin-bottom: 25px;
      overflow-x: auto;
    }

    .tab {
      padding: 15px 25px;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      white-space: nowrap;
      transition: all 0.3s;
    }

    .tab:hover {
      color: var(--primary);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
      background: rgba(57, 73, 171, 0.05);
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
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

    .badge-warning {
      background: #fff3e0;
      color: var(--warning);
    }

    .badge-danger {
      background: #ffebee;
      color: var(--danger);
    }

    .trial-balance-container {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 25px;
    }

    .trial-balance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .trial-balance-header h3 {
      color: var(--primary);
      margin: 0;
    }

    .trial-balance-summary {
      display: flex;
      gap: 30px;
    }

    .summary-item {
      text-align: right;
    }

    .summary-item.balanced {
      color: var(--success);
    }

    .summary-item.unbalanced {
      color: var(--danger);
    }

    .summary-item .label {
      display: block;
      font-size: 0.9rem;
      color: #666;
    }

    .summary-item .value {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .ledger-controls {
      margin-bottom: 25px;
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 2000;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(3px);
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: white;
      border-radius: 15px;
      width: 90%;
      max-width: 1000px;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalSlideIn 0.3s ease;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      padding: 25px 30px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(to right, #f8f9fa, white);
    }

    .modal-body {
      padding: 30px;
    }

    .modal-footer {
      padding: 20px 30px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      background: #f9f9f9;
      border-radius: 0 0 15px 15px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.8rem;
      cursor: pointer;
      color: #999;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.3s;
    }

    .close-btn:hover {
      background: #f5f5f5;
      color: #333;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
    }

    .form-row .form-group {
      flex: 1;
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      margin-bottom: 10px;
      font-weight: 500;
      color: #555;
    }

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

    .journal-lines {
      margin-top: 25px;
    }

    .lines-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .lines-header h4 {
      color: var(--primary);
      margin: 0;
    }

    .entry-details {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .detail-row .label {
      font-weight: 600;
      color: #555;
    }

    .detail-row .value {
      color: #333;
    }

    .journal-lines-view h4 {
      color: var(--primary);
      margin-bottom: 15px;
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

    .btn-danger {
      background: var(--danger);
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

    .btn-success {
      background: var(--success);
      color: white;
    }

    .text-right {
      text-align: right;
    }
  `]
})
export class GlComponent implements OnInit {
  journalEntries: JournalEntry[] = [];
  filteredEntries: JournalEntry[] = [];
  accounts: Account[] = [];
  trialBalanceAccounts: any[] = [];
  ledgerTransactions: any[] = [];

  activeTab = 'entries';
  searchTerm = '';
  filterStatus = '';
  filterDateFrom = '';
  filterDateTo = '';
  selectedAccountId = '';

  showJournalModalFlag = false;
  showViewModal = false;
  editingEntry: JournalEntry | null = null;
  viewingEntry: JournalEntry | null = null;

  journalFormData = {
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    lines: [] as JournalLine[]
  };

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  hasLocalStorage(): boolean {
    return this.isBrowser() && typeof window.localStorage !== 'undefined';
  }

  ngOnInit() {
    this.loadAccounts();
    this.loadJournalEntries();
  }

  loadAccounts() {
    const saved = this.hasLocalStorage() ? localStorage.getItem('erpCOA') : null;
    if (saved) {
      this.accounts = JSON.parse(saved).filter((acc: any) => acc.active);
    }
  }

  loadJournalEntries() {
    const saved = this.hasLocalStorage() ? localStorage.getItem('erpJournalEntries') : null;
    if (saved) {
      this.journalEntries = JSON.parse(saved);
    }
    this.filteredEntries = [...this.journalEntries];
  }

  saveJournalEntries() {
    if (this.hasLocalStorage()) {
      localStorage.setItem('erpJournalEntries', JSON.stringify(this.journalEntries));
    }
  }

  searchJournals() {
    this.filterEntries();
  }

  filterJournals() {
    this.filterEntries();
  }

  filterEntries() {
    this.filteredEntries = this.journalEntries.filter(entry => {
      const matchesSearch = !this.searchTerm ||
        entry.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.reference.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.filterStatus || entry.status === this.filterStatus;

      const matchesDateFrom = !this.filterDateFrom || entry.date >= this.filterDateFrom;
      const matchesDateTo = !this.filterDateTo || entry.date <= this.filterDateTo;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }

  getEntriesByStatus(status: string): JournalEntry[] {
    return this.journalEntries.filter(entry => entry.status === status);
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'Draft': 'warning',
      'Posted': 'success',
      'Voided': 'danger'
    };
    return `badge-${classes[status as keyof typeof classes] || 'secondary'}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  showJournalModal() {
    this.editingEntry = null;
    this.journalFormData = {
      date: new Date().toISOString().split('T')[0],
      reference: this.generateReference(),
      description: '',
      lines: [this.createEmptyLine()]
    };
    this.showJournalModalFlag = true;
  }

  closeJournalModal() {
    this.showJournalModalFlag = false;
    this.editingEntry = null;
  }

  generateReference(): string {
    const count = this.journalEntries.length + 1;
    return `JE-${count.toString().padStart(3, '0')}`;
  }

  get totalDebit(): number {
    return this.journalFormData.lines.reduce((sum, line) => sum + line.debit, 0);
  }

  get totalCredit(): number {
    return this.journalFormData.lines.reduce((sum, line) => sum + line.credit, 0);
  }

  createEmptyLine(): JournalLine {
    return {
      id: Date.now(),
      accountId: 0,
      accountCode: '',
      accountName: '',
      debit: 0,
      credit: 0,
      description: ''
    };
  }

  addJournalLine() {
    this.journalFormData.lines.push(this.createEmptyLine());
  }

  removeJournalLine(index: number) {
    if (this.journalFormData.lines.length > 1) {
      this.journalFormData.lines.splice(index, 1);
      this.updateDebitCredit();
    }
  }

  updateAccountInfo(line: JournalLine, index: number) {
    const account = this.accounts.find(acc => acc.id === line.accountId);
    if (account) {
      line.accountCode = account.code;
      line.accountName = account.name;
    }
  }

  updateDebitCredit() {
    this.journalFormData.lines.forEach(line => {
      if (line.debit > 0) line.credit = 0;
      if (line.credit > 0) line.debit = 0;
    });
  }

  isJournalBalanced(): boolean {
    const totalDebit = this.journalFormData.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = this.journalFormData.lines.reduce((sum, line) => sum + line.credit, 0);
    return Math.abs(totalDebit - totalCredit) < 0.01;
  }

  saveJournalEntry() {
    if (!this.isJournalBalanced()) {
      alert('Journal entry is not balanced. Total debits must equal total credits.');
      return;
    }

    const totalDebit = this.journalFormData.lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = this.journalFormData.lines.reduce((sum, line) => sum + line.credit, 0);

    const entry: JournalEntry = {
      id: this.editingEntry ? this.editingEntry.id : Date.now(),
      date: this.journalFormData.date,
      description: this.journalFormData.description,
      reference: this.journalFormData.reference,
      status: 'Draft',
      lines: [...this.journalFormData.lines],
      totalDebit,
      totalCredit
    };

    if (this.editingEntry) {
      const index = this.journalEntries.findIndex(e => e.id === this.editingEntry!.id);
      if (index !== -1) {
        this.journalEntries[index] = entry;
      }
    } else {
      this.journalEntries.push(entry);
    }

    this.saveJournalEntries();
    this.loadJournalEntries();
    this.closeJournalModal();
  }

  viewJournalEntry(entryId: number) {
    this.viewingEntry = this.journalEntries.find(entry => entry.id === entryId) || null;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewingEntry = null;
  }

  editJournalEntry(entryId: number) {
    const entry = this.journalEntries.find(e => e.id === entryId);
    if (entry && entry.status === 'Draft') {
      this.editingEntry = entry;
      this.journalFormData = {
        date: entry.date,
        reference: entry.reference,
        description: entry.description,
        lines: [...entry.lines]
      };
      this.showJournalModalFlag = true;
      this.closeViewModal();
    }
  }

  postJournalEntry(entryId: number) {
    const entry = this.journalEntries.find(e => e.id === entryId);
    if (entry && entry.status === 'Draft') {
      entry.status = 'Posted';
      // Update account balances
      entry.lines.forEach(line => {
        const account = this.accounts.find(acc => acc.id === line.accountId);
        if (account) {
          if (line.debit > 0) {
            account.balance += line.debit;
          } else if (line.credit > 0) {
            account.balance -= line.credit;
          }
        }
      });
      if (this.hasLocalStorage()) {
        localStorage.setItem('erpCOA', JSON.stringify(this.accounts));
      }
      this.saveJournalEntries();
      this.loadJournalEntries();
    }
  }

  deleteJournalEntry(entryId: number) {
    const index = this.journalEntries.findIndex(e => e.id === entryId);
    if (index !== -1 && this.journalEntries[index].status === 'Draft') {
      this.journalEntries.splice(index, 1);
      this.saveJournalEntries();
      this.loadJournalEntries();
    }
  }

  postAllEntries() {
    const draftEntries = this.journalEntries.filter(entry => entry.status === 'Draft');
    draftEntries.forEach(entry => this.postJournalEntry(entry.id));
  }

  runMonthEndClose() {
    // Simple month-end close - mark all entries as posted
    this.postAllEntries();
    alert('Month-end close completed. All draft entries have been posted.');
  }

  getTrialBalanceTotal(): number {
    return Math.abs(this.getTrialBalanceDebits() - this.getTrialBalanceCredits());
  }

  getTrialBalanceDebits(): number {
    return this.accounts.reduce((sum, acc) => sum + Math.max(acc.balance, 0), 0);
  }

  getTrialBalanceCredits(): number {
    return Math.abs(this.accounts.reduce((sum, acc) => sum + Math.min(acc.balance, 0), 0));
  }

  getTrialBalanceDifference(): number {
    return this.getTrialBalanceDebits() - this.getTrialBalanceCredits();
  }

  getTrialBalanceStatus(): string {
    return Math.abs(this.getTrialBalanceDifference()) < 0.01 ? 'balanced' : 'unbalanced';
  }

  loadAccountLedger() {
    if (!this.selectedAccountId) return;

    const accountId = parseInt(this.selectedAccountId);
    const account = this.accounts.find(acc => acc.id === accountId);
    if (!account) return;

    // Get all posted journal entries for this account
    const transactions: any[] = [];
    let balance = 0;

    this.journalEntries
      .filter(entry => entry.status === 'Posted')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(entry => {
        entry.lines
          .filter(line => line.accountId === accountId)
          .forEach(line => {
            balance += line.debit - line.credit;
            transactions.push({
              date: entry.date,
              reference: entry.reference,
              description: line.description || entry.description,
              debit: line.debit,
              credit: line.credit,
              balance: balance
            });
          });
      });

    this.ledgerTransactions = transactions;
  }
}