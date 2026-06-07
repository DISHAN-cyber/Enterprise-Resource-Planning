-- Core finance tables

CREATE TABLE chart_of_accounts (
    id SERIAL PRIMARY KEY,
    account_code VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE general_ledger (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES chart_of_accounts(id),
    transaction_date DATE NOT NULL,
    description TEXT,
    debit DECIMAL(15,2) DEFAULT 0,
    credit DECIMAL(15,2) DEFAULT 0,
    balance DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journals (
    id SERIAL PRIMARY KEY,
    journal_number VARCHAR(20) UNIQUE NOT NULL,
    journal_date DATE NOT NULL,
    description TEXT,
    total_debit DECIMAL(15,2),
    total_credit DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add more core finance tables