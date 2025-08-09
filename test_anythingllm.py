#!/usr/bin/env python3

from anythingllm_adapter import AnythingLLMAdapter

def test_anythingllm():
    print("🧪 Тестирую AnythingLLM...")
    
    # Создаем адаптер
    adapter = AnythingLLMAdapter(
        base_url="http://localhost:3001",
        api_key="M9RBFZM-MQR4B6A-G8YRM00-BH5RNP4"
    )
    
    # Проверяем здоровье
    print("\n1. Проверка здоровья...")
    health = adapter.health_check()
    print(f"Health: {health}")
    
    if not health['success']:
        print("❌ AnythingLLM недоступен!")
        return
    
    # Получаем список workspace
    print("\n2. Получение workspace...")
    workspaces = adapter.get_workspaces()
    print(f"Workspaces: {workspaces}")
    
    if workspaces['success']:
        workspace_list = workspaces.get('workspaces', [])
        print(f"📚 Доступные workspace: {len(workspaces.get('workspaces', []))}")
        
        for ws in workspace_list:
            print(f"  - {ws.get('name', 'Unknown')} (slug: {ws.get('slug', 'unknown')})")
    
    # Тестируем чат
    print("\n3. Тестируем чат...")
    result = adapter.chat_with_workspace("Создай страницу с фоном и формой поиска в стиле Material Design")
    print(f"Chat result: {result}")

if __name__ == "__main__":
    test_anythingllm()
