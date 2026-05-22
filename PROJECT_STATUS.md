# Project Status: Hoomy

Дата обновления: 2026-05-16

## Текущий этап

```text
Phase 1: frontend-first prototype on mocks
```

Цель этапа: собрать кликабельный customer mobile flow на мок-данных без backend.

## Уже сделано

* Подготовлены продуктовые документы.
* Зафиксирована модель: поставщик главный объект, доставка принадлежит поставщику.
* Переписан `Wireframes.md` под frontend-first разработку.
* Созданы правила для Antigravity/AI-агентов:
  * `AGENTS.md`;
  * `GEMINI.md`;
  * `.agents/rules/*`;
  * `.agents/roles/*`;
  * `.agents/workflows/*`.
* Зафиксирован recommended stack:
  * Expo + React Native;
  * Next.js;
  * TypeScript;
  * PostgreSQL + Prisma позже;
  * Zod;
  * TanStack Query.

## Следующая задача

```text
Task 1: scaffold frontend-first monorepo
```

Статус: Ready

Цель: создать базовую структуру проекта без backend:

```text
apps/mobile
apps/web
packages/shared
packages/config
```

Сначала нужны:

* TypeScript workspace;
* mock domain types;
* mock repositories;
* mobile app shell;
* web app shell;
* без Prisma и DB.

## Ближайший backlog

### Phase 1. Customer mobile mock

| ID | Task | Status |
| --- | --- | --- |
| P1-01 | Scaffold monorepo and frontend apps | Ready |
| P1-02 | Add shared domain types and mock data | Backlog |
| P1-03 | Build mobile navigation shell | Backlog |
| P1-04 | Build onboarding and auth mock | Backlog |
| P1-05 | Build home supplier feed | Backlog |
| P1-06 | Build supplier catalog | Backlog |
| P1-07 | Build product details and quantity stepper | Backlog |
| P1-08 | Build cart grouped by supplier | Backlog |
| P1-09 | Build checkout with delivery date per supplier | Backlog |
| P1-10 | Build mock order success and order history | Backlog |

### Phase 2. Supplier web mock

| ID | Task | Status |
| --- | --- | --- |
| P2-01 | Supplier dashboard shell | Backlog |
| P2-02 | Product list and product form | Backlog |
| P2-03 | Delivery settings form | Backlog |
| P2-04 | Supplier orders | Backlog |
| P2-05 | Supplier messages and analytics mock | Backlog |

### Phase 3. Admin web mock

| ID | Task | Status |
| --- | --- | --- |
| P3-01 | Admin dashboard shell | Backlog |
| P3-02 | Supplier review screens | Backlog |
| P3-03 | Product moderation | Backlog |
| P3-04 | Orders with supplier suborders | Backlog |
| P3-05 | Complaints and disputes mock | Backlog |

### Phase 4. API handoff

| ID | Task | Status |
| --- | --- | --- |
| P4-01 | Convert mock repositories to API contracts | Backlog |
| P4-02 | Add backend skeleton | Backlog |
| P4-03 | Add Prisma schema | Backlog |
| P4-04 | Replace supplier/product mocks with HTTP | Backlog |
| P4-05 | Replace cart/checkout/order mocks with HTTP | Backlog |

## Открытые решения

Не выбирать сейчас:

* SMS provider;
* payment provider;
* production hosting;
* real push provider;
* final legal document flow.

## Следующий промпт для разработки

См. `PROMPTS.md`, prompt `P1-01`.
