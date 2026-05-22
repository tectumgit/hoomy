# Database Model: Hoomy / Хоми

## Главный принцип модели

Доставка не принадлежит товару. Доставка принадлежит поставщику и фиксируется в подзаказе при checkout.

```text
supplier -> delivery rules
product  -> price, unit, minimum, step, stock
checkout -> selected delivery date/time per supplier order
```

## Деньги и количества

Деньги:

* хранить в копейках как `Int`;
* `priceKopecks`, `itemsTotalKopecks`, `deliveryFeeKopecks`, `totalKopecks`;
* не использовать float для денег.

Количество:

* хранить как `Decimal`;
* поддержать `0.1 кг`, `6 л`, `30 шт`;
* валидировать через `minQuantity` и `orderStep`.

Единицы:

```text
KG, G, L, ML, PCS, PACK, BOX, CRATE, BAG, SET
```

## Базовые enum

```text
UserRole:
  CUSTOMER
  SUPPLIER_USER
  ADMIN
  SUPER_ADMIN

UserStatus:
  ACTIVE
  BLOCKED
  DELETED

SupplierStatus:
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  BLOCKED

ProductStatus:
  DRAFT
  ACTIVE
  HIDDEN_BY_SUPPLIER
  HIDDEN_BY_ADMIN
  BLOCKED
  OUT_OF_STOCK

OrderStatus:
  CREATED
  PAID
  ACCEPTED_BY_SUPPLIER
  ASSEMBLING
  HANDED_TO_DELIVERY
  ON_THE_WAY
  DELIVERED
  CANCELLED
  REFUND
  DISPUTE

PaymentStatus:
  PENDING
  SUCCEEDED
  FAILED
  CANCELLED
  REFUNDED
  PARTIALLY_REFUNDED

DisputeStatus:
  CREATED
  UNDER_REVIEW
  INFO_REQUESTED
  RESOLVED_CUSTOMER
  RESOLVED_SUPPLIER
  CLOSED

NotificationType:
  ORDER
  PROMO
  SYSTEM
  BILLING
```

## Основные таблицы

### users

```text
id
phone unique
email nullable
name nullable
role
status
createdAt
updatedAt
deletedAt nullable
```

### customer_profiles

```text
id
userId unique
city
defaultAddressId nullable
createdAt
updatedAt
```

### addresses

```text
id
userId
city
street
house
entrance nullable
floor nullable
apartment nullable
comment nullable
lat nullable
lng nullable
createdAt
updatedAt
```

### suppliers

```text
id
ownerUserId
name
inn
ogrn nullable
ogrnip nullable
contactPerson
phone
email
city
description nullable
logoFileId nullable
coverFileId nullable
status
isB2B Boolean
boostLevel NONE | TIER_1 | TIER_2 | TIER_3
minOrderAmountKopecks
freeDeliveryFromKopecks nullable
baseDeliveryFeeKopecks
commissionBps
ratingAvg
reviewsCount
createdAt
updatedAt
```

`commissionBps` — basis points. Например, 10% = `1000`.

### supplier_categories

```text
supplierId
categoryId
```

### categories

```text
id
parentId nullable
name
slug unique
sortOrder
isActive
```

### products

```text
id
supplierId
categoryId
name
slug
description nullable
priceKopecks
discountPriceKopecks nullable
b2bPriceKopecks nullable
b2bMinQuantity Decimal nullable
isPopular Boolean
popularityScore Float
unit
minQuantity Decimal
orderStep Decimal
stockQuantity Decimal
storageConditions nullable
status
viewsCount
cartAddsCount
createdAt
updatedAt
```

В `products` нет `deliveryDate`, `deliveryFee`, `deliveryZoneId` как обязательных полей.

### product_images

```text
id
productId
fileId
sortOrder
alt nullable
createdAt
```

### delivery_zones

```text
id
supplierId
region
city
district nullable
polygon nullable
deliveryFeeKopecks nullable
minOrderAmountKopecks nullable
isActive
createdAt
updatedAt
```

Если у зоны нет собственной стоимости, используется `supplier.baseDeliveryFeeKopecks`.

### delivery_schedules

```text
id
supplierId
zoneId nullable
weekday
timeFrom
timeTo
orderDeadlineTime
deadlineDaysBefore
isActive
```

Пример: доставка во вторник, заказ до 18:00 за 1 день до доставки.

### carts

```text
id
userId
status ACTIVE | CHECKED_OUT | ABANDONED
createdAt
updatedAt
```

### cart_items

```text
id
cartId
supplierId
productId
quantity Decimal
unitPriceKopecks
createdAt
updatedAt
```

`supplierId` дублируется намеренно для быстрых группировок и проверки.

### orders

Общий заказ клиента.

```text
id
userId
addressId
status
paymentStatus
itemsTotalKopecks
deliveryTotalKopecks
totalKopecks
comment nullable
createdAt
updatedAt
paidAt nullable
cancelledAt nullable
```

### supplier_orders

Подзаказ конкретного поставщика.

```text
id
orderId
supplierId
status
itemsTotalKopecks
deliveryFeeKopecks
totalKopecks
minOrderAmountKopecks
selectedDeliveryDate
selectedTimeFrom
selectedTimeTo
deliveryZoneId nullable
supplierComment nullable
cancelReason nullable
createdAt
updatedAt
```

### order_items

```text
id
supplierOrderId
productId
productNameSnapshot
unit
quantity Decimal
unitPriceKopecks
lineTotalKopecks
createdAt
```

Snapshot нужен, чтобы заказ не ломался после изменения товара.

### payments

```text
id
orderId
provider
providerPaymentId unique nullable
amountKopecks
status
method
rawPayload nullable
createdAt
paidAt nullable
updatedAt
```

### payment_events

```text
id
paymentId nullable
provider
eventId unique
eventType
payload
processedAt nullable
createdAt
```

Нужно для идемпотентности вебхуков.

### refunds

```text
id
paymentId
orderId
supplierOrderId nullable
amountKopecks
reason
status
createdByUserId
createdAt
processedAt nullable
```

### message_threads

```text
id
customerId
supplierId
orderId nullable
productId nullable
createdAt
updatedAt
```

### messages

```text
id
threadId
senderUserId
text
attachmentFileId nullable
readAt nullable
createdAt
```

### complaints

```text
id
customerId
supplierId nullable
productId nullable
orderId nullable
supplierOrderId nullable
reason
description
status
createdAt
closedAt nullable
```

### disputes

```text
id
customerId
supplierId
orderId
supplierOrderId nullable
reason
description
status
adminId nullable
resolution nullable
createdAt
updatedAt
closedAt nullable
```

### reviews

```text
id
customerId
supplierId
productId nullable
orderId
rating
text nullable
photoFileId nullable
createdAt
```

### files

```text
id
ownerUserId nullable
bucket
key
url
mimeType
sizeBytes
createdAt
```

### analytics_events

```text
id
userId nullable
supplierId nullable
productId nullable
eventType
metadata
createdAt
```

События:

```text
SUPPLIER_VIEW
PRODUCT_VIEW
CART_ADD
CHECKOUT_STARTED
ORDER_PAID
```

### audit_logs

```text
id
actorUserId
action
entityType
entityId
before nullable
after nullable
createdAt
```

Обязательно писать:

* одобрение/отклонение поставщика;
* скрытие/блокировка товара;
* блокировка пользователя;
* решение по спору;
* ручное изменение заказа администратором;
* изменение комиссии.

### b2b_leads

```text
id
userId unique
companyName
inn
kpp nullable
phone
email
estimatedVolumeText nullable
status PENDING | APPROVED | REJECTED
createdAt
updatedAt
```

### weekly_templates

```text
id
userId unique
name
isActive
createdAt
updatedAt
```

### weekly_template_items

```text
id
templateId
productId
quantity Decimal
createdAt
```

### notifications

```text
id
userId
type NotificationType
title
message
link nullable
readAt nullable
createdAt
updatedAt
```

### search_history

```text
id
userId
query
createdAt
```


## Критические бизнес-правила

### Количество товара

```text
quantity >= product.minQuantity
(quantity - product.minQuantity) % product.orderStep == 0
quantity <= product.stockQuantity
```

Из-за Decimal проверку лучше делать через нормализацию масштаба, а не через float.

### Минимальная сумма поставщика

```text
sum(cart items by supplier) >= supplier.minOrderAmountKopecks
```

Если не достигнута:

```text
Минимальный заказ у поставщика — 3 000 ₽.
Добавьте товаров еще на 600 ₽.
```

### Доставка

Checkout должен проверить:

* адрес попадает в зону поставщика;
* выбранная дата доступна по графику;
* дедлайн заказа не прошел;
* интервал доставки активен;
* стоимость доставки рассчитана по поставщику/зоне;
* бесплатная доставка применяется, если сумма достигнута.

### Создание заказа

Алгоритм:

1. Получить активную корзину клиента.
2. Сгруппировать позиции по `supplierId`.
3. Проверить товары, остатки, минимумы, шаги.
4. Проверить минимальную сумму по каждому поставщику.
5. Проверить доставку по каждому поставщику.
6. Создать `orders`.
7. Создать `supplier_orders`.
8. Создать `order_items` со snapshot-данными.
9. Создать платеж.
10. После успешной оплаты перевести заказ и подзаказы в `PAID`.

### Публикация товара

Товар может стать `ACTIVE`, если:

* поставщик `APPROVED`;
* заполнены обязательные поля;
* есть цена;
* есть единица, минимум, шаг и остаток;
* есть хотя бы одно фото желательно, но для MVP можно разрешить без фото только как черновик.

### Спор

Спор должен быть связан минимум с:

* клиентом;
* поставщиком;
* заказом;
* причиной;
* описанием.

Если спор решен в пользу клиента, возможен полный или частичный возврат.
