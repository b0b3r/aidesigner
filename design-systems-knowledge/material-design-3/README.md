# Material Design 3 Knowledge Base (MDC)

Полная система дизайна для RAG. Включает дизайн-токены, компоненты и принципы Material Design 3.

## 📋 СОДЕРЖАНИЕ

1. **[Дизайн-токены](./design-tokens-official.md)** - Официальные CSS переменные, цвета, типографика, анимации
2. **Компоненты** - Готовые элементы интерфейса (описаны ниже)
3. **Принципы** - Правила использования системы дизайна

## 🎨 ДИЗАЙН-ТОКЕНЫ (CSS ПЕРЕМЕННЫЕ)

**Всегда используйте CSS переменные вместо жестко заданных значений!**

### Основные цвета:
- `--mdc-theme-primary` - Основной цвет (#6200ee)
- `--mdc-theme-on-primary` - Текст на основном цвете (#fff)
- `--mdc-theme-secondary` - Вторичный цвет (#018786)
- `--mdc-theme-surface` - Поверхность (#fff)
- `--mdc-theme-background` - Фон (#fff)

### Текст:
- `--mdc-theme-text-primary-on-background` - Основной текст
- `--mdc-theme-text-secondary-on-background` - Вторичный текст
- `--mdc-theme-text-hint-on-background` - Подсказки
- `--mdc-theme-on-surface` - Текст на поверхности

### Состояния:
- `--mdc-theme-error` - Ошибки (#b00020)
- `--mdc-theme-on-error` - Текст на ошибках (#fff)

**Подробная документация:** [design-tokens-official.md](./design-tokens-official.md)

---

Структура файлов для RAG. Каждый файл кратко описывает компонент, ключевые классы, базовую разметку и JS‑инициализацию (если требуется).

## Сводный индекс ключевых CSS‑классов MDC

- Buttons: `mdc-button`, модификаторы: `mdc-button--raised`, `mdc-button--outlined`, `mdc-button--unelevated`, `mdc-button--tonal`; внутренние: `mdc-button__label`, `mdc-button__icon`, `mdc-button__ripple`
- Icon Button: `mdc-icon-button`
- FAB: `mdc-fab`, `mdc-fab--mini`, `mdc-fab__icon`, `mdc-fab__label`
- Top App Bar: `mdc-top-app-bar`, `mdc-top-app-bar__row`, `mdc-top-app-bar__section`, `mdc-top-app-bar__title`
- Drawer: `mdc-drawer`, `mdc-drawer--modal`, `mdc-drawer__content`, `mdc-drawer__header`, `mdc-drawer__title`, `mdc-drawer__subtitle`
- Tabs: `mdc-tab-bar`, `mdc-tab`, `mdc-tab__content`, `mdc-tab__text-label`, `mdc-tab__ripple`, `mdc-tab-indicator`
- Lists: `mdc-list`, `mdc-list-item`, `mdc-list-item__text`, `mdc-list-item__primary-text`, `mdc-list-item__secondary-text`, `mdc-list-item__graphic`, `mdc-list-item__meta`, `mdc-list-divider`
- Menu: `mdc-menu`, `mdc-menu-surface` (контент: `mdc-list`, `mdc-list-item`)
- Dialog: `mdc-dialog`, `mdc-dialog__container`, `mdc-dialog__surface`, `mdc-dialog__title`, `mdc-dialog__content`, `mdc-dialog__actions`, `mdc-dialog__button`
- Text Field: `mdc-text-field`, `mdc-text-field--outlined`, `mdc-text-field--filled`; `mdc-text-field__input`, `mdc-notched-outline`, `mdc-notched-outline__leading`, `mdc-notched-outline__notch`, `mdc-notched-outline__trailing`
- Select: `mdc-select`, `mdc-select--outlined`; `mdc-select__anchor`, `mdc-select__selected-text`, `mdc-notched-outline*`, используется `mdc-menu`/`mdc-list`
- Checkbox: `mdc-checkbox`, `mdc-checkbox__native-control`, `mdc-checkbox__background`
- Radio: `mdc-radio`, `mdc-radio__native-control`, `mdc-radio__background`
- Switch: `mdc-switch`, `mdc-switch__track`, `mdc-switch__thumb-underlay`, `mdc-switch__thumb`, `mdc-switch__native-control`
- Slider: `mdc-slider`, `mdc-slider__track`, `mdc-slider__thumb`, `mdc-slider__value-indicator`
- Linear Progress: `mdc-linear-progress`, `mdc-linear-progress__buffer`, `mdc-linear-progress__bar`
- Circular Progress: `mdc-circular-progress`, `mdc-circular-progress__layer`
- Snackbar: `mdc-snackbar`, `mdc-snackbar__surface`, `mdc-snackbar__label`, `mdc-snackbar__actions`
- Tooltip: `mdc-tooltip`, `mdc-tooltip__surface`
- Chips: `mdc-chip-set`, `mdc-chip`, `mdc-chip__text`, `mdc-chip__icon`
- Card: `mdc-card`, `mdc-card__actions`, `mdc-card__action-buttons`, `mdc-card__action-icons`
- Image List: `mdc-image-list`, `mdc-image-list__item`, `mdc-image-list__image`, `mdc-image-list__supporting`
- Layout Grid (legacy): `mdc-layout-grid`, `mdc-layout-grid__inner`, `mdc-layout-grid__cell`
- Form Field: `mdc-form-field`
- Ripple: `mdc-ripple`

Примечание: многие компоненты требуют JS (например, `mdc.autoInit()` уже подключён в `public/index.html`).

## Минимальные примеры разметки (для RAG)

### Top App Bar
```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <span class="mdc-top-app-bar__title">Заголовок</span>
    </section>
  </div>
</header>
```

### Drawer (Modal)
```html
<aside class="mdc-drawer mdc-drawer--modal">
  <div class="mdc-drawer__header">
    <h3 class="mdc-drawer__title">Меню</h3>
    <h6 class="mdc-drawer__subtitle">Навигация</h6>
  </div>
  <div class="mdc-drawer__content">
    <ul class="mdc-list">
      <li class="mdc-list-item" tabindex="0">Пункт</li>
    </ul>
  </div>
</aside>
```

### Tabs
```html
<div class="mdc-tab-bar">
  <div class="mdc-tab mdc-tab--active">
    <span class="mdc-tab__content"><span class="mdc-tab__text-label">Вкладка</span></span>
    <span class="mdc-tab-indicator"></span>
    <span class="mdc-tab__ripple"></span>
  </div>
</div>
```

### List
```html
<ul class="mdc-list">
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">Элемент</span>
  </li>
</ul>
```

### Menu
```html
<div class="mdc-menu mdc-menu-surface">
  <ul class="mdc-list" role="menu">
    <li class="mdc-list-item" role="menuitem">Пункт</li>
  </ul>
</div>
```

### Dialog
```html
<div class="mdc-dialog">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface">
      <h2 class="mdc-dialog__title">Заголовок</h2>
      <div class="mdc-dialog__content">Текст</div>
      <footer class="mdc-dialog__actions">
        <button class="mdc-button mdc-dialog__button"><span class="mdc-button__label">OK</span></button>
      </footer>
    </div>
  </div>
</div>
```

### Text Field (outlined)
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

### Select (outlined)
```html
<div class="mdc-select mdc-select--outlined">
  <div class="mdc-select__anchor">
    <span class="mdc-select__selected-text">Выберите…</span>
    <span class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__notch"></span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
  </div>
  <div class="mdc-menu mdc-menu-surface">
    <ul class="mdc-list"><li class="mdc-list-item" data-value="1">Один</li></ul>
  </div>
</div>
```

### Checkbox
```html
<div class="mdc-checkbox">
  <input type="checkbox" class="mdc-checkbox__native-control" />
  <div class="mdc-checkbox__background"></div>
  </div>
```

### Radio
```html
<div class="mdc-radio">
  <input class="mdc-radio__native-control" type="radio" name="r" />
  <div class="mdc-radio__background"></div>
</div>
```

### Switch
```html
<div class="mdc-switch">
  <div class="mdc-switch__track"></div>
  <div class="mdc-switch__thumb-underlay">
    <div class="mdc-switch__thumb"></div>
    <input type="checkbox" class="mdc-switch__native-control" role="switch" />
  </div>
</div>
```

### Slider
```html
<div class="mdc-slider" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
  <div class="mdc-slider__track"></div>
  <div class="mdc-slider__thumb"></div>
</div>
```

### Linear Progress
```html
<div role="progressbar" class="mdc-linear-progress">
  <div class="mdc-linear-progress__buffer"></div>
  <div class="mdc-linear-progress__bar"></div>
</div>
```

### Circular Progress
```html
<div class="mdc-circular-progress" role="progressbar"></div>
```

### Snackbar
```html
<div class="mdc-snackbar">
  <div class="mdc-snackbar__surface">
    <div class="mdc-snackbar__label">Сообщение</div>
    <div class="mdc-snackbar__actions">
      <button class="mdc-button"><span class="mdc-button__label">ОК</span></button>
    </div>
  </div>
</div>
```

### Tooltip
```html
<div class="mdc-tooltip" aria-hidden="true">
  <div class="mdc-tooltip__surface">Подсказка</div>
</div>
```

### Chips
```html
<div class="mdc-chip-set">
  <div class="mdc-chip"><span class="mdc-chip__text">Тег</span></div>
</div>
```

### Image List
```html
<ul class="mdc-image-list">
  <li class="mdc-image-list__item"><img class="mdc-image-list__image" src="/img.jpg" /></li>
</ul>
```

### Layout Grid (legacy)
```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell">A</div>
    <div class="mdc-layout-grid__cell">B</div>
  </div>
</div>
```

### Form Field
```html
<div class="mdc-form-field">
  <div class="mdc-checkbox">
    <input type="checkbox" class="mdc-checkbox__native-control" />
    <div class="mdc-checkbox__background"></div>
  </div>
  <label>Согласен</label>
</div>
```

### Icon Button
```html
<button class="mdc-icon-button material-icons" aria-label="Избранное">favorite</button>
```

### FAB
```html
<button class="mdc-fab" aria-label="Добавить">
  <span class="mdc-fab__icon material-icons">add</span>
</button>
```

### Bottom Navigation (через Tabs)
```html
<nav class="mdc-tab-bar" role="tablist">
  <div class="mdc-tab" role="tab" aria-selected="true">
    <span class="mdc-tab__content">
      <span class="mdc-tab__text-label">Главная</span>
    </span>
    <span class="mdc-tab-indicator"></span>
    <span class="mdc-tab__ripple"></span>
  </div>
</nav>
```


