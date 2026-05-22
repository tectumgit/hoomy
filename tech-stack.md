# Tech Stack: Hoomy / Хоми

## Решение для MVP

Рекомендуемый стек:

```text
Mobile: Expo + React Native + TypeScript
Web: Next.js App Router + TypeScript
API: Next.js Route Handlers + service layer
DB: PostgreSQL + Prisma
Validation: Zod
Client state: TanStack Query + lightweight local state
Styling web: Tailwind CSS + shadcn/ui
Styling mobile: React Native components + design tokens
Monorepo: pnpm workspaces + Turborepo
```

Причина выбора: этот стек достаточно современный, хорошо документирован, быстро стартует, подходит для AI-кодинга и не требует сразу поднимать отдельный backend-сервис.

## Первый инкремент: без backend

Первый рабочий результат — кликабельный frontend на моках.

На этом этапе используем:

* Expo app;
* Next.js web shell для кабинета поставщика и админки;
* TypeScript-типы из `packages/shared`;
* mock repositories;
* локальное состояние корзины;
* мок-оплату;
* мок-заказы.

Не поднимаем в первом инкременте:

* PostgreSQL;
* Prisma migrations;
* реальную SMS-интеграцию;
* реальный платежный провайдер;
* реальные push-уведомления.

Но типы моков делаем похожими на будущий API, чтобы подключение backend было заменой слоя данных, а не переписыванием экранов.

## Mobile app

Основа:

* Expo SDK 55;
* React Native;
* TypeScript;
* Expo Router;
* EAS Build / Submit / Update;
* Expo SecureStore для чувствительных токенов;
* expo-notifications для push;
* expo-image-picker для фото в жалобах и товарах, если поставщик позже получит mobile-кабинет.

Библиотеки:

* TanStack Query — серверное состояние, кеш, refetch;
* Zod — валидация ответов и форм через общие схемы;
* React Hook Form — формы;
* Zustand — небольшое локальное состояние: выбранный город, UI-состояния, draft cart если нужно;
* react-native-mmkv или AsyncStorage — быстрые локальные настройки;
* lucide-react-native — иконки;
* date-fns — даты и интервалы.

Навигация:

```text
/(auth)
/(tabs)/home
/(tabs)/catalog
/(tabs)/cart
/(tabs)/orders
/(tabs)/profile
/supplier/[id]
/product/[id]
/checkout
/orders/[id]
/chat/[threadId]
/disputes/new
```

## Web app

Основа:

* Next.js App Router;
* TypeScript;
* React Server Components там, где это упрощает чтение данных;
* Route Handlers для API;
* Tailwind CSS;
* shadcn/ui для форм, таблиц, диалогов и админских компонентов;
* lucide-react для иконок.

Разделы:

```text
/(supplier)
  /dashboard
  /products
  /products/new
  /orders
  /messages
  /delivery
  /analytics
  /profile

/(admin)
  /dashboard
  /suppliers
  /products
  /orders
  /complaints
  /disputes
  /commissions
```

Библиотеки:

* TanStack Table — таблицы поставщиков, заказов, товаров, жалоб;
* React Hook Form — формы;
* Zod — валидация;
* Sonner — toast-уведомления;
* Recharts — базовая аналитика;
* UploadThing или S3-compatible upload adapter — загрузка файлов.

## Backend/API

Для MVP backend живет внутри `apps/web`:

```text
apps/web/app/api/*        -> HTTP route handlers
apps/web/src/modules/*    -> бизнес-логика
packages/shared/schemas   -> Zod-схемы
packages/db               -> Prisma Client
```

Route handler не должен содержать бизнес-логику. Он только:

1. проверяет сессию и роль;
2. валидирует input;
3. вызывает module service;
4. возвращает JSON.

Пример модулей:

```text
src/modules/catalog/catalog.service.ts
src/modules/cart/cart.service.ts
src/modules/checkout/checkout.service.ts
src/modules/payments/payments.service.ts
src/modules/disputes/disputes.service.ts
```

## Database

* PostgreSQL — основная база;
* Prisma — схема, миграции, типобезопасный клиент;
* деньги хранить в копейках как `Int`;
* количества хранить как `Decimal`;
* статусы хранить enum-ами;
* все важные действия писать в audit log.

Почему не MongoDB: модель заказов, платежей, подзаказов, поставщиков и прав доступа лучше ложится на реляционную БД.

## Auth

MVP:

* вход по телефону и SMS-коду;
* rate limit на отправку SMS;
* срок жизни кода 5-10 минут;
* одноразовое использование кода;
* refresh/session cookie для web;
* bearer token или session token для mobile.

Провайдер SMS должен быть заменяемым:

```text
SmsProvider interface
  sendCode(phone, code)
```

Кандидаты для проверки перед внедрением: SMS.ru, SMS Aero, Dadata SMS, провайдер банка/эквайринга.

## Payments

MVP:

* онлайн-оплата картой;
* СБП желательно;
* платеж создается на общий заказ;
* внутри системы платеж распределяется по подзаказам поставщиков;
* вебхуки платежей идемпотентны;
* возвраты привязываются к заказу, подзаказу или спору.

Платежный провайдер должен быть адаптером:

```text
PaymentProvider interface
  createPayment(order)
  handleWebhook(payload)
  refund(payment, amount)
```

Кандидаты для проверки перед внедрением: ЮKassa, CloudPayments, Т-Банк Касса.

## Files

Хранить файлы в S3-compatible storage:

* фото товаров;
* логотипы поставщиков;
* обложки;
* фото в жалобах и спорах;
* документы поставщика, если будут нужны.

Для продакшена с персональными данными РФ предпочтительнее заранее выбрать хранилище и серверы с учетом локализации данных.

## Maps and addresses

MVP:

* ручной ввод адреса;
* город;
* район/зона;
* комментарий к доставке.

Позже:

* подсказки адреса;
* геокодинг;
* проверка попадания адреса в зону поставщика.

Кандидаты: DaData, Яндекс Карты, 2ГИС.

## Notifications

Каналы:

* SMS — вход;
* push — клиентские и поставщицкие события;
* email — поставщику и администратору;
* in-app notifications — внутри web/mobile.

События:

* заказ оплачен;
* новый заказ поставщику;
* смена статуса;
* новое сообщение;
* спор создан;
* спор обновлен;
* низкий остаток.

## Testing

Минимальный набор:

* Vitest — unit-тесты бизнес-правил;
* Playwright — web/admin/supplier e2e;
* Maestro или Detox — критические mobile flows;
* MSW — мок API для frontend;
* Prisma seed — тестовые поставщики, товары, заказы.

Что тестировать обязательно:

* min quantity / order step;
* cart grouping by supplier;
* supplier min order amount;
* checkout creates supplier suborders;
* payment webhook idempotency;
* supplier cannot access another supplier's order;
* admin actions are audited.

## Deployment

Для прототипа:

* local Docker Postgres;
* Next.js локально;
* Expo development build.

Для MVP-продакшена:

* web/API: Node.js hosting или VPS;
* DB: managed PostgreSQL;
* files: S3-compatible storage;
* backups: ежедневные;
* logs: централизованные;
* SSL обязательно.

Если обрабатываются персональные данные граждан РФ, перед продакшеном нужно отдельно проверить требования по 152-ФЗ, локализации хранения и договоры с провайдерами.

## Источники по фреймворкам

* Expo: `create-expo-app` с template `default@sdk-55`, Expo Router и EAS Build описаны в официальной документации Expo.
* Next.js: официальный quick start создает TypeScript, Tailwind, ESLint, App Router и Turbopack по умолчанию.
* Prisma: официальная документация рекомендует PostgreSQL datasource, Prisma schema, migrations и Prisma Client.
