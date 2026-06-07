# ERP Finance System Documentation

## API Specifications

### Authentication
- POST /auth/login - User login
- POST /auth/register - User registration
- POST /auth/refresh - Token refresh

### Finance Core
- GET /api/chart-of-accounts - Get all accounts
- POST /api/chart-of-accounts - Create account
- GET /api/general-ledger - Get ledger entries
- POST /api/journals - Create journal entry

### Accounts Payable
- GET /api/vendors - Get vendors
- POST /api/invoices - Create invoice
- POST /api/payments - Process payment

### Accounts Receivable
- GET /api/customers - Get customers
- POST /api/invoices - Create sales invoice
- POST /api/collections - Record collection

### Fixed Assets
- GET /api/assets - Get assets
- POST /api/assets - Add asset
- POST /api/depreciation - Calculate depreciation

### Bank Reconciliation
- POST /api/bank-statements - Import statement
- POST /api/reconciliations - Reconcile transactions

### Budgeting
- GET /api/budgets - Get budgets
- POST /api/budgets - Create budget
- GET /api/budget-variance - Get variance analysis

### Reporting
- GET /api/reports/balance-sheet - Balance sheet
- GET /api/reports/pnl - Profit & Loss
- GET /api/reports/cashflow - Cash flow statement

## AI Service APIs
- GET /forecast - Financial forecasting
- POST /fraud-detection - Fraud detection
- GET /cashflow-predict - Cash flow prediction

## Mobile App Features
- Expense approvals
- Payment alerts
- Invoice notifications