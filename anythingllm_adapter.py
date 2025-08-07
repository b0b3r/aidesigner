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
        self.workspace_slug = "MyWorkspace"  # Slug рабочего пространства
        
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
    
    # Добавляем оптимизированный промпт для использования готовых классов
    formatted_message = f"""Создай UI компонент используя готовые CSS классы.

ВАЖНО: Используй готовые классы дизайн-систем вместо полного CSS кода!

Доступные системы:
- Material Design: mdc-button, mdc-card, mdc-text-field
- Bootstrap: btn, card, form-control  
- Ant Design: ant-btn, ant-card, ant-input

Примеры:
- Кнопка: <button class="mdc-button mdc-button--filled">Текст</button>
- Карточка: <div class="card">Содержимое</div>
- Форма: <input class="form-control" type="text">

ОБЯЗАТЕЛЬНО используй формат:
<VISUAL>
HTML с готовыми классами
</VISUAL>

<SIZE>ширина</SIZE>

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