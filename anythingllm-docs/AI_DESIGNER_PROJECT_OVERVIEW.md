# AI Designer - Обзор проекта

## Описание проекта
AI Designer - это веб-приложение для создания UI компонентов с помощью искусственного интеллекта. Пользователи могут описать желаемый интерфейс на естественном языке, и система сгенерирует соответствующий HTML/CSS код.

## Архитектура проекта

### Frontend (React)
- **Основной фреймворк**: React 18.2.0
- **Канвас**: React Flow (@xyflow/react) для интерактивного холста
- **Стилизация**: CSS с поддержкой Tailwind CSS
- **Состояние**: useState, useCallback, useRef, useEffect

### Backend (Python)
- **Фреймворк**: FastAPI
- **LLM API**: DeepSeek API для генерации кода
- **Обработка запросов**: Асинхронная обработка с поддержкой потоковой передачи

### Ключевые компоненты

#### 1. Canvas System (React Flow)
- **Файл**: `frontend/src/components/CanvasFlow.js`
- **Функции**: 
  - Интерактивный холст для размещения UI элементов
  - Drag & drop функциональность
  - Поддержка кастомных узлов
  - Миниатюра и элементы управления
  - Сетка точек для визуального позиционирования

#### 2. Visual Editor
- **Файлы**: 
  - `frontend/src/components/VisualEditor.js`
  - `frontend/src/components/VisualControls.js`
  - `frontend/src/utils/htmlParser.js`
- **Функции**:
  - Редактирование свойств HTML элементов в реальном времени
  - Цветовые пикеры, слайдеры размеров, контроли отступов
  - Debouncing для плавного редактирования
  - Извлечение и применение CSS стилей

#### 3. Message Router & Planning
- **Файлы**:
  - `frontend/src/services/MessageRouter.js`
  - `frontend/src/services/PlannerService.js`
- **Функции**:
  - Классификация пользовательских сообщений
  - Умная маршрутизация (чат, создание артефакта, пошаговое планирование)
  - Генерация и выполнение многоэтапных планов

#### 4. Properties Panel
- **Файл**: `frontend/src/components/PropertiesPanel.js`
- **Функции**:
  - Панель редактирования свойств выбранного элемента
  - Вкладки: Visual, Prompt, Code
  - Интеграция с Visual Editor

### Основные возможности

1. **Генерация UI по описанию**
   - Пользователь описывает желаемый интерфейс
   - LLM генерирует HTML/CSS код
   - Код отображается как интерактивный компонент на канвасе

2. **Visual Editing**
   - Выбор элементов внутри сгенерированного кода
   - Изменение стилей через GUI
   - Реальное время предварительного просмотра

3. **Step-by-Step Planning**
   - Разбивка сложных задач на этапы
   - Последовательное выполнение плана
   - Контекстная генерация для консистентности

4. **Smart Chat Routing**
   - Автоматическое определение типа запроса
   - Различные стратегии обработки для разных типов задач

### Технические детали

#### State Management
```javascript
// Основные состояния в AppWithReactFlow.js
const [canvasElements, setCanvasElements] = useState([]);
const [selectedElement, setSelectedElement] = useState(null);
const [editingElement, setEditingElement] = useState(null);
const [selectedInternalElement, setSelectedInternalElement] = useState(null);
const [chatMessages, setChatMessages] = useState([]);
const [activePlan, setActivePlan] = useState(null);
```

#### API Integration
```javascript
// Интеграция с DeepSeek API
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message, context })
});
```

#### HTML Processing
```javascript
// Обработка HTML для визуального редактирования
function makeElementsSelectable(htmlString) {
  // Добавление data-element-id атрибутов
  // Сохранение оригинальных стилей
  // Подготовка для интерактивного редактирования
}
```

### Рабочий процесс

1. **Пользовательский ввод**: Описание желаемого UI
2. **Классификация**: MessageRouter определяет тип запроса
3. **Обработка**: 
   - Простой чат → прямой ответ
   - Создание артефакта → генерация кода
   - Сложная задача → создание плана
4. **Генерация**: LLM создает HTML/CSS код
5. **Отображение**: Код рендерится на канвасе как React Flow узел
6. **Редактирование**: Пользователь может редактировать через Visual Editor

### Файловая структура

```
frontend/src/
├── components/
│   ├── CanvasFlow.js          # React Flow канвас
│   ├── PropertiesPanel.js     # Панель свойств
│   ├── VisualEditor.js        # Визуальный редактор
│   ├── VisualControls.js      # UI контролы
│   └── ChatPanel.js           # Панель чата
├── services/
│   ├── MessageRouter.js       # Маршрутизация сообщений
│   └── PlannerService.js      # Планирование задач
├── utils/
│   └── htmlParser.js          # Обработка HTML
├── AppWithReactFlow.js        # Главный компонент
└── index.js                   # Точка входа
```

### Интеграция с LLM

Система использует DeepSeek API для:
- Генерации HTML/CSS кода по описанию
- Создания планов выполнения сложных задач
- Редактирования существующих компонентов
- Ответов на вопросы пользователей

Промпты оптимизированы для генерации качественного, семантически корректного кода с использованием современных CSS практик и accessibility стандартов.

### Планы развития

1. **RAG Integration**: Интеграция с AnythingLLM для контекстных ответов
2. **Component Library**: Библиотека готовых компонентов
3. **Export Functionality**: Экспорт в различные форматы
4. **Collaboration**: Многопользовательское редактирование
5. **Templates**: Готовые шаблоны и темы