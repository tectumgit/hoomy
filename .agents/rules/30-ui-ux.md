# Rule: UI/UX for Hoomy

## Design direction

Hoomy should feel:

```text
clean food delivery UX
+
bulk purchase clarity
+
supplier trust
```

Do not copy Yandex visual identity.

## Brand colors

Use documented Hoomy colors:

* primary: `#FF6500`;
* fresh green: `#45D88A`;
* blue accent: `#4778F5`;
* background: `#F7F8FA`;
* text: `#1E1E1E`.

Orange is an accent, not a full-screen theme for every surface.

## Mobile-first rules

* First screen must be the usable app, not a landing page.
* Primary CTA visible and reachable.
* Bottom navigation: Главная, Поставщики, Корзина, Заказы, Профиль.
* Cart badge only when cart has items.
* Avoid nested cards.
* Avoid decorative gradients/orbs.
* Keep cards readable and dense enough for commerce.

## Required customer screens

Implement the flow from `Wireframes.md`:

1. Splash
2. Onboarding
3. Auth mock
4. Home
5. Search
6. Supplier list
7. Supplier catalog
8. Product details
9. Cart
10. Checkout
11. Order success
12. Orders
13. Order details
14. Chat
15. Dispute
16. Profile

## Required states

For major screens include:

* loading;
* empty;
* error;
* success;
* disabled action with reason;
* validation error.

## Copy style

Use short human text.

Good:

```text
Добавьте еще на 600 ₽
Мин. 10 кг
Доставка 300 ₽
Закажите до 18:00
```

Bad:

```text
Ошибка валидации параметра
Недостаточная закупочная позиция
Невозможно произвести операцию
```
