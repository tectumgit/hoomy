# AGENTS.md — Hoomy / Хоми

## Назначение

Этот файл — главный набор правил для AI-агентов, которые работают над проектом Hoomy в Antigravity IDE, Codex, Cursor, Claude Code или другой agentic IDE.

Перед любыми изменениями агент обязан прочитать:

1. [README.md](/Users/vladimirzhadov/Documents/hoomy/README.md)
2. [vision.md](/Users/vladimirzhadov/Documents/hoomy/vision.md)
3. [Wireframes.md](/Users/vladimirzhadov/Documents/hoomy/Wireframes.md)
4. [architecture.md](/Users/vladimirzhadov/Documents/hoomy/architecture.md)
5. [tech-stack.md](/Users/vladimirzhadov/Documents/hoomy/tech-stack.md)
6. [database-model.md](/Users/vladimirzhadov/Documents/hoomy/database-model.md)
7. [vibe-coding-brief.md](/Users/vladimirzhadov/Documents/hoomy/vibe-coding-brief.md)

Если документы конфликтуют, приоритет такой:

```text
AGENTS.md
-> README.md
-> Wireframes.md
-> architecture.md
-> tech-stack.md
-> database-model.md
-> остальные черновики
```

## Продукт

Hoomy — мобильный маркетплейс плановых закупок продуктов и товаров большими объемами напрямую у локальных поставщиков.

Главная логика:

* клиент сначала выбирает поставщика;
* затем выбирает товары из каталога поставщика;
* товар хранит цену, единицу измерения, минимальный объем, шаг заказа и остаток;
* доставка принадлежит поставщику, а не товару;
* корзина группируется по поставщикам;
* checkout создает общий заказ и отдельные подзаказы по поставщикам;
* дата доставки выбирается при checkout отдельно по каждому поставщику.

## Текущий этап разработки

Проект идет frontend-first:

```text
frontend на моках -> mock repositories -> API-контракты -> backend -> замена моков на HTTP
```

На первом инкременте нельзя начинать с реального backend, Prisma migrations, платежей или SMS. Сначала нужен кликабельный интерфейс:

* mobile app на моках;
* supplier web cabinet на моках;
* admin web на моках;
* mock cart;
* mock checkout;
* mock order creation.

## Рекомендуемый стек

```text
Mobile: Expo + React Native + TypeScript
Web: Next.js App Router + TypeScript
API позже: Next.js Route Handlers
DB позже: PostgreSQL + Prisma
Validation: Zod
State: TanStack Query + локальное состояние
Web UI: Tailwind CSS + shadcn/ui
Mobile UI: React Native components + design tokens
Monorepo: pnpm workspaces + Turborepo
```

## Обязательные бизнес-правила

### Quantity

```text
quantity >= product.minQuantity
quantity follows product.orderStep
quantity <= product.stockQuantity
```

Примеры:

* картофель: мин. 10 кг, шаг 5 кг -> 10, 15, 20;
* трюфели: мин. 0.1 кг, шаг 0.1 кг -> 0.1, 0.2, 0.3;
* молоко: мин. 6 л, шаг 1 л -> 6, 7, 8;
* яйца: мин. 30 шт, шаг 30 шт -> 30, 60, 90.

### Supplier cart

Корзина не бывает плоской. Всегда группировать:

```text
cart
  supplier A
    item 1
    item 2
  supplier B
    item 3
```

### Delivery

Нельзя добавлять `deliveryDate`, `deliveryFee`, `deliveryZone` как основные поля товара.

Доставка живет у поставщика и фиксируется в `supplierOrder` при checkout.

## UI/UX правила

* Главная страница — лента поставщиков с каруселями товаров.
* Карточка поставщика должна показывать рейтинг, минимум заказа, доставку, дни доставки и быстрые товары.
* Карточка товара всегда показывает цену, единицу, минимум, шаг, остаток и цену минимальной партии.
* Если кнопка недоступна, рядом должна быть причина.
* Не копировать Яндекс Еду/Лавку визуально: не брать фирменные цвета, тексты, иконки и узнаваемые паттерны.
* Основной брендовый цвет Hoomy: `#FF6500`.
* Интерфейс должен быть mobile-first, чистый, понятный, без маркетинговой посадочной страницы вместо приложения.

## Архитектурные правила

* UI-компоненты не импортируют моки напрямую.
* Экран получает данные через repository/API слой.
* На первом этапе repository использует mock adapter.
* При подключении backend mock adapter заменяется HTTP adapter.
* Бизнес-логику не писать прямо в React-компонентах.
* Деньги хранить в копейках.
* Количества хранить как Decimal/number в моках, но проектировать под Decimal в БД.
* Общие типы, enum и Zod-схемы держать в `packages/shared`.
* Prisma schema позже держать в `packages/db`.

## Безопасность

* Не читать, не печатать и не коммитить `.env`, ключи, токены, сертификаты.
* Не выполнять destructive commands без явного запроса пользователя.
* Не добавлять реальные платежные/SMS ключи в код.
* Любые платежи на frontend-first этапе только mock.
* Любые персональные данные в моках должны быть вымышленными.
* Для будущего продакшена учитывать 152-ФЗ и локализацию персональных данных РФ.

## Работа агента

Перед изменениями:

1. Прочитать релевантные документы.
2. Коротко сформулировать план.
3. Проверить, какой этап разработки затрагивается.
4. Не расширять scope без причины.

Во время работы:

* держать изменения маленькими;
* не переписывать unrelated документы;
* не менять бизнес-модель доставки;
* сохранять frontend-first подход;
* обновлять docs при изменении архитектурных решений.

Перед завершением:

* проверить, что UI путь или документ соответствует `Wireframes.md`;
* проверить бизнес-правила корзины и доставки;
* указать, что проверено;
* указать, что осталось не сделано.

## Специализация агентов

Использовать role cards из [.agents/roles](/Users/vladimirzhadov/Documents/hoomy/.agents/roles):

* `planner-agent.md` — декомпозиция задач и порядок работ;
* `project-manager-agent.md` — статус проекта, backlog и промпты для разработки;
* `mobile-frontend-agent.md` — Expo mobile frontend;
* `web-dashboard-agent.md` — supplier/admin web;
* `backend-agent.md` — API, Prisma, PostgreSQL, позже;
* `qa-agent.md` — проверки, edge states, регрессии;
* `docs-agent.md` — синхронизация документации.

Если задача большая, сначала planner-agent делит ее на подзадачи, затем специализированные агенты выполняют свои части.

## Human-in-the-loop

Агент обязан остановиться и спросить пользователя, если:

* нужно выбрать платежного провайдера;
* нужно выбрать SMS-провайдера;
* нужно менять продуктовую модель;
* нужно удалить или массово переписать документы;
* нужно работать с реальными персональными данными;
* нужно выполнять destructive command;
* решение влияет на юридические/платежные требования.
