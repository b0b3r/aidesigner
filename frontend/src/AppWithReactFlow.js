import React, { useState, useCallback } from 'react';
import './App.css';
import './components/CanvasFlow.css';
import CanvasFlow from './components/CanvasFlow';
import PropertiesPanel from './components/PropertiesPanel';

function AppWithReactFlow() {
  // Используем существующие данные из App.js
  const [selectedElement, setSelectedElement] = useState(null);
  const [editingElement, setEditingElement] = useState(null);
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
    // Сбрасываем режим редактирования при выборе другого элемента
    if (editingElement && editingElement.id !== element.id) {
      setEditingElement(null);
      console.log('🔄 Режим редактирования сброшен - выбран другой элемент');
    }
  }, [editingElement]);

  const handleElementRegenerate = useCallback(async (elementId) => {
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;

    setIsLoading(true);
    setLoadingStatus(`🔄 Регенерирую ${element.name}...`);

    try {
      console.log('🔄 Регенерирую элемент через API:', element.prompt);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: element.prompt || `Регенерируй элемент "${element.name}"` }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Данные регенерации:', data);

      if (data.success && data.visual_content) {
        // Обновляем элемент с новым контентом от API
        setCanvasElements(prev => prev.map(el => 
          el.id === elementId 
            ? { 
                ...el, 
                content: data.visual_content,
                code: data.visual_content,
                width: data.width || el.width,
                height: data.height === "auto" ? "auto" : (data.height || el.height),
                createdAt: new Date().toISOString()
              }
            : el
        ));

        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now() + '-regenerate',
            type: 'ai',
            content: data.text_content || `✅ Элемент "${element.name}" успешно регенерирован!`,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || 'Не удалось получить новый контент');
      }

    } catch (error) {
      console.error('❌ Ошибка регенерации:', error);
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

  // Обновление элемента из панели свойств
  const handleElementUpdate = useCallback((elementId, updates) => {
    setCanvasElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, ...updates }
        : el
    ));
  }, []);

  // Удаление элемента
  const handleElementDelete = useCallback((elementId) => {
    console.log('🗑️ Удаляем элемент с ID:', elementId);
    console.log('📊 Элементы ДО удаления:', canvasElements.map(el => ({ id: el.id, name: el.name, x: el.x, y: el.y })));
    
    setCanvasElements(prev => {
      const filtered = prev.filter(el => el.id !== elementId);
      console.log('📊 Элементы ПОСЛЕ удаления:', filtered.map(el => ({ id: el.id, name: el.name, x: el.x, y: el.y })));
      return filtered;
    });
    setSelectedElement(null);
  }, [canvasElements]);

  const handleElementEdit = useCallback((elementId) => {
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;

    setSelectedElement(element);
    setEditingElement(element); // Устанавливаем элемент в режим редактирования
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now() + '-edit',
        type: 'ai',
        content: `📝 Выбран элемент "${element.name}" для редактирования.\n\n**Текущий контент:**\n\`\`\`html\n${element.content?.slice(0, 200)}${element.content?.length > 200 ? '...' : ''}\n\`\`\`\n\n**Исходный промпт:** ${element.prompt}\n\nОпишите, какие изменения вы хотите внести.`,
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
    setLoadingStatus('📤 Отправляю запрос к LLM...');

    try {
      console.log('🚀 Отправляю запрос к LLM:', message);
      
      // Формируем контекст для редактирования или создания нового элемента
      let requestMessage = message;
      
      if (editingElement) {
        console.log('✏️ Режим редактирования элемента:', editingElement.id);
        requestMessage = `РЕДАКТИРОВАНИЕ СУЩЕСТВУЮЩЕГО ЭЛЕМЕНТА:

Название: ${editingElement.name}
Тип: ${editingElement.type}
Исходный промпт: ${editingElement.prompt}

ТЕКУЩИЙ HTML/CSS КОД:
${editingElement.content}

ЗАПРОС НА ИЗМЕНЕНИЕ: ${message}

ИНСТРУКЦИИ: Отредактируй существующий код выше согласно запросу. Верни только обновленный HTML/CSS код, сохранив общую структуру и стиль.`;
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: requestMessage }
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

        // Если есть визуальный контент - создаем или обновляем артефакт
        if (data.visual_content) {
          if (editingElement) {
            // РЕЖИМ РЕДАКТИРОВАНИЯ: Обновляем существующий элемент
            console.log('✏️ Обновляю существующий элемент:', editingElement.id);
            
            const updatedElement = {
              ...editingElement,
              content: data.visual_content,
              code: data.visual_content,
              width: data.width || editingElement.width,
              height: data.height === "auto" ? "auto" : (data.height || editingElement.height),
              // Обновляем промпт с новым сообщением
              prompt: `${editingElement.prompt} | ИЗМЕНЕНИЕ: ${message}`,
              updatedAt: new Date().toISOString()
            };
            
            setCanvasElements(prev => prev.map(el => 
              el.id === editingElement.id ? updatedElement : el
            ));
            
            // Обновляем selectedElement если он был выбран
            if (selectedElement?.id === editingElement.id) {
              setSelectedElement(updatedElement);
            }
            
            // Очищаем режим редактирования
            setEditingElement(null);
            
            console.log('✅ Элемент успешно обновлен');
            
            // Добавляем сообщение в чат об успешном редактировании
            setChatMessages(prev => [
              ...prev,
              { 
                id: Date.now() + '-edited', 
                type: 'ai', 
                content: `✏️ **Элемент обновлен!**\n\nУспешно изменил "${updatedElement.name}".\n\n🔄 Изменения применены к существующему элементу на канвасе.\n\nТеперь вы можете:\n• Внести дополнительные изменения\n• Переместить элемент\n• Продолжить редактирование других элементов`,
                timestamp: new Date() 
              }
            ]);
            
          } else {
            // РЕЖИМ СОЗДАНИЯ: Создаем новый артефакт
            console.log('🎨 Создаю новый артефакт на канвасе');
            
            // Обрабатываем размеры: ширина из LLM, высота автоматическая
            const artifactWidth = data.width || 400;
            const artifactHeight = data.height === "auto" ? "auto" : (data.height || 300);
            
            console.log(`📏 Размеры артефакта: ${artifactWidth}px x ${artifactHeight}`);
            
            // Генерируем случайную позицию, чтобы не зависеть от количества элементов
            const randomOffset = Math.floor(Math.random() * 200);
            const newArtifact = {
              id: 'artifact-' + Date.now(),
              type: 'artifact',
              x: 250 + randomOffset,
              y: 200 + randomOffset,
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
            console.log('✅ Артефакт добавлен на канвас');
            
            // Добавляем сообщение в чат о создании артефакта
            setChatMessages(prev => [
              ...prev,
              { 
                id: Date.now() + '-artifact', 
                type: 'ai', 
                content: `🎨 **Артефакт создан!**\n\nДобавил новый элемент "${newArtifact.name}" на канвас.\n\n📐 Размеры: ${artifactWidth}px × ${artifactHeight === "auto" ? "авто" : artifactHeight + "px"}\n🎯 Позиция: (${newArtifact.x}, ${newArtifact.y})\n\nТеперь вы можете:\n• Перетащить элемент в нужное место\n• Выбрать для редактирования свойств\n• Соединить с другими элементами`,
                timestamp: new Date() 
              }
            ]);
          }
        }
      } else {
        throw new Error(data.error || 'Unknown error from API');
      }

    } catch (error) {
      console.error('❌ Ошибка при отправке сообщения:', error);
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
  }, [canvasElements, editingElement, selectedElement]);

  return (
    <div className="app">
      {/* Левая панель - Чат */}
      <div className="chat-panel">
        <div className="panel-header">
          🚀 AI Designer с React Flow
          {editingElement && (
            <div style={{ 
              fontSize: '12px', 
              color: '#28a745', 
              marginTop: '4px',
              padding: '2px 6px',
              background: '#d4edda',
              borderRadius: '4px',
              border: '1px solid #c3e6cb'
            }}>
              ✏️ Редактирование: {editingElement.name}
            </div>
          )}
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
            placeholder={isLoading ? "Обрабатываю запрос..." : editingElement ? `Редактирование "${editingElement.name}" - опишите изменения...` : "Попробуйте: 'добавить элемент' или 'расскажи про flow'"}
            rows={2}
            disabled={isLoading}
          />
          {editingElement && (
            <button 
              onClick={() => {
                setEditingElement(null);
                console.log('🔄 Режим редактирования отменен пользователем');
                setChatMessages(prev => [
                  ...prev,
                  {
                    id: Date.now() + '-cancel',
                    type: 'ai',
                    content: `🔄 Режим редактирования отменен. Теперь вы можете создавать новые элементы или выбрать другой элемент для редактирования.`,
                    timestamp: new Date()
                  }
                ]);
              }}
              className="btn btn-secondary"
              style={{ 
                marginRight: '8px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px'
              }}
              title="Отменить редактирование"
              disabled={isLoading}
            >
              ✕ Отменить
            </button>
          )}
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
          onElementUpdate={handleElementUpdate}
        />
      </div>

      {/* Правая панель - Свойства */}
      {selectedElement && (
        <PropertiesPanel
          key={selectedElement.id}
          element={selectedElement}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onClose={() => setSelectedElement(null)}
        />
      )}
    </div>
  );
}

export default AppWithReactFlow;