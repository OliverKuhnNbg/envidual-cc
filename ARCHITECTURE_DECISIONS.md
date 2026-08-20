# Architecture Decisions & Developer Notes

This document captures the key architectural decisions (ADRs), pragmatic trade-offs, and known technical debt accrued during the implementation of the Twitter-Clone fullstack challenge.

## 1. Database Management: Flyway vs. Auto-DDL

**Decision:** We explicitly avoided using `spring.jpa.hibernate.ddl-auto=update` and instead implemented schema versioning via **Flyway**.
**Rationale:** Relying on Hibernate to automatically update the schema is an anti-pattern in enterprise environments. Flyway ensures deterministic, reproducible, and version-controlled database migrations across all environments.

## 2. Testing Strategy: Integration Tests over Mocked Unit Tests

**Decision:** We prioritized integration tests utilizing Testcontainers for the persistence layer and omitted exhaustive mock-based unit tests for aggregate creation (e.g., `save(Tweet)`).
**Rationale:**
Due to strict timeboxing, we focused on the most critical integration points. Implementing pure unit tests for the domain aggregate creation would have required complex mock setups or exposing internal state/constructors, which violates encapsulation. The integration tests provide higher confidence that the system interacts correctly with the actual PostgreSQL dialect.

## 3. Containerization: Directory Structure Constraints

**Decision:** The Docker Compose setup is provided but currently has path-resolution constraints.
**Rationale:**
The Spring Boot application was generated inside a nested directory (`backend/tweets-app`) rather than the repository root. This nested structure complicates the Docker build context and Gradle wrapper execution paths. Due to time constraints, re-architecting the folder structure was postponed.
_Future Fix:_ Flatten the directory structure or adjust the `docker-compose.yml` build context and `Dockerfile` paths to correctly target the nested Gradle wrapper.

## 4. Known Issues & Technical Debt

- **UI Styling:** There is a known issue with the Bootstrap import in the frontend. The layout relies on it, so visual presentation might be slightly degraded, though the functional reactive state (Signals) works perfectly.
- **Test Deprecation:** The backend integration tests currently utilize a deprecated `PostgreSQLContainer` instantiation pattern. As this is strictly isolated to the test scope, it does not impact the production build, but should be updated in a future maintenance cycle.
