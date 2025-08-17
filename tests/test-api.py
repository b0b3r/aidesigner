#!/usr/bin/env python3
"""
Тестирование API AnythingLLM
"""

import requests
import json

def test_api():
    base_url = "http://localhost:3001"
    
    try:
        # Проверяем workspaces
        response = requests.get(f"{base_url}/api/workspaces")
        print(f"Workspaces response status: {response.status_code}")
        print(f"Workspaces response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Workspaces data type: {type(data)}")
            print(f"Workspaces data: {json.dumps(data, indent=2)}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_api()