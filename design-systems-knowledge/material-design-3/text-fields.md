# Material Design Text Fields

**Дизайн-система:** Material Design 3
**Дата создания:** 2025-08-06 23:57:58

## Описание

Текстовые поля позволяют пользователям вводить и редактировать текст.

## Варианты

- Filled
- Outlined

## Состояния

- Default
- Focused
- Error
- Disabled

## Компоненты

- Label
- Input
- Helper text
- Error text

## MDC классы

- `mdc-text-field`, модификаторы: `mdc-text-field--outlined`, `mdc-text-field--filled`
- Внутренние: `mdc-text-field__input`, `mdc-notched-outline`, `mdc-notched-outline__leading`, `mdc-notched-outline__notch`, `mdc-notched-outline__trailing`

### Пример (outlined)
```html
<label class="mdc-text-field mdc-text-field--outlined">
  <input class="mdc-text-field__input" placeholder="Поиск" />
  <span class="mdc-notched-outline">
    <span class="mdc-notched-outline__leading"></span>
    <span class="mdc-notched-outline__notch"></span>
    <span class="mdc-notched-outline__trailing"></span>
  </span>
</label>
```

## Использование

Используйте outlined для форм, filled для поиска

## Доступность

Связывайте labels с inputs через for/id

