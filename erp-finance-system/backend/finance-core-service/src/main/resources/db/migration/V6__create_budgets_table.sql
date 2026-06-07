CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    budgeted_amount DECIMAL(15,2) NOT NULL,
    actual_amount DECIMAL(15,2) NOT NULL,
    fiscal_year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT chk_budget_month CHECK (month BETWEEN 1 AND 12),
    CONSTRAINT uk_budget_category_month UNIQUE (category, fiscal_year, month)
);

CREATE INDEX idx_budgets_year ON budgets(fiscal_year);
CREATE INDEX idx_budgets_month ON budgets(month);
CREATE INDEX idx_budgets_category ON budgets(category);