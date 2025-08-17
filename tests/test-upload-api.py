#!/usr/bin/env python3
"""
Тестирование API загрузки документов в AnythingLLM
"""

import requests
import json

def test_upload_apis():
    base_url = "http://localhost:3001"
    workspace_slug = "myworkspace"
    
    # Тестируем разные API endpoints для загрузки
    endpoints_to_test = [
        f"/api/workspace/{workspace_slug}/upload",
        f"/api/workspace/{workspace_slug}/upload-link", 
        f"/api/workspace/{workspace_slug}/documents",
        f"/api/document/upload",
        f"/api/documents/upload"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            # Пробуем GET запрос для проверки существования
            response = requests.get(f"{base_url}{endpoint}")
            print(f"GET {endpoint}: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"GET {endpoint}: Error - {str(e)}")
    
    # Тестируем загрузку простого текста
    test_content = """# Test Document

This is a test document for AnythingLLM RAG system.

## Features
- Test feature 1
- Test feature 2
"""
    
    # Пробуем разные форматы данных
    test_data_formats = [
        {
            "textContent": test_content,
            "metadata": {
                "title": "test.md",
                "source": "upload:test.md"
            }
        },
        {
            "content": test_content,
            "filename": "test.md",
            "type": "text/markdown"
        },
        {
            "document": {
                "content": test_content,
                "name": "test.md",
                "type": "markdown"
            }
        }
    ]
    
    for i, data in enumerate(test_data_formats):
        try:
            response = requests.post(
                f"{base_url}/api/workspace/{workspace_slug}/upload-link",
                json=data,
                headers={'Content-Type': 'application/json'}
            )
            print(f"POST format {i+1}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"POST format {i+1}: Error - {str(e)}")

if __name__ == "__main__":
    test_upload_apis()