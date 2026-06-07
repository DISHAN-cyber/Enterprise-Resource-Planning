# ERP Finance System

This is a comprehensive ERP Finance System built with microservices architecture, featuring modules for chart of accounts, general ledger, accounts payable, accounts receivable, fixed assets, bank reconciliation, budgeting, and financial reporting.

## Technologies

- **Backend**: Java + Spring Boot 3 (Microservices)
  - API Gateway: Spring Cloud Gateway + JWT routing
  - Auth Service: OAuth2, JWT, User & Role Management
  - Finance Core Service: Chart of Accounts, General Ledger, Journals, Trial Balance
  - AP Service: Accounts Payable, Vendors, Invoices, Payments
  - AR Service: Accounts Receivable, Customers, Collections, Aging
  - Fixed Assets Service: Asset Registry, Depreciation Schedules, Disposals
  - Bank Recon Service: Bank Accounts, Statement Import, Reconciliation
  - Budgeting Service: Budget Plans, Variance Analysis, Copy/Template
  - Reporting Service: Balance Sheet, P&L, Cash Flow, Financial Ratios
  - Shared Lib: Common DTOs, Exceptions, Security Config, Audit Utils

- **Frontend**: Angular 17+ + TypeScript
  - Features matching backend modules

- **AI Service**: Python (FastAPI) for Forecasting & Analytics
  - Forecasting, Fraud Detection, Cashflow Prediction

- **Mobile**: Flutter (Approvals, Alerts, Expense Claims)

- **Database**: PostgreSQL with Flyway migrations

- **Infrastructure**: Docker Compose for orchestration

## Setup

1. Clone the repository
2. Run `docker-compose up` in the docker directory
3. For frontend: `npm install` then `ng serve`
4. For backend: Build and run each service
6. For AI: `cd ai-service`, `pip install -r requirements.txt`, then `uvicorn app.main:app --host 0.0.0.0 --port 8000`
7. For mobile: `cd mobile/erp_finance_mobile`, then `flutter run`
8. Optional AI retrain cloud sync: configure AWS S3 or Azure Blob Storage credentials for the scheduled workflow.

## Usage

Access the frontend at http://localhost:4200

API Gateway at http://localhost:8080

## Troubleshooting

- Ensure Docker is running
- Check PostgreSQL connection
- Verify JWT tokens for auth