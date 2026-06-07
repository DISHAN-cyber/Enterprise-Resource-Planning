import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Invoice {
  id: number;
  vendorId: number;
  vendorName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'Open' | 'Paid' | 'Overdue' | 'Partial';
  description?: string;
}

@Component({
  selector: 'app-ap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="module-section">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-file-invoice-dollar"></i>
          Accounts Payable
        </div>
        <div class="section-actions">
          <button class="btn btn-primary" (click)="showAddInvoiceModal()">
            <i class="fas fa-plus"></i> Add Invoice
          </button>
          <button class="btn btn-success" (click)="processBatchPayments()">
            <i class="fas fa-credit-card"></i> Batch Payment
          </button>
          <button class="btn btn-info" (click)="exportAPData()">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      <!-- Metrics Cards -->
      <div class="cards-container">
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-dollar-sign"></i>
              Total Outstanding
            </div>
          </div>
          <div class="card-value">{{ formatCurrency(getTotalOutstanding()) }}</div>
          <div class="card-trend warning">
            <i class="fas fa-exclamation-triangle"></i> Due Soon
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-clock"></i>
              Overdue Invoices
            </div>
          </div>
          <div class="card-value">{{ getOverdueCount() }}</div>
          <div class="card-trend negative">
            <i class="fas fa-calendar-times"></i> Past Due
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-check"></i>
              Paid This Month
            </div>
          </div>
          <div class="card-value">{{ formatCurrency(getPaidThisMonth()) }}</div>
          <div class="card-trend positive">
            <i class="fas fa-arrow-up"></i> On Track
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <i class="fas fa-users"></i>
              Active Vendors
            </div>
          </div>
          <div class="card-value">{{ getUniqueVendors() }}</div>
          <div class="card-trend positive">
            <i class="fas fa-user-friends"></i> Suppliers
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" class="form-control" placeholder="Search invoices..." [(ngModel)]="searchTerm" (input)="searchAP()">
        </div>
        <select class="form-control filter-dropdown" [(ngModel)]="filterStatus" (change)="filterAP()">
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Partial">Partial</option>
        </select>
        <select class="form-control filter-dropdown" [(ngModel)]="filterVendor" (change)="filterAP()">
          <option value="">All Vendors</option>
          <option *ngFor="let vendor of getUniqueVendorList()" [value]="vendor">{{ vendor }}</option>
        </select>
      </div>

      <!-- Invoices Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let invoice of filteredInvoices">
              <td>{{ invoice.invoiceNumber }}</td>
              <td>{{ invoice.vendorName }}</td>
              <td>{{ formatDate(invoice.date) }}</td>
              <td>{{ formatDate(invoice.dueDate) }}</td>
              <td>{{ formatCurrency(invoice.amount) }}</td>
              <td>{{ formatCurrency(invoice.paidAmount) }}</td>
              <td>{{ formatCurrency(invoice.amount - invoice.paidAmount) }}</td>
              <td><span class="badge" [class]="getStatusBadgeClass(invoice.status)">{{ invoice.status }}</span></td>
              <td>
                <button class="btn btn-sm btn-info" (click)="viewInvoice(invoice.id)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-success" *ngIf="invoice.status !== 'Paid'" (click)="payInvoice(invoice.id)">
                  <i class="fas fa-dollar-sign"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Invoice Modal -->
    <div class="modal" [class.active]="showAddModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add Invoice</h3>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <form #invoiceForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Vendor *</label>
                <select class="form-control" [(ngModel)]="invoiceFormData.vendorId" name="vendorId" required>
                  <option value="">Select Vendor</option>
                  <option *ngFor="let vendor of vendors" [value]="vendor.id">{{ vendor.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Invoice Number *</label>
                <input type="text" class="form-control" [(ngModel)]="invoiceFormData.invoiceNumber" name="invoiceNumber" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Invoice Date *</label>
                <input type="date" class="form-control" [(ngModel)]="invoiceFormData.date" name="date" required>
              </div>
              <div class="form-group">
                <label class="form-label">Due Date *</label>
                <input type="date" class="form-control" [(ngModel)]="invoiceFormData.dueDate" name="dueDate" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Amount *</label>
                <input type="number" class="form-control" [(ngModel)]="invoiceFormData.amount" name="amount" step="0.01" required>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <input type="text" class="form-control" [(ngModel)]="invoiceFormData.description" name="description">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
          <button class="btn btn-primary" (click)="saveInvoice()" [disabled]="!invoiceForm.valid">
            Save Invoice
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

    .card-trend.negative {
      color: var(--danger);
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

    .badge-info {
      background: #e3f2fd;
      color: var(--info);
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

    .btn-success {
      background: var(--success);
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
export class ApComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  vendors = [
    { id: 1, name: 'Office Supplies Inc.' },
    { id: 2, name: 'Tech Solutions Ltd.' },
    { id: 3, name: 'Marketing Agency' },
    { id: 4, name: 'Consulting Services' }
  ];

  searchTerm = '';
  filterStatus = '';
  filterVendor = '';

  showAddModal = false;

  invoiceFormData = {
    vendorId: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: 0,
    description: ''
  };

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  hasLocalStorage(): boolean {
    return this.isBrowser() && typeof window.localStorage !== 'undefined';
  }

  ngOnInit() {
    this.loadInvoices();
    this.setDefaultDueDate();
  }

  loadInvoices() {
    const saved = this.hasLocalStorage() ? localStorage.getItem('erpAPInvoices') : null;
    if (saved) {
      this.invoices = JSON.parse(saved);
    } else {
      // Load sample data
      this.invoices = [
        {
          id: 1,
          vendorId: 1,
          vendorName: 'Office Supplies Inc.',
          invoiceNumber: 'INV-001',
          date: '2024-01-15',
          dueDate: '2024-02-15',
          amount: 2500,
          paidAmount: 0,
          status: 'Open',
          description: 'Office supplies for Q1'
        },
        {
          id: 2,
          vendorId: 2,
          vendorName: 'Tech Solutions Ltd.',
          invoiceNumber: 'INV-002',
          date: '2024-01-20',
          dueDate: '2024-02-20',
          amount: 5000,
          paidAmount: 5000,
          status: 'Paid',
          description: 'Software license renewal'
        }
      ];
      this.saveInvoices();
    }
    this.filteredInvoices = [...this.invoices];
    this.updateStatuses();
  }

  saveInvoices() {
    if (this.hasLocalStorage()) {
      localStorage.setItem('erpAPInvoices', JSON.stringify(this.invoices));
    }
  }

  updateStatuses() {
    const today = new Date();
    this.invoices.forEach(invoice => {
      const dueDate = new Date(invoice.dueDate);
      const balance = invoice.amount - invoice.paidAmount;

      if (balance <= 0) {
        invoice.status = 'Paid';
      } else if (dueDate < today) {
        invoice.status = 'Overdue';
      } else if (invoice.paidAmount > 0 && invoice.paidAmount < invoice.amount) {
        invoice.status = 'Partial';
      } else {
        invoice.status = 'Open';
      }
    });
    this.saveInvoices();
  }

  searchAP() {
    this.filterInvoices();
  }

  filterAP() {
    this.filterInvoices();
  }

  filterInvoices() {
    this.filteredInvoices = this.invoices.filter(invoice => {
      const matchesSearch = !this.searchTerm ||
        invoice.invoiceNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        invoice.vendorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        invoice.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.filterStatus || invoice.status === this.filterStatus;

      const matchesVendor = !this.filterVendor || invoice.vendorName === this.filterVendor;

      return matchesSearch && matchesStatus && matchesVendor;
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'Open': 'warning',
      'Paid': 'success',
      'Overdue': 'danger',
      'Partial': 'info'
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

  getTotalOutstanding(): number {
    return this.invoices.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0);
  }

  getOverdueCount(): number {
    return this.invoices.filter(inv => inv.status === 'Overdue').length;
  }

  getPaidThisMonth(): number {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return this.invoices
      .filter(inv => {
        const paidDate = new Date(inv.date);
        return paidDate.getMonth() === thisMonth && paidDate.getFullYear() === thisYear && inv.status === 'Paid';
      })
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  getUniqueVendors(): number {
    return new Set(this.invoices.map(inv => inv.vendorId)).size;
  }

  getUniqueVendorList(): string[] {
    return [...new Set(this.invoices.map(inv => inv.vendorName))];
  }

  setDefaultDueDate() {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    this.invoiceFormData.dueDate = dueDate.toISOString().split('T')[0];
  }

  showAddInvoiceModal() {
    this.invoiceFormData = {
      vendorId: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      amount: 0,
      description: ''
    };
    this.setDefaultDueDate();
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
  }

  saveInvoice() {
    const vendor = this.vendors.find(v => v.id.toString() === this.invoiceFormData.vendorId);
    if (!vendor) return;

    const newInvoice: Invoice = {
      id: Date.now(),
      vendorId: vendor.id,
      vendorName: vendor.name,
      invoiceNumber: this.invoiceFormData.invoiceNumber,
      date: this.invoiceFormData.date,
      dueDate: this.invoiceFormData.dueDate,
      amount: this.invoiceFormData.amount,
      paidAmount: 0,
      status: 'Open',
      description: this.invoiceFormData.description
    };

    this.invoices.push(newInvoice);
    this.saveInvoices();
    this.loadInvoices();
    this.closeModal();
  }

  payInvoice(invoiceId: number) {
    const invoice = this.invoices.find(inv => inv.id === invoiceId);
    if (invoice && invoice.amount > invoice.paidAmount) {
      const paymentAmount = invoice.amount - invoice.paidAmount;
      invoice.paidAmount += paymentAmount;
      this.saveInvoices();
      this.loadInvoices();
    }
  }

  viewInvoice(invoiceId: number) {
    // For now, just log. Could open a modal with details
    console.log('Viewing invoice:', invoiceId);
  }

  processBatchPayments() {
    const openInvoices = this.invoices.filter(inv => inv.status === 'Open');
    openInvoices.forEach(invoice => this.payInvoice(invoice.id));
    alert(`Processed payments for ${openInvoices.length} invoices`);
  }

  exportAPData() {
    if (!this.isBrowser()) {
      return;
    }

    const csvContent = [
      ['Invoice #', 'Vendor', 'Date', 'Due Date', 'Amount', 'Paid', 'Balance', 'Status'],
      ...this.invoices.map(inv => [
        inv.invoiceNumber,
        inv.vendorName,
        inv.date,
        inv.dueDate,
        inv.amount.toString(),
        inv.paidAmount.toString(),
        (inv.amount - inv.paidAmount).toString(),
        inv.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accounts-payable.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}