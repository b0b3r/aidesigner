# Material Design Navigation

**Дизайн-система:** Material Design 3
**Дата создания:** 2025-08-06 23:57:58

## Описание

Компоненты навигации помогают пользователям перемещаться по приложению.

## Типы

- Bottom navigation
- Navigation drawer
- Tabs
- Top app bar

### Пример Top App Bar (MDC)

Классы:
- `mdc-top-app-bar`, `mdc-top-app-bar__row`, `mdc-top-app-bar__section`, `mdc-top-app-bar__title`

Разметка:
```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <span class="mdc-top-app-bar__title">Заголовок</span>
    </section>
  </div>
  </header>
```

## Использование

Bottom navigation для 3-5 основных разделов

## Доступность

Используйте role='navigation' и aria-labels

