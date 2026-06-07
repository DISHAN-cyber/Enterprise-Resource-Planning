CREATE TABLE token_blacklist (
    token TEXT PRIMARY KEY,
    expiry_date TIMESTAMP NOT NULL
);

-- Index for faster lookups
CREATE INDEX idx_token_blacklist_expiry ON token_blacklist(expiry_date);
