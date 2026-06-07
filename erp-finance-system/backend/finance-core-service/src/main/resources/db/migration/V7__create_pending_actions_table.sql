CREATE TABLE pending_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(100),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT chk_action_priority CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT chk_action_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED'))
);

CREATE INDEX idx_pending_actions_status ON pending_actions(status);
CREATE INDEX idx_pending_actions_priority ON pending_actions(priority);
CREATE INDEX idx_pending_actions_due_date ON pending_actions(due_date);