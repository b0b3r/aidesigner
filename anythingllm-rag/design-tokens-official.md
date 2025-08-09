# Material Design 3 - Официальные Дизайн Токены

## 🎨 ЦВЕТОВАЯ СИСТЕМА (CSS ПЕРЕМЕННЫЕ)

### Основные цвета системы (MDC Theme)
```css
/* Primary colors */
--mdc-theme-primary: #6200ee;
--mdc-theme-on-primary: #ffffff;

/* Secondary colors */
--mdc-theme-secondary: #018786;
--mdc-theme-on-secondary: #ffffff;

/* Surface and background */
--mdc-theme-surface: #ffffff;
--mdc-theme-background: #ffffff;
--mdc-theme-on-surface: #000000;

/* Error colors */
--mdc-theme-error: #b00020;
--mdc-theme-on-error: #ffffff;

/* Text colors */
--mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);
--mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);
--mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);
--mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);
--mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);
```

### Поверхности и фоны
```css
/* Surface colors */
--md-sys-color-surface: #FEF7FF;
--md-sys-color-on-surface: #1D1B20;
--md-sys-color-surface-variant: #E7E0EC;
--md-sys-color-on-surface-variant: #49454F;

/* Background colors */
--md-sys-color-background: #FEF7FF;
--md-sys-color-on-background: #1D1B20;

/* Outline colors */
--md-sys-color-outline: #79747E;
--md-sys-color-outline-variant: #CAC4D0;
```

### Состояния ошибок
```css
/* Error colors */
--md-sys-color-error: #BA1A1A;
--md-sys-color-on-error: #FFFFFF;
--md-sys-color-error-container: #FFDAD6;
--md-sys-color-on-error-container: #410002;
```

## 📏 ТИПОГРАФИКА

### Размеры и веса шрифтов
```css
/* Display styles */
--md-sys-typescale-display-large-font-size: 57px;
--md-sys-typescale-display-large-line-height: 64px;
--md-sys-typescale-display-large-font-weight: 400;

--md-sys-typescale-display-medium-font-size: 45px;
--md-sys-typescale-display-medium-line-height: 52px;
--md-sys-typescale-display-medium-font-weight: 400;

--md-sys-typescale-display-small-font-size: 36px;
--md-sys-typescale-display-small-line-height: 44px;
--md-sys-typescale-display-small-font-weight: 400;

/* Headline styles */
--md-sys-typescale-headline-large-font-size: 32px;
--md-sys-typescale-headline-large-line-height: 40px;
--md-sys-typescale-headline-large-font-weight: 400;

--md-sys-typescale-headline-medium-font-size: 28px;
--md-sys-typescale-headline-medium-line-height: 36px;
--md-sys-typescale-headline-medium-font-weight: 400;

--md-sys-typescale-headline-small-font-size: 24px;
--md-sys-typescale-headline-small-line-height: 32px;
--md-sys-typescale-headline-small-font-weight: 400;

/* Title styles */
--md-sys-typescale-title-large-font-size: 22px;
--md-sys-typescale-title-large-line-height: 28px;
--md-sys-typescale-title-large-font-weight: 400;

--md-sys-typescale-title-medium-font-size: 16px;
--md-sys-typescale-title-medium-line-height: 24px;
--md-sys-typescale-title-medium-font-weight: 500;

--md-sys-typescale-title-small-font-size: 14px;
--md-sys-typescale-title-small-line-height: 20px;
--md-sys-typescale-title-small-font-weight: 500;

/* Body styles */
--md-sys-typescale-body-large-font-size: 16px;
--md-sys-typescale-body-large-line-height: 24px;
--md-sys-typescale-body-large-font-weight: 400;

--md-sys-typescale-body-medium-font-size: 14px;
--md-sys-typescale-body-medium-line-height: 20px;
--md-sys-typescale-body-medium-font-weight: 400;

--md-sys-typescale-body-small-font-size: 12px;
--md-sys-typescale-body-small-line-height: 16px;
--md-sys-typescale-body-small-font-weight: 400;

/* Label styles */
--md-sys-typescale-label-large-font-size: 14px;
--md-sys-typescale-label-large-line-height: 20px;
--md-sys-typescale-label-large-font-weight: 500;

--md-sys-typescale-label-medium-font-size: 12px;
--md-sys-typescale-label-medium-line-height: 16px;
--md-sys-typescale-label-medium-font-weight: 500;

--md-sys-typescale-label-small-font-size: 11px;
--md-sys-typescale-label-small-line-height: 16px;
--md-sys-typescale-label-small-font-weight: 500;
```

## 🔘 ФОРМА И СОСТОЯНИЯ

### Радиусы закругления
```css
--md-sys-shape-corner-none: 0px;
--md-sys-shape-corner-extra-small: 4px;
--md-sys-shape-corner-small: 8px;
--md-sys-shape-corner-medium: 12px;
--md-sys-shape-corner-large: 16px;
--md-sys-shape-corner-extra-large: 28px;
--md-sys-shape-corner-full: 50%;
```

### Состояния взаимодействия
```css
--md-sys-state-hover-state-layer-opacity: 0.08;
--md-sys-state-focus-state-layer-opacity: 0.12;
--md-sys-state-pressed-state-layer-opacity: 0.12;
--md-sys-state-dragged-state-layer-opacity: 0.16;
```

## 🌊 ТЕНИ И ВОЗВЫШЕНИЕ

### Уровни возвышения
```css
--md-sys-elevation-level0: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);
--md-sys-elevation-level1: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
--md-sys-elevation-level2: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
--md-sys-elevation-level3: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
--md-sys-elevation-level4: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
--md-sys-elevation-level5: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
```

## 🔄 АНИМАЦИИ И ДВИЖЕНИЕ

### Длительность анимаций
```css
--md-sys-motion-duration-short1: 50ms;
--md-sys-motion-duration-short2: 100ms;
--md-sys-motion-duration-short3: 150ms;
--md-sys-motion-duration-short4: 200ms;
--md-sys-motion-duration-medium1: 250ms;
--md-sys-motion-duration-medium2: 300ms;
--md-sys-motion-duration-medium3: 350ms;
--md-sys-motion-duration-medium4: 400ms;
--md-sys-motion-duration-long1: 450ms;
--md-sys-motion-duration-long2: 500ms;
--md-sys-motion-duration-long3: 550ms;
--md-sys-motion-duration-long4: 600ms;
```

### Кривые анимации
```css
--md-sys-motion-easing-linear: cubic-bezier(0, 0, 1, 1);
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
--md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
```

## 💡 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Кнопка с дизайн-токенами
```html
<button class="mdc-button mdc-button--raised" style="
  background-color: var(--mdc-theme-primary);
  color: var(--mdc-theme-on-primary);
  padding: 10px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
">
  <span class="mdc-button__label">Кнопка Primary</span>
</button>
```

### Карточка с дизайн-токенами
```html
<div class="mdc-card" style="
  background-color: var(--mdc-theme-surface);
  color: var(--mdc-theme-text-primary-on-background);
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
">
  <h3 style="
    color: var(--mdc-theme-text-primary-on-background);
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 500;
  ">
    Заголовок карточки
  </h3>
  <p style="
    color: var(--mdc-theme-text-secondary-on-background);
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
  ">
    Описание содержимого карточки с использованием официальных дизайн-токенов Material Design.
  </p>
</div>
```

### Поле ввода с дизайн-токенами
```html
<div style="
  background-color: var(--md-sys-color-surface-variant);
  border-radius: var(--md-sys-shape-corner-extra-small);
  padding: 16px;
  margin: 8px 0;
  border: 1px solid var(--md-sys-color-outline);
">
  <label style="
    font-size: var(--md-sys-typescale-body-small-font-size);
    font-weight: var(--md-sys-typescale-body-small-font-weight);
    color: var(--md-sys-color-on-surface-variant);
    display: block;
    margin-bottom: 4px;
  ">
    Метка поля
  </label>
  <input type="text" style="
    background: transparent;
    border: none;
    outline: none;
    font-size: var(--md-sys-typescale-body-large-font-size);
    font-weight: var(--md-sys-typescale-body-large-font-weight);
    color: var(--md-sys-color-on-surface);
    width: 100%;
  " placeholder="Введите текст">
</div>
```

## 🎯 КЛЮЧЕВЫЕ ПРИНЦИПЫ

1. **Всегда используйте CSS переменные** вместо жестко заданных значений
2. **Соблюдайте иерархию цветов**: primary > secondary > tertiary
3. **Применяйте правильные пары**: используйте `on-*` цвета для текста на цветных фонах
4. **Следуйте типографической шкале** для размеров текста
5. **Используйте системные радиусы** для единообразия форм
6. **Применяйте правильные уровни возвышения** для создания глубины

## 🔗 СОВМЕСТИМОСТЬ

Эти токены совместимы с:
- Material Components Web (MDC)
- Material Design 3 спецификацией
- Современными браузерами с поддержкой CSS переменных
- Темной и светлой темами (автоматическое переключение)
