/*
 * ADR: Explicit Schema Definition via Flyway
 * Context: Hibernate's hbm2ddl generation is unpredictable across different environments and unsuitable for production or reliable local seeding.
 * Decision: Use Flyway for explicit SQL-based schema migrations.
 * Consequence: Provides absolute certainty over the database structure and enables seamless schema evolution.
 */
CREATE TABLE tweets (
    id UUID PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    content VARCHAR(280) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);