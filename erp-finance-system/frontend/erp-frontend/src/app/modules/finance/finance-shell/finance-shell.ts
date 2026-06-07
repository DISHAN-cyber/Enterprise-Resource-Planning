import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { FinanceService, Invoice, JournalEntry, JournalLine } from '../../../core/services/finance.service';

@Component({
  selector: 'app-finance-shell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance-shell.html',
  styleUrls: ['./finance-shell.scss']
})
export class FinanceShellComponent implements OnInit, AfterViewInit, OnDestroy {
  public currentPage = 'dashboard';
  public sidebarOpen = false;
  public coaSearchTerm = '';
  public coaTypeFilter = 'all';
  public coaStatusFilter = 'all';
  public journalStatusFilter = 'all';
  public journalDateFilter = '';
  public journalSearchTerm = '';
  public apSearchTerm = '';
  public apStatusFilter = 'all';
  public apVendorFilter = 'all';
  public coaTab = 'accounts';
  public glTab = 'journals';
  public apTab = 'invoices';
  public arTab = 'arinvoices';
  public assetsTab = 'assetslist';
  public bankTab = 'bankaccounts';
  public budgetTab = 'budgetplan';
  public reportsTab = 'balancesheet';
  public setupTab = 'generalsetup';
  public editingAccountId: number | null = null;
  public showAddAccountModalFlag = false;
  public showJournalEntryModalFlag = false;
  public showInvoiceModalFlag = false;
  public chartPeriod = '365';
  public accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
  public pendingActionsList: Array<{ action: string; module: string; priority: string; dueDate: string; status: string }> = [];

  public profileForm = {
    displayName: '',
    email: '',
    phone: ''
  };

  public passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  public profileMessage = '';
  public profileError = '';
  public passwordMessage = '';
  public passwordError = '';

  public accountForm = {
    id: 0,
    code: '',
    name: '',
    type: '',
    subType: '',
    balance: 0,
    currency: 'USD',
    description: '',
    parentId: null as number | null,
    status: 'Active'
  };

  public journalForm = {
    date: new Date().toISOString().split('T')[0],
    type: 'General',
    description: '',
    reference: '',
    lines: [{ account: '', debit: 0, credit: 0, description: '' } as JournalLine]
  };

  public invoiceForm = {
    vendor: '',
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    amount: 0,
    description: '',
    account: ''
  };

  private routerSubscription?: Subscription;

  constructor(
    public finance: FinanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pendingActionsList = this.finance.getPendingActions();
  }

  ngOnInit(): void {
    this.updateRouteState(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateRouteState(event.urlAfterRedirects));

    if (this.isBrowser()) {
      this.loadUserProfile();
      this.loadDashboardData();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  ngAfterViewInit(): void {
    this.renderCurrentCharts();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  updateRouteState(url: string): void {
    this.currentPage = this.getCurrentPageFromUrl(url);
    this.renderCurrentCharts();
  }

  private getCurrentPageFromUrl(url: string): string {
    const cleanedUrl = url.split(/[?#]/)[0];
    const segments = cleanedUrl.split('/').filter((segment) => segment.length > 0);
    return segments.pop() || 'dashboard';
  }

  private renderCurrentCharts(): void {
    if (!this.isBrowser()) {
      return;
    }

    if (this.currentPage === 'dashboard') {
      this.drawFinancialChart();
    }
    if (this.currentPage === 'coa') {
      this.drawCOABalanceChart();
    }
    if (this.currentPage === 'gl' && this.glTab === 'trialbalance') {
      this.drawTrialBalanceChart();
    }
  }

  private createCanvasContext(canvasId: string): CanvasRenderingContext2D | null {
    if (!this.isBrowser()) {
      return null;
    }
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      return null;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return ctx;
  }

  private drawFinancialChart(): void {
    const ctx = this.createCanvasContext('financialChart');
    if (!ctx) {
      return;
    }

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const revenue = [120, 190, 300, 500, 250, 400, 320, 480, 420, 450];
    const expenses = [80, 120, 200, 300, 180, 250, 280, 320, 300, 280];
    const padding = 40;
    const width = ctx.canvas.width - padding * 2;
    const height = ctx.canvas.height - padding * 2;
    const maxValue = Math.max(...revenue, ...expenses) * 1.1;

    this.drawGrid(ctx, width, height, padding, maxValue);
    this.drawLineSeries(ctx, revenue, labels, padding, width, height, '#2e7d32');
    this.drawLineSeries(ctx, expenses, labels, padding, width, height, '#d32f2f');
    this.drawLabels(ctx, labels, padding, width, height);
  }

  private drawCOABalanceChart(): void {
    const ctx = this.createCanvasContext('coaBalanceChart');
    if (!ctx) {
      return;
    }

    const totals = this.accountTypes.map((type) => this.getAccountBalanceByType(type));
    const colors = ['#3949ab', '#ff9800', '#2e7d32', '#d32f2f', '#0288d1'];
    const total = totals.reduce((sum, value) => sum + value, 0) || 1;
    let startAngle = -Math.PI / 2;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    totals.forEach((value, index) => {
      const slice = (value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      startAngle += slice;
    });

    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(centerX, centerY, radius * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawTrialBalanceChart(): void {
    const ctx = this.createCanvasContext('trialBalanceChart');
    if (!ctx) {
      return;
    }

    const labels = ['Assets', 'Liabilities', 'Equity'];
    const values = [
      this.getAccountBalanceByType('Asset'),
      this.getAccountBalanceByType('Liability'),
      this.getAccountBalanceByType('Equity')
    ];
    const padding = 50;
    const width = ctx.canvas.width - padding * 2;
    const height = ctx.canvas.height - padding * 2;
    const maxValue = Math.max(...values) * 1.1 || 1;
    const barWidth = width / values.length - 24;

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
    }

    values.forEach((value, index) => {
      const x = padding + index * (barWidth + 24);
      const barHeight = (value / maxValue) * height;
      ctx.fillStyle = ['#3949ab', '#ff9800', '#2e7d32'][index];
      ctx.fillRect(x, padding + height - barHeight, barWidth, barHeight);
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(labels[index], x, padding + height + 20);
      ctx.fillText(this.finance.formatCurrency(value), x, padding + height - barHeight - 10);
    });
  }

  private drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, padding: number, maxValue: number): void {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    const rows = 5;
    for (let i = 0; i <= rows; i++) {
      const y = padding + (height / rows) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
    }
  }

  private drawLineSeries(
    ctx: CanvasRenderingContext2D,
    values: number[],
    labels: string[],
    padding: number,
    width: number,
    height: number,
    color: string
  ): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    values.forEach((value, index) => {
      const x = padding + (width / (values.length - 1)) * index;
      const y = padding + height - (value / Math.max(...values, 1)) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    ctx.stroke();
  }

  private drawLabels(ctx: CanvasRenderingContext2D, labels: string[], padding: number, width: number, height: number): void {
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    labels.forEach((label, index) => {
      const x = padding + (width / (labels.length - 1)) * index;
      ctx.fillText(label, x - 12, padding + height + 24);
    });
  }

  get pageTitle(): string {
    return this.finance.getPageTitle(this.currentPage);
  }

  get pendingActions() {
    return this.pendingActionsList;
  }

  markAllComplete(): void {
    this.pendingActionsList.forEach((action) => action.status = 'Completed');
    alert('All pending actions have been marked complete.');
  }

  completeAction(action: string): void {
    this.pendingActionsList = this.pendingActionsList.map((item) => item.action === action ? { ...item, status: 'Completed' } : item);
    this.finance.addNotification('Action Completed', `Completed action: ${action}`);
    alert(`Completed action: ${action}`);
  }

  updateFinancialChart(): void {
    this.renderCurrentCharts();
    this.finance.addNotification('Chart Updated', `Chart period updated to ${this.chartPeriod} days.`);
  }

  getAccountsByType(type: string) {
    return this.finance.chartOfAccounts.filter((account) => account.type === type);
  }

  getAccountCountByType(type: string): number {
    return this.getAccountsByType(type).length;
  }

  getAccountBalanceByType(type: string): number {
    return this.getAccountsByType(type).reduce((sum, account) => sum + account.balance, 0);
  }

  getTotalAccountBalance(): number {
    return this.finance.chartOfAccounts.reduce((sum, account) => sum + account.balance, 0);
  }

  getAccountBalancePct(type: string): number {
    const total = this.getTotalAccountBalance();
    return total ? (this.getAccountBalanceByType(type) / total) * 100 : 0;
  }

  getJournalUnpostedCount(): number {
    return this.finance.journalEntries.filter((entry) => entry.status !== 'Posted').length;
  }

  getJournalCurrentMonthCount(): number {
    const month = new Date().toISOString().slice(0, 7);
    return this.finance.journalEntries.filter((entry) => entry.date.startsWith(month)).length;
  }

  getTotalJournalDebits(): number {
    return this.finance.journalEntries.reduce((sum, entry) => sum + entry.totalDebit, 0);
  }

  getTotalJournalCredits(): number {
    return this.finance.journalEntries.reduce((sum, entry) => sum + entry.totalCredit, 0);
  }

  getTotalInvoiceDue(): number {
    return this.finance.invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  }

  getTotalInvoiceOverdue(): number {
    const today = new Date();
    return this.finance.invoices
      .filter((invoice) => new Date(invoice.dueDate) < today)
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  }

  getTotalInvoiceDueThisWeek(): number {
    const today = new Date();
    const weekFromToday = new Date(today);
    weekFromToday.setDate(today.getDate() + 7);
    return this.finance.invoices
      .filter((invoice) => {
        const dueDate = new Date(invoice.dueDate);
        return dueDate >= today && dueDate <= weekFromToday;
      })
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  }

  getEstimatedInvoiceCollection(): number {
    return this.getTotalInvoiceDue() * 0.4;
  }

  processBatchPayments(): void {
    const pending = this.finance.invoices.filter((invoice) => invoice.status !== 'Paid');
    if (!pending.length) {
      alert('No pending invoices to process.');
      return;
    }
    pending.forEach((invoice) => (invoice.status = 'Paid'));
    this.finance.saveToLocalStorage();
    alert(`${pending.length} invoice(s) processed and marked as paid.`);
  }

  viewJournal(entry: JournalEntry): void {
    alert(`Journal Entry ${entry.journalNo}\nDate: ${entry.date}\nType: ${entry.type}\nDescription: ${entry.description}\nStatus: ${entry.status}`);
  }

  get filteredCOA() {
    return this.finance.chartOfAccounts.filter((account) => {
      const searchLower = this.coaSearchTerm.toLowerCase();
      const matchesSearch = !searchLower || account.name.toLowerCase().includes(searchLower) || account.code.toLowerCase().includes(searchLower);
      const matchesType = this.coaTypeFilter === 'all' || account.type === this.coaTypeFilter;
      const matchesStatus = this.coaStatusFilter === 'all' || account.status === this.coaStatusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  get filteredJournals() {
    return this.finance.journalEntries.filter((entry) => {
      const searchLower = this.journalSearchTerm.toLowerCase();
      const matchesSearch = !searchLower || entry.description.toLowerCase().includes(searchLower) || entry.journalNo.toLowerCase().includes(searchLower);
      const matchesStatus = this.journalStatusFilter === 'all' || entry.status === this.journalStatusFilter;
      const matchesDate = !this.journalDateFilter || entry.date === this.journalDateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  get filteredAPInvoices() {
    return this.finance.invoices.filter((invoice) => {
      const searchLower = this.apSearchTerm.toLowerCase();
      const matchesSearch = !searchLower || invoice.vendor.toLowerCase().includes(searchLower) || invoice.invoiceNo.toLowerCase().includes(searchLower);
      const matchesStatus = this.apStatusFilter === 'all' || invoice.status.toLowerCase() === this.apStatusFilter;
      const matchesVendor = this.apVendorFilter === 'all' || invoice.vendor === this.apVendorFilter;
      return matchesSearch && matchesStatus && matchesVendor;
    });
  }

  get filteredAPVendors() {
    return Array.from(new Set(this.finance.invoices.map((invoice) => invoice.vendor)));
  }

  get balanceSheetData() {
    return this.finance.chartOfAccounts.filter((account) => account.type === 'Asset' || account.type === 'Liability' || account.type === 'Equity');
  }

  get domainLabel(): string {
    return this.finance.getDomainLabel(this.finance.currentDomain);
  }

  toggleSection(tab: string, section: string): void {
    if (section === 'coa') {
      this.coaTab = tab;
    }
    if (section === 'gl') {
      this.glTab = tab;
    }
    if (section === 'ap') {
      this.apTab = tab;
    }
    if (section === 'ar') {
      this.arTab = tab;
    }
    if (section === 'assets') {
      this.assetsTab = tab;
    }
    if (section === 'bank') {
      this.bankTab = tab;
    }
    if (section === 'budget') {
      this.budgetTab = tab;
    }
    if (section === 'reports') {
      this.reportsTab = tab;
    }
    if (section === 'setup') {
      this.setupTab = tab;
    }
    this.renderCurrentCharts();
  }

  openAddAccountModal(account?: any): void {
    if (account) {
      this.editingAccountId = account.id;
      this.accountForm = {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        subType: account.subType,
        balance: account.balance,
        currency: account.currency,
        description: account.description || '',
        parentId: account.parentId || null,
        status: account.status
      };
    } else {
      this.editingAccountId = null;
      this.accountForm = {
        id: 0,
        code: '',
        name: '',
        type: '',
        subType: '',
        balance: 0,
        currency: 'USD',
        description: '',
        parentId: null,
        status: 'Active'
      };
    }
    this.showAddAccountModalFlag = true;
  }

  closeAddAccountModal(): void {
    this.showAddAccountModalFlag = false;
  }

  saveAccount(): void {
    if (!this.accountForm.code || !this.accountForm.name || !this.accountForm.type) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.editingAccountId !== null) {
      const existing = this.finance.chartOfAccounts.find((account) => account.id === this.editingAccountId);
      if (existing) {
        Object.assign(existing, this.accountForm);
      }
    } else {
      const newId = Math.max(0, ...this.finance.chartOfAccounts.map((item) => item.id)) + 1;
      this.finance.chartOfAccounts.push({
        ...this.accountForm,
        id: newId
      });
    }

    this.finance.saveToLocalStorage();
    this.closeAddAccountModal();
    alert('Account saved successfully.');
  }

  toggleAccountStatus(account: any): void {
    account.status = account.status === 'Active' ? 'Inactive' : 'Active';
    this.finance.saveToLocalStorage();
  }

  exportCOA(): void {
    const dataStr = JSON.stringify(this.finance.chartOfAccounts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'chart-of-accounts.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  loadSampleCOA(): void {
    if (confirm('Load sample chart of accounts? This will replace your local data.')) {
      this.finance.loadSampleData();
      alert('Sample chart of accounts loaded.');
    }
  }

  addJournalLine(): void {
    this.journalForm.lines.push({ account: '', debit: 0, credit: 0, description: '' });
  }

  removeJournalLine(index: number): void {
    this.journalForm.lines.splice(index, 1);
  }

  get journalTotals() {
    const totals = { debit: 0, credit: 0 };
    this.journalForm.lines.forEach((line) => {
      totals.debit += line.debit || 0;
      totals.credit += line.credit || 0;
    });
    return totals;
  }

  get journalDifference() {
    return this.journalTotals.debit - this.journalTotals.credit;
  }

  saveJournalEntry(): void {
    if (!this.journalForm.date || !this.journalForm.description) {
      alert('Please fill in all required fields.');
      return;
    }

    if (this.journalForm.lines.every((line) => !(line.debit || line.credit))) {
      alert('Please add at least one line with debit or credit.');
      return;
    }

    if (Math.abs(this.journalDifference) > 0.01) {
      alert('Journal entry must balance.');
      return;
    }

    const newId = Math.max(0, ...this.finance.journalEntries.map((item) => item.id)) + 1;
    const journalNo = `JRNL-${(newId + 1000).toString().padStart(3, '0')}`;

    this.finance.journalEntries.push({
      id: newId,
      date: this.journalForm.date,
      journalNo,
      description: this.journalForm.description,
      type: this.journalForm.type,
      reference: this.journalForm.reference,
      lines: this.journalForm.lines.map((line) => ({ ...line })),
      status: 'Draft',
      totalDebit: this.journalTotals.debit,
      totalCredit: this.journalTotals.credit
    });

    this.finance.saveToLocalStorage();
    this.closeJournalEntryModal();
    alert('Journal entry saved successfully.');
  }

  closeJournalEntryModal(): void {
    this.showJournalEntryModalFlag = false;
    this.journalForm = {
      date: new Date().toISOString().split('T')[0],
      type: 'General',
      description: '',
      reference: '',
      lines: [{ account: '', debit: 0, credit: 0, description: '' }]
    };
  }

  postJournalEntry(entry: JournalEntry): void {
    if (entry.status === 'Posted') {
      alert('Journal entry already posted.');
      return;
    }

    if (confirm(`Post journal entry ${entry.journalNo}?`)) {
      entry.status = 'Posted';
      this.finance.saveToLocalStorage();
      this.finance.addNotification('Journal Posted', `Journal entry ${entry.journalNo} has been posted.`);
      alert('Journal entry posted successfully.');
    }
  }

  postAllEntries(): void {
    const unposted = this.finance.journalEntries.filter((entry) => entry.status !== 'Posted');
    if (!unposted.length) {
      alert('No unposted journal entries found.');
      return;
    }
    if (confirm(`Post ${unposted.length} unposted entries?`)) {
      unposted.forEach((entry) => (entry.status = 'Posted'));
      this.finance.saveToLocalStorage();
      alert(`${unposted.length} entries posted.`);
    }
  }

  runMonthEndClose(): void {
    if (confirm('Run month-end closing process?')) {
      alert('Month-end close completed.');
    }
  }

  payInvoice(invoice: Invoice): void {
    if (invoice.status === 'Paid') {
      alert('Invoice already paid.');
      return;
    }
    if (confirm(`Pay invoice ${invoice.invoiceNo} for ${this.finance.formatCurrency(invoice.amount)}?`)) {
      invoice.status = 'Paid';
      this.finance.saveToLocalStorage();
      alert('Invoice paid successfully.');
    }
  }

  viewInvoice(invoice: Invoice): void {
    alert(`Invoice: ${invoice.invoiceNo}\nVendor: ${invoice.vendor}\nDate: ${invoice.date}\nDue Date: ${invoice.dueDate}\nAmount: ${this.finance.formatCurrency(invoice.amount)}\nStatus: ${invoice.status}`);
  }

  createInvoice(): void {
    if (!this.invoiceForm.vendor || !this.invoiceForm.invoiceNo || !this.invoiceForm.amount) {
      alert('Please complete the invoice form.');
      return;
    }
    const newId = Math.max(0, ...this.finance.invoices.map((invoice) => invoice.id)) + 1;
    this.finance.invoices.push({
      id: newId,
      vendor: this.invoiceForm.vendor,
      invoiceNo: this.invoiceForm.invoiceNo,
      date: this.invoiceForm.date,
      dueDate: this.invoiceForm.dueDate,
      amount: this.invoiceForm.amount,
      description: this.invoiceForm.description,
      account: this.invoiceForm.account,
      status: 'Pending'
    });
    this.finance.saveToLocalStorage();
    this.closeInvoiceModal();
    alert('Invoice created successfully.');
  }

  closeInvoiceModal(): void {
    this.showInvoiceModalFlag = false;
    this.invoiceForm = {
      vendor: '',
      invoiceNo: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      amount: 0,
      description: '',
      account: ''
    };
  }

  applyDomainSettings(domain: string): void {
    this.finance.applyDomainSettings(domain);
    alert(`Domain settings for ${domain} applied.`);
  }

  closeModal(event: Event, modal: 'account' | 'journal' | 'invoice'): void {
    if (event.target === event.currentTarget) {
      if (modal === 'account') {
        this.closeAddAccountModal();
      } else if (modal === 'journal') {
        this.closeJournalEntryModal();
      } else if (modal === 'invoice') {
        this.closeInvoiceModal();
      }
    }
  }

  loadUserProfile(): void {
    this.finance.loadUserProfile().subscribe({
      next: (profile) => {
        this.profileForm.displayName = profile.displayName || profile.username;
        this.profileForm.email = profile.email;
        this.profileForm.phone = profile.phone || '';
      },
      error: () => {
        // Continue using local profile data when backend is unavailable
      }
    });
  }

  saveProfile(): void {
    this.profileError = '';
    this.profileMessage = '';

    this.finance.updateUserProfile(this.profileForm).subscribe({
      next: (profile) => {
        this.profileMessage = 'Profile updated successfully.';
        this.profileForm.displayName = profile.displayName || profile.username;
        this.profileForm.email = profile.email;
        this.profileForm.phone = profile.phone || '';
        this.finance.currentUser = {
          ...this.finance.currentUser,
          name: profile.displayName || profile.username,
          email: profile.email
        };
        this.finance.saveToLocalStorage();
      },
      error: () => {
        this.profileError = 'Unable to save profile. Please try again.';
      }
    });
  }

  changePassword(): void {
    this.passwordError = '';
    this.passwordMessage = '';

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'New password and confirmation do not match.';
      return;
    }

    this.finance.changePassword(this.passwordForm.currentPassword, this.passwordForm.newPassword).subscribe({
      next: () => {
        this.passwordMessage = 'Password changed successfully.';
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: () => {
        this.passwordError = 'Unable to change password. Verify your current password and try again.';
      }
    });
  }

  loadDashboardData(): void {
    this.finance.loadDashboard().subscribe({
      next: (dashboard) => this.finance.applyDashboardResponse(dashboard),
      error: () => {
        // Keep local sample data when backend is unavailable
      }
    });
  }

  get accountParents() {
    return this.finance.chartOfAccounts;
  }

  get totalUsers() {
    return this.finance.users.length;
  }

  get activeUsers() {
    return this.finance.users.filter((user) => user.status === 'Active').length;
  }

  get inactiveUsers() {
    return this.finance.users.filter((user) => user.status !== 'Active').length;
  }
}
