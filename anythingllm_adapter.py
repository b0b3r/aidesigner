"""
Адаптер для интеграции с AnythingLLM API
Заменяет прямые вызовы DeepSeek API на AnythingLLM с RAG
"""

import requests
import json
import logging
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class AnythingLLMAdapter:
    def __init__(self, base_url: str = "http://localhost:3001", api_key: Optional[str] = None):
        """
        Инициализация адаптера AnythingLLM
        
        Args:
            base_url: Базовый URL AnythingLLM сервера
            api_key: API ключ для аутентификации (если требуется)
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.workspace_slug = "myworkspace"  # Исправленный slug рабочего пространства
        
        # Заголовки для запросов
        self.headers = {
            "Content-Type": "application/json"
        }
        
        if self.api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"
    
    def chat_with_workspace(self, message: str, mode: str = "chat", thread_slug: Optional[str] = None) -> Dict[str, Any]:
        """
        Отправка сообщения в workspace для чата с RAG
        
        Args:
            message: Сообщение пользователя
            mode: Режим чата (chat, query)
            thread_slug: Идентификатор потока для контекста
            
        Returns:
            Ответ от AnythingLLM API
        """
        url = f"{self.base_url}/api/v1/workspace/{self.workspace_slug}/chat"
        
        payload = {
            "message": message,
            "mode": mode
        }
        
        if thread_slug:
            payload["thread_slug"] = thread_slug
        
        try:
            import time
            start_time = time.time()
            
            logger.debug(f"🌐 Отправляю запрос к AnythingLLM: {url}")
            logger.debug(f"📝 Payload: {json.dumps(payload, ensure_ascii=False)}")
            
            print(f"🤖 Отправляю запрос к AnythingLLM (timeout=120s)...")
            response = requests.post(url, headers=self.headers, json=payload, timeout=120)
            response.raise_for_status()
            
            elapsed_time = time.time() - start_time
            print(f"⏱️ AnythingLLM ответил за {elapsed_time:.2f}s")
            
            data = response.json()
            logger.debug(f"✅ Получен ответ от AnythingLLM")
            
            return {
                "success": True,
                "response": data.get("textResponse", ""),
                "sources": data.get("sources", []),
                "thread_slug": data.get("threadSlug"),
                "raw_data": data
            }
            
        except requests.exceptions.Timeout as e:
            print(f"⏰ Таймаут AnythingLLM ({e}) - возможно система перегружена")
            logger.error(f"❌ Таймаут AnythingLLM: {e}")
            return {
                "success": False,
                "error": f"Timeout: {e}",
                "response": ""
            }
        except requests.exceptions.RequestException as e:
            print(f"❌ Ошибка запроса к AnythingLLM: {e}")
            logger.error(f"❌ Ошибка запроса к AnythingLLM: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": ""
            }
        except json.JSONDecodeError as e:
            logger.error(f"❌ Ошибка парсинга JSON: {e}")
            return {
                "success": False,
                "error": "Invalid JSON response",
                "response": ""
            }
    
    def create_new_thread(self, thread_slug: Optional[str] = None) -> Dict[str, Any]:
        """
        Создание нового потока беседы
        
        Args:
            thread_slug: Пользовательский slug для потока
            
        Returns:
            Информация о созданном потоке
        """
        url = f"{self.base_url}/api/v1/workspace/{self.workspace_slug}/thread/new"
        
        payload = {}
        if thread_slug:
            payload["slug"] = thread_slug
        
        try:
            response = requests.post(url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            return {
                "success": True,
                "thread_slug": data.get("thread", {}).get("slug"),
                "raw_data": data
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Ошибка создания потока: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def delete_thread(self, thread_slug: str) -> Dict[str, Any]:
        """
        Удаление потока беседы
        
        Args:
            thread_slug: Идентификатор потока для удаления
            
        Returns:
            Результат операции удаления
        """
        url = f"{self.base_url}/api/v1/workspace/{self.workspace_slug}/thread/{thread_slug}"
        
        try:
            response = requests.delete(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            
            return {
                "success": True,
                "message": f"Thread {thread_slug} deleted successfully"
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Ошибка удаления потока {thread_slug}: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def health_check(self) -> Dict[str, Any]:
        """
        Проверка доступности AnythingLLM сервера
        
        Returns:
            Статус сервера
        """
        url = f"{self.base_url}/api/system/check"
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            return {
                "success": True,
                "status": "AnythingLLM доступен",
                "url": self.base_url
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "status": "AnythingLLM недоступен",
                "error": str(e),
                "url": self.base_url
            }

    def get_workspaces(self) -> Dict[str, Any]:
        """
        Получение списка доступных workspace
        
        Returns:
            Список workspace
        """
        url = f"{self.base_url}/api/v1/workspaces"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return {
                "success": True,
                "workspaces": data.get("workspaces", []),
                "raw_data": data
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": str(e),
                "workspaces": []
            }

def convert_deepseek_to_anythingllm_format(messages: List[Dict[str, str]], adapter: AnythingLLMAdapter) -> Dict[str, Any]:
    """
    Конвертирует формат сообщений DeepSeek в формат AnythingLLM
    
    Args:
        messages: Список сообщений в формате DeepSeek
        adapter: Экземпляр AnythingLLMAdapter
        
    Returns:
        Ответ в формате, совместимом с текущим API
    """
    # Получаем последнее сообщение пользователя
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            user_message = msg.get("content", "")
            break
    
    if not user_message:
        return {
            "success": False,
            "error": "No user message found"
        }
    
    # Простой промпт, который полагается на RAG для получения информации о классах
    formatted_message = f"""Создай современный UI компонент используя готовые CSS классы из дизайн-систем.

ВАЖНЫЕ ПРАВИЛА:
1. Используй готовые CSS классы для базовых стилей (mdc-button, mdc-card, ant-btn, etc.)
2. Используй inline-стили ТОЛЬКО для:
   - Позиционирования и layout (display: flex, margin, padding)
   - Размеров контейнеров (width, height)
   - Выравнивания (text-align, justify-content)
   - Отступов между элементами (gap, margin)
   - Цвета фона страницы (background-color)
   - Шрифтов (font-family, font-size)
3. Оборачивай HTML в <VISUAL>...</VISUAL>
4. Указывай ширину в <SIZE>ширина</SIZE>
5. Создавай адаптивные и современные макеты
6. Используй семантическую разметку HTML5
7. ПЕРЕДАВАЙ НАСТРОЙКИ BODY НА ПЕРВЫЙ ФРЕЙМ:
   - Добавляй style="background-color: #f5f5f5; font-family: 'Roboto', sans-serif;" к основному контейнеру
   - Это заменяет настройки body для фрейма
8. ИСПОЛЬЗУЙ ПРАВИЛЬНЫЕ INPUT ПОЛЯ:
   - Для Material Design: mdc-text-field, mdc-text-field--outlined
   - Для Ant Design: ant-input, ant-input-search
   - Для Bootstrap: form-control
   - НЕ упрощай input поля - они должны работать с подсказками

ПРИМЕР ПРАВИЛЬНОГО ИСПОЛЬЗОВАНИЯ:
```html
<div style="background-color: #f5f5f5; font-family: 'Roboto', sans-serif; padding: 24px;">
  <div style="display: flex; gap: 16px; align-items: center;">
    <div class="mdc-text-field mdc-text-field--outlined">
      <input type="text" class="mdc-text-field__input" placeholder="Поиск...">
      <div class="mdc-notched-outline">
        <div class="mdc-notched-outline__leading"></div>
        <div class="mdc-notched-outline__notch"></div>
        <div class="mdc-notched-outline__trailing"></div>
      </div>
    </div>
    <button class="mdc-button mdc-button--raised">Поиск</button>
  </div>
</div>
```

ПРОСТЫЕ КОМПОНЕНТЫ (предпочтительно):
- Кнопки: mdc-button, mdc-button--raised, mdc-button--outlined
- Карточки: mdc-card
- Чипы: mdc-chip
- Иконки: material-icons
- Input поля: mdc-text-field, ant-input, form-control

Запрос: {user_message}"""
    
    # Отправляем запрос в AnythingLLM
    result = adapter.chat_with_workspace(formatted_message)
    
    if result["success"]:
        # Отладочная информация
        print(f"🔍 AnythingLLM ответ: {result['response'][:200]}...")
        print(f"🔍 Содержит <VISUAL>: {'<VISUAL>' in result['response']}")
        print(f"🔍 Содержит <SIZE>: {'<SIZE>' in result['response']}")
        
        # Форматируем ответ в стиле DeepSeek API
        return {
            "success": True,
            "response": result["response"],
            "sources": result.get("sources", []),
            "thread_slug": result.get("thread_slug")
        }
    else:
        return result

if __name__ == "__main__":
    # Тестирование адаптера
    logging.basicConfig(level=logging.DEBUG)
    
    adapter = AnythingLLMAdapter(api_key="M9RBFZM-MQR4B6A-G8YRM00-BH5RNP4")
    
    # Проверка здоровья
    health = adapter.health_check()
    print(f"Health check: {health}")
    
    if health["success"]:
        # Тест чата
        test_message = "Расскажи про кнопки Material Design"
        result = adapter.chat_with_workspace(test_message)
        print(f"Chat result: {result}")