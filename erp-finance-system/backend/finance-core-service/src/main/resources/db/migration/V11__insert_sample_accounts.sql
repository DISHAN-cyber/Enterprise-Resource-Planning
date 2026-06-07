-- Insert sample Chart of Accounts (Standard accounting structure)

-- ASSETS (1000-1999)
INSERT INTO accounts (account_code, account_name, type, sub_type, balance, is_active, is_system_account) VALUES
('1000', 'Cash', 'ASSET', 'Current Asset', 125420.00, true, true),
('1100', 'Accounts Receivable', 'ASSET', 'Current Asset', 42560.00, true, true),
('1200', 'Inventory', 'ASSET', 'Current Asset', 85000.00, true, true),
('1500', 'Equipment', 'ASSET', 'Fixed Asset', 250000.00, true, true),
('1510', 'Office Equipment', 'ASSET', 'Fixed Asset', 75000.00, true, true),
('1520', 'Computer Equipment', 'ASSET', 'Fixed Asset', 125000.00, true, true),
('1600', 'Accumulated Depreciation', 'ASSET', 'Contra Asset', -50000.00, true, true);

-- LIABILITIES (2000-2999)
INSERT INTO accounts (account_code, account_name, type, sub_type, balance, is_active, is_system_account) VALUES
('2000', 'Accounts Payable', 'LIABILITY', 'Current Liability', 28750.00, true, true),
('2100', 'Accrued Expenses', 'LIABILITY', 'Current Liability', 15000.00, true, true),
('2500', 'Loans Payable', 'LIABILITY', 'Long-term Liability', 150000.00, true, true),
('2510', 'Bank Loan', 'LIABILITY', 'Long-term Liability', 100000.00, true, true),
('2520', 'Equipment Loan', 'LIABILITY', 'Long-term Liability', 50000.00, true, true);

-- EQUITY (3000-3999)
INSERT INTO accounts (account_code, account_name, type, sub_type, balance, is_active, is_system_account) VALUES
('3000', 'Common Stock', 'EQUITY', null, 200000.00, true, true),
('3100', 'Retained Earnings', 'EQUITY', null, 125230.00, true, true),
('3200', 'Owner''s Drawings', 'EQUITY', null, -25000.00, true, true);

-- REVENUE (4000-4999)
INSERT INTO accounts (account_code, account_name, type, sub_type, balance, is_active, is_system_account) VALUES
('4000', 'Sales Revenue', 'REVENUE', 'Operating Revenue', 450000.00, true, true),
('4100', 'Service Revenue', 'REVENUE', 'Operating Revenue', 85000.00, true, true),
('4200', 'Interest Income', 'REVENUE', 'Other Income', 5000.00, true, true),
('4300', 'Rental Income', 'REVENUE', 'Other Income', 12000.00, true, true);

-- EXPENSES (5000-5999)
INSERT INTO accounts (account_code, account_name, type, sub_type, balance, is_active, is_system_account) VALUES
('5000', 'Cost of Goods Sold', 'EXPENSE', null, 225000.00, true, true),
('6000', 'Salaries Expense', 'EXPENSE', null, 125000.00, true, true),
('6100', 'Rent Expense', 'EXPENSE', null, 36000.00, true, true),
('6200', 'Utilities Expense', 'EXPENSE', null, 12000.00, true, true),
('6300', 'Office Supplies', 'EXPENSE', null, 5000.00, true, true),
('6400', 'Depreciation Expense', 'EXPENSE', null, 15000.00, true, true),
('6500', 'Insurance Expense', 'EXPENSE', null, 8000.00, true, true),
('6600', 'Marketing Expense', 'EXPENSE', null, 18000.00, true, true);