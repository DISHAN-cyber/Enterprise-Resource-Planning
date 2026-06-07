import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  balance: number;
  status: string;
}

interface JournalEntry {
  id: number;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  status: string;
}

interface Invoice {
  number: string;
  vendor: string;
  amount: number;
  dueDate: string;
  status: string;
}

interface Asset {
  name: string;
  category: string;
  value: number;
  acquisitionDate: string;
  depreciation: number;
  netBookValue: number;
  status: string;
}

interface BankAccount {
  name: string;
  number: string;
  balance: number;
}

interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  type: string;
  status: string;
}

interface BudgetDetail {
  department: string;
  budgeted: number;
  actual: number;
  variance: number;
  status: string;
}

interface Report {
  title: string;
  summary: string;
}

interface User {
  fullName: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

interface SummaryMetric {
  title: string;
  subtitle?: string;
  value: string;
  note?: string;
  trend: number;
  trendLabel: string;
  icon: string;
  badgeClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('financialChart') financialChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('coaBalanceChart') coaBalanceChart?: ElementRef<HTMLCanvasElement>;

  activePage = 'dashboard';
  coaViewMode: 'table' | 'hierarchy' | 'balances' = 'table';
  coaSearchTerm = '';
  coaTypeFilter = '';
  coaStatusFilter = '';
  glSearchTerm = '';
  glStatusFilter = '';
  glFromDate = '';
  glToDate = '';
  apSearchTerm = '';
  apStatusFilter = '';
  arSearchTerm = '';
  arStatusFilter = '';

  showAddAccountModal = false;
  showAddInvoiceModal = false;

  newAccount = {
    code: '',
    name: '',
    type: 'Asset',
    balance: 0,
    status: 'Active'
  };

  newInvoice = {
    number: '',
    vendor: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };

  dashboardCards: SummaryMetric[] = [
    { title: 'Total Revenue', subtitle: 'Monthly', value: '$458,120', trend: 12, trendLabel: '+12%', icon: 'fas fa-dollar-sign', badgeClass: 'badge-info' },
    { title: 'Net Profit', subtitle: 'Quarterly', value: '$128,450', trend: 8, trendLabel: '+8%', icon: 'fas fa-chart-line', badgeClass: 'badge-success' },
    { title: 'Outstanding Invoices', subtitle: 'Open', value: '64', trend: -3, trendLabel: '-3%', icon: 'fas fa-file-invoice', badgeClass: 'badge-warning' },
    { title: 'Pending Bills', subtitle: 'Due Soon', value: '18', trend: 5, trendLabel: '+5%', icon: 'fas fa-clock', badgeClass: 'badge-danger' }
  ];

  pendingActions = [
    { task: 'Approve expense claim', owner: 'Sara Lee', due: 'Today', status: 'Pending' },
    { task: 'Review purchase order', owner: 'Martin Reed', due: 'Tomorrow', status: 'Pending' },
    { task: 'Finalize monthly close', owner: 'Admin', due: '2 days', status: 'Pending' }
  ];

  coaAccounts: Account[] = [
    { id: 1, code: '1000', name: 'Cash', type: 'Asset', balance: 185000, status: 'Active' },
    { id: 2, code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 62000, status: 'Active' },
    { id: 3, code: '3000', name: 'Equity', type: 'Equity', balance: 123000, status: 'Active' },
    { id: 4, code: '4000', name: 'Revenue', type: 'Revenue', balance: 930000, status: 'Active' },
    { id: 5, code: '5000', name: 'Expenses', type: 'Expense', balance: 670000, status: 'Active' }
  ];

  journalEntries: JournalEntry[] = [
    { id: 1, date: '2026-05-26', reference: 'JV-101', description: 'Payroll accrual', debit: 50000, credit: 0, status: 'Pending' },
    { id: 2, date: '2026-05-25', reference: 'JV-102', description: 'Sales revenue', debit: 0, credit: 82000, status: 'Posted' },
    { id: 3, date: '2026-05-24', reference: 'JV-103', description: 'Rent expense', debit: 18000, credit: 0, status: 'Posted' }
  ];

  invoices: Invoice[] = [
    { number: 'AP-5542', vendor: 'Supply Co.', amount: 14250, dueDate: '2026-06-15', status: 'Pending' },
    { number: 'AP-5543', vendor: 'Maintenance Pro', amount: 5850, dueDate: '2026-06-05', status: 'Paid' },
    { number: 'AP-5544', vendor: 'Office Plus', amount: 9200, dueDate: '2026-06-12', status: 'Pending' }
  ];

  glSummaryCards: SummaryMetric[] = [
    { title: 'Posted Entries', value: '1,428', note: 'Current period', trend: 6, trendLabel: '+6%', icon: 'fas fa-check-circle', badgeClass: 'badge-success' },
    { title: 'Pending Review', value: '32', note: 'Awaiting approval', trend: -2, trendLabel: '-2%', icon: 'fas fa-hourglass-half', badgeClass: 'badge-warning' },
    { title: 'Unbalanced Entries', value: '4', note: 'Needs correction', trend: 1, trendLabel: '+1', icon: 'fas fa-balance-scale', badgeClass: 'badge-danger' }
  ];

  apSummaryCards: SummaryMetric[] = [
    { title: 'Total Payables', value: '$39,300', note: 'Due this month', trend: 3, trendLabel: '+3%', icon: 'fas fa-file-invoice-dollar', badgeClass: 'badge-info' },
    { title: 'Overdue', value: '$8,750', note: 'Past due invoices', trend: -12, trendLabel: '-12%', icon: 'fas fa-exclamation-circle', badgeClass: 'badge-danger' },
    { title: 'Supplier Count', value: '42', note: 'Active vendors', trend: 5, trendLabel: '+5%', icon: 'fas fa-users', badgeClass: 'badge-success' }
  ];

  arSummaryCards: SummaryMetric[] = [
    { title: 'Receivables', value: '$54,600', note: 'Open invoices', trend: 10, trendLabel: '+10%', icon: 'fas fa-hand-holding-usd', badgeClass: 'badge-info' },
    { title: 'Overdue', value: '$12,200', note: 'Late payments', trend: -7, trendLabel: '-7%', icon: 'fas fa-clock', badgeClass: 'badge-warning' },
    { title: 'Collection Rate', value: '92%', note: 'This quarter', trend: 2, trendLabel: '+2%', icon: 'fas fa-percent', badgeClass: 'badge-success' }
  ];

  assetSummaries: SummaryMetric[] = [
    { title: 'Total Assets', value: '$772,000', note: 'Book value', trend: 1, trendLabel: '+1%', icon: 'fas fa-building', badgeClass: 'badge-info' },
    { title: 'Depreciation', value: '$64,500', note: 'Accumulated', trend: 0, trendLabel: '0%', icon: 'fas fa-coins', badgeClass: 'badge-warning' },
    { title: 'Active Assets', value: '28', note: 'Tracked items', trend: 3, trendLabel: '+3', icon: 'fas fa-check', badgeClass: 'badge-success' }
  ];

  bankSummaryCards: SummaryMetric[] = [
    { title: 'Bank Balance', value: '$212,450', note: 'Total available', trend: 8, trendLabel: '+8%', icon: 'fas fa-university', badgeClass: 'badge-success' },
    { title: 'Unreconciled', value: '$4,380', note: 'Pending items', trend: -2, trendLabel: '-2%', icon: 'fas fa-exclamation-triangle', badgeClass: 'badge-warning' },
    { title: 'Last Reconciliation', value: '2 days ago', note: 'Updated status', trend: 0, trendLabel: '', icon: 'fas fa-check-circle', badgeClass: 'badge-info' }
  ];

  receivables = [
    { customer: 'Acme Corp', description: 'Consulting services', amount: 38700, status: 'Open' },
    { customer: 'Bright Retail', description: 'Product shipment', amount: 15200, status: 'Open' },
    { customer: 'Green Industries', description: 'Subscription renewal', amount: 11200, status: 'Overdue' }
  ];

  bankTransactions: BankTransaction[] = [
    { date: '2026-06-01', description: 'Deposit - Customer Payment', amount: 25800, type: 'Credit', status: 'Reconciled' },
    { date: '2026-05-30', description: 'Wire Transfer - Supplier', amount: -14250, type: 'Debit', status: 'Pending' },
    { date: '2026-05-29', description: 'Bank Fee', amount: -45, type: 'Debit', status: 'Reconciled' }
  ];

  bankAccounts: BankAccount[] = [
    { name: 'Operating Account', number: '12345678', balance: 128450 },
    { name: 'Savings Account', number: '87654321', balance: 84000 }
  ];

  budgets: BudgetDetail[] = [
    { department: 'Marketing', budgeted: 120000, actual: 98000, variance: -22000, status: 'On Track' },
    { department: 'Operations', budgeted: 140000, actual: 146000, variance: 6000, status: 'Over Budget' },
    { department: 'Sales', budgeted: 110000, actual: 103500, variance: -6500, status: 'Under Budget' }
  ];

  reports: Report[] = [
    { title: 'Income Statement', summary: 'View monthly profit and loss performance.' },
    { title: 'Balance Sheet', summary: 'Review asset, liability, and equity balances.' },
    { title: 'Cash Flow', summary: 'Track cash inflows and outflows.' },
    { title: 'Trial Balance', summary: 'Verify ledger balances and reconciliations.' }
  ];

  users: User[] = [
    { fullName: 'Admin User', email: 'admin@company.com', role: 'Administrator', department: 'Finance', status: 'Active' },
    { fullName: 'John Smith', email: 'john.smith@company.com', role: 'Accountant', department: 'Finance', status: 'Active' },
    { fullName: 'Eliza Hart', email: 'eliza.hart@company.com', role: 'Controller', department: 'Accounting', status: 'Active' }
  ];

  assets: Asset[] = [
    { name: 'Office Equipment', category: 'Fixed Asset', value: 82000, acquisitionDate: '2024-01-15', depreciation: 14500, netBookValue: 67500, status: 'Active' },
    { name: 'Warehouse', category: 'Property', value: 375000, acquisitionDate: '2022-09-30', depreciation: 37250, netBookValue: 337750, status: 'Active' }
  ];

  setup = {
    companyName: 'ERP Finance Inc.',
    fiscalYear: '2026',
    currency: 'USD',
    approvalWorkflow: 'Standard',
    invoicePrefix: 'ERP-',
    enableAutoApproval: false,
    closePeriod: 'Monthly'
  };

  comparisonDomains = [
    { title: 'General Business', description: 'Core finance processes for small and medium enterprises.' },
    { title: 'Manufacturing', description: 'Inventory and production-oriented financial workflows.' },
    { title: 'Retail', description: 'Point-of-sale and receivables management.' },
    { title: 'Professional Services', description: 'Project-based revenue, billing, and resource tracking.' }
  ];

  coaHierarchy = [
    {
      code: '1000',
      name: 'Assets',
      type: 'Group',
      children: [
        { code: '1100', name: 'Cash', type: 'Current Asset' },
        { code: '1200', name: 'Accounts Receivable', type: 'Current Asset' }
      ]
    },
    {
      code: '2000',
      name: 'Liabilities',
      type: 'Group',
      children: [
        { code: '2100', name: 'Accounts Payable', type: 'Current Liability' },
        { code: '2200', name: 'Accrued Expenses', type: 'Current Liability' }
      ]
    }
  ];

  private routerSubscription: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActivePage(this.router.url);
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActivePage(event.urlAfterRedirects);
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.drawFinancialChart();
    this.drawCOABalanceChart();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateActivePage(url: string): void {
    const path = url.split('?')[0].replace('/', '') || 'dashboard';
    this.activePage = path || 'dashboard';
  }

  get filteredCOA(): Account[] {
    return this.coaAccounts.filter((account) => {
      const matchesSearch = account.name.toLowerCase().includes(this.coaSearchTerm.toLowerCase())
        || account.code.toLowerCase().includes(this.coaSearchTerm.toLowerCase());
      const matchesType = !this.coaTypeFilter || account.type === this.coaTypeFilter;
      const matchesStatus = !this.coaStatusFilter || account.status === this.coaStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  get filteredJournalEntries(): JournalEntry[] {
    return this.journalEntries.filter((entry) => {
      const matchesSearch = !this.glSearchTerm || entry.reference.toLowerCase().includes(this.glSearchTerm.toLowerCase())
        || entry.description.toLowerCase().includes(this.glSearchTerm.toLowerCase());
      const matchesStatus = !this.glStatusFilter || entry.status === this.glStatusFilter;
      const matchesFromDate = !this.glFromDate || entry.date >= this.glFromDate;
      const matchesToDate = !this.glToDate || entry.date <= this.glToDate;
      return matchesSearch && matchesStatus && matchesFromDate && matchesToDate;
    });
  }

  get filteredInvoices(): Invoice[] {
    return this.invoices.filter((invoice) => {
      const matchesSearch = !this.apSearchTerm || invoice.number.toLowerCase().includes(this.apSearchTerm.toLowerCase())
        || invoice.vendor.toLowerCase().includes(this.apSearchTerm.toLowerCase());
      const matchesStatus = !this.apStatusFilter || invoice.status === this.apStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get filteredReceivables(): any[] {
    return this.receivables.filter((item) => {
      const matchesSearch = !this.arSearchTerm || item.customer.toLowerCase().includes(this.arSearchTerm.toLowerCase())
        || item.description.toLowerCase().includes(this.arSearchTerm.toLowerCase());
      const matchesStatus = !this.arStatusFilter || item.status === this.arStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  setCOAView(mode: 'table' | 'hierarchy' | 'balances'): void {
    this.coaViewMode = mode;
  }

  getCOAViewButtonClass(mode: 'table' | 'hierarchy' | 'balances'): string {
    return this.coaViewMode === mode ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
  }

  getAccountTypeBadge(type: string): string {
    switch (type) {
      case 'Asset': return 'badge-success';
      case 'Liability': return 'badge-danger';
      case 'Equity': return 'badge-info';
      case 'Revenue': return 'badge-primary';
      case 'Expense': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  getJournalStatusBadge(status: string): string {
    return status === 'Posted' ? 'badge-success' : 'badge-warning';
  }

  getReconciliationStatusBadge(status: string): string {
    return status === 'Reconciled' ? 'badge-success' : 'badge-warning';
  }

  getBudgetStatusBadge(status: string): string {
    return status === 'On Track' ? 'badge-success' : status === 'Over Budget' ? 'badge-danger' : 'badge-info';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(amount);
  }

  drawFinancialChart(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const canvas = this.financialChart?.nativeElement;
    if (!canvas) {
      return;
    }

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }

    if (!ctx || typeof ctx.fillRect !== 'function') {
      return;
    }

    const values = [120, 170, 145, 190, 240, 210];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f4f6fb';
    ctx.fillRect(0, 0, width, height);

    const max = Math.max(...values) * 1.1;
    const barWidth = (width - padding * 2) / values.length - 20;

    values.forEach((value, index) => {
      const x = padding + index * (barWidth + 20);
      const barHeight = (value / max) * (height - padding * 2);
      const y = height - padding - barHeight;

      ctx.fillStyle = 'rgba(57, 73, 171, 0.85)';
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(labels[index], x, height - 12);
    });
  }

  updateFinancialChart(): void {
    this.drawFinancialChart();
  }

  drawCOABalanceChart(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const canvas = this.coaBalanceChart?.nativeElement;
    if (!canvas) {
      return;
    }

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }

    if (!ctx || typeof ctx.fillRect !== 'function') {
      return;
    }

    const grouped = this.coaAccounts.reduce<Record<string, number>>((acc, account) => {
      acc[account.type] = (acc[account.type] || 0) + account.balance;
      return acc;
    }, {});

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    let x = padding;
    const barWidth = (width - padding * 2) / labels.length - 16;
    const max = Math.max(...values) * 1.1;

    values.forEach((value, index) => {
      const barHeight = (value / max) * (height - padding * 2);
      const y = height - padding - barHeight;
      ctx.fillStyle = ['#3949ab', '#0288d1', '#2e7d32', '#f57c00', '#d32f2f'][index % 5];
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(labels[index], x, height - 18);
      ctx.fillText(this.formatCurrency(value), x, y - 10);
      x += barWidth + 16;
    });
  }

  openAddAccountModal(): void {
    this.showAddAccountModal = true;
  }

  openAddInvoiceModal(): void {
    this.showAddInvoiceModal = true;
  }

  closeModal(type: 'addAccount' | 'addInvoice'): void {
    if (type === 'addAccount') {
      this.showAddAccountModal = false;
    } else {
      this.showAddInvoiceModal = false;
    }
  }

  saveAccount(): void {
    this.coaAccounts.push({
      id: this.coaAccounts.length + 1,
      code: this.newAccount.code,
      name: this.newAccount.name,
      type: this.newAccount.type,
      balance: this.newAccount.balance,
      status: this.newAccount.status
    });
    this.newAccount = { code: '', name: '', type: 'Asset', balance: 0, status: 'Active' };
    this.showAddAccountModal = false;
    this.drawCOABalanceChart();
  }

  saveInvoice(): void {
    this.invoices.push({
      number: this.newInvoice.number,
      vendor: this.newInvoice.vendor,
      amount: this.newInvoice.amount,
      dueDate: this.newInvoice.dueDate,
      status: this.newInvoice.status
    });
    this.newInvoice = { number: '', vendor: '', amount: 0, dueDate: new Date().toISOString().split('T')[0], status: 'Pending' };
    this.showAddInvoiceModal = false;
  }

  saveSetup(): void {
    alert('Setup saved successfully.');
  }

  markAllComplete(): void {
    this.pendingActions = this.pendingActions.map((task) => ({ ...task, status: 'Completed' }));
  }

  completeAction(taskName: string): void {
    this.pendingActions = this.pendingActions.map((task) => {
      if (task.task === taskName) {
        return { ...task, status: 'Completed' };
      }
      return task;
    });
  }

  loadSampleCOA(): void {
    this.coaAccounts = [...this.coaAccounts];
    setTimeout(() => this.drawCOABalanceChart());
  }

  viewReport(title: string): void {
    alert(`Opening report: ${title}`);
  }
}
