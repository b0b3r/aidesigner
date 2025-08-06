# Техническая документация компонентов AI Designer

## React Flow Canvas System

### CanvasFlow.js
Основной компонент канваса, построенный на React Flow.

**Ключевые функции:**
- `convertToFlowNodes()` - преобразует элементы канваса в узлы React Flow
- `UIComponentNode` - кастомный узел для UI компонентов
- `onNodesChange` - обработка изменений позиций узлов
- `onInternalElementSelect` - выбор элементов внутри узлов

**Конфигурация:**
```javascript
const nodeTypes = {
  uiComponent: UIComponentNode,
  process: ProcessNode
};

// Настройки React Flow
fitView={false}
nodesDraggable={true}
nodesConnectable={false}
elementsSelectable={true}
```

### Visual Editor System

#### VisualEditor.js
Главный компонент для визуального редактирования элементов.

**State Management:**
```javascript
const [selectedElementData, setSelectedElementData] = useState(null);

// Debounced property changes
const debouncedHandlePropertyChange = useCallback(
  debounce((property, value) => {
    // Применение изменений с задержкой для плавности
  }, 300),
  [element, selectedInternalElement, onElementUpdate]
);
```

#### VisualControls.js
Набор UI контролов для редактирования свойств:

**Компоненты:**
- `ColorPicker` - выбор цвета с поддержкой HEX/RGB
- `SizeControl` - управление размерами с предустановками
- `NumberInput` - числовые поля с валидацией
- `SpacingControl` - контроль отступов (margin/padding)
- `PropertyGroup` - группировка свойств

#### htmlParser.js
Утилиты для обработки HTML:

**Функции:**
```javascript
// Добавление интерактивности к HTML
makeElementsSelectable(htmlString) {
  // Парсинг HTML
  // Добавление data-element-id
  // Сохранение оригинальных стилей
}

// Извлечение CSS свойств
extractElementProperties(element) {
  // Получение computed styles
  // Нормализация значений
  // Возврат объекта свойств
}

// Применение новых стилей
applyElementProperties(htmlString, elementId, properties) {
  // Поиск элемента по ID
  // Обновление inline стилей
  // Возврат обновленного HTML
}
```

## Message Processing System

### MessageRouter.js
Классификация и маршрутизация пользовательских сообщений.

**Алгоритм классификации:**
```javascript
classifyMessage(message) {
  const artifactScore = this.calculateKeywordScore(message, artifactKeywords);
  const planningScore = this.calculateKeywordScore(message, planningKeywords);
  const chatScore = this.calculateKeywordScore(message, chatKeywords);
  
  // Логика принятия решения на основе очков
  if (artifactScore > threshold) return 'artifact_creation';
  if (planningScore > threshold) return 'step_by_step_plan';
  return 'chat_response';
}
```

**Типы сообщений:**
- `chat_response` - обычный чат
- `artifact_creation` - создание UI компонента
- `step_by_step_plan` - многоэтапная задача

### PlannerService.js
Создание и выполнение планов для сложных задач.

**Структура плана:**
```json
{
  "title": "Создание дашборда аналитики",
  "description": "Многоэтапное создание интерфейса",
  "steps": [
    {
      "id": 1,
      "title": "Создать заголовок",
      "description": "Header с навигацией",
      "status": "pending"
    }
  ]
}
```

**Выполнение:**
```javascript
async executeStep(plan, stepIndex, context) {
  const step = plan.steps[stepIndex];
  const prompt = this.createStepPrompt(plan, step, context);
  
  // Отправка в LLM с контекстом всего плана
  const response = await this.sendToLLM(prompt);
  return this.parseStepResponse(response);
}
```

## Properties Panel System

### PropertiesPanel.js
Панель редактирования свойств выбранного элемента.

**Структура вкладок:**
```javascript
const tabs = [
  { id: 'visual', label: 'Visual', icon: '🎨' },
  { id: 'prompt', label: 'Prompt', icon: '💬' },
  { id: 'code', label: 'Code', icon: '💻' }
];
```

**Интеграция с Visual Editor:**
- Передача `selectedInternalElement`
- Обработка `onElementUpdate`
- Синхронизация состояния редактирования

## State Management Architecture

### AppWithReactFlow.js
Центральное управление состоянием приложения.

**Основные состояния:**
```javascript
// Элементы канваса
const [canvasElements, setCanvasElements] = useState([]);

// Выбранный элемент на канвасе
const [selectedElement, setSelectedElement] = useState(null);

// Элемент в режиме редактирования
const [editingElement, setEditingElement] = useState(null);

// Выбранный внутренний элемент (для Visual Editor)
const [selectedInternalElement, setSelectedInternalElement] = useState(null);

// Сообщения чата
const [chatMessages, setChatMessages] = useState([]);

// Активный план выполнения
const [activePlan, setActivePlan] = useState(null);

// Статус выполнения плана
const [isExecutingPlan, setIsExecutingPlan] = useState(false);
```

**Обработчики событий:**
```javascript
// Выбор элемента на канвасе
const handleElementSelect = useCallback((element) => {
  setSelectedElement(element);
  setEditingElement(null);
}, []);

// Выбор внутреннего элемента
const handleInternalElementSelect = useCallback((elementInfo) => {
  setSelectedInternalElement(elementInfo);
}, []);

// Обновление элемента
const handleElementUpdate = useCallback((elementId, updates) => {
  setCanvasElements(prev => 
    prev.map(el => el.id === elementId ? { ...el, ...updates } : el)
  );
}, []);
```

## API Integration

### Backend Communication
Взаимодействие с FastAPI бэкендом:

```javascript
// Отправка сообщения в чат
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: userMessage,
    context: editingElement ? {
      type: 'edit',
      element: editingElement
    } : null
  })
});
```

### Response Processing
Обработка ответов от LLM:

```javascript
// Парсинг HTML из ответа
const htmlMatch = response.match(/```html\s*([\s\S]*?)\s*```/);
if (htmlMatch) {
  const htmlContent = htmlMatch[1];
  // Создание нового элемента или обновление существующего
}
```

## Error Handling

### Visual Editor Error Recovery
```javascript
try {
  const updatedHtml = applyElementProperties(content, elementId, properties);
  onElementUpdate(element.id, { content: updatedHtml });
} catch (error) {
  console.error('Error applying properties:', error);
  // Откат к предыдущему состоянию
}
```

### Network Error Handling
```javascript
try {
  const response = await fetch(apiEndpoint, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  setIsLoading(false);
  setChatMessages(prev => [...prev, {
    type: 'error',
    content: 'Произошла ошибка при обращении к серверу'
  }]);
}
```

## Performance Optimizations

### Debouncing
```javascript
// Debouncing для Visual Editor
const debouncedPropertyChange = useCallback(
  debounce((property, value) => {
    handlePropertyChange(property, value);
  }, 300),
  [handlePropertyChange]
);
```

### Memoization
```javascript
// Мемоизация для предотвращения лишних рендеров
const memoizedNodes = useMemo(() => {
  return convertToFlowNodes(canvasElements, handleInternalElementSelect);
}, [canvasElements, handleInternalElementSelect]);
```

### React Flow Optimizations
```javascript
// Отключение auto-fit для предотвращения скачков
fitView={false}

// Кастомная обработка изменений узлов
const onNodesChange = useCallback((changes) => {
  // Обновление только позиций без перерендера всего канваса
}, [onElementUpdate]);
```