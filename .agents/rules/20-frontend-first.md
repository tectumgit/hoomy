# Rule: Frontend-first implementation

## Current implementation order

Build in this order:

```text
1. Frontend shell
2. Mock data
3. Mock repositories
4. Client mobile flow
5. Supplier web mock
6. Admin web mock
7. API contracts
8. Backend
9. Replace mocks with HTTP
```

## First increment

Do not start with:

* PostgreSQL;
* Prisma migrations;
* real SMS;
* real payment;
* push notifications;
* production hosting.

Start with:

* Expo app shell;
* mock auth;
* suppliers mock;
* products mock;
* local/mock cart;
* mock checkout;
* mock orders;
* web shell for supplier/admin.

## Data access rule

Components must not import mock arrays directly.

Correct:

```text
screen -> feature hook -> repository -> mock adapter
```

Later:

```text
screen -> feature hook -> repository -> HTTP adapter
```

The UI should not change when switching from mocks to backend.

## Mock data quality

Mocks must be realistic:

* Kazan city;
* 3-5 suppliers;
* 20+ products;
* multiple units: kg, l, pcs, pack, box;
* multiple delivery days;
* one supplier below min order in cart;
* one supplier with free delivery reached;
* one low-stock product;
* one out-of-stock product.

## Mock payment

Mock payment behavior:

1. User taps pay.
2. Loading state appears.
3. After delay, mock order is created.
4. Cart is cleared.
5. User is routed to success screen.

No real payment integration in frontend-first stage.
