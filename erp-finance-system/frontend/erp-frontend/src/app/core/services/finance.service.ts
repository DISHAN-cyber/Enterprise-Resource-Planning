import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ChartAccount {
  id: number;
  code: string;
  name: string;
  type: string;
  subType: string;
  balance: number;
  currency: string;
  status: string;
  description?: string;
  parentId?: number | null;
}

export interface JournalLine {
  account: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalEntry {
  id: number;
  date: string;
  journalNo: string;
  description: string;
  type: string;
  reference: string;
  lines: JournalLine[];
  status: string;
  totalDebit: number;
  totalCredit: number;
}

export interface Invoice {
  id: number;
  vendor: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  amount: number;
  description?: string;
  account?: string;
  status: string;
}

export interface UserProfile {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: string;
}

export interface BackendUserProfile {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardApiResponse {
  welcomeMessage: string;
  companyName: string;
  totalRevenue: string;
  accountsReceivable: string;
  accountsPayable: string;
  openTasks: number;
  userName: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  timestamp: string;
}

export interface FinancialData {
  revenue: number;
  accountsReceivable: number;
  accountsPayable: number;
  cashBalance: number;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly storageKey = 'erpFinanceData';

  private readonly apiBase = '/api';

  currentDomain = 'general';
  currentUser = {
    id: 1,
    name: 'Admin User',
    role: 'System Administrator',
    email: 'admin@company.com',
    department: 'Finance'
  };

  financialData: FinancialData = {
    revenue: 245830,
    accountsReceivable: 42560,
    accountsPayable: 28750,
    cashBalance: 125420
  };

  chartOfAccounts: ChartAccount[] = [];
  journalEntries: JournalEntry[] = [];
  invoices: Invoice[] = [];
  users: UserProfile[] = [];
  notifications: NotificationItem[] = [];

  constructor(private http: HttpClient) {
    this.init();
    if (this.isBrowser()) {
      this.tryLoadUserProfile();
      this.tryLoadDashboard();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  init(): void {
    if (!this.loadFromLocalStorage()) {
      this.loadSampleData();
    }
  }

  private tryLoadUserProfile(): void {
    this.http.get<BackendUserProfile>(`${this.apiBase}/users/me`, { withCredentials: true })
      .subscribe({
        next: (profile) => this.updateUserFromBackend(profile),
        error: () => {
          // Keep local defaults when backend is unavailable
        }
      });
  }

  private tryLoadDashboard(): void {
    this.http.get<DashboardApiResponse>(`${this.apiBase}/dashboard`, { withCredentials: true })
      .subscribe({
        next: (dashboard) => this.applyDashboardResponse(dashboard),
        error: () => {
          // Keep local sample data when backend is unavailable
        }
      });
  }

  loadUserProfile() {
    return this.http.get<BackendUserProfile>(`${this.apiBase}/users/me`, { withCredentials: true });
  }

  loadDashboard() {
    return this.http.get<DashboardApiResponse>(`${this.apiBase}/dashboard`, { withCredentials: true });
  }

  updateUserProfile(request: { email?: string; displayName?: string; phone?: string }) {
    return this.http.put<BackendUserProfile>(`${this.apiBase}/users/me`, request, { withCredentials: true });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<void>(`${this.apiBase}/users/me/password`, { currentPassword, newPassword }, { withCredentials: true });
  }

  login(username: string, password: string) {
    return this.http.post<BackendUserProfile>(`${this.apiBase}/auth/login`, { username, password }, { withCredentials: true });
  }

  logout() {
    return this.http.post(`${this.apiBase}/auth/logout`, null, { withCredentials: true });
  }

  private updateUserFromBackend(profile: BackendUserProfile): void {
    this.currentUser = {
      id: profile.id,
      name: profile.displayName || profile.username,
      role: profile.role,
      email: profile.email,
      department: this.currentUser.department
    };
    this.saveToLocalStorage();
  }

  public applyDashboardResponse(response: DashboardApiResponse): void {
    this.financialData = {
      revenue: this.parseCurrency(response.totalRevenue),
      accountsReceivable: this.parseCurrency(response.accountsReceivable),
      accountsPayable: this.parseCurrency(response.accountsPayable),
      cashBalance: this.financialData.cashBalance
    };
    this.saveToLocalStorage();
  }

  private parseCurrency(value: string): number {
    return Number(value.replace(/[^0-9.-]+/g, '')) || 0;
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  loadFromLocalStorage(): boolean {
    if (!this.hasLocalStorage()) {
      return false;
    }

    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) {
        return false;
      }

      const parsed = JSON.parse(saved) as Partial<FinanceService>;

      if (parsed.currentDomain) {
        this.currentDomain = parsed.currentDomain;
      }
      if (parsed.currentUser) {
        this.currentUser = parsed.currentUser;
      }
      if (parsed.financialData) {
        this.financialData = parsed.financialData;
      }
      if (parsed.chartOfAccounts) {
        this.chartOfAccounts = parsed.chartOfAccounts;
      }
      if (parsed.journalEntries) {
        this.journalEntries = parsed.journalEntries;
      }
      if (parsed.invoices) {
        this.invoices = parsed.invoices;
      }
      if (parsed.users) {
        this.users = parsed.users;
      }
      if (parsed.notifications) {
        this.notifications = parsed.notifications;
      }

      return true;
    } catch {
      return false;
    }
  }

  saveToLocalStorage(): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const payload = {
      currentDomain: this.currentDomain,
      currentUser: this.currentUser,
      financialData: this.financialData,
      chartOfAccounts: this.chartOfAccounts,
      journalEntries: this.journalEntries,
      invoices: this.invoices,
      users: this.users,
      notifications: this.notifications
    };
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }

  loadSampleData(): void {
    this.currentDomain = 'general';
    this.financialData = {
      revenue: 245830,
      accountsReceivable: 42560,
      accountsPayable: 28750,
      cashBalance: 125420
    };

    this.chartOfAccounts = [
      { id: 1, code: '1000', name: 'Cash', type: 'Asset', subType: 'Current Asset', balance: 125420, currency: 'USD', status: 'Active' },
      { id: 2, code: '1100', name: 'Accounts Receivable', type: 'Asset', subType: 'Current Asset', balance: 42560, currency: 'USD', status: 'Active' },
      { id: 3, code: '1200', name: 'Inventory', type: 'Asset', subType: 'Current Asset', balance: 85000, currency: 'USD', status: 'Active' },
      { id: 4, code: '1500', name: 'Equipment', type: 'Asset', subType: 'Fixed Asset', balance: 250000, currency: 'USD', status: 'Active' },
      { id: 5, code: '2000', name: 'Accounts Payable', type: 'Liability', subType: 'Current Liability', balance: 28750, currency: 'USD', status: 'Active' },
      { id: 6, code: '2500', name: 'Loans Payable', type: 'Liability', subType: 'Long-term Liability', balance: 150000, currency: 'USD', status: 'Active' },
      { id: 7, code: '3000', name: 'Common Stock', type: 'Equity', subType: '', balance: 200000, currency: 'USD', status: 'Active' },
      { id: 8, code: '3100', name: 'Retained Earnings', type: 'Equity', subType: '', balance: 125230, currency: 'USD', status: 'Active' },
      { id: 9, code: '4000', name: 'Sales Revenue', type: 'Revenue', subType: 'Operating Revenue', balance: 450000, currency: 'USD', status: 'Active' },
      { id: 10, code: '4100', name: 'Service Revenue', type: 'Revenue', subType: 'Operating Revenue', balance: 85000, currency: 'USD', status: 'Active' },
      { id: 11, code: '5000', name: 'Cost of Goods Sold', type: 'Expense', subType: '', balance: 225000, currency: 'USD', status: 'Active' },
      { id: 12, code: '6000', name: 'Salaries Expense', type: 'Expense', subType: '', balance: 125000, currency: 'USD', status: 'Active' },
      { id: 13, code: '6100', name: 'Rent Expense', type: 'Expense', subType: '', balance: 36000, currency: 'USD', status: 'Active' },
      { id: 14, code: '6200', name: 'Utilities Expense', type: 'Expense', subType: '', balance: 8500, currency: 'USD', status: 'Active' }
    ];

    this.journalEntries = [
      {
        id: 1,
        date: '2023-10-05',
        journalNo: 'JRNL-001',
        description: 'Initial capital investment',
        type: 'General',
        reference: 'INV-001',
        lines: [
          { account: 'Cash', debit: 5000, credit: 0, description: 'Cash received' },
          { account: 'Common Stock', debit: 0, credit: 5000, description: 'Capital investment' }
        ],
        status: 'Posted',
        totalDebit: 5000,
        totalCredit: 5000
      },
      {
        id: 2,
        date: '2023-10-06',
        journalNo: 'JRNL-002',
        description: 'Purchase of computer equipment',
        type: 'Purchase',
        reference: 'PO-001',
        lines: [
          { account: 'Equipment', debit: 2500, credit: 0, description: 'Computer equipment purchase' },
          { account: 'Accounts Payable', debit: 0, credit: 2500, description: 'Vendor payable' }
        ],
        status: 'Posted',
        totalDebit: 2500,
        totalCredit: 2500
      }
    ];

    this.invoices = [
      { id: 1, vendor: 'Office Supplies Ltd', invoiceNo: 'INV-001', date: '2023-10-01', dueDate: '2023-10-31', amount: 1250.5, status: 'Pending' },
      { id: 2, vendor: 'Tech Solutions Inc', invoiceNo: 'INV-002', date: '2023-10-05', dueDate: '2023-11-04', amount: 3500, status: 'Pending' },
      { id: 3, vendor: 'Utilities Corp', invoiceNo: 'INV-003', date: '2023-09-25', dueDate: '2023-10-25', amount: 850.75, status: 'Overdue' }
    ];

    this.users = [
      { id: 1, userId: 'USR001', fullName: 'Admin User', email: 'admin@company.com', role: 'Administrator', department: 'Finance', lastLogin: '2023-10-31 09:15', status: 'Active' },
      { id: 2, userId: 'USR002', fullName: 'John Smith', email: 'john.smith@company.com', role: 'Accountant', department: 'Finance', lastLogin: '2023-10-30 14:30', status: 'Active' }
    ];

    this.notifications = [
      { id: 1, title: 'Overdue Invoice', message: 'Invoice INV-003 is overdue by 5 days', type: 'warning', timestamp: '2023-10-26 10:30' },
      { id: 2, title: 'Journal Posted', message: 'Journal entry JRNL-002 has been posted', type: 'info', timestamp: '2023-10-25 14:15' },
      { id: 3, title: 'New User Added', message: 'New user John Smith has been added', type: 'success', timestamp: '2023-10-24 09:45' }
    ];

    this.saveToLocalStorage();
  }

  getPageTitle(page: string): string {
    const pageTitles: Record<string, string> = {
      dashboard: 'Finance Dashboard',
      coa: 'Chart of Accounts',
      gl: 'General Ledger',
      ap: 'Accounts Payable',
      ar: 'Accounts Receivable',
      assets: 'Fixed Assets',
      bank: 'Bank & Reconciliation',
      budget: 'Budgeting',
      reports: 'Financial Reports',
      users: 'User Management',
      setup: 'Module Setup',
      comparison: 'Domain Comparison'
    };
    return pageTitles[page] || 'Finance Module';
  }

  getDomainLabel(domain: string): string {
    const labels: Record<string, string> = {
      general: 'General Business',
      hotel: 'Hotel Industry',
      education: 'Education Sector',
      banking: 'Banking',
      manufacturing: 'Manufacturing'
    };
    return labels[domain] || 'General Business';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getAccountTypeBadge(type: string): string {
    const badges: Record<string, string> = {
      Asset: 'badge-primary',
      Liability: 'badge-warning',
      Equity: 'badge-success',
      Revenue: 'badge-info',
      Expense: 'badge-danger'
    };
    return badges[type] || 'badge-primary';
  }

  getJournalStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      Draft: 'badge-warning',
      Pending: 'badge-info',
      Posted: 'badge-success',
      Reversed: 'badge-danger'
    };
    return badges[status] || 'badge-primary';
  }

  getPendingActions() {
    return [
      { action: 'Approve journal entries', module: 'General Ledger', priority: 'High', dueDate: 'Today', status: 'Pending' },
      { action: 'Reconcile bank statement', module: 'Bank Reconciliation', priority: 'High', dueDate: 'Today', status: 'Pending' },
      { action: 'Process vendor payments', module: 'Accounts Payable', priority: 'Medium', dueDate: 'Tomorrow', status: 'Pending' },
      { action: 'Follow up on overdue invoices', module: 'Accounts Receivable', priority: 'Medium', dueDate: 'This week', status: 'Pending' }
    ];
  }

  applyDomainSettings(domain: string): void {
    this.currentDomain = domain;
    this.saveToLocalStorage();
  }

  addNotification(title: string, message: string, type = 'info'): void {
    this.notifications.push({
      id: this.notifications.length + 1,
      title,
      message,
      type,
      timestamp: new Date().toLocaleString()
    });
    this.saveToLocalStorage();
  }
}
