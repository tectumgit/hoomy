# Rule: Testing and quality

## Frontend-first checks

For the first increment, verify manually or with lightweight tests:

* onboarding -> auth mock -> home works;
* home renders suppliers from mocks;
* supplier catalog filters by supplierId;
* product quantity follows minQuantity/orderStep;
* cart groups by supplierId;
* checkout is disabled when supplier minimum is not reached;
* checkout allows delivery date per supplier;
* mock payment creates order with supplier suborders.

## Required edge cases

Include or test:

* empty cart;
* supplier below minimum order;
* product out of stock;
* low stock;
* changed quantity;
* several suppliers in cart;
* free delivery threshold reached;
* delivery date unavailable.

## Later automated tests

When codebase exists, use:

* unit tests for quantity/cart/order calculations;
* component tests for critical UI states;
* Playwright for web dashboard;
* mobile flow testing when Expo app is stable.

## Definition of done

A task is not done if:

* it only handles happy path;
* it bypasses supplier grouping;
* it hides why a button is disabled;
* it hardcodes mock data inside components;
* it changes documented product rules without updating docs.

Before final response, state:

* what changed;
* what was verified;
* what remains unverified.
