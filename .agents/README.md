# Hoomy agent setup

Этот каталог содержит правила, роли и workflows для работы AI-агентов в Antigravity IDE.

## Файлы

```text
.agents/
  rules/      workspace rules
  roles/      role cards для отдельных агентов
  workflows/  повторяемые сценарии работы
```

## Как использовать в Antigravity

1. Откройте проект `/Users/vladimirzhadov/Documents/hoomy` в Antigravity.
2. Убедитесь, что в корне есть `AGENTS.md` и `GEMINI.md`.
3. В Agent Manager / Customizations добавьте workspace rules из `.agents/rules`, если IDE не подхватила их автоматически.
4. Для больших задач начинайте с workflow `.agents/workflows/start-task.md`.
5. Для реализации frontend-first используйте `.agents/workflows/frontend-mock-feature.md`.

## Принцип

Не один агент делает все. Используем специализацию:

* planner;
* project manager;
* mobile frontend;
* web dashboard;
* backend;
* QA;
* docs.

Это следует паттернам multi-agent работы: декомпозиция задачи, специализация, координация, видимость результата и human-in-the-loop.
