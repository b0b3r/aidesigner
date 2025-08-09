# Material Design Buttons

**Дизайн-система:** Material Design 3
**Дата создания:** 2025-08-06 23:57:58

## Описание

Кнопки позволяют пользователям выполнять действия и делать выбор одним нажатием.

## Варианты

- Filled
- Outlined
- Text
- Elevated
- Tonal

## MDC классы

**ПРАВИЛЬНЫЕ КЛАССЫ:**
- Базовый: `mdc-button`
- Filled кнопка: `mdc-button mdc-button--raised` (НЕ --filled!)
- Outlined кнопка: `mdc-button mdc-button--outlined`
- Text кнопка: `mdc-button`
- Tonal кнопка: `mdc-button mdc-button--tonal`
- Unelevated кнопка: `mdc-button mdc-button--unelevated`
- Внутренние: `mdc-button__label`, `mdc-button__icon`, `mdc-button__ripple`

**❌ НЕПРАВИЛЬНЫЕ КЛАССЫ (НЕ ИСПОЛЬЗУЙ):**
- `mdc-button--filled` - НЕ СУЩЕСТВУЕТ в MDC!

### Пример (правильный filled/raised)
```html
<button class="mdc-button mdc-button--raised">
  <span class="mdc-button__label">Filled Button</span>
</button>
```

### Пример (outlined)
```html
<button class="mdc-button mdc-button--outlined">
  <span class="mdc-button__label">Outlined Button</span>
</button>
```

## Размеры

- Small
- Medium
- Large

## Состояния

- Default
- Hovered
- Focused
- Pressed
- Disabled

## Использование

Используйте filled кнопки для основных действий, outlined для вторичных

## Доступность

Добавляйте aria-label для иконочных кнопок

