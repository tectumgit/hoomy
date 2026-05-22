# Workflow: pm-next-task

Use when the user asks what to do next or asks for a development prompt.

## Steps

1. Read `PROJECT_STATUS.md`.
2. Read `PROJECT_MANAGER.md`.
3. Find the first `Ready` task.
4. If no task is Ready, pick the next logical Backlog task and mark it as proposed.
5. Read or create the matching prompt in `PROMPTS.md`.
6. Make sure the prompt includes:
   * role;
   * workflow;
   * context files;
   * goal;
   * scope;
   * do-not list;
   * acceptance criteria;
   * verification.
7. Return only the next task and prompt unless the user asks for a broader roadmap.

## Guardrail

If the next task would start backend before frontend mock is ready, warn and recommend the frontend-first task instead.
