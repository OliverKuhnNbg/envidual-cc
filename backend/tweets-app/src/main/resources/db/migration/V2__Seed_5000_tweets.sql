/*
 * ADR: Deterministic Data Distribution for Seeding
 * Context: The application requires a varied dataset (multiple authors) to properly test UI rendering and timeline filtering, without introducing non-deterministic behavior during startup.
 * Decision: Use modulo arithmetic (i % 2) on the series index to alternate authors instead of a random distribution, guaranteeing an exact 50/50 split.
 * Consequence: The seeded data remains entirely predictable and reproducible across all developer machines and CI/CD pipelines. Integration tests asserting specific record counts per author will not suffer from flaky execution.
 */
INSERT INTO tweets (id, author, content, created_at)
SELECT 
    gen_random_uuid(),
    CASE WHEN i % 2 = 0 THEN 'OliverUser' ELSE 'SeedUser' END,
    'hello world ' || LPAD(i::text, 5, '0'),
    NOW() - (i || ' minutes')::INTERVAL
FROM generate_series(1, 5000) AS s(i);