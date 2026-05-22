# Workflow: sync-docs

Use after implementation changes product, architecture, data model, or agent behavior.

## Steps

1. Identify which decision changed.
2. Update the correct document:
   * product -> `vision.md`;
   * UI flow -> `Wireframes.md`;
   * architecture -> `architecture.md`;
   * stack -> `tech-stack.md`;
   * database -> `database-model.md`;
   * AI workflow -> `AGENTS.md` or `.agents/*`.
3. Search for contradictions.
4. Remove stale wording or mark as future work.
5. Keep `README.md` as navigation.

## Final check

Run searches for common contradictions:

```text
deliveryDate
дата доставки
доступные даты доставки
стоимость доставки как свойства товара
```

Make sure product delivery still belongs to supplier, not product.
