# Rule: Documentation and handoff

## Keep docs synchronized

If a task changes product or architecture decisions, update the relevant document:

* product logic -> `vision.md` or `vibe-coding-brief.md`;
* screen/flow logic -> `Wireframes.md`;
* architecture -> `architecture.md`;
* stack -> `tech-stack.md`;
* database -> `database-model.md`;
* agent behavior -> `AGENTS.md` or `.agents/rules/*`.

## Do not duplicate blindly

Prefer one source of truth and link to it.

Do not paste the same full rule into many files unless needed for IDE compatibility.

## Handoff format

When finishing a task, report:

```text
Changed:
- file/path

Verified:
- command or manual check

Notes:
- limitations or next step
```

## If blocked

State:

* what is blocked;
* what information is missing;
* what safe assumption could be used;
* what decision is needed from the user.
