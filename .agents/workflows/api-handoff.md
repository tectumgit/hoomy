# Workflow: api-handoff

Use when moving from mocks to API contracts/backend.

## Steps

1. Read:
   * `architecture.md`;
   * `database-model.md`;
   * `Wireframes.md`;
   * current frontend repository interfaces.
2. List existing mock repository methods.
3. Convert each method into an API contract:
   * route;
   * method;
   * request schema;
   * response schema;
   * auth role;
   * errors.
4. Keep UI unchanged.
5. Implement HTTP adapter alongside mock adapter.
6. Add feature flag/config switch if useful.
7. Verify mock mode still works.
8. Verify HTTP mode with stub/server when available.

## Guardrails

* Do not rewrite screens to fit backend.
* Backend should match validated frontend contract unless there is a documented product reason.
* Payment webhooks must be idempotent.
* Supplier authorization must be enforced server-side.
