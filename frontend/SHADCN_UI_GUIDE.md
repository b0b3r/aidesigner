# 🎨 shadcn/ui Темы - Руководство

## 📋 Что интегрировано

### ✅ Установленные компоненты
- **Button** - Кнопки с различными вариантами и размерами
- **Card** - Карточки с заголовками и контентом
- **Input** - Поля ввода
- **Textarea** - Многострочные поля ввода

### ✅ Настроенные темы
- **Светлая тема** (по умолчанию)
- **Темная тема** (переключается кнопкой)
- **CSS переменные** для всех цветов
- **Автоматическое сохранение** выбранной темы

## 🚀 Как использовать

### Переключение темы
```jsx
import { ThemeToggle } from './components/ThemeToggle';

// В компоненте
<ThemeToggle />
```

### Использование компонентов
```jsx
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';

// Кнопки
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Размеры
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// Карточки
<Card>
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
  </CardHeader>
  <CardContent>
    Контент карточки
  </CardContent>
</Card>

// Поля ввода
<Input placeholder="Введите текст..." />
<Textarea placeholder="Многострочный текст..." />
```

## 🎨 CSS переменные

### Основные цвета
```css
--background: 0 0% 100%;           /* Фон */
--foreground: 222.2 84% 4.9%;      /* Основной текст */
--card: 0 0% 100%;                 /* Фон карточек */
--card-foreground: 222.2 84% 4.9%; /* Текст в карточках */
--popover: 0 0% 100%;              /* Фон всплывающих окон */
--popover-foreground: 222.2 84% 4.9%; /* Текст во всплывающих окнах */
```

### Акцентные цвета
```css
--primary: 221.2 83.2% 53.3%;      /* Основной цвет */
--primary-foreground: 210 40% 98%; /* Текст на основном цвете */
--secondary: 210 40% 96%;          /* Вторичный цвет */
--secondary-foreground: 222.2 84% 4.9%; /* Текст на вторичном цвете */
--muted: 210 40% 96%;              /* Приглушенный цвет */
--muted-foreground: 215.4 16.3% 46.9%; /* Приглушенный текст */
--accent: 210 40% 96%;             /* Акцентный цвет */
--accent-foreground: 222.2 84% 4.9%; /* Текст на акцентном цвете */
```

### Семантические цвета
```css
--destructive: 0 84.2% 60.2%;      /* Цвет ошибки */
--destructive-foreground: 210 40% 98%; /* Текст на цвете ошибки */
--warning: 38 92% 50%;             /* Цвет предупреждения */
--warning-foreground: 48 96% 89%;  /* Текст на цвете предупреждения */
--success: 142 76% 36%;            /* Цвет успеха */
--success-foreground: 138 76% 97%; /* Текст на цвете успеха */
```

### Границы и кольца
```css
--border: 214.3 31.8% 91.4%;       /* Цвет границ */
--input: 214.3 31.8% 91.4%;        /* Цвет полей ввода */
--ring: 221.2 83.2% 53.3%;         /* Цвет фокуса */
--radius: 0.5rem;                  /* Радиус скругления */
```

## 🔧 Добавление новых компонентов

### 1. Установка компонента
```bash
npx shadcn@latest add [component-name]
```

### 2. Использование
```jsx
import { ComponentName } from './components/ui/component-name';
```

## 🎯 Примеры интеграции

### Обновленный чат
```jsx
<Card className="border-0 shadow-none">
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg">🚀 UI Design Assistant</CardTitle>
      <ThemeToggle />
    </div>
  </CardHeader>
  <CardContent className="p-0">
    {/* Контент чата */}
  </CardContent>
</Card>
```

### Кнопки-сайджесты
```jsx
<Button
  variant="outline"
  size="sm"
  onClick={handleClick}
  className="text-xs"
>
  Текст сайджеста
</Button>
```

## 🌙 Темная тема

### Автоматическое переключение
- Тема сохраняется в `localStorage`
- Автоматически применяется при загрузке
- Переключается кнопкой в интерфейсе

### CSS классы
```css
/* Светлая тема (по умолчанию) */
:root {
  /* переменные светлой темы */
}

/* Темная тема */
.dark {
  /* переменные темной темы */
}
```

## 📱 Адаптивность

Все компоненты shadcn/ui поддерживают:
- ✅ Responsive дизайн
- ✅ Доступность (a11y)
- ✅ Фокус-состояния
- ✅ Hover-эффекты
- ✅ Disabled-состояния

## 🎨 Кастомизация

### Изменение цветов темы
Отредактируйте переменные в `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Измените на нужный цвет */
  --secondary: 210 40% 96%;     /* И так далее */
}
```

### Добавление новых вариантов
В компонентах можно добавить новые варианты:

```jsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        custom: "custom-classes", // Новый вариант
      },
    },
  }
)
```

## 🔗 Полезные ссылки

- [shadcn/ui Документация](https://ui.shadcn.com/)
- [Доступные компоненты](https://ui.shadcn.com/docs/components)
- [Темы и цвета](https://ui.shadcn.com/themes)
- [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Следующие шаги

1. **Добавить больше компонентов** по мере необходимости
2. **Создать кастомные темы** для брендинга
3. **Интегрировать в остальные части приложения**
4. **Добавить анимации** с помощью `tailwindcss-animate`
