import { useState, useCallback } from 'react';
import { ChatBot } from './components/ChatBot';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ChatMessage, DesignElement, ProjectState, Suggestion } from './types';

export default function App() {
  const [state, setState] = useState<ProjectState>({
    elements: [],
    selectedElementId: null,
    chatMessages: [
      {
        id: '1',
        type: 'ai',
        content: 'Привет! Я помогу вам создать дизайн интерфейса. Расскажите, что вы хотите разработать? Это может быть:\n\n• Веб-сайт\n• Мобильное приложение\n• Лендинг страница\n• Отдельная функция или компонент\n\nОпишите вашу задачу, и я составлю план создания дизайна.',
        timestamp: new Date(),
        suggestions: [
          { id: '1', text: '🌐 Веб-сайт', value: 'Хочу создать веб-сайт' },
          { id: '2', text: '📱 Мобильное приложение', value: 'Нужно мобильное приложение' },
          { id: '3', text: '🎯 Лендинг', value: 'Создать лендинг страницу' },
          { id: '4', text: '🧩 Компонент', value: 'Разработать отдельный компонент' },
        ]
      }
    ],
    canvasZoom: 1,
    canvasOffset: { x: 200, y: 100 },
    isGenerating: false,
  });

  // Симуляция ответов AI с разными сценариями и саджестами
  const generateAIResponse = useCallback((userMessage: string): { response: string; shouldCreateArtifact: boolean; artifactData?: any; suggestions?: Suggestion[] } => {
    const message = userMessage.toLowerCase();
    
    // Сценарий 1: Пользователь дает начальное описание
    if (message.includes('сайт') || message.includes('приложение') || message.includes('интерфейс') || message.includes('лендинг')) {
      return {
        response: `Отлично! Я понял, что вы хотите создать. Давайте составим план:\n\n**План создания дизайна:**\n\n1. **Анализ требований** - определение целевой аудитории и основных функций\n2. **Структура сайта** - создание wireframe с основными блоками\n3. **Дизайн компонентов** - проработка отдельных элементов\n4. **Финальная компоновка** - объединение всех элементов\n\nПодтверждаете этот план? Если да, я начну с создания wireframe основной структуры.`,
        shouldCreateArtifact: false,
        suggestions: [
          { id: '1', text: '✅ Подтверждаю план', value: 'Да, подтверждаю план' },
          { id: '2', text: '✏️ Изменить план', value: 'Хочу изменить план' },
          { id: '3', text: '❓ Больше деталей', value: 'Расскажите подробнее о каждом этапе' },
        ]
      };
    }
    
    // Сценарий 2: Пользователь подтверждает план
    if (message.includes('да') || message.includes('подтверждаю') || message.includes('согласен') || message.includes('хорошо')) {
      return {
        response: `Превосходно! Начинаю создание wireframe. Это базовая структура вашего интерфейса с основными блоками.\n\n**Управление канвасом:**\n• **Клик на элемент** - выделение и перетаскивание\n• **Колесо мыши** - масштабирование\n• **Средняя кнопка** - панорамирование\n• **Клик на пустое поле** - снятие выделения и панорамирование\n• **Escape** - снять выделение`,
        shouldCreateArtifact: true,
        artifactData: {
          type: 'wireframe',
          name: 'Основной wireframe',
          prompt: 'Создать wireframe для современного веб-сайта с шапкой, hero-секцией, блоком контента с карточками и подвалом',
          position: { x: 100, y: 100 },
          size: { width: 400, height: 500 },
        },
        suggestions: [
          { id: '1', text: '➕ Добавить кнопку', value: 'Добавь кнопку' },
          { id: '2', text: '📝 Создать форму', value: 'Создай форму' },
          { id: '3', text: '🎴 Добавить карточку', value: 'Нужна карточка товара' },
          { id: '4', text: '🎨 Изменить дизайн', value: 'Измени цветовую схему' },
        ]
      };
    }
    
    // Сценарий 3: Пользователь просит изменения
    if (message.includes('измени') || message.includes('добави') || message.includes('убери') || message.includes('другой')) {
      return {
        response: `Понял! Я могу помочь с изменениями. Чтобы отредактировать элемент:\n\n1. **Кликните** на нужный элемент на канвасе\n2. **Откроется панель свойств** справа с двумя вкладками\n3. **Во вкладке "Промпт"** отредактируйте описание и нажмите "Сгенерировать заново"\n4. **Во вкладке "Код"** можете просмотреть и отредактировать HTML/CSS\n\n**Перемещение элементов:** просто перетащите элемент в нужное место.\n\nЛибо опишите более детально что именно нужно изменить, и я создам новый элемент.`,
        shouldCreateArtifact: false,
        suggestions: [
          { id: '1', text: '🎨 Изменить цвета', value: 'Измени цветовую схему' },
          { id: '2', text: '📐 Изменить размеры', value: 'Сделай элементы больше' },
          { id: '3', text: '📝 Изменить текст', value: 'Измени текст на элементах' },
          { id: '4', text: '🔄 Переставить блоки', value: 'Поменяй местами блоки' },
        ]
      };
    }

    // Сценарий 4: Пользователь просит добавить новые элементы
    if (message.includes('кнопк') || message.includes('форм') || message.includes('карточк') || message.includes('компонент')) {
      const artifactTypes = {
        'кнопк': { name: 'Кнопка', type: 'component', prompt: 'Создать современную кнопку с hover эффектами' },
        'форм': { name: 'Форма', type: 'component', prompt: 'Создать форму обратной связи с полями email и сообщения' },
        'карточк': { name: 'Карточка', type: 'component', prompt: 'Создать карточку продукта с изображением, названием и ценой' },
        'компонент': { name: 'Компонент', type: 'component', prompt: 'Создать интерактивный UI компонент' }
      };

      const foundType = Object.keys(artifactTypes).find(key => message.includes(key));
      const artifactData = foundType ? artifactTypes[foundType as keyof typeof artifactTypes] : artifactTypes.компонент;

      return {
        response: `Создаю ${artifactData.name.toLowerCase()} для вашего дизайна. Элемент появится на канвасе, и вы сможете перетащить его в нужное место.`,
        shouldCreateArtifact: true,
        artifactData: {
          type: artifactData.type,
          name: artifactData.name,
          prompt: artifactData.prompt,
          position: { x: 300 + state.elements.length * 50, y: 200 + state.elements.length * 50 },
          size: { width: 250, height: 150 },
        },
        suggestions: [
          { id: '1', text: '➕ Еще компонент', value: 'Добавь еще один компонент' },
          { id: '2', text: '🎨 Стилизация', value: 'Измени стиль компонента' },
          { id: '3', text: '📏 Размеры', value: 'Изменить размер элемента' },
          { id: '4', text: '🔧 Настройки', value: 'Хочу настроить свойства' },
        ]
      };
    }
    
    // Сценарий по умолчанию
    return {
      response: `Интересно! Расскажите подробнее о ваших требованиях. Какие основные функции должны быть? Кто ваша целевая аудитория? Есть ли примеры дизайна, которые вам нравятся?\n\nВы также можете попросить меня добавить конкретные элементы, например:\n• "Добавь кнопку"\n• "Создай форму"\n• "Нужна карточка товара"`,
      shouldCreateArtifact: false,
      suggestions: [
        { id: '1', text: '💼 Корпоративный сайт', value: 'Нужен корпоративный сайт' },
        { id: '2', text: '🛒 Интернет-магазин', value: 'Создать интернет-магазин' },
        { id: '3', text: '👤 Личный кабинет', value: 'Сделать личный кабинет' },
        { id: '4', text: '📊 Дашборд', value: 'Нужен дашборд с графиками' },
      ]
    };
  }, [state.elements.length]);

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, userMessage],
      isGenerating: true,
    }));

    // Симуляция задержки AI
    setTimeout(() => {
      const { response, shouldCreateArtifact, artifactData, suggestions } = generateAIResponse(message);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        hasArtifact: shouldCreateArtifact,
        artifactId: shouldCreateArtifact ? (Date.now() + 2).toString() : undefined,
        suggestions: suggestions,
      };

      setState(prev => {
        const newElements = shouldCreateArtifact && artifactData ? [
          ...prev.elements,
          {
            id: aiMessage.artifactId!,
            type: artifactData.type,
            name: artifactData.name,
            prompt: artifactData.prompt,
            code: `<div class="${artifactData.type}">\n  <!-- ${artifactData.name} -->\n  ${artifactData.prompt}\n</div>`,
            position: artifactData.position,
            size: artifactData.size,
          }
        ] : prev.elements;

        return {
          ...prev,
          chatMessages: [...prev.chatMessages, aiMessage],
          elements: newElements,
          isGenerating: false,
        };
      });
    }, 1500);
  }, [generateAIResponse]);

  const handleSelectElement = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedElementId: id,
    }));
  }, []);

  const handleUpdateElementPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id 
          ? { ...el, position }
          : el
      ),
    }));
  }, []);

  const handleZoomChange = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      canvasZoom: zoom,
    }));
  }, []);

  const handleOffsetChange = useCallback((offset: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      canvasOffset: offset,
    }));
  }, []);

  const handleRegenerateElement = useCallback((id: string, newPrompt: string) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id 
          ? { 
              ...el, 
              prompt: newPrompt,
              code: `<div class="regenerated">\n  <!-- Обновлено: ${el.name} -->\n  ${newPrompt}\n</div>`
            }
          : el
      ),
    }));
    
    // Добавляем сообщение в чат о регенерации
    const element = state.elements.find(el => el.id === id);
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Элемент "${element?.name}" был обновлен с новым промптом.`,
      timestamp: new Date(),
      suggestions: [
        { id: '1', text: '✨ Улучшить еще', value: 'Улучши этот элемент еще больше' },
        { id: '2', text: '➕ Добавить элемент', value: 'Добавь похожий элемент' },
        { id: '3', text: '🎨 Изменить стиль', value: 'Измени стиль этого элемента' },
      ]
    };
    
    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, message],
    }));
  }, [state.elements]);

  const handleUpdateElementCode = useCallback((id: string, newCode: string) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id 
          ? { ...el, code: newCode }
          : el
      ),
    }));
  }, []);

  const selectedElement = state.elements.find(el => el.id === state.selectedElementId) || null;

  return (
    <div className="h-screen flex bg-background">
      {/* Chat Bot */}
      <ChatBot
        messages={state.chatMessages}
        onSendMessage={handleSendMessage}
        isGenerating={state.isGenerating}
      />

      {/* Canvas */}
      <Canvas
        elements={state.elements}
        selectedElementId={state.selectedElementId}
        onSelectElement={handleSelectElement}
        onUpdateElementPosition={handleUpdateElementPosition}
        zoom={state.canvasZoom}
        offset={state.canvasOffset}
        onZoomChange={handleZoomChange}
        onOffsetChange={handleOffsetChange}
      />

      {/* Properties Panel */}
      {selectedElement && (
        <PropertiesPanel
          element={selectedElement}
          onClose={() => handleSelectElement(null)}
          onRegenerateElement={handleRegenerateElement}
          onUpdateElementCode={handleUpdateElementCode}
        />
      )}
    </div>
  );
}