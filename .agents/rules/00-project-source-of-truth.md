# Rule: Project source of truth

## Always read first

Before planning or editing, read the relevant source documents:

1. `AGENTS.md`
2. `README.md`
3. `vision.md`
4. `Wireframes.md`
5. `architecture.md`
6. `tech-stack.md`
7. `database-model.md`
8. `vibe-coding-brief.md`

## Priority order

If documents conflict:

```text
AGENTS.md
README.md
Wireframes.md
architecture.md
tech-stack.md
database-model.md
other drafts
```

## Current project stage

The project is in preparation / frontend-first implementation stage.

Do not assume a codebase already exists. If implementation starts, scaffold it conservatively according to the documented structure.

## Do not invent missing decisions

Ask the user before choosing:

* real payment provider;
* real SMS provider;
* production hosting;
* personal data storage provider;
* legal/payment workflows;
* final brand/legal naming.

For all other implementation details, prefer existing documented decisions.
