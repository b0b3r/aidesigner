"""
Тест AnythingLLM API для диагностики проблем с доступом
"""

import requests
import json

API_KEY = "M9RBFZM-MQR4B6A-G8YRM00-BH5RNP4"
BASE_URL = "http://localhost:3001"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def test_api_key():
    """Проверка валидности API ключа"""
    print("🔑 Тестируем API ключ...")
    
    try:
        # Проверяем системную информацию
        response = requests.get(f"{BASE_URL}/api/system/check", headers=headers, timeout=10)
        print(f"System check: {response.status_code}")
        
        # Проверяем workspaces
        response = requests.get(f"{BASE_URL}/api/workspaces", headers=headers, timeout=10)
        print(f"Workspaces: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            workspaces = data.get('workspaces', [])
            print(f"📁 Найдено workspaces: {len(workspaces)}")
            
            for ws in workspaces:
                print(f"  - {ws.get('name', 'Unknown')} (slug: {ws.get('slug', 'unknown')})")
            
            return workspaces
        else:
            print(f"❌ Ошибка доступа к workspaces: {response.status_code}")
            print(f"Response: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return []

def test_workspace_chat(workspace_slug):
    """Тест чата с workspace"""
    print(f"\n💬 Тестируем чат с workspace: {workspace_slug}")
    
    url = f"{BASE_URL}/api/v1/workspace/{workspace_slug}/chat"
    payload = {
        "message": "Привет! Это тест RAG системы.",
        "mode": "chat"
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"Chat response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Успешный ответ!")
            print(f"📝 Текст: {data.get('textResponse', 'No response')[:200]}...")
            if data.get('sources'):
                print(f"📚 Источников: {len(data['sources'])}")
            return True
        else:
            print(f"❌ Ошибка чата: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка чата: {e}")
        return False

def test_workspace_documents(workspace_slug):
    """Проверка документов в workspace"""
    print(f"\n📄 Проверяем документы в workspace: {workspace_slug}")
    
    url = f"{BASE_URL}/api/workspace/{workspace_slug}/documents"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Documents response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            documents = data.get('documents', [])
            print(f"📄 Найдено документов: {len(documents)}")
            
            for doc in documents[:5]:  # Показываем первые 5
                print(f"  - {doc.get('name', 'Unknown')}")
            
            return len(documents) > 0
        else:
            print(f"❌ Ошибка получения документов: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Диагностика AnythingLLM API\n")
    
    # Тест API ключа и получение workspaces
    workspaces = test_api_key()
    
    if workspaces:
        # Находим MyWorkspace
        target_workspace = None
        for ws in workspaces:
            if ws.get('slug') == 'myworkspace':
                target_workspace = ws
                break
        
        if target_workspace:
            print(f"\n✅ Найден workspace: {target_workspace['name']}")
            
            # Проверяем документы
            has_docs = test_workspace_documents('myworkspace')
            
            if has_docs:
                print("✅ В workspace есть документы")
            else:
                print("⚠️ В workspace нет документов - RAG не будет работать")
            
            # Тестируем чат
            chat_success = test_workspace_chat('myworkspace')
            
            if chat_success:
                print("\n🎉 API работает корректно!")
            else:
                print("\n❌ Проблемы с API чата")
        else:
            print("\n❌ Workspace 'myworkspace' не найден")
    else:
        print("\n❌ Не удалось получить список workspaces")