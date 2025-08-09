import React, { useState, useCallback } from 'react';
import './App.css';
// Старый интерфейс. Не используется в проде.

function App() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasElements, setCanvasElements] = useState([
    // Демо wireframe элементы как на скриншоте
    { id: 'header', type: 'wireframe', x: 100, y: 50, width: 600, height: 80, name: 'Шапка', content: '<div style="background: #e9ecef; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 4px;">Header</div>' },
    { id: 'nav1', type: 'wireframe', x: 120, y: 100, width: 120, height: 40, name: 'Навигация 1', content: '<div style="background: #dee2e6; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Nav 1</div>' },
    { id: 'nav2', type: 'wireframe', x: 260, y: 100, width: 120, height: 40, name: 'Навигация 2', content: '<div style="background: #dee2e6; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Nav 2</div>' },
    { id: 'nav3', type: 'wireframe', x: 400, y: 100, width: 120, height: 40, name: 'Навигация 3', content: '<div style="background: #dee2e6; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Nav 3</div>' },
    { id: 'nav4', type: 'wireframe', x: 540, y: 100, width: 120, height: 40, name: 'Навигация 4', content: '<div style="background: #dee2e6; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Nav 4</div>' },
    { id: 'hero', type: 'wireframe', x: 120, y: 160, width: 580, height: 60, name: 'Герой секция', content: '<div style="background: #d1ecf1; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 4px;">Hero Section</div>' },
    { id: 'content1', type: 'wireframe', x: 120, y: 240, width: 180, height: 120, name: 'Контент 1', content: '<div style="background: #f8d7da; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Content 1</div>' },
    { id: 'content2', type: 'wireframe', x: 320, y: 240, width: 180, height: 120, name: 'Контент 2', content: '<div style="background: #f8d7da; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Content 2</div>' },
    { id: 'content3', type: 'wireframe', x: 520, y: 240, width: 180, height: 120, name: 'Контент 3', content: '<div style="background: #f8d7da; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Content 3</div>' },
    { id: 'sidebar', type: 'wireframe', x: 120, y: 380, width: 120, height: 100, name: 'Сайдбар', content: '<div style="background: #d4edda; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 4px;">Sidebar</div>' },
    { id: 'footer', type: 'wireframe', x: 120, y: 500, width: 580, height: 60, name: 'Подвал', content: '<div style="background: #ffeaa7; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 4px;">Footer</div>' }
  ]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: '**План создания дизайна:**\n\n1. **Анализ требований** - определение целевой аудитории и основных функций\n2. **Структура сайта** - создание wireframe с основными блоками\n3. **Дизайн компонентов** - проработка отдельных элементов\n4. **Финальная компоновка** - объединение всех элементов\n\nПодтверждаете этот план? Если да, я начну с создания wireframe основной структуры.',
      timestamp: new Date()
    }
  ]);

  const [zoom, setZoom] = useState(100);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('Создать wireframe для современного веб-сайта с шапкой, hero-секцией, блоком контента с карточками и подвалом');
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragElementId, setDragElementId] = useState(null);
  const [elementDragStart, setElementDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  const handleElementSelect = useCallback((elementId) => {
    const element = canvasElements.find(el => el.id === elementId);
    setSelectedElement(element);
  }, [canvasElements]);

  const handleCanvasClick = useCallback(() => {
    setSelectedElement(null);
  }, []);

  // Управление зумом
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);
  
  // Переключение сетки
  const toggleGrid = () => setShowGrid(prev => !prev);

  // Обработка перетаскивания канваса
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('canvas-area')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !dragElementId) {
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (dragElementId) {
      // Перетаскивание элемента
      const newX = elementDragStart.x + (e.clientX - dragStart.x) / (zoom / 100);
      const newY = elementDragStart.y + (e.clientY - dragStart.y) / (zoom / 100);
      
      setCanvasElements(prev => prev.map(el => 
        el.id === dragElementId 
          ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
          : el
      ));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragElementId(null);
  };

  // Начало перетаскивания элемента
  const handleElementMouseDown = (e, elementId) => {
    e.stopPropagation();
    const element = canvasElements.find(el => el.id === elementId);
    if (element) {
      setDragElementId(elementId);
      setElementDragStart({ x: element.x, y: element.y });
      setDragStart({ x: e.clientX, y: e.clientY });
      handleElementSelect(elementId);
    }
  };

  // Обработка отправки сообщений в чат
  const handleSendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { id: Date.now() + '-user', type: 'user', content: message, timestamp: new Date() }
    ]);

    setIsLoading(true);
    setLoadingStatus('📤 Отправляю запрос к LLM...');

    try {
      console.log('🚀 Отправляю запрос к LLM:', message);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            // ОТПРАВЛЯЕМ ТОЛЬКО НОВОЕ СООБЩЕНИЕ БЕЗ ИСТОРИИ
            { role: 'user', content: message }
          ]
        })
      });

      setLoadingStatus('⏳ Ожидаю ответ от DeepSeek API...');
      console.log('📡 Получен ответ:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setLoadingStatus('🔄 Обрабатываю ответ...');
      const data = await response.json();
      console.log('📦 Данные ответа:', data);

      if (data.success) {
        setChatMessages(prev => [
          ...prev,
          { 
            id: Date.now() + '-ai', 
            type: 'ai', 
            content: data.text_content,
            timestamp: new Date() 
          }
        ]);

        // Если есть визуальный контент - создаем артефакт на канвасе
        if (data.visual_content) {
          console.log('🎨 Создаю артефакт на канвасе');
          
          // Обрабатываем размеры: ширина из LLM, высота автоматическая
          const artifactWidth = data.width || 400;
          const artifactHeight = data.height === "auto" ? "auto" : (data.height || 300);
          
          console.log(`📏 Размеры артефакта: ${artifactWidth}px x ${artifactHeight}`);
          
          const newArtifact = {
            id: 'artifact-' + Date.now(),
            type: 'artifact',
            x: 200 + (canvasElements.length * 30),
            y: 150 + (canvasElements.length * 30),
            width: artifactWidth,
            height: artifactHeight,
            isAutoHeight: artifactHeight === "auto",
            name: 'Generated Artifact',
            content: data.visual_content,
            code: data.visual_content,
            prompt: message,
            createdAt: new Date().toISOString()
          };
          setCanvasElements(prev => [...prev, newArtifact]);
        }
      }
      
      setIsLoading(false);
      setLoadingStatus('');
    } catch (error) {
      console.error('💥 Ошибка API:', error);
      setIsLoading(false);
      setLoadingStatus('');
      setChatMessages(prev => [
        ...prev,
        { 
          id: Date.now() + '-error', 
          type: 'ai', 
          content: `Ошибка связи с LLM: ${error.message}`,
          timestamp: new Date() 
        }
      ]);
    }
  }, [chatMessages, canvasElements]);

  return (
    <div className="app">
      {/* Левая панель - Чат */}
      <div className="chat-panel">
        <div className="panel-header">
          💬 UI Design Assistant
        </div>
        
        <div className="chat-messages">
          {chatMessages.map((message) => (
            <div key={message.id} className={`chat-message ${message.type}`}>
              <div className="message-content">
                {message.content.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Индикатор загрузки */}
          {isLoading && (
            <div className="chat-message ai loading">
              <div className="message-content">
                <div className="loading-spinner">⏳</div>
                <div className="loading-text">{loadingStatus}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="chat-input">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Ожидаю ответ..." : "Опишите что хотите создать"}
            rows={2}
            disabled={isLoading}
          />
          <button 
            onClick={() => {
              handleSendMessage(inputValue);
              setInputValue('');
            }}
            disabled={!inputValue.trim() || isLoading}
          >
            Отправить
          </button>
        </div>
      </div>

      {/* Центральная область - Канвас */}
      <div className="design-canvas">
        <div className="canvas-toolbar">
          <button onClick={handleZoomOut} title="Уменьшить">🔍</button>
          <button onClick={handleResetZoom} title="100%">🔍</button>
          <button onClick={handleZoomIn} title="Увеличить">🔍</button>
          <button onClick={toggleGrid} title={showGrid ? "Скрыть сетку" : "Показать сетку"}>
            {showGrid ? "⊞" : "⊡"}
          </button>
          <button title="Настройки">⚙️</button>
          {/* DEV-кнопки тестирования CSS/CDN скрыты в прод-версии */}
          <span className="zoom-level">{zoom}%</span>
        </div>

        <div 
          className={`canvas-area ${showGrid ? 'show-grid' : 'hide-grid'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ 
            transform: `scale(${zoom / 100}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div className="wireframe-title">Основной wireframe</div>
          
          {canvasElements.map((element) => (
            <div
              key={element.id}
              className={`canvas-element ${element.type} ${selectedElement?.id === element.id ? 'selected' : ''} ${element.isAutoHeight ? 'auto-height' : ''}`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.isAutoHeight ? 'auto' : element.height,
                minHeight: element.isAutoHeight ? '200px' : undefined,
              }}
              onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            >
              {element.type === 'artifact' ? (
                <div className="artifact-wrapper">
                  <div className="artifact-header">
                    <span className="artifact-title">{element.name}</span>
                    <span className="artifact-time">{new Date(element.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div 
                    className="artifact-content"
                    dangerouslySetInnerHTML={{ __html: element.content }}
                  />
                </div>
              ) : (
                <div 
                  className="element-content"
                  dangerouslySetInnerHTML={{ __html: element.content }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="canvas-help">
          <div>✋ Средняя кнопка: панорамирование</div>
          <div>🖱️ Колесо: масштаб • Escape: снять выделение</div>
        </div>
      </div>

      {/* Правая панель - Свойства */}
      {selectedElement && (
        <div className="properties-panel">
          <div className="panel-header">
            <span>{selectedElement.name}</span>
            <button onClick={() => setSelectedElement(null)}>✕</button>
          </div>
          
          <div className="properties-tabs">
            <div className="tab active">✏️ Промпт</div>
            <div className="tab">📝 Код</div>
          </div>
          
          <div className="properties-content">
            <div className="prompt-section">
              <label>Промпт для генерации</label>
              <textarea
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                rows={4}
              />
              <button className="generate-btn">Сгенерировать заново</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;