"""
Полный тест интеграции AI Designer с AnythingLLM
"""

import requests
import json
import time
import sys
import os

# Добавляем путь для импорта
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_anythingllm_direct():
    """Прямой тест AnythingLLM"""
    print("🧪 Тестируем AnythingLLM напрямую...")
    
    headers = {
        "Authorization": "Bearer M9RBFZM-MQR4B6A-G8YRM00-BH5RNP4",
        "Content-Type": "application/json"
    }
    
    payload = {
        "message": "Расскажи про кнопки Material Design",
        "mode": "chat"
    }
    
    try:
        response = requests.post(
            "http://localhost:3001/api/v1/workspace/myworkspace/chat",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Успех! Ответ: {data.get('textResponse', 'No response')[:200]}...")
            if data.get('sources'):
                print(f"📚 Источников RAG: {len(data['sources'])}")
            return True
        else:
            print(f"❌ Ошибка: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def test_backend_api():
    """Тест backend API"""
    print("\n🧪 Тестируем Backend API...")
    
    # Проверяем health
    try:
        response = requests.get("http://localhost:8002/api/health", timeout=10)
        print(f"Health check: {response.status_code}")
        
        if response.status_code != 200:
            print("❌ Backend недоступен")
            return False
            
    except Exception as e:
        print(f"❌ Backend недоступен: {e}")
        return False
    
    # Тест чата
    payload = {
        "messages": [
            {"role": "user", "content": "Создай кнопку Material Design"}
        ]
    }
    
    try:
        response = requests.post(
            "http://localhost:8002/api/chat",
            json=payload,
            timeout=30
        )
        
        print(f"Chat API status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend отвечает!")
            print(f"Text: {data.get('text_content', 'No text')[:100]}...")
            print(f"Visual: {'Yes' if data.get('visual_content') else 'No'}")
            return True
        else:
            print(f"❌ Ошибка backend: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка backend: {e}")
        return False

def check_services():
    """Проверка всех сервисов"""
    print("🔍 Проверяем статус сервисов...\n")
    
    services = [
        ("AnythingLLM", "http://localhost:3001/api/system/check"),
        ("Backend", "http://localhost:8002/api/health"),
        ("Frontend", "http://localhost:3000")
    ]
    
    for name, url in services:
        try:
            response = requests.get(url, timeout=5)
            status = "✅ Работает" if response.status_code == 200 else f"⚠️ {response.status_code}"
        except Exception:
            status = "❌ Недоступен"
        
        print(f"{name}: {status}")
    
    print()

def main():
    print("🚀 Полный тест интеграции AI Designer + AnythingLLM\n")
    
    # 1. Проверка сервисов
    check_services()
    
    # 2. Тест AnythingLLM
    anythingllm_works = test_anythingllm_direct()
    
    # 3. Тест Backend
    backend_works = test_backend_api()
    
    # 4. Итоговый отчет
    print("\n" + "="*50)
    print("📊 ИТОГОВЫЙ ОТЧЕТ")
    print("="*50)
    
    print(f"AnythingLLM API: {'✅ Работает' if anythingllm_works else '❌ Проблемы'}")
    print(f"Backend API: {'✅ Работает' if backend_works else '❌ Проблемы'}")
    
    if anythingllm_works and backend_works:
        print("\n🎉 ВСЕ РАБОТАЕТ! Система готова к использованию!")
        print("\n📝 Рекомендации:")
        print("1. Откройте http://localhost:3000")
        print("2. Попробуйте: 'Создай кнопку Material Design'")
        print("3. Система должна использовать RAG из AnythingLLM")
        
    elif backend_works and not anythingllm_works:
        print("\n⚠️ AnythingLLM недоступен, но система работает с DeepSeek fallback")
        print("1. Проверьте API ключ AnythingLLM")
        print("2. Убедитесь что документы загружены в workspace")
        
    else:
        print("\n❌ Есть проблемы с системой")
        print("1. Проверьте что все сервисы запущены")
        print("2. Проверьте конфигурацию")

if __name__ == "__main__":
    main()