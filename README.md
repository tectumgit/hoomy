# Hoomy / Хоми: пакет подготовки к разработке

Этот каталог содержит исходные документы для разработки мобильного маркетплейса плановых закупок продуктов у поставщиков.

## Как читать документы

1. [vision.md](/Users/vladimirzhadov/Documents/hoomy/vision.md) — главный продуктовый ориентир: что строим, для кого, MVP-границы, метрики.
2. [ux-research-hardclient-lavka.md](/Users/vladimirzhadov/Documents/hoomy/ux-research-hardclient-lavka.md) — выводы из статьи Hard Client про Яндекс Лавку и как адаптировать их для Хоми.
3. [Wireframes.md](/Users/vladimirzhadov/Documents/hoomy/Wireframes.md) — frontend-first wireframes: сначала интерфейс на мок-данных, потом подключение API.
4. [architecture.md](/Users/vladimirzhadov/Documents/hoomy/architecture.md) — целевая структура приложения, модули, потоки данных и границы ответственности.
5. [tech-stack.md](/Users/vladimirzhadov/Documents/hoomy/tech-stack.md) — рекомендуемые фреймворки, библиотеки, инфраструктура и причины выбора.
6. [database-model.md](/Users/vladimirzhadov/Documents/hoomy/database-model.md) — нормализованная модель данных и бизнес-правила БД.
7. [vibe-coding-brief.md](/Users/vladimirzhadov/Documents/hoomy/vibe-coding-brief.md) — краткий бриф для AI-кодинга, чтобы генерация не уходила в неверную модель.
8. [AGENTS.md](/Users/vladimirzhadov/Documents/hoomy/AGENTS.md) — правила для AI-агентов и Antigravity.
9. [GEMINI.md](/Users/vladimirzhadov/Documents/hoomy/GEMINI.md) — короткий entrypoint для Antigravity.
10. [.agents](/Users/vladimirzhadov/Documents/hoomy/.agents/README.md) — workspace rules, роли агентов и workflows.
11. [PROJECT_MANAGER.md](/Users/vladimirzhadov/Documents/hoomy/PROJECT_MANAGER.md) — процесс управления задачами и выдачи промптов.
12. [PROJECT_STATUS.md](/Users/vladimirzhadov/Documents/hoomy/PROJECT_STATUS.md) — текущий статус, backlog и открытые решения.
13. [PROMPTS.md](/Users/vladimirzhadov/Documents/hoomy/PROMPTS.md) — готовые промпты для разработки.

Дополнительные черновики:

* [тз.md](/Users/vladimirzhadov/Documents/hoomy/тз.md) — подробное техническое задание.
* [userflow.md](/Users/vladimirzhadov/Documents/hoomy/userflow.md) — клиентские, поставщицкие и административные сценарии.
* [designsystem.md](/Users/vladimirzhadov/Documents/hoomy/designsystem.md) — UI-направление и компоненты.
* [designapp.md](/Users/vladimirzhadov/Documents/hoomy/designapp.md) — отдельные заметки по UX-референсам.
* [BusinessModelCanvas.md](/Users/vladimirzhadov/Documents/hoomy/BusinessModelCanvas.md) — бизнес-модель.

## Главные правила продукта

1. Главный объект покупки — поставщик, а не отдельный товар.
2. Клиент сначала выбирает поставщика, затем товары в его каталоге.
3. Товар хранит цену, единицу измерения, минимальный объем, шаг заказа и остаток.
4. Доставка хранится у поставщика: зоны, дни, временные интервалы, дедлайн заказа, стоимость, бесплатная доставка от суммы.
5. Корзина всегда группируется по поставщикам.
6. Checkout создает один общий заказ и отдельные подзаказы по поставщикам.
7. Дата доставки выбирается при оформлении заказа отдельно по каждому поставщику.
8. Товары публикуются автоматически, но администратор может скрыть или заблокировать товар после публикации.
9. Чат клиента с поставщиком доступен до и после заказа.
10. Если вопрос не решен напрямую, клиент открывает спор, и подключается поддержка Хоми.

## MVP-решение по архитектуре

Для первого запуска выбран прагматичный вариант: Expo-приложение для клиента, Next.js web-приложение для кабинета поставщика и админ-панели, общий API в Next.js route handlers, PostgreSQL + Prisma, общий пакет типов и схем.

Это снижает количество сервисов на старте и подходит для вайб-кодинга. При росте нагрузки API можно вынести в отдельный backend-сервис без изменения бизнес-модели.

## AI-agent workflow

В Antigravity и других AI IDE начинать с:

```text
AGENTS.md -> GEMINI.md -> .agents/mission-control.md -> .agents/rules/*
```

Текущий режим проекта:

```text
frontend на моках -> mock repositories -> API-контракты -> backend
```

Для больших задач сначала использовать planner-agent, затем специализированные роли из `.agents/roles`.

## Как запустить проект

Для локальной разработки используйте `pnpm` (убедитесь, что он установлен глобально):

1. Установите зависимости:
   ```bash
   pnpm install
   ```

2. Запустите все приложения в режиме разработки:
   ```bash
   pnpm dev
   ```

   - Мобильное приложение (Expo) запустится и выведет QR-код. Для запуска на симуляторе iOS нажмите `i`, для Android — `a`.
   - Web-кабинет (Next.js) будет доступен по адресу: http://localhost:3000

3. Для проверки типов и линтинга:
   ```bash
   pnpm typecheck
   pnpm lint
   ```

## Источники

* Hard Client: [Как Лавка доставляет хороший UX](https://hardclient.com/yandex-lavka)
* Expo docs: [Create a new Expo app](https://github.com/expo/expo/blob/main/docs/pages/build/setup.mdx)
* Next.js docs: [App Router installation](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx)
* Prisma docs: [PostgreSQL setup](<https://github.com/prisma/web/blob/main/apps/docs/content/docs/(index)/prisma-orm/add-to-existing-project/postgresql.mdx>)
