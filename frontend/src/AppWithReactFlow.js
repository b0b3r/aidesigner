import React, { useState, useCallback } from 'react';
import './App.css';
import './components/CanvasFlow.css';
import CanvasFlow from './components/CanvasFlow';

function AppWithReactFlow() {
  // Используем существующие данные из App.js
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasElements, setCanvasElements] = useState([
    // Демо wireframe элементы как в оригинале
    { 
      id: 'header', 
      type: 'wireframe', 
      x: 200, 
      y: 150, 
      width: 600, 
      height: 80, 
      name: 'Шапка сайта', 
      content: '<div style="background: #e9ecef; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 4px; padding: 20px;">🌐 Header Navigation</div>',
      prompt: 'Создать современную шапку с навигацией',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'hero', 
      type: 'wireframe', 
      x: 200, 
      y: 280, 
      width: 600, 
      height: 200, 
      name: 'Hero секция', 
      content: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border-radius: 4px; padding: 40px;"><h1 style="margin: 0 0 16px 0; font-size: 32px;">🚀 Добро пожаловать</h1><p style="margin: 0; opacity: 0.9;">Современный дизайн с помощью ИИ</p></div>',
      prompt: 'Hero секция с призывом к действию',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'features', 
      type: 'wireframe', 
      x: 200, 
      y: 520, 
      width: 600, 
      height: 160, 
      name: 'Блок возможностей', 
      content: '<div style="background: #f8f9fa; height: 100%; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 20px; border-radius: 4px;"><div style="background: white; padding: 16px; border-radius: 6px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><div style="font-size: 24px; margin-bottom: 8px;">🎨</div><div style="font-weight: bold;">Дизайн</div></div><div style="background: white; padding: 16px; border-radius: 6px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><div style="font-size: 24px; margin-bottom: 8px;">⚡</div><div style="font-weight: bold;">Скорость</div></div><div style="background: white; padding: 16px; border-radius: 6px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><div style="font-size: 24px; margin-bottom: 8px;">🤖</div><div style="font-weight: bold;">ИИ</div></div></div>',
      prompt: 'Блок с тремя ключевыми возможностями',
      createdAt: new Date().toISOString()
    },
    { 
      id: 'cta', 
      type: 'wireframe', 
      x: 200, 
      y: 720, 
      width: 600, 
      height: 120, 
      name: 'Призыв к действию', 
      content: '<div style="background: #28a745; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border-radius: 4px; padding: 24px;"><h3 style="margin: 0 0 12px 0;">Начните создавать сегодня!</h3><button style="background: white; color: #28a745; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer;">Попробовать бесплатно</button></div>',
      prompt: 'CTA секция с кнопкой регистрации',
      createdAt: new Date().toISOString()
    }
  ]);

  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: '🚀 **React Flow Canvas активирован!**\n\nТеперь у вас есть доступ к продвинутым возможностям:\n\n• **Интерактивные связи** между элементами\n• **Процесс-карта** генерации дизайна\n• **Мини-карта** для навигации\n• **Масштабирование к курсору**\n• **Групповое выделение** элементов\n\nПопробуйте перетащить элементы или соединить их между собой!',
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // Обработчики для React Flow компонента
  const handleElementSelect = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  const handleElementRegenerate = useCallback(async (elementId) => {
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;

    setIsLoading(true);
    setLoadingStatus(`🔄 Регенерирую ${element.name}...`);

    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Обновляем элемент
      setCanvasElements(prev => prev.map(el => 
        el.id === elementId 
          ? { 
              ...el, 
              content: el.content.replace(/🌐|🚀|🎨|🤖/g, '✨'),
              createdAt: new Date().toISOString()
            }
          : el
      ));

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-regenerate',
          type: 'ai',
          content: `✅ Элемент "${element.name}" успешно регенерирован с новыми стилями!`,
          timestamp: new Date()
        }
      ]);

    } catch (error) {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-error',
          type: 'ai',
          content: `❌ Ошибка при регенерации: ${error.message}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, [canvasElements]);

  const handleElementEdit = useCallback((elementId) => {
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;

    setSelectedElement(element);
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now() + '-edit',
        type: 'ai',
        content: `📝 Выбран элемент "${element.name}" для редактирования. Опишите, какие изменения вы хотите внести.`,
        timestamp: new Date()
      }
    ]);
  }, [canvasElements]);

  // Обработка отправки сообщений в чат
  const handleSendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { id: Date.now() + '-user', type: 'user', content: message, timestamp: new Date() }
    ]);

    setIsLoading(true);
    setLoadingStatus('🤖 Обрабатываю запрос...');

    try {
      // Симуляция различных ответов
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let response = '';
      
      if (message.toLowerCase().includes('элемент') || message.toLowerCase().includes('добавить')) {
        // Добавляем новый элемент
        const newElement = {
          id: 'element-' + Date.now(),
          type: 'artifact',
          x: 300 + (canvasElements.length * 40),
          y: 200 + (canvasElements.length * 40),
          width: 300,
          height: 200,
          name: 'Новый элемент',
          content: '<div style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); height: 100%; display: flex; align-items: center; justify-content: center; color: white; border-radius: 8px; font-weight: bold;">🎉 Новый UI элемент</div>',
          prompt: message,
          createdAt: new Date().toISOString()
        };
        
        setCanvasElements(prev => [...prev, newElement]);
        response = '✅ Добавил новый UI элемент на канвас! Попробуйте соединить его с другими элементами с помощью React Flow.';
      } else if (message.toLowerCase().includes('flow') || message.toLowerCase().includes('связи')) {
        response = '🔗 **React Flow возможности:**\n\n• Перетащите от одного элемента к другому для создания связи\n• Используйте Ctrl+клик для множественного выделения\n• Колесо мыши для масштабирования к курсору\n• Мини-карта показывает общую структуру\n• Кнопка "Fit View" показывает все элементы';
      } else {
        response = '🤖 Понял ваш запрос! В React Flow режиме вы можете:\n\n• **Перетаскивать** элементы мышью\n• **Соединять** элементы линиями связи\n• **Масштабировать** канвас колесом\n• **Группировать** элементы выделением\n• Использовать **мини-карту** для навигации\n\nЧто именно вы хотите сделать?';
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-ai',
          type: 'ai',
          content: response,
          timestamp: new Date()
        }
      ]);

    } catch (error) {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-error',
          type: 'ai',
          content: `❌ Ошибка: ${error.message}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, [canvasElements]);

  return (
    <div className="app">
      {/* Левая панель - Чат */}
      <div className="chat-panel">
        <div className="panel-header">
          🚀 AI Designer с React Flow
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
            placeholder={isLoading ? "Обрабатываю запрос..." : "Попробуйте: 'добавить элемент' или 'расскажи про flow'"}
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

      {/* Центральная область - React Flow Canvas */}
      <div className="design-canvas">
        <CanvasFlow
          elements={canvasElements}
          selectedElement={selectedElement}
          onElementSelect={handleElementSelect}
          onElementRegenerate={handleElementRegenerate}
          onElementEdit={handleElementEdit}
        />
      </div>

      {/* Правая панель - Свойства */}
      {selectedElement && (
        <div className="properties-panel">
          <div className="panel-header">
            <span>📦 {selectedElement.name}</span>
            <button onClick={() => setSelectedElement(null)}>✕</button>
          </div>
          
          <div className="properties-tabs">
            <div className="tab active">🎨 Свойства</div>
            <div className="tab">💭 Промпт</div>
          </div>
          
          <div className="properties-content">
            <div className="property-group">
              <label>Название элемента</label>
              <input 
                type="text" 
                value={selectedElement.name || ''} 
                readOnly
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  marginBottom: '12px'
                }}
              />
            </div>
            
            <div className="property-group">
              <label>Позиция</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number" 
                  value={selectedElement.x || 0} 
                  readOnly
                  placeholder="X"
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input 
                  type="number" 
                  value={selectedElement.y || 0} 
                  readOnly
                  placeholder="Y"
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            
            <div className="property-group">
              <label>Размеры</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="number" 
                  value={selectedElement.width || 0} 
                  readOnly
                  placeholder="Ширина"
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input 
                  type="number" 
                  value={selectedElement.height || 0} 
                  readOnly
                  placeholder="Высота"
                  style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div className="prompt-section" style={{ marginTop: '20px' }}>
              <label>Промпт для генерации</label>
              <textarea
                value={selectedElement.prompt || 'Промпт не задан'}
                readOnly
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  marginBottom: '12px'
                }}
              />
              <button 
                className="generate-btn"
                onClick={() => handleElementRegenerate(selectedElement.id)}
                disabled={isLoading}
              >
                {isLoading ? '🔄 Регенерирую...' : '🎨 Регенерировать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppWithReactFlow;