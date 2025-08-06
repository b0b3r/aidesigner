/**
 * MessageRouter - умная классификация пользовательских запросов
 * Определяет тип ответа: обычный чат, создание артефакта или пошаговый план
 */

export class MessageRouter {
  constructor() {
    // Ключевые слова для создания артефактов
    this.artifactKeywords = [
      'создай', 'сделай', 'нарисуй', 'построй', 'сгенерируй',
      'разработай', 'напиши код', 'создать', 'сделать', 'нарисовать',
      'ui', 'интерфейс', 'компонент', 'страниц', 'форм', 'кнопк'
    ];

    // Ключевые слова для пошагового планирования
    this.planningKeywords = [
      'флоу', 'поток', 'процесс', 'последовательность', 'этапы',
      'шаги', 'план', 'схема', 'алгоритм', 'workflow', 'flow'
    ];

    // Ключевые слова для обычного чата
    this.chatKeywords = [
      'что такое', 'как работает', 'объясни', 'расскажи', 'помоги',
      'можно ли', 'почему', 'зачем', 'когда', 'где', 'сколько'
    ];
  }

  /**
   * Классифицирует сообщение пользователя
   * @param {string} message - сообщение пользователя
   * @param {Object} context - контекст (выбранный элемент, режим редактирования)
   * @returns {Object} - тип сообщения и дополнительная информация
   */
  classifyMessage(message, context = {}) {
    const lowerMessage = message.toLowerCase();
    
    // Если в режиме редактирования - всегда редактируем артефакт
    if (context.editingElement) {
      return {
        type: 'artifact_edit',
        confidence: 1.0,
        element: context.editingElement
      };
    }

    // Проверяем на пошаговое планирование
    const planningScore = this.calculateScore(lowerMessage, this.planningKeywords);
    const artifactScore = this.calculateScore(lowerMessage, this.artifactKeywords);
    const chatScore = this.calculateScore(lowerMessage, this.chatKeywords);

    console.log('🎯 MessageRouter scores:', {
      message: lowerMessage,
      planningScore,
      artifactScore,
      chatScore
    });

    // Улучшенная логика определения типа
    // 1. Проверяем на прямое упоминание флоу/процесса
    const hasFlowKeywords = this.planningKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (hasFlowKeywords || planningScore > 0.1) {
      console.log('✅ Определен как план (флоу обнаружен)');
      return {
        type: 'step_by_step_plan',
        confidence: Math.max(planningScore, 0.8),
        requiresPlanning: true
      };
    }

    // 2. Проверяем на вопросы
    if (chatScore > 0.2 || this.isQuestionLike(lowerMessage)) {
      console.log('✅ Определен как чат (вопрос)');
      return {
        type: 'chat_response',
        confidence: Math.max(chatScore, 0.5),
        requiresSimpleAnswer: true
      };
    }

    // 3. Все остальное - создание артефактов
    console.log('✅ Определен как артефакт (по умолчанию)');
    return {
      type: 'artifact_creation',
      confidence: Math.max(artifactScore, 0.5),
      requiresArtifact: true,
      fallback: artifactScore < 0.2
    };
  }

  /**
   * Вычисляет скор совпадения с ключевыми словами
   */
  calculateScore(message, keywords) {
    let matches = 0;
    let totalWords = message.split(' ').length;

    keywords.forEach(keyword => {
      if (message.includes(keyword)) {
        matches += keyword.split(' ').length;
      }
    });

    return matches / totalWords;
  }

  /**
   * Проверяет, является ли сообщение вопросом
   */
  isQuestionLike(message) {
    return message.includes('?') || 
           message.startsWith('что') ||
           message.startsWith('как') ||
           message.startsWith('почему') ||
           message.startsWith('зачем') ||
           message.startsWith('когда') ||
           message.startsWith('где') ||
           message.startsWith('можно ли');
  }

  /**
   * Создает промпт для LLM на основе типа сообщения
   */
  createPrompt(message, classification, context = {}) {
    switch (classification.type) {
      case 'chat_response':
        return {
          type: 'chat',
          prompt: `Ответь на вопрос пользователя как опытный помощник по разработке UI/UX. 
                   Дай краткий, но полезный ответ. Не создавай код или артефакты.
                   
                   Вопрос: ${message}`
        };

      case 'step_by_step_plan':
        return {
          type: 'planning',
          prompt: `Создай подробный план выполнения запроса пользователя по шагам.
                   Каждый шаг должен быть отдельной задачей, которую можно выполнить независимо.
                   
                   Запрос: ${message}
                   
                   Верни ответ в формате JSON:
                   {
                     "plan_title": "Название плана",
                     "steps": [
                       {
                         "id": 1,
                         "title": "Название шага",
                         "description": "Описание что нужно сделать",
                         "type": "artifact|analysis|research",
                         "estimated_time": "время выполнения"
                       }
                     ]
                   }`
        };

      case 'artifact_creation':
        return {
          type: 'artifact',
          prompt: message
        };

      case 'artifact_edit':
        return {
          type: 'artifact_edit',
          prompt: message,
          element: context.editingElement
        };

      default:
        return {
          type: 'artifact',
          prompt: message
        };
    }
  }
}

export default MessageRouter;