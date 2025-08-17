import React, { useState, useCallback, useEffect, useMemo } from 'react';
import './App.css';
import './components/CanvasFlow.css';
import CanvasFlow from './components/CanvasFlow';
import PropertiesPanel from './components/PropertiesPanel';
import ChatPanel from './components/ChatPanel';
import MessageRouter from './services/MessageRouter';
import PlannerService from './services/PlannerService';
import cssInjector from './utils/cssInjector';
import ResizeTest from './utils/resizeTest';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';

function App() {
  // Используем существующие данные из App.js
  const [selectedElement, setSelectedElement] = useState(null);
  const [editingElement, setEditingElement] = useState(null);
  const [selectedInternalElement, setSelectedInternalElement] = useState(null);
  
  // Инициализируем сервисы с useMemo для стабильности зависимостей
  const messageRouter = useMemo(() => new MessageRouter(), []);
  const plannerService = useMemo(() => new PlannerService(), []);
  
  // Состояние для планов
  const [activePlan, setActivePlan] = useState(null);
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  const PLAN_STEP_DELAY_MS = process.env.NODE_ENV === 'development' ? 300 : 0;
  
  const [canvasElements, setCanvasElements] = useState([
    // 
    // 🎨 ТЕСТОВЫЙ АРТЕФАКТ 1: С правильными MDC переменными
    {
      id: 'test-mdc-theming',
      type: 'artifact',
      x: 400,
      y: 300,
      width: 320,
      height: 400,
      isAutoHeight: true,
      name: 'Демо 1',
      content: `
        <div style="padding: 16px; background-color: var(--mdc-theme-background); font-family: 'Roboto', sans-serif;">
          <h3 style="color: var(--mdc-theme-text-primary-on-background); margin: 0 0 16px; font-size: 18px;">MDC Темизация</h3>
          
          <!-- Отладочные цвета -->
          <div class="debug-theme-colors">
            <div class="debug-color-sample debug-primary">P</div>
            <div class="debug-color-sample debug-secondary">S</div>
            <div class="debug-color-sample debug-surface">Sur</div>
          </div>
          
          <!-- Filled кнопка (должна использовать тему автоматически) -->
          <button class="mdc-button mdc-button--raised">
            <span class="mdc-button__label">Filled Button</span>
          </button>
          
          <br><br>
          
          <!-- Outlined кнопка -->
          <button class="mdc-button mdc-button--outlined">
            <span class="mdc-button__label">Outlined Button</span>
          </button>
          
          <br><br>
          
          <!-- Карточка с поверхностью -->
          <div style="background-color: var(--mdc-theme-surface); padding: 12px; border-radius: 8px; margin-top: 16px; box-shadow: 0 2px 4px var(--mdc-theme-shadow);">
            <p style="color: var(--mdc-theme-text-primary-on-background); margin: 0; font-size: 14px;">
              Карточка с surface цветом
            </p>
          </div>
        </div>
      `,
      prompt: 'Тестовый артефакт с правильной MDC темизацией',
      createdAt: new Date().toISOString()
    }
  ]);

  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: 'Готов к работе!\n\nДоступны новые возможности:\n\n• 💬 Умный чат - задавайте вопросы, получайте ответы\n• 🎨 Создание артефактов - генерация UI элементов\n• 📋 Пошаговые планы - создание флоу по этапам\n\n Пример задачи:',
      timestamp: new Date(),
      suggestions: [
        {
          id: 'example-1',
          text: 'Создай кнопку',
          action: 'send_message',
          data: 'Создай красивую кнопку в стиле Material design'
        },
        {
          id: 'example-2', 
          text: 'Сделай флоу регистрации',
          action: 'send_message',
          data: 'Нарисуй флоу регистрации пользователя на мобильном устройстве. Экран шириной 360px;'
        },
        {
          id: 'example-3',
          text: 'Объясни что такое UX?',
          action: 'send_message', 
          data: 'Что такое UX дизайн?'
        }
      ]
    }
  ]);


  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  const typingIntervalRef = React.useRef(null);

  // Состояние для контекстного меню
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    selectedText: ''
  });

  // Очистка интервала псевдо-стримминга при размонтировании
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Обработчик клика вне контекстного меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu.isVisible) {
        setContextMenu({ isVisible: false, x: 0, y: 0, selectedText: '' });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.isVisible]);

  const streamTextToChat = useCallback((fullText) => {
    const tempId = Date.now() + '-ai-stream';
    // Плейсхолдер
    setChatMessages(prev => [
      ...prev,
      { id: tempId, type: 'ai', content: 'Печатает…', timestamp: new Date() }
    ]);
    // Псевдо-стримминг
    let i = 0;
    const step = 28;
    const tickMs = 24;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = setInterval(() => {
      i = Math.min(i + step, fullText.length);
      const chunk = fullText.slice(0, i) || '';
      setChatMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: chunk } : m));
      
      if (i >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, tickMs);
  }, []);
  // Функция глобальной очистки всех overlay-слоев
  const clearAllOverlays = useCallback(() => {
    console.log('🧹 Очищаем все overlay-слои');
    const allContainers = document.querySelectorAll('.ui-flow-content');
    allContainers.forEach(container => {
      const allElements = container.querySelectorAll('[data-element-id]');
      allElements.forEach(el => {
        el.style.outline = 'none';
        el.style.outlineOffset = '';
        el.style.backgroundColor = '';
        el.removeAttribute('data-original-bg');
      });
    });
  }, []);

  // Обработчики для React Flow компонента
  const handleElementSelect = useCallback((element) => {
    setSelectedElement(element);
    // Сбрасываем режим редактирования при выборе другого элемента
    if (editingElement && editingElement.id !== element.id) {
      setEditingElement(null);
      console.log('🔄 Режим редактирования сброшен - выбран другой элемент');
    }
    // Сбрасываем выбор внутреннего элемента при смене артефакта
    setSelectedInternalElement(null);
    // Очищаем все overlay-слои при смене элемента
    clearAllOverlays();
  }, [editingElement, clearAllOverlays]);

  // Обработчики для выбора внутренних элементов в артефактах

  const handleInternalElementSelect = useCallback((artifactId, elementId, domElement) => {
    console.log('🎯 Выбран внутренний элемент:', elementId, 'в артефакте:', artifactId);
    console.log('🔍 DEBUG: domElement:', domElement);
    
    // Если elementId пустой, очищаем все overlay
    if (!elementId) {
      console.log('🧹 Очищаем выделение - вызываем clearAllOverlays');
      clearAllOverlays();
      setSelectedInternalElement(null);
      return;
    }
    
    // Устанавливаем выбранный внутренний элемент
    const newSelection = {
      artifactId,
      elementId,
      domElement
    };
    console.log('🔍 DEBUG: setSelectedInternalElement:', newSelection);
    setSelectedInternalElement(newSelection);
    
    // Убеждаемся что артефакт выбран
    const artifact = canvasElements.find(el => el.id === artifactId);
    console.log('🔍 DEBUG: artifact найден:', !!artifact);
    if (artifact && (!selectedElement || selectedElement.id !== artifactId)) {
      console.log('🔍 DEBUG: устанавливаем selectedElement:', artifact.name);
      setSelectedElement(artifact);
    }
  }, [canvasElements, selectedElement, clearAllOverlays]);

  // CSS инъектор для дизайн-токенов в артефакты
  useEffect(() => {
    console.log('🎨 Инициализация CSS инъектора...');
    
    // Инжектируем дизайн-токены в существующие артефакты
    setTimeout(() => {
      cssInjector.injectDesignTokensToAllArtifacts();
    }, 1000);
    
    // Следим за изменениями DOM для новых артефактов
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Проверяем, является ли добавленный элемент артефактом
            if (node.classList?.contains('react-flow__node') || 
                node.querySelector?.('.react-flow__node')) {
              console.log('🎨 Обнаружен новый артефакт, инжектируем токены');
              setTimeout(() => {
                cssInjector.injectDesignTokensToAllArtifacts();
              }, 100);
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, []);

  // Инициализация при загрузке компонента
  useEffect(() => {
    // Инициализируем CSS инжектор
    cssInjector.injectDesignTokensToAllArtifacts();
    
    // Инициализируем тест изменения размера
    if (typeof window !== 'undefined') {
      window.resizeTest = new ResizeTest();
      console.log('🧪 Тест изменения размера инициализирован. Используйте:');
      console.log('  - window.resizeTest.quickCheck() - быстрая проверка');
      console.log('  - window.resizeTest.runFullTest() - полный тест');
    }
  }, []);

  // Принудительная загрузка локального CSS отключена в проде (DEV-утилита)
  // Удалено: const forceLoadLocalCSS = () => {};

  // Обработчик клавиши Escape для очистки overlay-слоев
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        console.log('🔑 Нажата клавиша Escape - очищаем overlay-слои');
        clearAllOverlays();
        setSelectedInternalElement(null);
        setSelectedElement(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [clearAllOverlays]);

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

  // Функция для генерации артефакта по фрагменту (с LLM)
  const handleCreateArtifactFromText = useCallback(async (selectedText) => {
    if (!selectedText.trim()) return;

    console.log('🎨 Генерирую артефакт по фрагменту:', selectedText);
    
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now() + '-context-artifact',
        type: 'ai',
        content: `🎨 **Генерирую артефакт по фрагменту:**\n\n"${selectedText}"`,
        timestamp: new Date()
      }
    ]);

    setIsLoading(true);
    setLoadingStatus('🎨 Генерирую артефакт...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Создай UI компонент на основе этого текста: "${selectedText}"`
            }
          ]
        })
      });

      const data = await response.json();

      if (data.visual_content) {
        // Создаем новый артефакт
        const newArtifact = {
          id: `artifact-${Date.now()}`,
          type: 'artifact',
          x: 100 + Math.random() * 200,
          y: 100 + Math.random() * 200,
          width: data.width || 400,
          height: 'auto',
          isAutoHeight: true,
          name: `Артефакт из текста`,
          content: data.visual_content,
          prompt: `Создан из выделенного текста: "${selectedText}"`,
          createdAt: new Date().toISOString()
        };

        setCanvasElements(prev => [...prev, newArtifact]);
        
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now() + '-artifact-success',
            type: 'ai',
            content: `✅ **Артефакт сгенерирован!**\n\nЭлемент добавлен на канвас. Вы можете выбрать его для редактирования.`,
            timestamp: new Date()
          }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now() + '-artifact-error',
            type: 'ai',
            content: `❌ Не удалось сгенерировать артефакт из выделенного текста.`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('❌ Ошибка генерации артефакта:', error);
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-artifact-error',
          type: 'ai',
          content: `❌ Ошибка при генерации артефакта: ${error.message}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
      setContextMenu({ isVisible: false, x: 0, y: 0, selectedText: '' });
    }
  }, []);

  // Функция для создания простого артефакта из выделенного текста (без LLM)
  const handleCreateSimpleArtifactFromText = useCallback((selectedText) => {
    if (!selectedText.trim()) return;
    
    console.log('📝 Создаю простой артефакт из выделенного текста:', selectedText);
    
    const simpleArtifact = `
      <div style="
        width: 400px;
        height: auto;
        padding: 16px;
        background-color: var(--mdc-theme-surface);
        border: 1px solid var(--mdc-theme-outline);
        border-radius: 8px;
        font-family: 'Roboto', sans-serif;
        color: var(--mdc-theme-on-surface);
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
        box-shadow: 0px 1px 3px 1px var(--mdc-theme-shadow);
      ">
        ${selectedText}
      </div>
    `;
    
    const newArtifact = {
      id: `simple-artifact-${Date.now()}`,
      type: 'artifact',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 400,
      height: 'auto',
      isAutoHeight: true,
      name: `Простой артефакт`,
      content: simpleArtifact,
      prompt: `Создан простой артефакт из выделенного текста: "${selectedText}"`,
      createdAt: new Date().toISOString()
    };
    
    setCanvasElements(prev => [...prev, newArtifact]);
    
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now() + '-simple-artifact-success',
        type: 'ai',
        content: `✅ **Простой артефакт создан!**\n\nЭлемент добавлен на канвас. Вы можете выбрать его для редактирования.`,
        timestamp: new Date()
      }
    ]);
    
    setContextMenu({ isVisible: false, x: 0, y: 0, selectedText: '' });
  }, []);

  // Обработчик правого клика на сообщениях чата
  const handleChatMessageContextMenu = useCallback((event, messageContent) => {
    event.preventDefault();
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      setContextMenu({
        isVisible: true,
        x: event.clientX,
        y: event.clientY,
        selectedText: selectedText
      });
    }
  }, []);

  // Закрытие контекстного меню
  const closeContextMenu = useCallback(() => {
    setContextMenu({ isVisible: false, x: 0, y: 0, selectedText: '' });
  }, []);

  // Копирование текста в буфер обмена
  const copyTextToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('📋 Текст скопирован в буфер обмена:', text);
      
      // Показываем уведомление об успешном копировании
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-copy-success',
          type: 'ai',
          content: `📋 **Текст скопирован в буфер обмена!**\n\n"${text.length > 50 ? text.substring(0, 50) + '...' : text}"`,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('❌ Ошибка копирования в буфер обмена:', error);
      
      // Fallback для старых браузеров
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now() + '-copy-success',
            type: 'ai',
            content: `📋 **Текст скопирован в буфер обмена!**\n\n"${text.length > 50 ? text.substring(0, 50) + '...' : text}"`,
            timestamp: new Date()
          }
        ]);
      } catch (fallbackError) {
        console.error('❌ Ошибка fallback копирования:', fallbackError);
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now() + '-copy-error',
            type: 'ai',
            content: `❌ **Не удалось скопировать текст в буфер обмена**`,
            timestamp: new Date()
          }
        ]);
      }
    }
    
    // Закрываем контекстное меню
    setContextMenu({ isVisible: false, x: 0, y: 0, selectedText: '' });
  }, []);

  // Обработка отправки сообщений в чат
  const handleSendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { id: Date.now() + '-user', type: 'user', content: message, timestamp: new Date() }
    ]);

    setIsLoading(true);
    setLoadingStatus('🧠 Анализирую запрос...');

    try {
      console.log('🚀 Анализирую сообщение:', message);
      
      // Классифицируем сообщение пользователя
      const classification = messageRouter.classifyMessage(message, { 
        editingElement,
        selectedElement 
      });
      
      console.log('🎯 Классификация сообщения:', classification);
      
      // Создаем промпт на основе классификации
      const promptData = messageRouter.createPrompt(message, classification, {
        editingElement,
        selectedElement
      });
      
      console.log('📝 Промпт данные:', promptData);

      // Обработка обычных чат-ответов
      if (classification.type === 'chat_response') {
        setLoadingStatus('💬 Отвечаю на вопрос...');
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'Ты опытный помощник по разработке UI/UX. Отвечай кратко и по делу в JSON формате: {"notes": "твой ответ"}. НЕ создавай визуальные артефакты, только текстовые ответы.' },
              { role: 'user', content: promptData.prompt }
            ]
          })
        });

        const data = await response.json();
        
        if (data.success && data.text_content) {
          // Пробуем извлечь notes из JSON для чат-ответов
          let chatText = data.text_content;
          try {
            const parsed = JSON.parse(data.text_content);
            if (parsed.notes) {
              chatText = parsed.notes;
            }
          } catch (e) {
            // Если не JSON, используем как есть
          }
          streamTextToChat(chatText);
        }
        
        setIsLoading(false);
        return;
      }

      // Обработка пошагового планирования
      if (classification.type === 'step_by_step_plan') {
        setLoadingStatus('📋 Создаю план выполнения...');
        
        const plan = await plannerService.createExecutionPlan(message);
        console.log('📋 Создан план:', plan);
        
        setActivePlan(plan);
        
        // Создаем текстовое представление плана
        let planText = `📋 **${plan.plan_title}**\n\n${plan.description}\n\n**План выполнения:**\n`;
        plan.steps?.forEach((step, index) => {
          planText += `\n${index + 1}. **${step.title}**\n   ${step.description}\n   ⏱️ ${step.estimated_time}`;
        });
        planText += '\n\n🚀 Нажмите кнопку ниже, чтобы выполнить все шаги последовательно:';
        
        setChatMessages(prev => [
          ...prev,
          { 
            id: Date.now() + '-ai', 
            type: 'ai', 
            content: planText,
            timestamp: new Date(),
            suggestions: [
              {
                id: 'execute-plan',
                text: '🚀 Выполнить план',
                action: 'execute_plan',
                data: plan
              }
            ]
          }
        ]);
        
        setIsLoading(false);
        return;
      }

      // Обработка создания/редактирования артефактов
      setLoadingStatus('📤 Отправляю запрос к LLM...');
      
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

      setLoadingStatus('⏳ Ожидаю ответ от AnythingLLM...');
      console.log('📡 Получен ответ:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setLoadingStatus('🔄 Обрабатываю ответ...');
      const data = await response.json();
      console.log('📦 Данные ответа:', data);

      if (data.success) {
        if (data.text_content) {
          streamTextToChat(data.text_content);
        }

        // Если есть визуальный контент - создаем или обновляем артефакт
        if (data.visual_content) {
          if (editingElement) {
            // РЕЖИМ РЕДАКТИРОВАНИЯ: Обновляем существующий элемент
            console.log('✏️ Обновляю существующий элемент:', editingElement.id);
            
            // Инжектируем дизайн-токены в обновлённое содержимое
            const contentWithTokens = cssInjector.injectDesignTokensToHTML(data.visual_content);
            
            const updatedElement = {
              ...editingElement,
              content: contentWithTokens,
              code: contentWithTokens,
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
            // Инжектируем дизайн-токены в HTML содержимое
            const contentWithTokens = cssInjector.injectDesignTokensToHTML(data.visual_content);
            
            const newArtifact = {
              id: 'artifact-' + Date.now(),
              type: 'artifact',
              x: 250 + randomOffset,
              y: 200 + randomOffset,
              width: artifactWidth,
              height: artifactHeight,
              isAutoHeight: artifactHeight === "auto",
              name: 'Generated Artifact',
              content: contentWithTokens, // Используем HTML с инжектированными токенами
              code: contentWithTokens, // Также обновляем код
              prompt: message,
              createdAt: new Date().toISOString()
            };
            
            setCanvasElements(prev => [...prev, newArtifact]);
            console.log('✅ Артефакт добавлен на канвас');
            
            // Инжектируем дизайн-токены в новый артефакт
            setTimeout(() => {
              cssInjector.injectDesignTokensToAllArtifacts();
              console.log('🎨 Дизайн-токены инжектированы в новый артефакт');
            }, 200);
            
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
  }, [canvasElements, editingElement, selectedElement, messageRouter, plannerService, streamTextToChat]);

  // Обработчик выполнения шага плана
  const handleExecuteStep = useCallback(async (step) => {
    if (!activePlan || isExecutingPlan) return;

    setIsExecutingPlan(true);
    setLoadingStatus(`🚀 Выполняю шаг: ${step.title}...`);

    try {
      console.log('🚀 Выполняю шаг плана:', step);
      
      const result = await plannerService.executeStep(step);
      console.log('✅ Результат выполнения шага:', result);

      // Обновляем план с результатом
      setActivePlan(prevPlan => {
        const updatedCompletedSteps = [...(prevPlan.completedSteps || []), result];
        const nextStep = prevPlan.steps.findIndex(s => s.id === step.id + 1);
        
        return {
          ...prevPlan,
          completedSteps: updatedCompletedSteps,
          currentStep: nextStep >= 0 ? nextStep : prevPlan.steps.length,
          status: nextStep >= 0 ? 'executing' : 'completed'
        };
      });

      // Добавляем сообщение в чат
      setChatMessages(prev => [
        ...prev,
        { 
          id: Date.now() + '-step-result', 
          type: 'ai', 
          content: `✅ **Шаг "${step.title}" выполнен!**\n\n${result.textContent || 'Шаг успешно завершен.'}`,
          timestamp: new Date() 
        }
      ]);

      // Если есть визуальный контент - создаем артефакт
      if (result.success && result.visualContent) {
        const newElement = {
          id: `step-${step.id}-${Date.now()}`,
          type: plannerService.getElementTypeFromStep(step),
          x: 100 + (step.id - 1) * 50, // Смещение для каждого шага
          y: 100 + (step.id - 1) * 50,
          width: result.width || 400,
          height: result.height === "auto" ? "auto" : (result.height || 300),
          name: step.title,
          content: result.visualContent,
          code: result.visualContent,
          prompt: step.prompt,
          createdAt: new Date().toISOString(),
          stepId: step.id,
          planId: activePlan.id
        };

        setCanvasElements(prev => [...prev, newElement]);
        
        setChatMessages(prev => [
          ...prev,
          { 
            id: Date.now() + '-artifact-created', 
            type: 'ai', 
            content: `🎨 **Артефакт создан:** "${step.title}"\n\nЭлемент добавлен на канвас и готов к использованию.`,
            timestamp: new Date() 
          }
        ]);
      }

    } catch (error) {
      console.error('❌ Ошибка выполнения шага:', error);
      
      // Обновляем план с ошибкой
      setActivePlan(prevPlan => ({
        ...prevPlan,
        completedSteps: [
          ...(prevPlan.completedSteps || []),
          {
            stepId: step.id,
            success: false,
            error: error.message,
            executedAt: new Date().toISOString()
          }
        ]
      }));

      setChatMessages(prev => [
        ...prev,
        { 
          id: Date.now() + '-step-error', 
          type: 'ai', 
          content: `❌ **Ошибка выполнения шага "${step.title}"**\n\n${error.message}`,
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsExecutingPlan(false);
      setIsLoading(false);
    }
  }, [activePlan, isExecutingPlan, plannerService]);

  // Обработчик отмены плана (закомментирован - не используется)
  // const handleCancelPlan = useCallback((planId) => {
  //   setActivePlan(null);
  //   setChatMessages(prev => [
  //     ...prev,
  //     { 
  //       id: Date.now() + '-plan-cancelled', 
  //       type: 'ai', 
  //       content: '❌ **План отменен**\n\nВы можете создать новый план или продолжить работу с отдельными элементами.',
  //       timestamp: new Date() 
  //     }
  //   ]);
  // }, []);

  // Обработчик выполнения всего плана последовательно
  const handleExecutePlan = useCallback(async (plan) => {
    if (!plan || !plan.steps || isExecutingPlan) return;

    console.log('🚀 Начинаю выполнение плана:', plan.plan_title);
    
    setIsExecutingPlan(true);
    setActivePlan(plan);

    // Добавляем сообщение о начале выполнения
    setChatMessages(prev => [
      ...prev,
      { 
        id: Date.now() + '-plan-start', 
        type: 'ai', 
        content: `🚀 **Начинаю выполнение плана "${plan.plan_title}"**\n\nВыполню ${plan.steps.length} шагов последовательно...`,
        timestamp: new Date() 
      }
    ]);

    try {
      // Выполняем шаги последовательно
      for (let i = 0; i < plan.steps.length; i++) {
        const step = plan.steps[i];
        
        setLoadingStatus(`🔄 Шаг ${i + 1}/${plan.steps.length}: ${step.title}...`);
        setIsLoading(true);

        // Создаем контекстный промпт для шага
        const contextPrompt = `ВЫПОЛНЕНИЕ ПЛАНА: "${plan.plan_title}"

КОНТЕКСТ ВСЕГО ПЛАНА: ${plan.description}

ТЕКУЩИЙ ШАГ ${i + 1} из ${plan.steps.length}: ${step.title}
ОПИСАНИЕ ШАГА: ${step.description}

ИСХОДНЫЙ ЗАПРОС ПОЛЬЗОВАТЕЛЯ: ${plan.originalRequest}

ЗАДАЧА: ${step.prompt}

ВАЖНО: Создай UI элемент согласно этому шагу, учитывая общий контекст плана. Элемент должен быть частью единого флоу "${plan.plan_title}".`;

        console.log(`🔄 Выполняю шаг ${i + 1}: ${step.title}`);

        try {
          const result = await plannerService.executeStep({
            ...step,
            prompt: contextPrompt
          });

          if (result.success && result.visualContent) {
            // Создаем артефакт для шага
            const newElement = {
              id: `plan-${plan.id}-step-${step.id}-${Date.now()}`,
              type: plannerService.getElementTypeFromStep(step),
              x: 150 + i * 80, // Размещаем элементы по горизонтали
              y: 150 + i * 60,
              width: result.width || 400,
              height: result.height === "auto" ? "auto" : (result.height || 300),
              name: step.title,
              content: result.visualContent,
              code: result.visualContent,
              prompt: step.prompt,
              createdAt: new Date().toISOString(),
              stepId: step.id,
              planId: plan.id,
              stepNumber: i + 1
            };

            setCanvasElements(prev => [...prev, newElement]);

            // Добавляем сообщение об успешном выполнении шага
            setChatMessages(prev => [
              ...prev,
              { 
                id: Date.now() + `-step-${i + 1}-completed`, 
                type: 'ai', 
                content: `✅ **Шаг ${i + 1} завершен: "${step.title}"**\n\n${result.textContent || 'Элемент создан и добавлен на канвас.'}`,
                timestamp: new Date() 
              }
            ]);

            // Обновляем план с результатом
            setActivePlan(prevPlan => ({
              ...prevPlan,
              completedSteps: [...(prevPlan.completedSteps || []), result],
              currentStep: i + 1
            }));

            // Пауза между шагами (0 в проде)
            if (PLAN_STEP_DELAY_MS > 0) {
              await new Promise(resolve => setTimeout(resolve, PLAN_STEP_DELAY_MS));
            }

          } else {
            throw new Error(result.error || 'Не удалось создать элемент');
          }

        } catch (stepError) {
          console.error(`❌ Ошибка на шаге ${i + 1}:`, stepError);
          
          setChatMessages(prev => [
            ...prev,
            { 
              id: Date.now() + `-step-${i + 1}-error`, 
              type: 'ai', 
              content: `❌ **Ошибка на шаге ${i + 1}: "${step.title}"**\n\n${stepError.message}\n\nПродолжаю выполнение следующих шагов...`,
              timestamp: new Date() 
            }
          ]);
        }
      }

      // План выполнен
      setChatMessages(prev => [
        ...prev,
        { 
          id: Date.now() + '-plan-completed', 
          type: 'ai', 
          content: `🎉 **План "${plan.plan_title}" успешно выполнен!**\n\nВсе элементы созданы и добавлены на канвас. Теперь вы можете их редактировать или создать новый план.`,
          timestamp: new Date() 
        }
      ]);

      setActivePlan(prevPlan => ({
        ...prevPlan,
        status: 'completed'
      }));

    } catch (error) {
      console.error('❌ Ошибка выполнения плана:', error);
      
      setChatMessages(prev => [
        ...prev,
        { 
          id: Date.now() + '-plan-error', 
          type: 'ai', 
          content: `❌ **Ошибка выполнения плана**\n\n${error.message}`,
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsExecutingPlan(false);
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, [plannerService, isExecutingPlan, PLAN_STEP_DELAY_MS]);

  // Обработчик кликов по саджестам
  const handleSuggestionClick = useCallback(async (suggestion) => {
    console.log('🎯 Клик по саджесту:', suggestion);
    
    if (suggestion.action === 'execute_plan') {
      await handleExecutePlan(suggestion.data);
    } else if (suggestion.action === 'execute_step') {
      await handleExecuteStep(suggestion.data);
    } else if (suggestion.action === 'send_message') {
      const message = suggestion.data || suggestion.text;
      await handleSendMessage(message);
    }
  }, [handleExecutePlan, handleExecuteStep, handleSendMessage]);

  return (
    <div className="app">
      {/* Левая панель - Чат */}
      <ChatPanel
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        isLoading={isLoading}
        loadingStatus={loadingStatus}
        editingElement={editingElement}
        setEditingElement={setEditingElement}
        onSendMessage={handleSendMessage}
        onSuggestionClick={handleSuggestionClick}
        onContextMenu={handleChatMessageContextMenu}
      />

      {/* Центральная область - React Flow Canvas */}
      <div className="design-canvas">
        <CanvasFlow
          elements={canvasElements}
          selectedElement={selectedElement}
          selectedInternalElement={selectedInternalElement}
          onElementSelect={handleElementSelect}
          onElementRegenerate={handleElementRegenerate}
          onElementEdit={handleElementEdit}
          
          onInternalElementSelect={handleInternalElementSelect}
        />
      </div>

      {/* Правая панель - Свойства */}
      {selectedElement && (
        <PropertiesPanel
          key={`${selectedElement.id}-${selectedInternalElement?.elementId || 'none'}`}
          element={selectedElement}
          selectedInternalElement={selectedInternalElement}
          onElementUpdate={handleElementUpdate}
          onElementDelete={handleElementDelete}
          onClose={() => setSelectedElement(null)}
        />
      )}

      {/* Контекстное меню */}
      {contextMenu.isVisible && (
        <div 
          className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg p-1 min-w-[180px] text-sm"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <div 
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors select-none"
            onClick={() => copyTextToClipboard(contextMenu.selectedText)}
          >
            <span className="mr-2 text-sm">📋</span>
            <span className="text-popover-foreground font-medium">Копировать</span>
          </div>
          <div 
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors select-none"
            onClick={() => handleCreateArtifactFromText(contextMenu.selectedText)}
          >
            <span className="mr-2 text-sm">🎨</span>
            <span className="text-popover-foreground font-medium">Использовать как промпт</span>
          </div>
          <div 
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors select-none"
            onClick={() => handleCreateSimpleArtifactFromText(contextMenu.selectedText)}
          >
            <span className="mr-2 text-sm">📝</span>
            <span className="text-popover-foreground font-medium">Создать артефакт</span>
          </div>
          <Separator className="my-1" />
          <div 
            className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors select-none"
            onClick={closeContextMenu}
          >
            <span className="mr-2 text-sm">✕</span>
            <span className="text-popover-foreground font-medium">Отмена</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;