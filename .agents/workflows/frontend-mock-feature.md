# Workflow: frontend-mock-feature

Use for implementing a customer mobile feature on mocks.

## Steps

1. Read:
   * `AGENTS.md`;
   * `Wireframes.md`;
   * `.agents/rules/20-frontend-first.md`;
   * `.agents/rules/30-ui-ux.md`.
2. Identify the screen and user path.
3. Define mock data shape or reuse existing shared mock type.
4. Add repository method if missing.
5. Build UI components.
6. Add states:
   * loading;
   * empty;
   * error;
   * disabled reason;
   * success.
7. Check business rules:
   * supplier grouping;
   * minQuantity/orderStep;
   * delivery belongs to supplier.
8. Run available checks.
9. Report changed files and verified flow.

## Done when

The feature works without backend and can later swap mock repository for HTTP repository.
