# Workflow: web-mock-dashboard

Use for supplier cabinet or admin dashboard work.

## Steps

1. Read:
   * `AGENTS.md`;
   * `Wireframes.md`;
   * `.agents/roles/web-dashboard-agent.md`.
2. Identify whether the task is supplier or admin.
3. Use table/form/dashboard patterns, not marketing layouts.
4. Use mock repositories.
5. Implement the relevant state changes locally.
6. Include status badges and clear disabled states.
7. Verify desktop layout first.
8. Check mobile width does not break.

## Supplier-specific checks

* Product form does not include delivery date/fee/zone.
* Delivery settings are separate from products.
* Orders show delivery date/window from supplier order.

## Admin-specific checks

* Orders show supplier suborders.
* Moderation actions are explicit.
* Dispute actions are calm and reversible in mock state.
