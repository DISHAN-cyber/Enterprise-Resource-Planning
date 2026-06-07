CREATE TABLE ap_invoice_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES ap_invoices(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2)
);

CREATE INDEX idx_ap_invoice_lines_invoice ON ap_invoice_lines(invoice_id);