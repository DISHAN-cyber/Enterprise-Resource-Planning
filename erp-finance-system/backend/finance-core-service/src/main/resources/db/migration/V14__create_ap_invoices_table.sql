CREATE TABLE ap_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    amount DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2),
    total_amount DECIMAL(15,2),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by UUID,
    approved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ap_invoice_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED')),
    CONSTRAINT chk_approval_status CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE INDEX idx_ap_invoices_number ON ap_invoices(invoice_number);
CREATE INDEX idx_ap_invoices_vendor ON ap_invoices(vendor_id);
CREATE INDEX idx_ap_invoices_status ON ap_invoices(status);
CREATE INDEX idx_ap_invoices_due_date ON ap_invoices(due_date);
CREATE INDEX idx_ap_invoices_approval ON ap_invoices(approval_status);