# Workflow: qa-before-finish

Use before calling a task complete.

## Steps

1. Read `.agents/rules/50-testing-quality.md`.
2. Identify the affected flow.
3. Check happy path.
4. Check edge states.
5. Check domain invariants:
   * supplier-first flow;
   * cart grouped by supplier;
   * product has no delivery ownership;
   * quantity follows minimum and step;
   * checkout creates supplier suborders.
6. Run available tests/lint/typecheck.
7. If no tests exist, document manual verification.
8. Report findings first if any.

## Output

```text
Findings:
- ...

Verified:
- ...

Remaining:
- ...
```
