-- Sample Transactions (Revenue)
INSERT INTO transactions (type, amount, date, description, category, status) VALUES
('INCOME', 45830.00, '2026-04-01', 'Product Sales - Q2', 'SALES', 'COMPLETED'),
('INCOME', 38500.00, '2026-04-05', 'Service Revenue', 'SERVICES', 'COMPLETED'),
('INCOME', 52000.00, '2026-04-10', 'Consulting Fees', 'CONSULTING', 'COMPLETED'),
('INCOME', 41200.00, '2026-04-15', 'Product Sales', 'SALES', 'COMPLETED'),
('INCOME', 35800.00, '2026-04-20', 'Subscription Revenue', 'SUBSCRIPTION', 'COMPLETED'),
('INCOME', 32500.00, '2026-04-25', 'License Fees', 'LICENSING', 'COMPLETED'),

-- Sample Transactions (Expenses)
('EXPENSE', 15200.00, '2026-04-02', 'Office Rent', 'RENT', 'COMPLETED'),
('EXPENSE', 8500.00, '2026-04-08', 'Utilities', 'UTILITIES', 'COMPLETED'),
('EXPENSE', 12300.00, '2026-04-12', 'Salaries', 'PAYROLL', 'COMPLETED'),
('EXPENSE', 5600.00, '2026-04-18', 'Marketing', 'MARKETING', 'COMPLETED'),
('EXPENSE', 3200.00, '2026-04-22', 'Software Licenses', 'SOFTWARE', 'COMPLETED'),
('EXPENSE', 4800.00, '2026-04-28', 'Office Supplies', 'SUPPLIES', 'COMPLETED');

-- Sample Invoices (Accounts Receivable)
INSERT INTO invoices (type, invoice_number, party_name, amount, due_date, issue_date, status, paid_amount) VALUES
('ACCOUNTS_RECEIVABLE', 'INV-2026-001', 'ABC Corporation', 15000.00, '2026-05-15', '2026-04-15', 'UNPAID', 0.00),
('ACCOUNTS_RECEIVABLE', 'INV-2026-002', 'XYZ Ltd', 12500.00, '2026-04-20', '2026-03-20', 'OVERDUE', 0.00),
('ACCOUNTS_RECEIVABLE', 'INV-2026-003', 'Tech Solutions Inc', 8900.00, '2026-05-01', '2026-04-01', 'UNPAID', 0.00),
('ACCOUNTS_RECEIVABLE', 'INV-2026-004', 'Global Services', 6160.00, '2026-04-25', '2026-03-25', 'OVERDUE', 0.00),

-- Sample Invoices (Accounts Payable)
('ACCOUNTS_PAYABLE', 'BILL-2026-001', 'Office Supplies Co', 3200.00, '2026-05-10', '2026-04-10', 'UNPAID', 0.00),
('ACCOUNTS_PAYABLE', 'BILL-2026-002', 'Tech Vendor LLC', 8500.00, '2026-04-30', '2026-03-30', 'OVERDUE', 0.00),
('ACCOUNTS_PAYABLE', 'BILL-2026-003', 'Utility Company', 2100.00, '2026-05-05', '2026-04-05', 'UNPAID', 0.00),
('ACCOUNTS_PAYABLE', 'BILL-2026-004', 'Consulting Partners', 14950.00, '2026-05-20', '2026-04-20', 'UNPAID', 0.00);

-- Sample Budgets
INSERT INTO budgets (category, budgeted_amount, actual_amount, fiscal_year, month) VALUES
('SALES', 50000.00, 45830.00, 2026, 4),
('SERVICES', 40000.00, 38500.00, 2026, 4),
('CONSULTING', 45000.00, 52000.00, 2026, 4),
('MARKETING', 10000.00, 5600.00, 2026, 4),
('OPERATIONS', 25000.00, 15200.00, 2026, 4),
('PAYROLL', 15000.00, 12300.00, 2026, 4);

-- Sample Pending Actions
INSERT INTO pending_actions (action, module, priority, due_date, status, assigned_to) VALUES
('Approve journal entries', 'General Ledger', 'HIGH', CURRENT_DATE, 'PENDING', 'Admin User'),
('Reconcile bank statement', 'Bank Reconciliation', 'HIGH', CURRENT_DATE, 'PENDING', 'Admin User'),
('Process vendor payments', 'Accounts Payable', 'MEDIUM', CURRENT_DATE + INTERVAL '1 day', 'PENDING', 'Admin User'),
('Review expense reports', 'Expense Management', 'MEDIUM', CURRENT_DATE + INTERVAL '2 days', 'PENDING', 'Finance Manager'),
('Update budget forecasts', 'Budgeting', 'LOW', CURRENT_DATE + INTERVAL '5 days', 'PENDING', 'Finance Manager'),
('Audit trail review', 'Compliance', 'HIGH', CURRENT_DATE + INTERVAL '3 days', 'IN_PROGRESS', 'Compliance Officer'),
('Tax filing preparation', 'Tax Management', 'HIGH', CURRENT_DATE + INTERVAL '7 days', 'PENDING', 'Tax Consultant'),
('Monthly financial reports', 'Reporting', 'MEDIUM', CURRENT_DATE + INTERVAL '4 days', 'PENDING', 'Accountant');