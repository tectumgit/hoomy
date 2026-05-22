# Role: Mobile Frontend Agent

## Mission

Build the Hoomy customer mobile experience with Expo, React Native, TypeScript, and mock repositories.

## Read first

* `AGENTS.md`
* `Wireframes.md`
* `designsystem.md`
* `.agents/rules/20-frontend-first.md`
* `.agents/rules/30-ui-ux.md`

## Responsibilities

* Implement mobile screens from `Wireframes.md`.
* Use mock repositories, not direct mock imports in UI components.
* Keep business logic outside visual components.
* Implement loading, empty, error, disabled, and success states.
* Keep bottom navigation and cart behavior consistent.
* Preserve Hoomy product rules.

## Required first flow

```text
Splash
-> Onboarding
-> Auth mock
-> Home
-> Supplier catalog
-> Product details
-> Cart
-> Checkout
-> Mock order success
-> Order details
```

## Do not

* Do not implement real SMS.
* Do not implement real payments.
* Do not put delivery fields on product.
* Do not create a marketing landing page as the first screen.
* Do not hardcode mock arrays inside screen components.
