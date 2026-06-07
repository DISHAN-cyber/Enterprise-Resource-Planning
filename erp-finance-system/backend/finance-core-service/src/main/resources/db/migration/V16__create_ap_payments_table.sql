CREATE TABLE ap_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number VARCHAR(100) NOT NULL UNIQUE,
    invoice_id UUID NOT NULL REFERENCES ap_invoices(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    amount DECIMAL(15,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('CHECK', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'ONLINE_PAYMENT'))
);

CREATE INDEX idx_ap_payments_number ON ap_payments(payment_number);
CREATE INDEX idx_ap_payments_invoice ON ap_payments(invoice_id);
CREATE INDEX idx_ap_payments_vendor ON ap_payments(vendor_id);
CREATE INDEX idx_ap_payments_date ON ap_payments(payment_date);