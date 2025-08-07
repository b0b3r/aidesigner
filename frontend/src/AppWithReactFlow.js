import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import './components/CanvasFlow.css';
import CanvasFlow from './components/CanvasFlow';
import PropertiesPanel from './components/PropertiesPanel';
import MessageRouter from './services/MessageRouter';
import PlannerService from './services/PlannerService';
import cssInjector from './utils/cssInjector';

function AppWithReactFlow() {
  // Используем существующие данные из App.js
  const [selectedElement, setSelectedElement] = useState(null);
  const [editingElement, setEditingElement] = useState(null);
  const [selectedInternalElement, setSelectedInternalElement] = useState(null);
  
  // Инициализируем сервисы
  const messageRouter = new MessageRouter();
  const plannerService = new PlannerService();
  
  // Состояние для планов
  const [activePlan, setActivePlan] = useState(null);
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  
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
      content: '🚀 **AI Designer готов к работе!**\n\nТеперь доступны новые возможности:\n\n• **💬 Умный чат** - задавайте вопросы, получайте ответы\n• **🎨 Создание артефактов** - генерация UI элементов\n• **📋 Пошаговые планы** - создание флоу по этапам\n\nВыберите что хотите сделать:',
      timestamp: new Date(),
      suggestions: [
        {
          id: 'example-1',
          text: '🎨 Создать кнопку',
          action: 'send_message',
          data: 'Создай красивую кнопку'
        },
        {
          id: 'example-2', 
          text: '📋 Флоу регистрации',
          action: 'send_message',
          data: 'Нарисуй флоу регистрации пользователя'
        },
        {
          id: 'example-3',
          text: '💬 Что такое UX?',
          action: 'send_message', 
          data: 'Что такое UX дизайн?'
        }
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  


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

  // Загружаем CSS дизайн-систем при инициализации
  useEffect(() => {
    cssInjector.loadDesignSystemsCSS();
  }, []);

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
              { role: 'system', content: 'Ты опытный помощник по разработке UI/UX. Отвечай кратко и по делу. НЕ создавай код или артефакты, только текстовые ответы.' },
              { role: 'user', content: promptData.prompt }
            ]
          })
        });

        const data = await response.json();
        
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

  // Обработчик отмены плана
  const handleCancelPlan = useCallback((planId) => {
    setActivePlan(null);
    setChatMessages(prev => [
      ...prev,
      { 
        id: Date.now() + '-plan-cancelled', 
        type: 'ai', 
        content: '❌ **План отменен**\n\nВы можете создать новый план или продолжить работу с отдельными элементами.',
        timestamp: new Date() 
      }
    ]);
  }, []);

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

            // Небольшая пауза между шагами
            await new Promise(resolve => setTimeout(resolve, 1000));

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
  }, [plannerService, isExecutingPlan]);

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
          
          {/* Тестовые кнопки для отладки */}
          <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSendMessage('Нарисуй флоу регистрации пользователя')}
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
              disabled={isLoading}
            >
              🧪 Тест План
            </button>
            <button
              onClick={() => handleSendMessage('Что такое React?')}
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
              disabled={isLoading}
            >
              🧪 Тест Чат
            </button>
            <button
              onClick={() => handleSendMessage('Создай кнопку')}
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                background: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
              disabled={isLoading}
            >
              🧪 Тест Артефакт
            </button>
          </div>
          

        </div>
        
        <div className="chat-messages">
          {chatMessages.map((message) => (
            <div key={message.id} className={`chat-message ${message.type}`}>
              <div className="message-content">
                {message.content.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              
              {/* Кнопки-саджесты */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="message-suggestions">
                  {message.suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className="suggestion-btn"
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isLoading}
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              )}
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
          selectedInternalElement={selectedInternalElement}
          onElementSelect={handleElementSelect}
          onElementRegenerate={handleElementRegenerate}
          onElementEdit={handleElementEdit}
          onElementUpdate={handleElementUpdate}
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
    </div>
  );
}

export default AppWithReactFlow;