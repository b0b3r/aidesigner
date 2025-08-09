# Material Design 3 - Базовые Стили

## 🎨 БАЗОВЫЕ СТИЛИ ДЛЯ BODY И КОНТЕЙНЕРОВ

### Основной контейнер
```html
<div style="
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
  padding: 24px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
">
  <!-- Содержимое -->
</div>
```

### Стили body для Material Design 3
```css
body {
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.87);
}
```

## 🎯 ПРАВИЛЬНЫЕ ЦВЕТА MATERIAL DESIGN 3

### Primary цвета (ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙ!)
- **Primary кнопки:** `background-color: #6200ee` (фиолетовый)
- **Текст на Primary:** `color: #ffffff` (белый)

### Secondary цвета
- **Secondary элементы:** `background-color: #018786` (бирюзовый)
- **Текст на Secondary:** `color: #ffffff` (белый)

### Surface и Background
- **Surface (карточки):** `background-color: #ffffff` (белый)
- **Background (основной фон):** `background-color: #f5f5f5` (светло-серый)

### Текст
- **Основной текст:** `color: rgba(0, 0, 0, 0.87)` (тёмный)
- **Вторичный текст:** `color: rgba(0, 0, 0, 0.54)` (серый)
- **Подсказки:** `color: rgba(0, 0, 0, 0.38)` (светло-серый)

## ❌ ЧЕГО НЕ ДЕЛАТЬ

- **НЕ используй белый цвет (#ffffff) для кнопок!**
- **НЕ используй серый цвет для primary элементов!**
- **НЕ забывай про контрастность текста!**

## ✅ ПРИМЕРЫ ПРАВИЛЬНОГО ИСПОЛЬЗОВАНИЯ

### Primary кнопка
```html
<button class="mdc-button mdc-button--raised" style="
  background-color: #6200ee;
  color: #ffffff;
  padding: 10px 24px;
  border-radius: 4px;
  border: none;
">
  <span class="mdc-button__label">Primary Button</span>
</button>
```

### Карточка
```html
<div class="mdc-card" style="
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12);
">
  <h3 style="color: rgba(0, 0, 0, 0.87); margin: 0 0 8px;">Заголовок</h3>
  <p style="color: rgba(0, 0, 0, 0.54); margin: 0;">Описание</p>
</div>
```

### Контейнер с правильным фоном
```html
<div style="
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
">
  <!-- Ваш контент здесь -->
</div>
```
