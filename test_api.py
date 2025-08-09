import requests
import json

def test_api():
    url = "http://localhost:8002/api/chat"
    data = {
        "messages": [
            {
                "role": "user", 
                "content": "Создай кнопку в стиле Material Design"
            }
        ]
    }
    
    try:
        print("🧪 Тестирую API...")
        response = requests.post(url, json=data, timeout=30)
        print(f"📡 Статус: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Успешно!")
            print(f"📝 Текст: {result.get('text_content', '')[:100]}...")
            print(f"🎨 Визуал: {'Да' if result.get('visual_content') else 'Нет'}")
            if result.get('visual_content'):
                print(f"📏 Размер: {result.get('width', 'N/A')}px")
                print(f"🎨 HTML: {result.get('visual_content', '')[:200]}...")
        else:
            print(f"❌ Ошибка: {response.text}")
            
    except Exception as e:
        print(f"💥 Ошибка: {e}")

if __name__ == "__main__":
    test_api()
