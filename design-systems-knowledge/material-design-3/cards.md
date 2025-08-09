# Material Design Cards

**Дизайн-система:** Material Design 3
**Дата создания:** 2025-08-06 23:57:58

## Описание

Карточки содержат контент и действия по одной теме.

## Варианты

- Elevated
- Filled
- Outlined

## Компоненты

- Header
- Content
- Actions
- Media

## MDC классы

- Базовый: `mdc-card`
- Действия: `mdc-card__actions`, `mdc-card__action-buttons`, `mdc-card__action-icons`

### Пример
```html
<div class="mdc-card" style="padding:16px;">
  <h3>Заголовок</h3>
  <p>Контент</p>
  <div class="mdc-card__actions">
    <div class="mdc-card__action-buttons">
      <button class="mdc-button mdc-button--outlined"><span class="mdc-button__label">Действие</span></button>
    </div>
  </div>
</div>
```

## Использование

Используйте карточки для группировки связанной информации

## Доступность

Обеспечьте логическую структуру заголовков

