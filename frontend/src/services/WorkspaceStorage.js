/**
 * WorkspaceStorage - сервис для сохранения и загрузки рабочего пространства
 * Автоматически сохраняет элементы канваса, историю чата и активные планы
 */

export class WorkspaceStorage {
  constructor() {
    this.STORAGE_KEYS = {
      CANVAS_ELEMENTS: 'aidesigner_canvas_elements',
      CHAT_MESSAGES: 'aidesigner_chat_messages', 
      ACTIVE_PLAN: 'aidesigner_active_plan',
      WORKSPACE_META: 'aidesigner_workspace_meta'
    };
  }

  /**
   * Сохраняет элементы канваса
   */
  saveCanvasElements(elements) {
    try {
      const data = {
        elements: elements,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.STORAGE_KEYS.CANVAS_ELEMENTS, JSON.stringify(data));
      console.log('💾 Элементы канваса сохранены:', elements.length);
    } catch (error) {
      console.error('❌ Ошибка сохранения элементов канваса:', error);
    }
  }

  /**
   * Загружает элементы канваса
   */
  loadCanvasElements() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.CANVAS_ELEMENTS);
      if (!saved) return null;

      const data = JSON.parse(saved);
      console.log('📂 Элементы канваса загружены:', data.elements?.length || 0);
      return data.elements || [];
    } catch (error) {
      console.error('❌ Ошибка загрузки элементов канваса:', error);
      return null;
    }
  }

  /**
   * Сохраняет историю чата (только последние 50 сообщений)
   */
  saveChatMessages(messages) {
    try {
      // Сохраняем только последние 50 сообщений для экономии места
      const recentMessages = messages.slice(-50);
      
      const data = {
        messages: recentMessages,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(data));
      console.log('💾 История чата сохранена:', recentMessages.length, 'сообщений');
    } catch (error) {
      console.error('❌ Ошибка сохранения истории чата:', error);
    }
  }

  /**
   * Загружает историю чата
   */
  loadChatMessages() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.CHAT_MESSAGES);
      if (!saved) return null;

      const data = JSON.parse(saved);
      console.log('📂 История чата загружена:', data.messages?.length || 0, 'сообщений');
      return data.messages || [];
    } catch (error) {
      console.error('❌ Ошибка загрузки истории чата:', error);
      return null;
    }
  }

  /**
   * Сохраняет активный план
   */
  saveActivePlan(plan) {
    try {
      if (!plan) {
        localStorage.removeItem(this.STORAGE_KEYS.ACTIVE_PLAN);
        console.log('💾 Активный план удален из хранилища');
        return;
      }

      const data = {
        plan: plan,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(data));
      console.log('💾 Активный план сохранен:', plan.plan_title);
    } catch (error) {
      console.error('❌ Ошибка сохранения активного плана:', error);
    }
  }

  /**
   * Загружает активный план
   */
  loadActivePlan() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_PLAN);
      if (!saved) return null;

      const data = JSON.parse(saved);
      console.log('📂 Активный план загружен:', data.plan?.plan_title || 'Без названия');
      return data.plan;
    } catch (error) {
      console.error('❌ Ошибка загрузки активного плана:', error);
      return null;
    }
  }

  /**
   * Сохраняет метаданные рабочего пространства
   */
  saveWorkspaceMeta(meta) {
    try {
      const data = {
        ...meta,
        lastSaved: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.STORAGE_KEYS.WORKSPACE_META, JSON.stringify(data));
      console.log('💾 Метаданные рабочего пространства сохранены');
    } catch (error) {
      console.error('❌ Ошибка сохранения метаданных:', error);
    }
  }

  /**
   * Загружает метаданные рабочего пространства
   */
  loadWorkspaceMeta() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.WORKSPACE_META);
      if (!saved) return null;

      const data = JSON.parse(saved);
      console.log('📂 Метаданные рабочего пространства загружены');
      return data;
    } catch (error) {
      console.error('❌ Ошибка загрузки метаданных:', error);
      return null;
    }
  }

  /**
   * Сохраняет всё рабочее пространство целиком
   */
  saveWorkspace(workspace) {
    try {
      this.saveCanvasElements(workspace.canvasElements || []);
      this.saveChatMessages(workspace.chatMessages || []);
      this.saveActivePlan(workspace.activePlan);
      this.saveWorkspaceMeta({
        selectedElementId: workspace.selectedElement?.id,
        editingElementId: workspace.editingElement?.id,
        isExecutingPlan: workspace.isExecutingPlan || false
      });
      
      console.log('💾 Рабочее пространство полностью сохранено');
      return true;
    } catch (error) {
      console.error('❌ Ошибка сохранения рабочего пространства:', error);
      return false;
    }
  }

  /**
   * Загружает всё рабочее пространство
   */
  loadWorkspace() {
    try {
      const workspace = {
        canvasElements: this.loadCanvasElements(),
        chatMessages: this.loadChatMessages(),
        activePlan: this.loadActivePlan(),
        meta: this.loadWorkspaceMeta()
      };

      console.log('📂 Рабочее пространство загружено:', {
        elements: workspace.canvasElements?.length || 0,
        messages: workspace.chatMessages?.length || 0,
        hasPlan: !!workspace.activePlan,
        hasMeta: !!workspace.meta
      });

      return workspace;
    } catch (error) {
      console.error('❌ Ошибка загрузки рабочего пространства:', error);
      return null;
    }
  }

  /**
   * Очищает всё хранилище
   */
  clearWorkspace() {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('🗑️ Рабочее пространство очищено');
      return true;
    } catch (error) {
      console.error('❌ Ошибка очистки рабочего пространства:', error);
      return false;
    }
  }

  /**
   * Получает размер данных в localStorage (в KB)
   */
  getStorageSize() {
    try {
      let totalSize = 0;
      const sizes = {};

      Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
        const data = localStorage.getItem(key);
        const size = data ? new Blob([data]).size : 0;
        sizes[name] = Math.round(size / 1024 * 100) / 100; // KB с округлением
        totalSize += size;
      });

      return {
        total: Math.round(totalSize / 1024 * 100) / 100, // KB
        breakdown: sizes
      };
    } catch (error) {
      console.error('❌ Ошибка получения размера хранилища:', error);
      return { total: 0, breakdown: {} };
    }
  }

  /**
   * Проверяет, есть ли сохраненные данные
   */
  hasStoredData() {
    return Object.values(this.STORAGE_KEYS).some(key => 
      localStorage.getItem(key) !== null
    );
  }
}

export default WorkspaceStorage;