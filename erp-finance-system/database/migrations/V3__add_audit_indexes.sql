-- Add audit indexes for performance

CREATE INDEX idx_general_ledger_account_id ON general_ledger(account_id);
CREATE INDEX idx_general_ledger_transaction_date ON general_ledger(transaction_date);
CREATE INDEX idx_journals_journal_date ON journals(journal_date);
CREATE INDEX idx_journals_status ON journals(status);

-- Add audit triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at columns and triggers to main tables