import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Server Configuration
SERVER_CONFIG = {
    "backend": {
        "host": "127.0.0.1",
        "port": 8002,
        "reload": True,
        "cors_origins": ["http://localhost:3000"]
    },
    "frontend": {
        "host": "localhost",
        "port": 3000,
        "proxy": "http://127.0.0.1:8002"
    }
}

# DeepSeek API Configuration
DEEPSEEK_CONFIG = {
    "api_key": "sk-cfbe0536ffd2433d82796441ea9cdbe3",
    "api_url": "https://api.deepseek.com/v1/chat/completions",
    "model": "deepseek-chat",
    "temperature": 0.7,
    "max_tokens": 2000,
    "timeout": 60
}

# AnythingLLM Configuration
ANYTHINGLLM_CONFIG = {
    "api_key": os.getenv("ANYTHINGLLM_API_KEY", "M9RBFZM-MQR4B6A-G8YRM00-BH5RNP4"),
    "base_url": "http://localhost:3001",
    "workspace_slug": "myworkspace",
    "enabled": os.getenv("USE_ANYTHINGLLM", "true").lower() == "true"
}

# LLM System Prompts
LLM_PROMPTS = {
    "chat": """Ты эксперт по веб-дизайну и UX. Твоя задача - помочь создать современный дизайн веб-страниц и интерфейсов.

ВАЖНЫЕ ПРАВИЛА:
1. Текстовые ответы (описания, планы, объяснения) пиши обычным текстом
2. Визуальные элементы (HTML/CSS код) ОБЯЗАТЕЛЬНО оборачивай в теги <VISUAL>...</VISUAL>
3. Создавай современный, красивый дизайн с использованием CSS
4. Используй семантическую разметку HTML5
5. Добавляй интерактивность с CSS hover эффектами и анимациями
6. Используй современные цвета, градиенты, тени
7. Делай адаптивный дизайн

Пример ответа:
Создам для вас современную карточку товара с анимацией при наведении.

<VISUAL>
<div style="
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
" onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'">
  <div style="
    height: 200px; 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  ">
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 48px;
      opacity: 0.3;
    ">📱</div>
  </div>
  <div style="padding: 24px;">
    <h3 style="
      margin: 0 0 12px 0; 
      color: #1a202c; 
      font-size: 20px; 
      font-weight: 600;
      line-height: 1.2;
    ">Современный смартфон</h3>
    <p style="
      color: #718096; 
      margin: 0 0 20px 0; 
      font-size: 14px;
      line-height: 1.5;
    ">Инновационный дизайн и передовые технологии</p>
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <div style="
        font-size: 24px; 
        font-weight: 700; 
        color: #2d3748;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      ">₽49,999</div>
      <button style="
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Купить</button>
    </div>
  </div>
</div>
</VISUAL>

Всегда четко разделяй текстовые описания и визуальный код.""",

    "plan": """Create a detailed plan for web page development.
Break down the process into logical steps:
1. requirements analysis
2. layout choice (header, main, footer)
3. modular grid definition
4. wireframe creation
5. block detailing

For each step specify:
- Step name
- Action description
- Expected result

Answer in JSON format:
{
  "plan_id": "plan_1",
  "title": "Web Design Plan",
  "steps": [
    {
      "step_id": "step_1",
      "title": "Requirements Analysis",
      "description": "Define goals and requirements for design"
    }
  ]
}""",

    "step": """Generate content for step: {step_title}
Step description: {step_description}

Create HTML/CSS code for this step. If you need to show a visual element,
wrap it in <VISUAL>...</VISUAL> tags."""
}

# Validation functions
def validate_config():
    """Validate all configuration settings"""
    errors = []
    
    # Check DeepSeek API key
    if not DEEPSEEK_CONFIG["api_key"]:
        errors.append("DeepSeek API key is not configured")
    elif not DEEPSEEK_CONFIG["api_key"].startswith("sk-"):
        errors.append("DeepSeek API key format is invalid")
    
    # Check server ports
    if SERVER_CONFIG["backend"]["port"] == SERVER_CONFIG["frontend"]["port"]:
        errors.append("Backend and frontend ports cannot be the same")
    
    # Check proxy configuration
    if SERVER_CONFIG["frontend"]["proxy"] != f"http://{SERVER_CONFIG['backend']['host']}:{SERVER_CONFIG['backend']['port']}":
        errors.append("Frontend proxy does not match backend configuration")
    
    return errors

def get_backend_url():
    """Get backend URL"""
    return f"http://{SERVER_CONFIG['backend']['host']}:{SERVER_CONFIG['backend']['port']}"

def get_frontend_url():
    """Get frontend URL"""
    return f"http://{SERVER_CONFIG['frontend']['host']}:{SERVER_CONFIG['frontend']['port']}" 
