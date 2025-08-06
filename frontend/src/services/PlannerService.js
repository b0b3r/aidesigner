/**
 * PlannerService - сервис для создания и выполнения пошаговых планов
 * Разбивает сложные задачи на этапы и выполняет их последовательно
 */

export class PlannerService {
  constructor(apiEndpoint = '/api/chat') {
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Создает план выполнения на основе пользовательского запроса
   * @param {string} userRequest - запрос пользователя
   * @returns {Promise<Object>} - объект плана
   */
  async createExecutionPlan(userRequest) {
    console.log('📋 PlannerService: создаю план для запроса:', userRequest);
    
    const planningPrompt = `Создай подробный план выполнения запроса пользователя по шагам.
Каждый шаг должен быть отдельной задачей для создания отдельного UI элемента.

Запрос пользователя: "${userRequest}"

Пример для "флоу регистрации пользователя":
{
  "plan_title": "Флоу регистрации пользователя",
  "description": "Создание интерфейса процесса регистрации от начала до конца",
  "steps": [
    {
      "id": 1,
      "title": "Главная страница с кнопкой регистрации",
      "description": "Создать главную страницу с призывом к регистрации",
      "type": "artifact",
      "prompt": "Создай главную страницу сайта с яркой кнопкой 'Зарегистрироваться' и привлекательным заголовком",
      "estimated_time": "2-3 минуты",
      "dependencies": []
    },
    {
      "id": 2,
      "title": "Форма регистрации",
      "description": "Создать форму для ввода данных регистрации",
      "type": "artifact", 
      "prompt": "Создай красивую форму регистрации с полями: имя, email, пароль, подтверждение пароля и кнопкой 'Создать аккаунт'",
      "estimated_time": "3-4 минуты",
      "dependencies": []
    },
    {
      "id": 3,
      "title": "Страница подтверждения email",
      "description": "Экран с информацией о необходимости подтвердить email",
      "type": "artifact",
      "prompt": "Создай страницу подтверждения email с иконкой письма, текстом 'Проверьте почту' и кнопкой 'Отправить повторно'",
      "estimated_time": "2-3 минуты", 
      "dependencies": []
    }
  ]
}

ВАЖНО: Верни ответ СТРОГО в формате JSON без дополнительного текста:`;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: 'Ты планировщик задач для создания UI/UX. Отвечай ТОЛЬКО в формате JSON, без дополнительного текста.' 
            },
            { role: 'user', content: planningPrompt }
          ]
        })
      });

      const data = await response.json();
      console.log('📋 PlannerService: ответ от API:', data);
      
      if (data.success) {
        console.log('📋 PlannerService: text_content:', data.text_content);
        try {
          // Пытаемся распарсить JSON из ответа
          const planData = this.extractJsonFromResponse(data.text_content);
          console.log('📋 PlannerService: распарсенный план:', planData);
          
          const finalPlan = {
            id: this.generateId(),
            ...planData,
            status: 'pending',
            currentStep: 0,
            createdAt: new Date().toISOString(),
            completedSteps: [],
            originalRequest: userRequest
          };
          
          console.log('📋 PlannerService: финальный план:', finalPlan);
          return finalPlan;
        } catch (parseError) {
          console.error('❌ Ошибка парсинга плана:', parseError);
          console.error('❌ Исходный текст:', data.text_content);
          // Fallback - создаем простой план
          return this.createFallbackPlan(userRequest);
        }
      } else {
        console.error('❌ API вернул ошибку:', data);
      }
    } catch (error) {
      console.error('❌ Ошибка создания плана:', error);
      return this.createFallbackPlan(userRequest);
    }
  }

  /**
   * Выполняет конкретный шаг плана
   * @param {Object} step - шаг для выполнения
   * @param {Object} context - контекст выполнения (результаты предыдущих шагов)
   * @returns {Promise<Object>} - результат выполнения шага
   */
  async executeStep(step, context = {}) {
    console.log('🚀 Выполняю шаг:', step.title);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: step.prompt }
          ]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          stepId: step.id,
          success: true,
          textContent: data.text_content,
          visualContent: data.visual_content,
          width: data.width,
          height: data.height,
          executedAt: new Date().toISOString()
        };
      } else {
        throw new Error('API вернул ошибку');
      }
    } catch (error) {
      console.error('❌ Ошибка выполнения шага:', error);
      return {
        stepId: step.id,
        success: false,
        error: error.message,
        executedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Извлекает JSON из ответа LLM (может быть обернут в текст)
   */
  extractJsonFromResponse(response) {
    // Ищем JSON в ответе
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Если JSON не найден, пытаемся парсить весь ответ
    return JSON.parse(response);
  }

  /**
   * Создает простой план, если основной алгоритм не сработал
   */
  createFallbackPlan(userRequest) {
    return {
      id: this.generateId(),
      plan_title: `План: ${userRequest}`,
      description: 'Автоматически созданный план',
      steps: [
        {
          id: 1,
          title: 'Создание основного элемента',
          description: 'Создать основной UI элемент согласно запросу',
          type: 'artifact',
          prompt: userRequest,
          estimated_time: '3-5 минут',
          dependencies: []
        }
      ],
      status: 'pending',
      currentStep: 0,
      createdAt: new Date().toISOString(),
      completedSteps: [],
      originalRequest: userRequest
    };
  }

  /**
   * Проверяет, готов ли шаг к выполнению (выполнены ли зависимости)
   */
  isStepReady(step, completedSteps) {
    if (!step.dependencies || step.dependencies.length === 0) {
      return true;
    }

    return step.dependencies.every(depId => 
      completedSteps.some(completed => completed.stepId === depId)
    );
  }

  /**
   * Получает следующий шаг для выполнения
   */
  getNextStep(plan) {
    const { steps, completedSteps } = plan;
    
    return steps.find(step => 
      !completedSteps.some(completed => completed.stepId === step.id) &&
      this.isStepReady(step, completedSteps)
    );
  }

  /**
   * Генерирует уникальный ID
   */
  generateId() {
    return 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Определяет тип элемента на основе шага
   */
  getElementTypeFromStep(step) {
    const stepTitle = step.title.toLowerCase();
    
    if (stepTitle.includes('экран') || stepTitle.includes('страниц')) {
      return 'page';
    }
    if (stepTitle.includes('форм')) {
      return 'form';
    }
    if (stepTitle.includes('кнопк') || stepTitle.includes('button')) {
      return 'button';
    }
    if (stepTitle.includes('навигац') || stepTitle.includes('меню')) {
      return 'navigation';
    }
    
    return 'component';
  }
}

export default PlannerService;