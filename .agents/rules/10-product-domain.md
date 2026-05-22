# Rule: Hoomy product domain

## Product

Hoomy is a planned bulk-purchase marketplace:

```text
customer -> supplier -> bulk cart -> planned delivery
```

It is not express delivery and not a regular flat e-commerce catalog.

## Main object

Supplier is the main shopping object.

Correct:

```text
Home -> supplier card -> supplier catalog -> product -> cart grouped by supplier
```

Incorrect:

```text
Home -> endless product feed -> flat cart -> one generic delivery
```

## Product fields

Product owns:

* name;
* description;
* category;
* supplierId;
* image;
* price;
* unit;
* minQuantity;
* orderStep;
* stockQuantity;
* status.

Product does not own:

* deliveryDate;
* deliveryFee;
* deliveryZone;
* required warehouse address.

## Supplier delivery

Supplier owns:

* city;
* districts/zones;
* delivery days;
* delivery windows;
* order deadline;
* base delivery fee;
* free delivery threshold;
* supplier min order amount.

## Cart

Cart is always grouped by supplier.

For each supplier group show:

* supplier name;
* supplier min order amount;
* current supplier subtotal;
* remaining amount to minimum;
* delivery estimate;
* items;
* supplier subtotal.

## Checkout

Checkout creates:

* one customer order;
* one supplier suborder per supplier;
* delivery date/window per supplier suborder.

## Quantity validation

Use:

```text
quantity >= minQuantity
quantity follows orderStep
quantity <= stockQuantity
```

Show human-readable errors:

```text
Минимальный заказ этого товара — 10 кг
Количество можно менять только с шагом 5 кг
Осталось только 20 кг
```
