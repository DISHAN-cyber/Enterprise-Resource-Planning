-- Create accounts table
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_code VARCHAR(20) NOT NULL UNIQUE,
    account_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    sub_type VARCHAR(100),
    balance DECIMAL(15,2) DEFAULT 0.00,
    debit_balance DECIMAL(15,2) DEFAULT 0.00,
    credit_balance DECIMAL(15,2) DEFAULT 0.00,
    parent_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_system_account BOOLEAN NOT NULL DEFAULT false,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT chk_account_type CHECK (type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'))
);

-- Create indexes
CREATE INDEX idx_accounts_code ON accounts(account_code);
CREATE INDEX idx_accounts_type ON accounts(type);
CREATE INDEX idx_accounts_parent ON accounts(parent_account_id);
CREATE INDEX idx_accounts_active ON accounts(is_active);
CREATE INDEX idx_accounts_created_at ON accounts(created_at);

-- Add comment
COMMENT ON TABLE accounts IS 'Chart of Accounts - Master table for all financial accounts';
COMMENT ON COLUMN accounts.account_code IS 'Unique account code following accounting standards';
COMMENT ON COLUMN accounts.type IS 'Account type: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE';
COMMENT ON COLUMN accounts.balance IS 'Current account balance (debit - credit for assets/expenses, credit - debit for liabilities/equity/revenue)';