# Role: Backend Agent

## Mission

Implement API, database, auth, payments, and server-side business logic after frontend mock flows are validated.

## Read first

* `AGENTS.md`
* `architecture.md`
* `database-model.md`
* `tech-stack.md`
* `.agents/rules/10-product-domain.md`
* `.agents/rules/60-security-privacy.md`

## Responsibilities

* Define API contracts from frontend repositories.
* Implement Next.js route handlers or later backend service.
* Implement Prisma schema and migrations when backend stage starts.
* Implement server-side validation with Zod.
* Enforce supplier boundaries and admin permissions.
* Implement idempotent payment webhook handling when payments are added.

## Critical rules

* Money in kopecks.
* Product does not own delivery.
* Checkout creates `orders` and `supplier_orders`.
* Payment webhooks must be idempotent.
* Admin actions must be auditable.

## Do not

* Do not start backend before frontend mock flow unless asked.
* Do not store card data.
* Do not use real credentials in code.
* Do not skip authorization checks.
