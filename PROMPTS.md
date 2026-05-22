# Development Prompts: Hoomy

## P1-01: Scaffold frontend-first monorepo

```text
Read GEMINI.md and AGENTS.md first.
Use role: .agents/roles/mobile-frontend-agent.md
Use workflow: .agents/workflows/start-task.md

Task:
Scaffold the frontend-first Hoomy monorepo without backend.

Context files:
- README.md
- Wireframes.md
- architecture.md
- tech-stack.md
- vibe-coding-brief.md
- .agents/rules/20-frontend-first.md
- .agents/rules/40-code-architecture.md

Goal:
Create the initial project structure for frontend mock development.

Scope:
- Create apps/mobile for Expo + React Native + TypeScript.
- Create apps/web for Next.js + TypeScript web shell.
- Create packages/shared for shared domain types and constants.
- Create packages/config for shared TypeScript/config placeholders if needed.
- Add package manager workspace config.
- Add basic scripts for typecheck/lint/dev placeholders.
- Add README notes for how to run once dependencies are installed.

Do not:
- Do not add PostgreSQL.
- Do not add Prisma.
- Do not add real API route handlers yet.
- Do not add real SMS.
- Do not add real payments.
- Do not put delivery fields on Product.
- Do not implement full UI screens in this task.

Acceptance criteria:
- Repository has apps/mobile, apps/web, packages/shared.
- Shared package defines initial Supplier, Product, CartItem, Order, SupplierOrder types.
- Product type has price/unit/minQuantity/orderStep/stockQuantity.
- Product type does not have deliveryDate, deliveryFee, deliveryZone.
- There is a clear place for mock repositories.
- The structure supports replacing mocks with HTTP later.

Verification:
- List created files.
- Run available package manager install/typecheck only if safe and configured.
- If commands cannot run because dependencies are not installed, state that clearly.

Before final response:
- list changed files
- list verification performed
- list remaining gaps
```

## P1-02: Shared mock data and repositories

```text
Read GEMINI.md and AGENTS.md first.
Use role: .agents/roles/mobile-frontend-agent.md
Use workflow: .agents/workflows/frontend-mock-feature.md

Task:
Add realistic shared mock data and repository interfaces for the customer mobile prototype.

Context files:
- Wireframes.md
- database-model.md
- .agents/rules/10-product-domain.md
- .agents/rules/20-frontend-first.md

Scope:
- Add mock suppliers for Kazan.
- Add mock products linked to suppliers.
- Add repository interfaces for suppliers/products/cart/orders.
- Add mock repository implementations.
- Add cart calculation helpers.

Do not:
- Do not call HTTP.
- Do not add backend.
- Do not add delivery fields to product.
- Do not hardcode mocks inside components.

Acceptance criteria:
- At least 3 suppliers.
- At least 20 products.
- Multiple units: kg, l, pcs, pack, box.
- One low-stock product.
- One out-of-stock product.
- Delivery windows live on supplier.
- Cart helper groups by supplierId.
```

## P1-03: Mobile navigation shell

```text
Read GEMINI.md and AGENTS.md first.
Use role: .agents/roles/mobile-frontend-agent.md
Use workflow: .agents/workflows/frontend-mock-feature.md

Task:
Build the Expo mobile app shell with bottom navigation and placeholder screens.

Context files:
- Wireframes.md
- designsystem.md
- .agents/rules/30-ui-ux.md

Scope:
- Add routes/tabs: Главная, Поставщики, Корзина, Заказы, Профиль.
- Add app theme tokens from designsystem.
- Add placeholder screens that clearly match future flow.
- Add cart badge placeholder from mock/local state.

Do not:
- Do not build full screen content yet.
- Do not add backend calls.
- Do not create a marketing landing page.

Acceptance criteria:
- App opens into usable app shell.
- Bottom navigation exists.
- Each tab renders a placeholder.
- Styling uses Hoomy colors.
```
