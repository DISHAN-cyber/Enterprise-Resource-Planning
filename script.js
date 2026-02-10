// Global State Management
        class ERPFinanceSystem {
            constructor() {
                this.state = {
                    currentDomain: 'general',
                    currentUser: {
                        id: 1,
                        name: 'Admin User',
                        role: 'admin',
                        email: 'admin@company.com',
                        department: 'Finance'
                    },
                    chartOfAccounts: [],
                    journalEntries: [],
                    vendors: [],
                    customers: [],
                    invoices: [],
                    bankAccounts: [],
                    fixedAssets: [],
                    budgets: [],
                    users: [],
                    notifications: [],
                    financialData: {
                        revenue: 245830,
                        accountsReceivable: 42560,
                        accountsPayable: 28750,
                        cashBalance: 125420
                    }
                };
                
                this.init();
            }
            
            init() {
                this.loadFromLocalStorage();
                this.setupEventListeners();
                this.renderDashboard();
                this.showPage('dashboard');
            }
            
            loadFromLocalStorage() {
                const saved = localStorage.getItem('erpFinanceData');
                if (saved) {
                    this.state = JSON.parse(saved);
                } else {
                    this.loadSampleData();
                }
            }
            
            saveToLocalStorage() {
                localStorage.setItem('erpFinanceData', JSON.stringify(this.state));
            }
            
            loadSampleData() {
                // Chart of Accounts
                this.state.chartOfAccounts = [
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
                
                // Journal Entries
                this.state.journalEntries = [
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
                
                // Invoices
                this.state.invoices = [
                    { id: 1, vendor: 'Office Supplies Ltd', invoiceNo: 'INV-001', date: '2023-10-01', dueDate: '2023-10-31', amount: 1250.50, status: 'Pending' },
                    { id: 2, vendor: 'Tech Solutions Inc', invoiceNo: 'INV-002', date: '2023-10-05', dueDate: '2023-11-04', amount: 3500.00, status: 'Pending' },
                    { id: 3, vendor: 'Utilities Corp', invoiceNo: 'INV-003', date: '2023-09-25', dueDate: '2023-10-25', amount: 850.75, status: 'Overdue' }
                ];
                
                // Users
                this.state.users = [
                    { id: 1, userId: 'USR001', fullName: 'Admin User', email: 'admin@company.com', role: 'Administrator', department: 'Finance', lastLogin: '2023-10-31 09:15', status: 'Active' },
                    { id: 2, userId: 'USR002', fullName: 'John Smith', email: 'john.smith@company.com', role: 'Accountant', department: 'Finance', lastLogin: '2023-10-30 14:30', status: 'Active' }
                ];
                
                // Notifications
                this.state.notifications = [
                    { id: 1, title: 'Overdue Invoice', message: 'Invoice INV-003 is overdue by 5 days', type: 'warning', timestamp: '2023-10-26 10:30' },
                    { id: 2, title: 'Journal Posted', message: 'Journal entry JRNL-002 has been posted', type: 'info', timestamp: '2023-10-25 14:15' },
                    { id: 3, title: 'New User Added', message: 'New user John Smith has been added', type: 'success', timestamp: '2023-10-24 09:45' }
                ];
                
                this.saveToLocalStorage();
            }
            
            setupEventListeners() {
                // Sidebar navigation
                document.querySelectorAll('.sidebar-menu a').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const page = e.target.closest('a').getAttribute('data-page');
                        document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
                        e.target.closest('a').classList.add('active');
                        this.showPage(page);
                    });
                });
                
                // Toggle sidebar
                document.getElementById('toggleSidebar').addEventListener('click', () => {
                    document.getElementById('sidebar').classList.toggle('active');
                });
                
                // Tab switching
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        const tabId = e.target.getAttribute('data-tab');
                        const parent = e.target.closest('.module-section');
                        
                        parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                        e.target.classList.add('active');
                        
                        parent.querySelectorAll('.tab-content').forEach(content => {
                            content.classList.remove('active');
                        });
                        
                        const tabContent = parent.querySelector(`#${tabId}Tab`);
                        if (tabContent) {
                            tabContent.classList.add('active');
                        }
                    });
                });
                
                // Close modals when clicking outside
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            this.closeModal(modal.id);
                        }
                    });
                });
                
                // Initialize date fields
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('journalDate').value = today;
                document.getElementById('invoiceDate').value = today;
                document.getElementById('invoiceDueDate').value = this.addDays(today, 30);
            }
            
            // Utility Methods
            addDays(dateStr, days) {
                const date = new Date(dateStr);
                date.setDate(date.getDate() + days);
                return date.toISOString().split('T')[0];
            }
            
            formatCurrency(amount) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                }).format(amount);
            }
            
            // Page Navigation
            showPage(page) {
                // Hide all pages
                document.querySelectorAll('.page-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show selected page
                const pageContent = document.getElementById(`${page}Content`);
                if (pageContent) {
                    pageContent.style.display = 'block';
                }
                
                // Update page title
                const pageTitles = {
                    'dashboard': 'Finance Dashboard',
                    'coa': 'Chart of Accounts',
                    'gl': 'General Ledger',
                    'ap': 'Accounts Payable',
                    'ar': 'Accounts Receivable',
                    'assets': 'Fixed Assets',
                    'bank': 'Bank & Reconciliation',
                    'budget': 'Budgeting',
                    'reports': 'Financial Reports',
                    'users': 'User Management',
                    'setup': 'Module Setup',
                    'comparison': 'Domain Comparison'
                };
                
                document.getElementById('pageTitle').textContent = pageTitles[page] || 'Finance Module';
                
                // Load page-specific data
                switch(page) {
                    case 'dashboard':
                        this.renderDashboard();
                        break;
                    case 'coa':
                        this.renderChartOfAccounts();
                        break;
                    case 'gl':
                        this.renderGeneralLedger();
                        break;
                    case 'ap':
                        this.renderAccountsPayable();
                        break;
                    case 'users':
                        this.renderUsers();
                        break;
                }
                
                // Close sidebar on mobile
                if (window.innerWidth <= 1200) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            }
            
            // Modal Methods
            showModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    
                    if (modalId === 'journalEntryModal') {
                        this.populateJournalAccountDropdown();
                    }
                    
                    if (modalId === 'addAccountModal') {
                        this.populateParentAccounts();
                    }
                }
            }
            
            closeModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('active');
                    if (modalId === 'addAccountModal') {
                        document.getElementById('addAccountForm').reset();
                    }
                    if (modalId === 'journalEntryModal') {
                        document.getElementById('journalEntryForm').reset();
                        document.getElementById('journalLines').innerHTML = `
                            <div class="journal-line" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                                <select class="form-control" style="flex: 2;" onchange="erpSystem.updateAccountBalance(this)">
                                    <option value="">Select Account</option>
                                </select>
                                <input type="number" class="form-control" placeholder="Debit" style="flex: 1;" onchange="erpSystem.updateDebitCredit()" step="0.01">
                                <input type="number" class="form-control" placeholder="Credit" style="flex: 1;" onchange="erpSystem.updateDebitCredit()" step="0.01">
                                <input type="text" class="form-control" placeholder="Line Description" style="flex: 2;">
                                <button type="button" class="btn btn-danger btn-sm" onclick="erpSystem.removeJournalLine(this)"><i class="fas fa-times"></i></button>
                            </div>
                        `;
                    }
                }
            }
            
            // User Menu
            showUserMenu() {
                const menu = document.getElementById('userMenu');
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
            
            toggleNotifications() {
                const panel = document.getElementById('notificationsPanel');
                panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                if (panel.style.display === 'block') {
                    this.renderNotifications();
                }
            }
            
            clearAllNotifications() {
                this.state.notifications = [];
                this.saveToLocalStorage();
                this.renderNotifications();
                document.querySelector('.notification-badge').textContent = '0';
            }
            
            // Dashboard Methods
            renderDashboard() {
                // Update metrics
                document.getElementById('totalRevenue').textContent = this.formatCurrency(this.state.financialData.revenue);
                document.getElementById('totalAR').textContent = this.formatCurrency(this.state.financialData.accountsReceivable);
                document.getElementById('totalAP').textContent = this.formatCurrency(this.state.financialData.accountsPayable);
                document.getElementById('cashBalance').textContent = this.formatCurrency(this.state.financialData.cashBalance);
                
                // Render chart
                this.renderFinancialChart();
                
                // Render pending actions
                this.renderPendingActions();
                
                // Update notification badge
                document.querySelector('.notification-badge').textContent = this.state.notifications.length;
            }
            
            renderFinancialChart() {
                const ctx = document.getElementById('financialChart').getContext('2d');
                if (window.financialChart) {
                    window.financialChart.destroy();
                }
                
                window.financialChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                        datasets: [
                            {
                                label: 'Revenue',
                                data: [120, 190, 300, 500, 250, 400, 320, 480, 420, 450],
                                borderColor: '#2e7d32',
                                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'Expenses',
                                data: [80, 120, 200, 300, 180, 250, 280, 320, 300, 280],
                                borderColor: '#d32f2f',
                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                fill: true,
                                tension: 0.4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value + 'k';
                                    }
                                }
                            }
                        }
                    }
                });
            }
            
            renderPendingActions() {
                const table = document.getElementById('pendingActions');
                const actions = [
                    { action: 'Approve journal entries', module: 'General Ledger', priority: 'High', dueDate: 'Today', status: 'Pending' },
                    { action: 'Reconcile bank statement', module: 'Bank Reconciliation', priority: 'High', dueDate: 'Today', status: 'Pending' },
                    { action: 'Process vendor payments', module: 'Accounts Payable', priority: 'Medium', dueDate: 'Tomorrow', status: 'Pending' },
                    { action: 'Follow up on overdue invoices', module: 'Accounts Receivable', priority: 'Medium', dueDate: 'This week', status: 'Pending' }
                ];
                
                table.innerHTML = '';
                actions.forEach(action => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${action.action}</td>
                        <td>${action.module}</td>
                        <td><span class="badge ${action.priority === 'High' ? 'badge-danger' : 'badge-warning'}">${action.priority}</span></td>
                        <td>${action.dueDate}</td>
                        <td><span class="badge badge-warning">${action.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.completeAction('${action.action}')">
                                <i class="fas fa-check"></i> Complete
                            </button>
                        </td>
                    `;
                    table.appendChild(row);
                });
            }
            
            completeAction(actionName) {
                alert(`Action "${actionName}" marked as complete!`);
                this.renderPendingActions();
            }
            
            markAllComplete() {
                if (confirm('Mark all pending actions as complete?')) {
                    alert('All actions marked as complete!');
                    this.renderPendingActions();
                }
            }
            
            updateFinancialChart() {
                const period = document.getElementById('chartPeriod').value;
                alert(`Financial chart updated for period: ${period}`);
                this.renderFinancialChart();
            }
            
            // Chart of Accounts Methods
            renderChartOfAccounts() {
                this.renderCOATable();
                this.renderCOAHierarchy();
                this.renderCOABalances();
                this.renderCOAChart();
            }
            
            renderCOATable() {
                const table = document.getElementById('coaTable');
                table.innerHTML = '';
                
                this.state.chartOfAccounts.forEach(account => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${account.code}</strong></td>
                        <td>${account.name}</td>
                        <td><span class="badge ${this.getAccountTypeBadge(account.type)}">${account.type}</span></td>
                        <td>${account.subType || '-'}</td>
                        <td>${this.formatCurrency(account.balance)}</td>
                        <td><span class="badge ${account.status === 'Active' ? 'badge-success' : 'badge-danger'}">${account.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.editAccount(${account.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.toggleAccountStatus(${account.id})">
                                <i class="fas ${account.status === 'Active' ? 'fa-ban' : 'fa-check'}"></i>
                            </button>
                        </td>
                    `;
                    table.appendChild(row);
                });
            }
            
            getAccountTypeBadge(type) {
                const badges = {
                    'Asset': 'badge-primary',
                    'Liability': 'badge-warning',
                    'Equity': 'badge-success',
                    'Revenue': 'badge-info',
                    'Expense': 'badge-danger'
                };
                return badges[type] || 'badge-primary';
            }
            
            renderCOAHierarchy() {
                const container = document.getElementById('coaHierarchy');
                let html = '<div style="padding: 20px;">';
                
                // Group by type
                const grouped = {};
                this.state.chartOfAccounts.forEach(account => {
                    if (!grouped[account.type]) {
                        grouped[account.type] = [];
                    }
                    grouped[account.type].push(account);
                });
                
                Object.keys(grouped).forEach(type => {
                    html += `<div style="margin-bottom: 25px;">
                        <h4 style="color: var(--primary); margin-bottom: 10px;">
                            <i class="fas fa-folder"></i> ${type} Accounts
                        </h4>
                        <div style="margin-left: 20px;">`;
                    
                    grouped[type].forEach(account => {
                        html += `<div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <div style="width: 100px; font-weight: 600;">${account.code}</div>
                            <div style="flex: 1;">${account.name}</div>
                            <div style="width: 120px; text-align: right;">
                                ${this.formatCurrency(account.balance)}
                            </div>
                        </div>`;
                    });
                    
                    html += '</div></div>';
                });
                
                html += '</div>';
                container.innerHTML = html;
            }
            
            renderCOABalances() {
                const table = document.getElementById('coaBalancesTable');
                
                // Calculate totals by type
                const typeTotals = {};
                this.state.chartOfAccounts.forEach(account => {
                    if (!typeTotals[account.type]) {
                        typeTotals[account.type] = { count: 0, total: 0 };
                    }
                    typeTotals[account.type].count++;
                    typeTotals[account.type].total += account.balance;
                });
                
                const grandTotal = Object.values(typeTotals).reduce((sum, type) => sum + type.total, 0);
                
                table.innerHTML = '';
                Object.keys(typeTotals).forEach(type => {
                    const percentage = ((typeTotals[type].total / grandTotal) * 100).toFixed(1);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${type}</td>
                        <td>${typeTotals[type].count}</td>
                        <td>${this.formatCurrency(typeTotals[type].total)}</td>
                        <td>
                            <div style="display: flex; align-items: center;">
                                <div style="width: 100px; height: 8px; background: #eee; border-radius: 4px; margin-right: 10px;">
                                    <div style="width: ${percentage}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
                                </div>
                                ${percentage}%
                            </div>
                        </td>
                    `;
                    table.appendChild(row);
                });
            }
            
            renderCOAChart() {
                const ctx = document.getElementById('coaBalanceChart').getContext('2d');
                if (window.coaChart) {
                    window.coaChart.destroy();
                }
                
                // Calculate totals by type
                const typeTotals = {};
                this.state.chartOfAccounts.forEach(account => {
                    if (!typeTotals[account.type]) {
                        typeTotals[account.type] = 0;
                    }
                    typeTotals[account.type] += account.balance;
                });
                
                window.coaChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(typeTotals),
                        datasets: [{
                            data: Object.values(typeTotals),
                            backgroundColor: ['#3949ab', '#ff9800', '#2e7d32', '#d32f2f', '#0288d1'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'right' }
                        }
                    }
                });
            }
            
            searchCOA() {
                const searchTerm = document.getElementById('coaSearch').value.toLowerCase();
                const rows = document.querySelectorAll('#coaTable tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
            
            filterCOA() {
                const typeFilter = document.getElementById('coaTypeFilter').value;
                const statusFilter = document.getElementById('coaStatusFilter').value;
                const rows = document.querySelectorAll('#coaTable tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 6) return;
                    
                    const type = cells[2].textContent.trim();
                    const status = cells[5].textContent.trim();
                    
                    const typeMatch = typeFilter === 'all' || type === typeFilter;
                    const statusMatch = statusFilter === 'all' || status === statusFilter;
                    
                    row.style.display = typeMatch && statusMatch ? '' : 'none';
                });
            }
            
            populateParentAccounts() {
                const select = document.getElementById('parentAccount');
                select.innerHTML = '<option value="">No Parent (Top Level)</option>';
                this.state.chartOfAccounts.forEach(account => {
                    const option = document.createElement('option');
                    option.value = account.id;
                    option.textContent = `${account.code} - ${account.name}`;
                    select.appendChild(option);
                });
            }
            
            saveAccount() {
                const code = document.getElementById('accountCode').value;
                const name = document.getElementById('accountName').value;
                const type = document.getElementById('accountType').value;
                const balance = parseFloat(document.getElementById('accountBalance').value) || 0;
                
                if (!code || !name || !type) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                const newAccount = {
                    id: this.state.chartOfAccounts.length + 1,
                    code: code,
                    name: name,
                    type: type,
                    subType: document.getElementById('accountSubType').value,
                    balance: balance,
                    currency: document.getElementById('accountCurrency').value,
                    status: document.getElementById('accountActive').checked ? 'Active' : 'Inactive',
                    description: document.getElementById('accountDescription').value,
                    parentId: document.getElementById('parentAccount').value || null
                };
                
                this.state.chartOfAccounts.push(newAccount);
                this.saveToLocalStorage();
                this.renderChartOfAccounts();
                this.closeModal('addAccountModal');
                alert('Account added successfully!');
            }
            
            editAccount(accountId) {
                const account = this.state.chartOfAccounts.find(acc => acc.id === accountId);
                if (!account) return;
                
                // Populate form
                document.getElementById('accountCode').value = account.code;
                document.getElementById('accountName').value = account.name;
                document.getElementById('accountType').value = account.type;
                document.getElementById('accountSubType').value = account.subType || '';
                document.getElementById('accountBalance').value = account.balance;
                document.getElementById('accountCurrency').value = account.currency || 'USD';
                document.getElementById('accountDescription').value = account.description || '';
                document.getElementById('accountActive').checked = account.status === 'Active';
                
                this.showModal('addAccountModal');
                
                // Change save button behavior
                const saveBtn = document.querySelector('#addAccountModal .btn-primary');
                saveBtn.textContent = 'Update Account';
                saveBtn.onclick = () => this.updateAccount(accountId);
            }
            
            updateAccount(accountId) {
                const accountIndex = this.state.chartOfAccounts.findIndex(acc => acc.id === accountId);
                if (accountIndex === -1) return;
                
                const code = document.getElementById('accountCode').value;
                const name = document.getElementById('accountName').value;
                const type = document.getElementById('accountType').value;
                const balance = parseFloat(document.getElementById('accountBalance').value) || 0;
                
                if (!code || !name || !type) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                this.state.chartOfAccounts[accountIndex] = {
                    ...this.state.chartOfAccounts[accountIndex],
                    code: code,
                    name: name,
                    type: type,
                    subType: document.getElementById('accountSubType').value,
                    balance: balance,
                    currency: document.getElementById('accountCurrency').value,
                    status: document.getElementById('accountActive').checked ? 'Active' : 'Inactive',
                    description: document.getElementById('accountDescription').value,
                    parentId: document.getElementById('parentAccount').value || null
                };
                
                this.saveToLocalStorage();
                this.renderChartOfAccounts();
                this.closeModal('addAccountModal');
                
                // Reset button
                const saveBtn = document.querySelector('#addAccountModal .btn-primary');
                saveBtn.textContent = 'Save Account';
                saveBtn.onclick = () => this.saveAccount();
                
                alert('Account updated successfully!');
            }
            
            toggleAccountStatus(accountId) {
                const accountIndex = this.state.chartOfAccounts.findIndex(acc => acc.id === accountId);
                if (accountIndex === -1) return;
                
                const account = this.state.chartOfAccounts[accountIndex];
                const newStatus = account.status === 'Active' ? 'Inactive' : 'Active';
                
                if (confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} account ${account.code}?`)) {
                    this.state.chartOfAccounts[accountIndex].status = newStatus;
                    this.saveToLocalStorage();
                    this.renderChartOfAccounts();
                    alert(`Account ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
                }
            }
            
            exportCOA() {
                const dataStr = JSON.stringify(this.state.chartOfAccounts, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const link = document.createElement('a');
                link.setAttribute('href', dataUri);
                link.setAttribute('download', 'chart_of_accounts.json');
                link.click();
                alert('Chart of Accounts exported successfully!');
            }
            
            loadSampleCOA() {
                if (confirm('Load sample chart of accounts? This will replace your current data.')) {
                    this.loadSampleData();
                    this.renderChartOfAccounts();
                    alert('Sample Chart of Accounts loaded successfully!');
                }
            }
            
            // General Ledger Methods
            renderGeneralLedger() {
                this.renderJournalTable();
                this.updateGLMetrics();
                this.renderTrialBalanceTable();
                this.renderTrialBalanceChart();
            }
            
            renderJournalTable() {
                const table = document.getElementById('journalTable');
                table.innerHTML = '';
                
                this.state.journalEntries.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${entry.date}</td>
                        <td><strong>${entry.journalNo}</strong></td>
                        <td>${entry.description}</td>
                        <td>${this.formatCurrency(entry.totalDebit)}</td>
                        <td>${this.formatCurrency(entry.totalCredit)}</td>
                        <td><span class="badge ${this.getJournalStatusBadge(entry.status)}">${entry.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.viewJournalEntry(${entry.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.postJournalEntry(${entry.id})" ${entry.status === 'Posted' ? 'disabled' : ''}>
                                <i class="fas fa-check"></i>
                            </button>
                        </td>
                    `;
                    table.appendChild(row);
                });
            }
            
            getJournalStatusBadge(status) {
                const badges = {
                    'Draft': 'badge-warning',
                    'Pending': 'badge-info',
                    'Posted': 'badge-success',
                    'Reversed': 'badge-danger'
                };
                return badges[status] || 'badge-primary';
            }
            
            updateGLMetrics() {
                const totalJournals = this.state.journalEntries.length;
                const unpostedJournals = this.state.journalEntries.filter(je => je.status !== 'Posted').length;
                
                let totalDebit = 0;
                let totalCredit = 0;
                this.state.journalEntries.forEach(entry => {
                    totalDebit += entry.totalDebit;
                    totalCredit += entry.totalCredit;
                });
                
                document.getElementById('totalJournals').textContent = totalJournals;
                document.getElementById('unpostedJournals').textContent = unpostedJournals;
                document.getElementById('monthJournals').textContent = this.state.journalEntries.filter(je => 
                    je.date.startsWith('2023-10')).length;
                document.getElementById('debitCreditBalance').textContent = 
                    `${this.formatCurrency(totalDebit)} / ${this.formatCurrency(totalCredit)}`;
            }
            
            populateJournalAccountDropdown() {
                const dropdowns = document.querySelectorAll('#journalLines select');
                dropdowns.forEach(dropdown => {
                    dropdown.innerHTML = '<option value="">Select Account</option>';
                    this.state.chartOfAccounts.forEach(account => {
                        if (account.status === 'Active') {
                            const option = document.createElement('option');
                            option.value = account.name;
                            option.textContent = `${account.code} - ${account.name}`;
                            dropdown.appendChild(option);
                        }
                    });
                });
            }
            
            addJournalLine() {
                const container = document.getElementById('journalLines');
                const lineDiv = document.createElement('div');
                lineDiv.className = 'journal-line';
                lineDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px; align-items: center;';
                lineDiv.innerHTML = `
                    <select class="form-control" style="flex: 2;" onchange="erpSystem.updateAccountBalance(this)">
                        <option value="">Select Account</option>
                    </select>
                    <input type="number" class="form-control" placeholder="Debit" style="flex: 1;" onchange="erpSystem.updateDebitCredit()" step="0.01">
                    <input type="number" class="form-control" placeholder="Credit" style="flex: 1;" onchange="erpSystem.updateDebitCredit()" step="0.01">
                    <input type="text" class="form-control" placeholder="Line Description" style="flex: 2;">
                    <button type="button" class="btn btn-danger btn-sm" onclick="erpSystem.removeJournalLine(this)"><i class="fas fa-times"></i></button>
                `;
                container.appendChild(lineDiv);
                this.populateJournalAccountDropdown();
            }
            
            removeJournalLine(button) {
                button.parentElement.remove();
                this.updateDebitCredit();
            }
            
            updateDebitCredit() {
                const debitInputs = document.querySelectorAll('#journalLines input[placeholder="Debit"]');
                const creditInputs = document.querySelectorAll('#journalLines input[placeholder="Credit"]');
                
                let totalDebit = 0;
                let totalCredit = 0;
                
                debitInputs.forEach(input => {
                    totalDebit += parseFloat(input.value) || 0;
                });
                
                creditInputs.forEach(input => {
                    totalCredit += parseFloat(input.value) || 0;
                });
                
                const diff = totalDebit - totalCredit;
                
                document.getElementById('totalDebit').value = totalDebit.toFixed(2);
                document.getElementById('totalCredit').value = totalCredit.toFixed(2);
                document.getElementById('debitCreditDiff').value = diff.toFixed(2);
                
                const statusDiv = document.getElementById('balanceStatus');
                if (Math.abs(diff) < 0.01) {
                    statusDiv.innerHTML = '<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Journal entry is balanced</span>';
                    statusDiv.style.display = 'block';
                    document.getElementById('debitCreditDiff').style.color = 'var(--success)';
                } else {
                    statusDiv.innerHTML = `<span style="color: var(--danger);"><i class="fas fa-exclamation-triangle"></i> Journal entry is unbalanced by ${Math.abs(diff).toFixed(2)}</span>`;
                    statusDiv.style.display = 'block';
                    document.getElementById('debitCreditDiff').style.color = 'var(--danger)';
                }
            }
            
            saveJournalEntry() {
                const date = document.getElementById('journalDate').value;
                const description = document.getElementById('journalDescription').value;
                
                if (!date || !description) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                // Get journal lines
                const journalLines = document.querySelectorAll('#journalLines .journal-line');
                const lines = [];
                
                journalLines.forEach(line => {
                    const accountSelect = line.querySelector('select');
                    const debitInput = line.querySelector('input[placeholder="Debit"]');
                    const creditInput = line.querySelector('input[placeholder="Credit"]');
                    const lineDescInput = line.querySelector('input[placeholder="Line Description"]');
                    
                    if (accountSelect.value) {
                        const debit = parseFloat(debitInput.value) || 0;
                        const credit = parseFloat(creditInput.value) || 0;
                        
                        if (debit > 0 || credit > 0) {
                            lines.push({
                                account: accountSelect.value,
                                debit: debit,
                                credit: credit,
                                description: lineDescInput.value || ''
                            });
                        }
                    }
                });
                
                if (lines.length === 0) {
                    alert('Please add at least one journal line');
                    return;
                }
                
                // Check balance
                const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
                const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
                
                if (Math.abs(totalDebit - totalCredit) > 0.01) {
                    alert('Journal entry must balance. Debits must equal credits.');
                    return;
                }
                
                // Generate journal number
                const journalNo = 'JRNL-' + (this.state.journalEntries.length + 1001).toString().padStart(3, '0');
                
                const newEntry = {
                    id: this.state.journalEntries.length + 1,
                    date: date,
                    journalNo: journalNo,
                    description: description,
                    type: document.getElementById('journalType').value,
                    reference: document.getElementById('journalReference').value,
                    lines: lines,
                    status: 'Draft',
                    totalDebit: totalDebit,
                    totalCredit: totalCredit
                };
                
                this.state.journalEntries.push(newEntry);
                this.saveToLocalStorage();
                this.renderGeneralLedger();
                this.closeModal('journalEntryModal');
                alert('Journal entry saved successfully!');
            }
            
            viewJournalEntry(entryId) {
                const entry = this.state.journalEntries.find(je => je.id === entryId);
                if (!entry) return;
                
                let details = `<h3>Journal Entry Details</h3>
                    <p><strong>Journal No:</strong> ${entry.journalNo}</p>
                    <p><strong>Date:</strong> ${entry.date}</p>
                    <p><strong>Description:</strong> ${entry.description}</p>
                    <p><strong>Type:</strong> ${entry.type}</p>
                    <p><strong>Status:</strong> <span class="badge ${this.getJournalStatusBadge(entry.status)}">${entry.status}</span></p>
                    
                    <h4 style="margin-top: 20px;">Journal Lines</h4>
                    <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Account</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Debit</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Credit</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
                            </tr>
                        </thead>
                        <tbody>`;
                
                entry.lines.forEach(line => {
                    details += `<tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">${line.account}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${line.debit > 0 ? this.formatCurrency(line.debit) : '-'}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${line.credit > 0 ? this.formatCurrency(line.credit) : '-'}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${line.description}</td>
                    </tr>`;
                });
                
                details += `</tbody>
                    <tfoot>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">${this.formatCurrency(entry.totalDebit)}</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">${this.formatCurrency(entry.totalCredit)}</th>
                            <th style="padding: 10px; border: 1px solid #ddd;"></th>
                        </tr>
                    </tfoot>
                </table>`;
                
                alert(details);
            }
            
            postJournalEntry(entryId) {
                const entryIndex = this.state.journalEntries.findIndex(je => je.id === entryId);
                if (entryIndex === -1) return;
                
                const entry = this.state.journalEntries[entryIndex];
                
                if (entry.status === 'Posted') {
                    alert('This journal entry is already posted.');
                    return;
                }
                
                if (confirm(`Post journal entry ${entry.journalNo}?`)) {
                    this.state.journalEntries[entryIndex].status = 'Posted';
                    
                    // Update account balances
                    entry.lines.forEach(line => {
                        const account = this.state.chartOfAccounts.find(acc => acc.name === line.account);
                        if (account) {
                            if (line.debit > 0) {
                                if (account.type === 'Asset' || account.type === 'Expense') {
                                    account.balance += line.debit;
                                } else {
                                    account.balance -= line.debit;
                                }
                            }
                            if (line.credit > 0) {
                                if (account.type === 'Asset' || account.type === 'Expense') {
                                    account.balance -= line.credit;
                                } else {
                                    account.balance += line.credit;
                                }
                            }
                        }
                    });
                    
                    this.saveToLocalStorage();
                    this.renderGeneralLedger();
                    this.renderChartOfAccounts();
                    this.renderDashboard();
                    
                    // Add notification
                    this.state.notifications.push({
                        id: this.state.notifications.length + 1,
                        title: 'Journal Posted',
                        message: `Journal entry ${entry.journalNo} has been posted`,
                        type: 'info',
                        timestamp: new Date().toLocaleString()
                    });
                    
                    this.saveToLocalStorage();
                    alert('Journal entry posted successfully!');
                }
            }
            
            postAllEntries() {
                const unpostedEntries = this.state.journalEntries.filter(je => je.status !== 'Posted');
                
                if (unpostedEntries.length === 0) {
                    alert('No unposted journal entries found.');
                    return;
                }
                
                if (confirm(`Post all ${unpostedEntries.length} unposted journal entries?`)) {
                    unpostedEntries.forEach(entry => {
                        const entryIndex = this.state.journalEntries.findIndex(je => je.id === entry.id);
                        if (entryIndex !== -1) {
                            this.state.journalEntries[entryIndex].status = 'Posted';
                            
                            // Update account balances
                            entry.lines.forEach(line => {
                                const account = this.state.chartOfAccounts.find(acc => acc.name === line.account);
                                if (account) {
                                    if (line.debit > 0) {
                                        if (account.type === 'Asset' || account.type === 'Expense') {
                                            account.balance += line.debit;
                                        } else {
                                            account.balance -= line.debit;
                                        }
                                    }
                                    if (line.credit > 0) {
                                        if (account.type === 'Asset' || account.type === 'Expense') {
                                            account.balance -= line.credit;
                                        } else {
                                            account.balance += line.credit;
                                        }
                                    }
                                }
                            });
                        }
                    });
                    
                    this.saveToLocalStorage();
                    this.renderGeneralLedger();
                    this.renderChartOfAccounts();
                    this.renderDashboard();
                    alert(`Successfully posted ${unpostedEntries.length} journal entries!`);
                }
            }
            
            runMonthEndClose() {
                if (confirm('Run month-end closing process? This will close all open periods.')) {
                    alert('Month-end closing process completed successfully!');
                }
            }
            
            renderTrialBalanceTable() {
                const table = document.getElementById('trialBalanceTable');
                table.innerHTML = '';
                
                this.state.chartOfAccounts.forEach(account => {
                    let debitBalance = 0;
                    let creditBalance = 0;
                    let netBalance = 0;
                    
                    if (account.type === 'Asset' || account.type === 'Expense') {
                        debitBalance = account.balance;
                        netBalance = account.balance;
                    } else {
                        creditBalance = account.balance;
                        netBalance = -account.balance;
                    }
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${account.code}</td>
                        <td>${account.name}</td>
                        <td>${debitBalance > 0 ? this.formatCurrency(debitBalance) : '-'}</td>
                        <td>${creditBalance > 0 ? this.formatCurrency(creditBalance) : '-'}</td>
                        <td><strong>${this.formatCurrency(netBalance)}</strong></td>
                    `;
                    table.appendChild(row);
                });
            }
            
            renderTrialBalanceChart() {
                const ctx = document.getElementById('trialBalanceChart').getContext('2d');
                if (window.trialBalanceChart) {
                    window.trialBalanceChart.destroy();
                }
                
                // Calculate trial balance data
                const assetAccounts = this.state.chartOfAccounts.filter(acc => acc.type === 'Asset');
                const liabilityAccounts = this.state.chartOfAccounts.filter(acc => acc.type === 'Liability');
                const equityAccounts = this.state.chartOfAccounts.filter(acc => acc.type === 'Equity');
                
                const assetTotal = assetAccounts.reduce((sum, acc) => sum + acc.balance, 0);
                const liabilityTotal = liabilityAccounts.reduce((sum, acc) => sum + acc.balance, 0);
                const equityTotal = equityAccounts.reduce((sum, acc) => sum + acc.balance, 0);
                
                window.trialBalanceChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Assets', 'Liabilities', 'Equity'],
                        datasets: [{
                            label: 'Account Balances',
                            data: [assetTotal, liabilityTotal, equityTotal],
                            backgroundColor: ['#3949ab', '#ff9800', '#2e7d32']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        }
                    }
                });
            }
            
            searchJournals() {
                const searchTerm = document.getElementById('journalSearch').value.toLowerCase();
                const rows = document.querySelectorAll('#journalTable tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
            
            filterJournals() {
                const statusFilter = document.getElementById('journalStatusFilter').value;
                const dateFilter = document.getElementById('journalDateFilter').value;
                const rows = document.querySelectorAll('#journalTable tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 6) return;
                    
                    const date = cells[0].textContent.trim();
                    const status = cells[5].textContent.trim();
                    
                    const statusMatch = statusFilter === 'all' || status === statusFilter;
                    const dateMatch = !dateFilter || date === dateFilter;
                    
                    row.style.display = statusMatch && dateMatch ? '' : 'none';
                });
            }
            
            // Accounts Payable Methods
            renderAccountsPayable() {
                this.renderAPTable();
                this.updateAPMetrics();
            }
            
            renderAPTable() {
                const table = document.getElementById('apTable');
                table.innerHTML = '';
                
                this.state.invoices.forEach(invoice => {
                    const today = new Date();
                    const dueDate = new Date(invoice.dueDate);
                    const status = invoice.status === 'Overdue' ? 'Overdue' : 
                                  dueDate < today ? 'Overdue' : invoice.status;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${invoice.vendor}</td>
                        <td>${invoice.invoiceNo}</td>
                        <td>${invoice.date}</td>
                        <td>${invoice.dueDate}</td>
                        <td>${this.formatCurrency(invoice.amount)}</td>
                        <td><span class="badge ${status === 'Overdue' ? 'badge-danger' : 'badge-warning'}">${status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.payInvoice(${invoice.id})">
                                <i class="fas fa-money-bill-wave"></i>
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.viewInvoice(${invoice.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    `;
                    table.appendChild(row);
                });
            }
            
            updateAPMetrics() {
                const totalDue = this.state.invoices.reduce((sum, inv) => sum + inv.amount, 0);
                const overdue = this.state.invoices.filter(inv => {
                    const dueDate = new Date(inv.dueDate);
                    return dueDate < new Date();
                }).reduce((sum, inv) => sum + inv.amount, 0);
                
                document.getElementById('apTotalDue').textContent = totalDue.toLocaleString();
                document.getElementById('apOverdue').textContent = overdue.toLocaleString();
                document.getElementById('apDueThisWeek').textContent = (totalDue * 0.4).toLocaleString();
                document.getElementById('apVendorCount').textContent = '3';
            }
            
            saveInvoice() {
                const vendor = document.getElementById('invoiceVendor').value;
                const invoiceNo = document.getElementById('invoiceNumber').value;
                const amount = parseFloat(document.getElementById('invoiceAmount').value);
                
                if (!vendor || !invoiceNo || !amount) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                const newInvoice = {
                    id: this.state.invoices.length + 1,
                    vendor: vendor,
                    invoiceNo: invoiceNo,
                    date: document.getElementById('invoiceDate').value,
                    dueDate: document.getElementById('invoiceDueDate').value,
                    amount: amount,
                    description: document.getElementById('invoiceDescription').value,
                    account: document.getElementById('invoiceAccount').value,
                    status: 'Pending'
                };
                
                this.state.invoices.push(newInvoice);
                this.saveToLocalStorage();
                this.renderAccountsPayable();
                this.closeModal('addInvoiceModal');
                alert('Invoice added successfully!');
            }
            
            payInvoice(invoiceId) {
                const invoice = this.state.invoices.find(inv => inv.id === invoiceId);
                if (!invoice) return;
                
                if (confirm(`Pay invoice ${invoice.invoiceNo} for ${this.formatCurrency(invoice.amount)}?`)) {
                    invoice.status = 'Paid';
                    this.saveToLocalStorage();
                    this.renderAccountsPayable();
                    alert('Invoice paid successfully!');
                }
            }
            
            viewInvoice(invoiceId) {
                const invoice = this.state.invoices.find(inv => inv.id === invoiceId);
                if (!invoice) return;
                
                alert(`Invoice Details:\n\nVendor: ${invoice.vendor}\nInvoice No: ${invoice.invoiceNo}\nDate: ${invoice.date}\nDue Date: ${invoice.dueDate}\nAmount: ${this.formatCurrency(invoice.amount)}\nStatus: ${invoice.status}`);
            }
            
            searchAP() {
                const searchTerm = document.getElementById('apSearch').value.toLowerCase();
                const rows = document.querySelectorAll('#apTable tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
            
            filterAP() {
                const statusFilter = document.getElementById('apStatusFilter').value;
                const rows = document.querySelectorAll('#apTable tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 6) return;
                    
                    const status = cells[5].textContent.trim();
                    const statusMatch = statusFilter === 'all' || status === statusFilter;
                    
                    row.style.display = statusMatch ? '' : 'none';
                });
            }
            
            processBatchPayments() {
                if (confirm('Process batch payments for all pending invoices?')) {
                    alert('Batch payment processing completed!');
                }
            }
            
            exportAPData() {
                alert('AP data exported successfully!');
            }
            
            // User Management Methods
            renderUsers() {
                const table = document.getElementById('usersTable');
                table.innerHTML = '';
                
                this.state.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${user.userId}</strong></td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td><span class="badge badge-primary">${user.role}</span></td>
                        <td>${user.department}</td>
                        <td>${user.lastLogin}</td>
                        <td><span class="badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}">${user.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.editUser(${user.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline" onclick="erpSystem.toggleUserStatus(${user.id})">
                                <i class="fas ${user.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                            </button>
                        </td>
                    `;
                    table.appendChild(row);
                });
                
                // Update user counts
                document.getElementById('totalUsers').textContent = this.state.users.length;
                document.getElementById('activeUsers').textContent = this.state.users.filter(u => u.status === 'Active').length;
                document.getElementById('inactiveUsers').textContent = this.state.users.filter(u => u.status !== 'Active').length;
                document.getElementById('userRolesCount').textContent = '4';
            }
            
            addUser() {
                alert('Add User functionality would open a modal here.');
            }
            
            editUser(userId) {
                alert(`Edit user ${userId} functionality would open a modal here.`);
            }
            
            toggleUserStatus(userId) {
                const userIndex = this.state.users.findIndex(u => u.id === userId);
                if (userIndex === -1) return;
                
                const user = this.state.users[userIndex];
                const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
                
                if (confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} user ${user.fullName}?`)) {
                    this.state.users[userIndex].status = newStatus;
                    this.saveToLocalStorage();
                    this.renderUsers();
                    alert(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
                }
            }
            
            manageRoles() {
                alert('Manage Roles functionality would open a modal here.');
            }
            
            auditLogs() {
                alert('Audit Logs functionality would open a modal here.');
            }
            
            // Notifications Methods
            renderNotifications() {
                const list = document.getElementById('notificationsList');
                list.innerHTML = '';
                
                if (this.state.notifications.length === 0) {
                    list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No notifications</p>';
                    return;
                }
                
                this.state.notifications.forEach(notification => {
                    const div = document.createElement('div');
                    div.style.cssText = 'padding: 12px; border-bottom: 1px solid #eee;';
                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between;">
                            <strong style="color: #333;">${notification.title}</strong>
                            <small style="color: #999;">${notification.timestamp}</small>
                        </div>
                        <div style="margin-top: 5px; color: #666;">${notification.message}</div>
                    `;
                    list.appendChild(div);
                });
            }
            
            // Domain Methods
            changeDomain(domain) {
                this.state.currentDomain = domain;
                this.saveToLocalStorage();
                this.updateDomainBadge();
            }
            
            updateDomainBadge() {
                const domainLabels = {
                    'general': 'General Business',
                    'hotel': 'Hotel Industry',
                    'education': 'Education Sector',
                    'banking': 'Banking',
                    'manufacturing': 'Manufacturing'
                };
                document.getElementById('domainBadge').textContent = domainLabels[this.state.currentDomain] || 'General Business';
            }
            
            showDomainDetails(domain) {
                const details = {
                    hotel: {
                        title: 'Hotel Industry - Finance Configuration',
                        content: `
                            <div class="bank-card">
                                <h4>Key Features:</h4>
                                <ul>
                                    <li><strong>Revenue Recognition:</strong> Daily room revenue, event bookings</li>
                                    <li><strong>Chart of Accounts:</strong> Departmental (rooms, F&B, events)</li>
                                    <li><strong>AP Focus:</strong> Many small vendors (suppliers, services)</li>
                                    <li><strong>AR Complexity:</strong> Mostly credit cards, corporate accounts</li>
                                </ul>
                            </div>
                        `
                    },
                    education: {
                        title: 'Education Sector - Finance Configuration',
                        content: `
                            <div class="bank-card">
                                <h4>Key Features:</h4>
                                <ul>
                                    <li><strong>Revenue Recognition:</strong> Tuition fees, grants, research funds</li>
                                    <li><strong>Chart of Accounts:</strong> Fund accounting, grants, research</li>
                                    <li><strong>AP Focus:</strong> Faculty payments, infrastructure</li>
                                    <li><strong>AR Complexity:</strong> Student accounts, sponsorships</li>
                                </ul>
                            </div>
                        `
                    },
                    banking: {
                        title: 'Banking - Finance Configuration',
                        content: `
                            <div class="bank-card">
                                <h4>Key Features:</h4>
                                <ul>
                                    <li><strong>Revenue Recognition:</strong> Interest income, fees, commissions</li>
                                    <li><strong>Chart of Accounts:</strong> Regulatory structure, provisions</li>
                                    <li><strong>AP Focus:</strong> Few large vendors, interbank</li>
                                    <li><strong>AR Complexity:</strong> Loan repayments, fee collection</li>
                                </ul>
                            </div>
                        `
                    },
                    manufacturing: {
                        title: 'Manufacturing - Finance Configuration',
                        content: `
                            <div class="bank-card">
                                <h4>Key Features:</h4>
                                <ul>
                                    <li><strong>Revenue Recognition:</strong> Product sales, service contracts</li>
                                    <li><strong>Chart of Accounts:</strong> Cost centers by product line</li>
                                    <li><strong>AP Focus:</strong> Raw material suppliers, MRO</li>
                                    <li><strong>AR Complexity:</strong> Customer invoices, milestones</li>
                                </ul>
                            </div>
                        `
                    }
                };
                
                const domainInfo = details[domain];
                if (!domainInfo) return;
                
                document.getElementById('domainDetailsTitle').textContent = domainInfo.title;
                document.getElementById('domainDetailsContent').innerHTML = domainInfo.content;
                document.getElementById('domainDetails').style.display = 'block';
            }
            
            applyDomainSettings(domain) {
                this.state.currentDomain = domain;
                document.getElementById('domainSelector').value = domain;
                this.updateDomainBadge();
                this.saveToLocalStorage();
                alert(`Domain settings for ${domain} applied successfully!`);
            }
            
            // Other Module Methods (simplified)
            addFixedAsset() {
                alert('Add Fixed Asset functionality would open a modal here.');
            }
            
            runDepreciation() {
                alert('Depreciation run successfully for all fixed assets.');
            }
            
            exportAssets() {
                alert('Fixed Assets exported successfully!');
            }
            
            addBankAccount() {
                alert('Add Bank Account functionality would open a modal here.');
            }
            
            importBankStatement() {
                alert('Bank statement import functionality.');
            }
            
            reconcileAccount() {
                alert('Account reconciliation started.');
            }
            
            createBudget() {
                alert('Create Budget functionality would open a modal here.');
            }
            
            copyBudget() {
                alert('Budget copied from previous period.');
            }
            
            analyzeVariance() {
                alert('Variance analysis completed.');
            }
            
            generateFinancialStatement(type) {
                alert(`Generating ${type} report...`);
            }
            
            downloadReport(type) {
                alert(`Downloading ${type} report...`);
            }
            
            viewReport(type) {
                alert(`Viewing ${type} report...`);
            }
            
            saveSetup() {
                alert('Setup settings saved successfully!');
            }
            
            testConnection() {
                alert('Connection test successful!');
            }
            
            backupConfig() {
                alert('Configuration backup completed!');
            }
        }

        // Initialize the ERP System
        const erpSystem = new ERPFinanceSystem();

        // Global functions for inline event handlers
        function showModal(modalId) {
            erpSystem.showModal(modalId);
        }
        
        function closeModal(modalId) {
            erpSystem.closeModal(modalId);
        }
        
        function showUserMenu() {
            erpSystem.showUserMenu();
        }
        
        function toggleNotifications() {
            erpSystem.toggleNotifications();
        }
        
        function changeDomain(domain) {
            erpSystem.changeDomain(domain);
        }
        
        function addJournalLine() {
            erpSystem.addJournalLine();
        }
        
        function removeJournalLine(button) {
            erpSystem.removeJournalLine(button);
        }
        
        function updateDebitCredit() {
            erpSystem.updateDebitCredit();
        }
        
        function saveAccount() {
            erpSystem.saveAccount();
        }
        
        function saveJournalEntry() {
            erpSystem.saveJournalEntry();
        }
        
        function saveInvoice() {
            erpSystem.saveInvoice();
        }
        
        function markAllComplete() {
            erpSystem.markAllComplete();
        }
        
        function completeAction(action) {
            erpSystem.completeAction(action);
        }
        
        function updateFinancialChart() {
            erpSystem.updateFinancialChart();
        }
        
        function searchCOA() {
            erpSystem.searchCOA();
        }
        
        function filterCOA() {
            erpSystem.filterCOA();
        }
        
        function exportCOA() {
            erpSystem.exportCOA();
        }
        
        function loadSampleCOA() {
            erpSystem.loadSampleCOA();
        }
        
        function postAllEntries() {
            erpSystem.postAllEntries();
        }
        
        function runMonthEndClose() {
            erpSystem.runMonthEndClose();
        }
        
        function searchJournals() {
            erpSystem.searchJournals();
        }
        
        function filterJournals() {
            erpSystem.filterJournals();
        }
        
        function searchAP() {
            erpSystem.searchAP();
        }
        
        function filterAP() {
            erpSystem.filterAP();
        }
        
        function processBatchPayments() {
            erpSystem.processBatchPayments();
        }
        
        function exportAPData() {
            erpSystem.exportAPData();
        }
        
        function showDomainDetails(domain) {
            erpSystem.showDomainDetails(domain);
        }
        
        function applyDomainSettings(domain) {
            erpSystem.applyDomainSettings(domain);
        }
        
        // Add click outside handlers
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenu');
            const userProfile = document.querySelector('.user-profile');
            if (userMenu && userProfile && !userMenu.contains(e.target) && !userProfile.contains(e.target)) {
                userMenu.style.display = 'none';
            }
            
            const notificationsPanel = document.getElementById('notificationsPanel');
            const notificationBell = document.querySelector('.notification');
            if (notificationsPanel && notificationBell && !notificationsPanel.contains(e.target) && !notificationBell.contains(e.target)) {
                notificationsPanel.style.display = 'none';
            }
        });

        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const toggleBtn = document.getElementById('toggleSidebar');
            if (window.innerWidth <= 1200 && sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // Initialize with current date
        document.getElementById('journalDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        document.getElementById('invoiceDueDate').value = dueDate.toISOString().split('T')[0];