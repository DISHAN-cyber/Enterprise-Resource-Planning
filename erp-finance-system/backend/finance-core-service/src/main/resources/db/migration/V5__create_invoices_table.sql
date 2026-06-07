CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    party_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    issue_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    paid_amount DECIMAL(15,2),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT chk_invoice_type CHECK (type IN ('ACCOUNTS_RECEIVABLE', 'ACCOUNTS_PAYABLE')),
    CONSTRAINT chk_invoice_status CHECK (status IN ('PAID', 'UNPAID', 'OVERDUE', 'PARTIAL')),
    CONSTRAINT uk_invoice_number UNIQUE (invoice_number)
);

CREATE INDEX idx_invoices_type ON invoices(type);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_party ON invoices(party_name);