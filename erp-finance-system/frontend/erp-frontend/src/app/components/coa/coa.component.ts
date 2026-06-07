import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  category: string;
  parentId?: number;
  balance: number;
  active: boolean;
  description?: string;
}

@Component({
  selector: 'app-coa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="module-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-list-alt"></i>
          Chart of Accounts
        </div>
        <div class="section-actions">
          <button class="btn btn-primary" (click)="showAddAccountModal()">
            <i class="fas fa-plus"></i> Add Account
          </button>
          <button class="btn btn-outline" (click)="exportCOA()">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="btn btn-info" (click)="loadSampleCOA()">
            <i class="fas fa-database"></i> Load Sample Data
          </button>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" class="form-control" placeholder="Search accounts..." [(ngModel)]="searchTerm" (input)="searchCOA()">
        </div>
        <select class="form-control filter-dropdown" [(ngModel)]="filterType" (change)="filterCOA()">
          <option value="">All Types</option>
          <option value="Asset">Asset</option>
          <option value="Liability">Liability</option>
          <option value="Equity">Equity</option>
          <option value="Revenue">Revenue</option>
          <option value="Expense">Expense</option>
        </select>
        <select class="form-control filter-dropdown" [(ngModel)]="filterStatus" (change)="filterCOA()">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <div class="tab" [class.active]="activeTab === 'table'" (click)="activeTab = 'table'">Table View</div>
        <div class="tab" [class.active]="activeTab === 'hierarchy'" (click)="activeTab = 'hierarchy'">Hierarchy View</div>
        <div class="tab" [class.active]="activeTab === 'balances'" (click)="activeTab = 'balances'">Account Balances</div>
      </div>

      <!-- Table View -->
      <div class="tab-content" [class.active]="activeTab === 'table'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Account Code</th>
                <th>Account Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let account of filteredAccounts">
                <td>{{ account.code }}</td>
                <td>{{ account.name }}</td>
                <td><span class="badge" [class]="'badge-' + getAccountTypeClass(account.type)">{{ account.type }}</span></td>
                <td>{{ account.category }}</td>
                <td>{{ formatCurrency(account.balance) }}</td>
                <td><span class="badge" [class]="account.active ? 'badge-success' : 'badge-danger'">{{ account.active ? 'Active' : 'Inactive' }}</span></td>
                <td>
                  <button class="btn btn-sm btn-info" (click)="editAccount(account.id)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm" [class]="account.active ? 'btn-warning' : 'btn-success'" (click)="toggleAccountStatus(account.id)">
                    <i class="fas" [class]="account.active ? 'fa-ban' : 'fa-check'"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hierarchy View -->
      <div class="tab-content" [class.active]="activeTab === 'hierarchy'">
        <div class="coa-hierarchy">
          <div *ngFor="let account of rootAccounts" class="hierarchy-item">
            <div class="account-header" (click)="toggleExpand(account.id)">
              <i class="fas" [class]="expandedAccounts.has(account.id) ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
              <span class="account-code">{{ account.code }}</span>
              <span class="account-name">{{ account.name }}</span>
              <span class="account-balance">{{ formatCurrency(account.balance) }}</span>
            </div>
            <div class="account-children" *ngIf="expandedAccounts.has(account.id)">
              <div *ngFor="let child of getChildAccounts(account.id)" class="hierarchy-item child">
                <div class="account-header">
                  <span class="account-code">{{ child.code }}</span>
                  <span class="account-name">{{ child.name }}</span>
                  <span class="account-balance">{{ formatCurrency(child.balance) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Balances View -->
      <div class="tab-content" [class.active]="activeTab === 'balances'">
        <div class="cards-container">
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-chart-pie"></i>
                Account Type Distribution
              </div>
            </div>
            <div class="card-value">{{ accounts.length }}</div>
            <div class="card-trend positive">
              <i class="fas fa-arrow-up"></i> Total Accounts
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-dollar-sign"></i>
                Total Assets
              </div>
            </div>
            <div class="card-value">{{ formatCurrency(getTotalByType('Asset')) }}</div>
            <div class="card-trend positive">
              <i class="fas fa-arrow-up"></i> Asset Balance
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-balance-scale"></i>
                Total Liabilities
              </div>
            </div>
            <div class="card-value">{{ formatCurrency(getTotalByType('Liability')) }}</div>
            <div class="card-trend negative">
              <i class="fas fa-arrow-down"></i> Liability Balance
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-chart-line"></i>
                Net Equity
              </div>
            </div>
            <div class="card-value">{{ formatCurrency(getTotalByType('Equity')) }}</div>
            <div class="card-trend positive">
              <i class="fas fa-arrow-up"></i> Equity Balance
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Account Modal -->
    <div class="modal" [class.active]="showAddModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingAccount ? 'Edit Account' : 'Add Account to Chart of Accounts' }}</h3>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form #accountForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Account Code *</label>
                <input type="text" class="form-control" [(ngModel)]="accountFormData.code" name="code" required>
              </div>
              <div class="form-group">
                <label class="form-label">Account Name *</label>
                <input type="text" class="form-control" [(ngModel)]="accountFormData.name" name="name" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Account Type *</label>
                <select class="form-control" [(ngModel)]="accountFormData.type" name="type" required>
                  <option value="">Select Type</option>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-control" [(ngModel)]="accountFormData.category" name="category">
                  <option value="">Select Category</option>
                  <option value="Current Assets">Current Assets</option>
                  <option value="Fixed Assets">Fixed Assets</option>
                  <option value="Current Liabilities">Current Liabilities</option>
                  <option value="Long-term Liabilities">Long-term Liabilities</option>
                  <option value="Owner's Equity">Owner's Equity</option>
                  <option value="Operating Revenue">Operating Revenue</option>
                  <option value="Operating Expenses">Operating Expenses</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Parent Account</label>
                <select class="form-control" [(ngModel)]="accountFormData.parentId" name="parentId">
                  <option value="">No Parent (Root Account)</option>
                  <option *ngFor="let account of accounts" [value]="account.id">{{ account.code }} - {{ account.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Initial Balance</label>
                <input type="number" class="form-control" [(ngModel)]="accountFormData.balance" name="balance" step="0.01">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea class="form-control" [(ngModel)]="accountFormData.description" name="description" rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="saveAccount()" [disabled]="!accountForm.valid">
            {{ editingAccount ? 'Update Account' : 'Save Account' }}
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

    .badge-danger {
      background: #ffebee;
      color: var(--danger);
    }

    .badge-primary {
      background: #e8eaf6;
      color: var(--primary);
    }

    .badge-info {
      background: #e3f2fd;
      color: var(--info);
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

    .card-trend.negative {
      color: var(--danger);
    }

    .coa-hierarchy {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }

    .hierarchy-item {
      margin-bottom: 10px;
    }

    .account-header {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 12px 15px;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .account-header:hover {
      background: #f0f0f0;
    }

    .account-code {
      font-weight: 600;
      color: var(--primary);
      min-width: 100px;
    }

    .account-name {
      flex: 1;
      font-weight: 500;
    }

    .account-balance {
      font-weight: 600;
      color: var(--success);
    }

    .account-children {
      margin-left: 30px;
      margin-top: 10px;
    }

    .hierarchy-item.child .account-header {
      background: #f8f9fa;
      border-left: 3px solid var(--primary);
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
      max-width: 800px;
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

    .btn-outline {
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-outline:hover {
      background: var(--primary);
      color: white;
    }

    .btn-warning {
      background: var(--warning);
      color: white;
    }

    .btn-success {
      background: var(--success);
      color: white;
    }
  `]
})
export class CoaComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  rootAccounts: Account[] = [];
  expandedAccounts = new Set<number>();

  activeTab = 'table';
  searchTerm = '';
  filterType = '';
  filterStatus = '';

  showAddModal = false;
  editingAccount: Account | null = null;

  accountFormData = {
    code: '',
    name: '',
    type: '',
    category: '',
    parentId: '',
    balance: 0,
    description: ''
  };

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  hasLocalStorage(): boolean {
    return this.isBrowser() && typeof window.localStorage !== 'undefined';
  }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    const saved = this.hasLocalStorage() ? localStorage.getItem('erpCOA') : null;
    if (saved) {
      this.accounts = JSON.parse(saved);
    }
    this.filteredAccounts = [...this.accounts];
    this.rootAccounts = this.accounts.filter(acc => !acc.parentId);
  }

  saveAccounts() {
    if (this.hasLocalStorage()) {
      localStorage.setItem('erpCOA', JSON.stringify(this.accounts));
    }
  }

  searchCOA() {
    this.filterAccounts();
  }

  filterCOA() {
    this.filterAccounts();
  }

  filterAccounts() {
    this.filteredAccounts = this.accounts.filter(account => {
      const matchesSearch = !this.searchTerm ||
        account.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        account.code.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.filterType || account.type === this.filterType;

      const matchesStatus = !this.filterStatus ||
        (this.filterStatus === 'active' && account.active) ||
        (this.filterStatus === 'inactive' && !account.active);

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  getAccountTypeClass(type: string): string {
    const classes = {
      'Asset': 'primary',
      'Liability': 'warning',
      'Equity': 'success',
      'Revenue': 'info',
      'Expense': 'danger'
    };
    return classes[type as keyof typeof classes] || 'secondary';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  showAddAccountModal() {
    this.editingAccount = null;
    this.accountFormData = {
      code: '',
      name: '',
      type: '',
      category: '',
      parentId: '',
      balance: 0,
      description: ''
    };
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.editingAccount = null;
  }

  saveAccount() {
    if (this.editingAccount) {
      // Update existing account
      const index = this.accounts.findIndex(acc => acc.id === this.editingAccount!.id);
      if (index !== -1) {
        this.accounts[index] = {
          ...this.editingAccount,
          ...this.accountFormData,
          parentId: this.accountFormData.parentId ? parseInt(this.accountFormData.parentId) : undefined
        };
      }
    } else {
      // Add new account
      const newAccount: Account = {
        id: Date.now(),
        code: this.accountFormData.code,
        name: this.accountFormData.name,
        type: this.accountFormData.type,
        category: this.accountFormData.category,
        parentId: this.accountFormData.parentId ? parseInt(this.accountFormData.parentId) : undefined,
        balance: this.accountFormData.balance,
        active: true,
        description: this.accountFormData.description
      };
      this.accounts.push(newAccount);
    }

    this.saveAccounts();
    this.loadAccounts();
    this.closeModal();
  }

  editAccount(accountId: number) {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (account) {
      this.editingAccount = account;
      this.accountFormData = {
        code: account.code,
        name: account.name,
        type: account.type,
        category: account.category,
        parentId: account.parentId?.toString() || '',
        balance: account.balance,
        description: account.description || ''
      };
      this.showAddModal = true;
    }
  }

  toggleAccountStatus(accountId: number) {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (account) {
      account.active = !account.active;
      this.saveAccounts();
      this.filterAccounts();
    }
  }

  toggleExpand(accountId: number) {
    if (this.expandedAccounts.has(accountId)) {
      this.expandedAccounts.delete(accountId);
    } else {
      this.expandedAccounts.add(accountId);
    }
  }

  getChildAccounts(parentId: number): Account[] {
    return this.accounts.filter(acc => acc.parentId === parentId);
  }

  getTotalByType(type: string): number {
    return this.accounts
      .filter(acc => acc.type === type && acc.active)
      .reduce((sum, acc) => sum + acc.balance, 0);
  }

  exportCOA() {
    if (!this.isBrowser()) {
      return;
    }

    const csvContent = [
      ['Account Code', 'Account Name', 'Type', 'Category', 'Balance', 'Status', 'Description'],
      ...this.accounts.map(acc => [
        acc.code,
        acc.name,
        acc.type,
        acc.category,
        acc.balance.toString(),
        acc.active ? 'Active' : 'Inactive',
        acc.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-of-accounts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  loadSampleCOA() {
    this.accounts = [
      { id: 1, code: '1000', name: 'Cash', type: 'Asset', category: 'Current Assets', balance: 50000, active: true, description: 'Cash in bank' },
      { id: 2, code: '1100', name: 'Accounts Receivable', type: 'Asset', category: 'Current Assets', balance: 25000, active: true },
      { id: 3, code: '1200', name: 'Inventory', type: 'Asset', category: 'Current Assets', balance: 30000, active: true },
      { id: 4, code: '1300', name: 'Prepaid Expenses', type: 'Asset', category: 'Current Assets', balance: 5000, active: true },
      { id: 5, code: '1400', name: 'Fixed Assets', type: 'Asset', category: 'Fixed Assets', balance: 150000, active: true },
      { id: 6, code: '2000', name: 'Accounts Payable', type: 'Liability', category: 'Current Liabilities', balance: -20000, active: true },
      { id: 7, code: '2100', name: 'Loans Payable', type: 'Liability', category: 'Long-term Liabilities', balance: -50000, active: true },
      { id: 8, code: '3000', name: 'Owner\'s Equity', type: 'Equity', category: 'Owner\'s Equity', balance: 155000, active: true },
      { id: 9, code: '4000', name: 'Sales Revenue', type: 'Revenue', category: 'Operating Revenue', balance: 200000, active: true },
      { id: 10, code: '5000', name: 'Cost of Goods Sold', type: 'Expense', category: 'Operating Expenses', balance: -80000, active: true },
      { id: 11, code: '5100', name: 'Operating Expenses', type: 'Expense', category: 'Operating Expenses', balance: -45000, active: true },
      { id: 12, code: '5200', name: 'Marketing Expenses', type: 'Expense', category: 'Operating Expenses', balance: -15000, active: true }
    ];

    this.saveAccounts();
    this.loadAccounts();
  }
}