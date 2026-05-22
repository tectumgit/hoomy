# Project Management: Hoomy

## Роль

Project manager отвечает за:

* порядок разработки;
* декомпозицию задач;
* выдачу промптов для Antigravity/AI-агентов;
* контроль scope;
* приемку результата;
* обновление статуса проекта;
* фиксацию решений и открытых вопросов.

## Главный режим проекта

```text
frontend на моках -> mock repositories -> API-контракты -> backend -> замена моков на HTTP
```

До завершения кликабельного frontend-прототипа не начинать:

* реальный backend;
* Prisma migrations;
* SMS-интеграцию;
* платежного провайдера;
* production deploy.

## Рабочий цикл задачи

1. PM формулирует задачу.
2. PM указывает агента/роль.
3. PM дает контекстные документы.
4. PM задает scope и что нельзя трогать.
5. Агент выполняет задачу.
6. QA проверяет acceptance criteria.
7. PM принимает результат или возвращает на доработку.
8. PM обновляет `PROJECT_STATUS.md`.

## Статусы задач

```text
Backlog
Ready
In Progress
Review
Blocked
Done
```

## Шаблон задачи

```text
Task:

Agent:

Context:
- AGENTS.md
- Wireframes.md
- ...

Goal:

Scope:
- ...

Do not:
- ...

Acceptance criteria:
- ...

Verification:
- ...
```

## Шаблон промпта для Antigravity

```text
Read GEMINI.md and AGENTS.md first.
Use role: .agents/roles/<role>.md
Use workflow: .agents/workflows/<workflow>.md

Task:
<one clear task>

Context files:
- <file>
- <file>

Scope:
- <allowed changes>

Do not:
- <forbidden changes>

Acceptance criteria:
- <checks>

Before final response:
- list changed files
- list verification performed
- list remaining gaps
```

## PM-правила

* Одна задача — один понятный результат.
* Не смешивать mobile, web, backend и docs в одной задаче без причины.
* Для больших задач сначала выдавать planning prompt.
* Для реализации сначала mobile customer flow, потом supplier web, потом admin web.
* Каждый prompt должен содержать запреты: не делать backend, не делать real payments, не менять product delivery model.
* После каждой реализации нужна проверка по `qa-before-finish`.

## Формат отчета PM пользователю

```text
Сейчас этап:

Сделано:

Следующая задача:

Промпт для Antigravity:

Что проверять после выполнения:
```

## Human decisions

Пользователь принимает решения по:

* платежному провайдеру;
* SMS-провайдеру;
* юридическим документам;
* production-инфраструктуре;
* изменению бизнес-модели;
* изменению MVP scope.
