import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import requests
import json
import re

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from config import SERVER_CONFIG, DEEPSEEK_CONFIG, ANYTHINGLLM_CONFIG, LLM_PROMPTS, validate_config
    
    # Импорт AnythingLLM адаптера с обработкой ошибок
    anythingllm_adapter = None
    AnythingLLMAdapter = None
    convert_deepseek_to_anythingllm_format = None
    
    try:
        # Добавляем корневую папку проекта в путь
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        sys.path.insert(0, project_root)
        from anythingllm_adapter import AnythingLLMAdapter, convert_deepseek_to_anythingllm_format
        print("✅ AnythingLLM адаптер загружен")
    except ImportError as e:
        print(f"⚠️ AnythingLLM адаптер недоступен: {e}")
        print("📝 Будет использоваться только DeepSeek API")
    print("✅ Config imported successfully")
    print(f"🔧 Backend will run on: {SERVER_CONFIG['backend']['host']}:{SERVER_CONFIG['backend']['port']}")
    print(f"🔑 DeepSeek API configured: {'Yes' if DEEPSEEK_CONFIG['api_key'] else 'No'}")
    print(f"🤖 AnythingLLM enabled: {'Yes' if ANYTHINGLLM_CONFIG['enabled'] else 'No'}")
    
    # Инициализация AnythingLLM адаптера
    if ANYTHINGLLM_CONFIG['enabled'] and AnythingLLMAdapter:
        anythingllm_adapter = AnythingLLMAdapter(
            base_url=ANYTHINGLLM_CONFIG['base_url'],
            api_key=ANYTHINGLLM_CONFIG['api_key']
        )
        health_check = anythingllm_adapter.health_check()
        print(f"🔗 AnythingLLM connection: {'✅ OK' if health_check['success'] else '❌ FAILED'}")
    else:
        print("📝 Using direct DeepSeek API")
except ImportError as e:
    print(f"❌ Error importing config: {e}")
    print(f"📁 Current directory: {os.getcwd()}")
    raise

app = FastAPI(title="AI Designer Backend", version="1.0.0")

# Настройка CORS с явными origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "deepseek-chat"

class DesignStep(BaseModel):
    step_id: str
    title: str
    description: str
    status: str = "pending"  # pending, confirmed, completed
    visual_content: Optional[str] = None
    text_content: Optional[str] = None

class DesignPlan(BaseModel):
    plan_id: str
    title: str
    steps: List[DesignStep]
    current_step: int = 0

# Конфигурация берется из config.py
# Для обратной совместимости оставляем старые переменные
DEEPSEEK_API_KEY = DEEPSEEK_CONFIG["api_key"]
DEEPSEEK_API_URL = DEEPSEEK_CONFIG["api_url"]

# Хранилище данных (в реальном проекте использовать базу данных)
design_plans: Dict[str, DesignPlan] = {}

def call_llm_api(messages: List[Dict[str, str]], model: str = "deepseek-chat") -> str:
    """Вызов LLM API (AnythingLLM или DeepSeek)"""
    
    # Если AnythingLLM включен, используем его
    if ANYTHINGLLM_CONFIG['enabled'] and anythingllm_adapter and convert_deepseek_to_anythingllm_format:
        print("🤖 Используем AnythingLLM с RAG")
        try:
            result = convert_deepseek_to_anythingllm_format(messages, anythingllm_adapter)
            
            if result["success"]:
                print(f"✅ Получен ответ от AnythingLLM")
                if result.get("sources"):
                    print(f"📚 Использованы источники: {len(result['sources'])}")
                return result["response"]
            else:
                print(f"❌ Ошибка AnythingLLM: {result.get('error', 'Unknown error')}")
                # Fallback на DeepSeek
                print("🔄 Переключаемся на DeepSeek API")
        except Exception as e:
            print(f"❌ Исключение AnythingLLM: {e}")
            print("🔄 Переключаемся на DeepSeek API")
    
    # Используем DeepSeek API (по умолчанию или fallback)
    print("🌐 Используем DeepSeek API")
    if not DEEPSEEK_API_KEY:
        raise HTTPException(status_code=500, detail="LLM API not configured")
    
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-chat", 
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    print(f"🌐 Отправляем запрос к {DEEPSEEK_API_URL}")
    
    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=data, timeout=60)
        print(f"📡 Ответ DeepSeek API: {response.status_code}")
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        print(f"💥 Ошибка API: {e}")
        raise HTTPException(status_code=500, detail=f"LLM API error: {str(e)}")

def parse_llm_response(response: str) -> Dict[str, Any]:
    """Парсинг ответа LLM для разделения текста и визуального контента"""
    print(f"🔍 Парсим ответ LLM: {response[:100]}...")
    
    # Ищем все блоки <VISUAL>...</VISUAL>
    visual_pattern = r'<VISUAL>(.*?)</VISUAL>'
    visual_matches = re.findall(visual_pattern, response, re.DOTALL)
    
    # Ищем размеры <SIZE>ширина</SIZE> (новый формат) или <SIZE>ширина,высота</SIZE> (старый)
    size_pattern_new = r'<SIZE>(\d+)(?:px)?</SIZE>'
    size_pattern_old = r'<SIZE>(\d+)(?:px)?,(\d+)(?:px)?</SIZE>'
    
    size_matches_new = re.findall(size_pattern_new, response)
    size_matches_old = re.findall(size_pattern_old, response)
    
    # Берем первый найденный визуальный блок
    visual_content = None
    width = 400  # ширина по умолчанию
    
    if visual_matches:
        visual_content = visual_matches[0].strip()
        print(f"🎨 Найден визуальный контент: {len(visual_content)} символов")
        
        # Если нет SIZE тега, пробуем найти размеры в CSS
        if not size_matches_new and not size_matches_old:
            # Ищем width в CSS стилях
            css_width_pattern = r'width:\s*(\d+)px'
            css_width_matches = re.findall(css_width_pattern, visual_content)
            if css_width_matches:
                width = int(css_width_matches[0])
                print(f"📐 Найдена ширина в CSS: {width}px")
            else:
                print("⚠️ Размеры не найдены, используем ширину по умолчанию: 400px")
    
    # Берем размеры из SIZE тега (приоритет)
    if size_matches_new:
        width = int(size_matches_new[0])
        print(f"📐 Найдена ширина в SIZE: {width}px (высота авто)")
    elif size_matches_old:
        width = int(size_matches_old[0][0])
        print(f"📐 Найдены размеры в SIZE (старый формат): {width}px (высота авто)")
    
    # Удаляем все специальные блоки из текста
    text_content = re.sub(visual_pattern, '', response, flags=re.DOTALL)
    text_content = re.sub(size_pattern_new, '', text_content, flags=re.DOTALL)
    text_content = re.sub(size_pattern_old, '', text_content, flags=re.DOTALL).strip()
    
    return {
        "text_content": text_content,
        "visual_content": visual_content,
        "width": width,
        "height": "auto"  # Высота всегда автоматическая
    }

@app.get("/")
async def root():
    return {"message": "AI Designer API is running"}

@app.post("/api/chat")
async def chat_with_llm(request: ChatRequest):
    """Основной endpoint для чата с LLM"""
    try:
        print("📥 Получен запрос к /api/chat")
        print(f"📝 Количество сообщений: {len(request.messages)}")
        
        # Форматируем сообщения для API
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        last_message = messages[-1]['content'] if messages else ""
        print(f"💬 Последнее сообщение ({len(last_message)} символов): {last_message[:200]}{'...' if len(last_message) > 200 else ''}")
        
        # ТОЛЬКО ПОСЛЕДНЕЕ СООБЩЕНИЕ - БЕЗ ИСТОРИИ
        last_user_message = messages[-1]['content'] if messages else ""
        api_messages = [
            {"role": "system", "content": """Создавай HTML код для веб-элементов. 

ВАЖНО: 
1. HTML код оборачивай в <VISUAL>код</VISUAL>
2. ВСЕГДА указывай ширину в <SIZE>ширина</SIZE> (без высоты)

Ширина по типу контента:
- Кнопки, инпуты: 120-300px 
- Карточки товаров: 300-400px
- Формы логина: 400-500px
- Таблицы, дашборды: 600-800px
- Мобильные страницы: 375px
- Десктопные сайты: 1200px

Высота будет подстраиваться автоматически под содержимое.

Пример ответа:
<VISUAL>
<button>Текст кнопки</button>
</VISUAL>
<SIZE>200</SIZE>"""},
            {"role": "user", "content": last_user_message}
        ]
        
        print(f"🤖 Отправляю запрос к DeepSeek API...")
        print(f"🔑 API Key: {DEEPSEEK_CONFIG['api_key'][:10]}...")
        
        # Вызываем LLM API (AnythingLLM или DeepSeek)
        response = call_llm_api(api_messages, request.model)
        print(f"✅ Получен ответ от DeepSeek")
        print(f"📄 Контент от LLM: {response[:200]}...")
        
        # Парсим ответ
        parsed_response = parse_llm_response(response)
        print(f"✂️ Распарсили - текст: {len(parsed_response['text_content'])} символов, визуал: {'Да' if parsed_response['visual_content'] else 'Нет'}")
        if parsed_response['visual_content']:
            print(f"📏 Размеры артефакта: {parsed_response['width']}x{parsed_response['height']}px")
        
        response_data = {
            "success": True,
            "text_content": parsed_response["text_content"],
            "visual_content": parsed_response["visual_content"],
            "width": parsed_response["width"],
            "height": parsed_response["height"]
        }
        return JSONResponse(
            content=response_data,
            media_type="application/json; charset=utf-8"
        )
        
    except Exception as e:
        print(f"💥 Ошибка в chat_with_llm: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/design/plan")
async def create_design_plan(request: ChatRequest):
    """Создание плана дизайна"""
    try:
        # Специальный промпт для создания плана
        plan_prompt = """Создай детальный план для разработки веб-страницы. 
        Разбей процесс на логические этапы:
        1. Анализ требований
        2. Выбор layout (header, main, footer)
        3. Определение модульной сетки
        4. Создание wireframe
        5. Детализация каждого блока
        
        Для каждого этапа укажи:
        - Название этапа
        - Описание действий
        - Ожидаемый результат
        
        Ответь в формате JSON:
        {
          "title": "Название проекта",
          "steps": [
            {
              "step_id": "step_1",
              "title": "Название этапа",
              "description": "Описание этапа"
            }
          ]
        }"""
        
        messages = [{"role": "system", "content": plan_prompt}]
        messages.extend([{"role": msg.role, "content": msg.content} for msg in request.messages])
        
        response = call_llm_api(messages, request.model)
        
        # Пытаемся парсить JSON из ответа
        try:
            import re
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                plan_data = json.loads(json_match.group())
                plan = DesignPlan(**plan_data)
                design_plans[plan.plan_id] = plan
                return {"success": True, "plan": plan.dict()}
            else:
                raise ValueError("JSON not found in response")
        except (json.JSONDecodeError, ValueError):
            # Если не удалось парсить JSON, создаем базовый план
            plan = DesignPlan(
                plan_id=f"plan_{len(design_plans) + 1}",
                title="Новый проект дизайна",
                steps=[
                    DesignStep(
                        step_id="step_1",
                        title="Анализ требований",
                        description="Определение целей и требований к дизайну"
                    ),
                    DesignStep(
                        step_id="step_2", 
                        title="Создание wireframe",
                        description="Создание базовой структуры страницы"
                    ),
                    DesignStep(
                        step_id="step_3",
                        title="Детализация блоков", 
                        description="Наполнение блоков контентом"
                    )
                ]
            )
            design_plans[plan.plan_id] = plan
            return {"success": True, "plan": plan.dict()}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/design/plans")
async def get_design_plans():
    """Получение всех планов дизайна"""
    return {"plans": [plan.dict() for plan in design_plans.values()]}

@app.get("/api/design/plans/{plan_id}")
async def get_design_plan(plan_id: str):
    """Получение конкретного плана дизайна"""
    if plan_id not in design_plans:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"plan": design_plans[plan_id].dict()}

@app.post("/api/design/plans/{plan_id}/steps/{step_id}/confirm")
async def confirm_design_step(plan_id: str, step_id: str):
    """Подтверждение этапа дизайна"""
    if plan_id not in design_plans:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    plan = design_plans[plan_id]
    for step in plan.steps:
        if step.step_id == step_id:
            step.status = "confirmed"
            return {"success": True, "step": step.dict()}
    
    raise HTTPException(status_code=404, detail="Step not found")

@app.post("/api/design/plans/{plan_id}/steps/{step_id}/generate")
async def generate_step_content(plan_id: str, step_id: str, request: ChatRequest):
    """Генерация содержимого для этапа"""
    if plan_id not in design_plans:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    plan = design_plans[plan_id]
    target_step = None
    
    for step in plan.steps:
        if step.step_id == step_id:
            target_step = step
            break
    
    if not target_step:
        raise HTTPException(status_code=404, detail="Step not found")
    
    try:
        # Генерируем содержимое для этапа
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        step_prompt = f"""Сгенерируй содержимое для этапа: {target_step.title}
        Описание этапа: {target_step.description}
        
        Создай HTML/CSS код для этого этапа. Если нужно показать визуальный элемент, 
        оберни его в теги <VISUAL>...</VISUAL>."""
        
        messages.insert(0, {"role": "system", "content": step_prompt})
        
        response = call_llm_api(messages)
        parsed_response = parse_llm_response(response)
        
        # Обновляем этап
        target_step.text_content = parsed_response["text_content"]
        target_step.visual_content = parsed_response["visual_content"]
        target_step.status = "completed"
        
        response_data = {
            "success": True,
            "step": target_step.dict(),
            "text_content": parsed_response["text_content"],
            "visual_content": parsed_response["visual_content"]
        }
        return JSONResponse(
            content=response_data,
            media_type="application/json; charset=utf-8"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Проверка работоспособности API"""
    return {
        "status": "healthy",
        "message": "AI Designer Backend is running",
        "config": {
            "deepseek_configured": bool(DEEPSEEK_CONFIG["api_key"]),
            "host": SERVER_CONFIG["backend"]["host"],
            "port": SERVER_CONFIG["backend"]["port"]
        }
    }

@app.get("/api/test-llm")
async def test_llm_connection():
    """Тест связи с DeepSeek API"""
    try:
        print("🧪 Тестируем связь с DeepSeek API...")
        
        # Минимальный запрос для проверки
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_CONFIG['api_key']}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": DEEPSEEK_CONFIG["model"],
            "messages": [{"role": "user", "content": "Привет"}],
            "max_tokens": 10,
            "temperature": 0.1
        }
        
        print(f"🌐 Отправляем тестовый запрос к {DEEPSEEK_CONFIG['api_url']}")
        
        import requests
        response = requests.post(
            DEEPSEEK_CONFIG["api_url"], 
            headers=headers, 
            json=data, 
            timeout=15  # Короткий timeout для теста
        )
        
        print(f"📡 Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            return {
                "status": "success",
                "message": "DeepSeek API доступен",
                "response_preview": result.get("choices", [{}])[0].get("message", {}).get("content", "")[:50]
            }
        else:
            return {
                "status": "error",
                "message": f"DeepSeek API вернул статус {response.status_code}", 
                "details": response.text[:200]
            }
            
    except requests.exceptions.Timeout:
        return {
            "status": "timeout",
            "message": "Превышено время ожидания ответа от DeepSeek API (15s)",
            "suggestion": "Проверьте интернет-соединение"
        }
    except requests.exceptions.ConnectionError as e:
        return {
            "status": "connection_error", 
            "message": "Ошибка подключения к DeepSeek API",
            "details": str(e)[:200]
        }
    except Exception as e:
        print(f"💥 Ошибка в test_llm_connection: {e}")
        return {
            "status": "error",
            "message": "Неожиданная ошибка при тесте LLM",
            "details": str(e)[:200]
        }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Designer Backend...")
    print(f"📡 API will be available at: http://{SERVER_CONFIG['backend']['host']}:{SERVER_CONFIG['backend']['port']}")
    print(f"📝 API docs at: http://{SERVER_CONFIG['backend']['host']}:{SERVER_CONFIG['backend']['port']}/docs")
    uvicorn.run(app, host=SERVER_CONFIG["backend"]["host"], port=SERVER_CONFIG["backend"]["port"]) 