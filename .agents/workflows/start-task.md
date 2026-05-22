# Workflow: start-task

Use this workflow before any non-trivial Hoomy task.

## Steps

1. Read `AGENTS.md`.
2. Read the most relevant source docs:
   * `Wireframes.md` for UI/frontend;
   * `architecture.md` for structure;
   * `tech-stack.md` for libraries;
   * `database-model.md` for backend/data;
   * `vibe-coding-brief.md` for AI-coding summary.
3. Identify the stage:
   * frontend mock;
   * supplier/admin mock;
   * API contract;
   * backend;
   * QA/docs.
4. State the scope in 3-6 bullets.
5. Name files likely to change.
6. State what will not be touched.
7. Implement or produce the requested artifact.
8. Verify against relevant acceptance criteria.
9. Summarize changed/verified/remaining.

## Guardrail

If the task would introduce real SMS, real payments, or production infrastructure, stop and ask for explicit confirmation.
