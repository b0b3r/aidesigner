#!/usr/bin/env python3
"""
Автоматический загрузчик данных в AnythingLLM RAG
"""

import requests
import json
import time
import os
from pathlib import Path

class AnythingLLMUploader:
    def __init__(self, base_url="http://localhost:3001"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'AnythingLLM-Uploader/1.0'
        })
        self.workspace_slug = None
        self.api_key = None

    def check_connection(self):
        """Проверяет соединение с AnythingLLM"""
        try:
            response = self.session.get(f"{self.base_url}/api/system/check")
            if response.status_code == 200:
                print("✅ AnythingLLM доступен")
                return True
            else:
                print(f"❌ AnythingLLM недоступен: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Ошибка подключения: {str(e)}")
            return False

    def get_workspaces(self):
        """Получает список рабочих пространств"""
        try:
            response = self.session.get(f"{self.base_url}/api/workspaces")
            if response.status_code == 200:
                data = response.json()
                workspaces = data.get('workspaces', [])
                print(f"📁 Найдено рабочих пространств: {len(workspaces)}")
                return workspaces
            else:
                print(f"❌ Не удалось получить список workspace: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Ошибка получения workspaces: {str(e)}")
            return []

    def create_workspace(self, name="MyWorkspace"):
        """Создает новое рабочее пространство"""
        try:
            data = {
                "name": name,
                "openAiTemp": 0.7,
                "openAiHistory": 20,
                "similarityThreshold": 0.25,
                "topK": 4
            }
            
            response = self.session.post(f"{self.base_url}/api/workspace/new", json=data)
            
            if response.status_code == 200:
                workspace = response.json()
                self.workspace_slug = workspace.get('workspace', {}).get('slug')
                print(f"✅ Workspace создан: {self.workspace_slug}")
                return workspace
            else:
                print(f"❌ Не удалось создать workspace: {response.status_code}")
                print(f"Response: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Ошибка создания workspace: {str(e)}")
            return None

    def upload_document(self, file_path, workspace_slug):
        """Загружает документ в рабочее пространство"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Подготавливаем данные для загрузки
            filename = os.path.basename(file_path)
            
            # Используем API для загрузки текстового контента
            data = {
                "textContent": content,
                "metadata": {
                    "title": filename,
                    "source": f"upload:{filename}",
                    "published": time.strftime('%Y-%m-%d'),
                    "wordCount": len(content.split()),
                    "token_count_estimate": len(content.split()) * 1.3  # Примерная оценка
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/api/workspace/{workspace_slug}/upload-link",
                json=data
            )
            
            if response.status_code == 200:
                print(f"  ✅ Загружен: {filename}")
                return True
            else:
                print(f"  ❌ Ошибка загрузки {filename}: {response.status_code}")
                print(f"  Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"  ❌ Ошибка загрузки {file_path}: {str(e)}")
            return False

    def upload_documents_from_folder(self, folder_path, workspace_slug):
        """Загружает все markdown файлы из папки"""
        folder = Path(folder_path)
        if not folder.exists():
            print(f"❌ Папка не найдена: {folder_path}")
            return False
        
        md_files = list(folder.rglob("*.md"))
        if not md_files:
            print(f"❌ Markdown файлы не найдены в {folder_path}")
            return False
        
        print(f"📄 Найдено файлов для загрузки: {len(md_files)}")
        
        success_count = 0
        for file_path in md_files:
            print(f"📤 Загружаю: {file_path.relative_to(folder)}")
            if self.upload_document(file_path, workspace_slug):
                success_count += 1
            time.sleep(1)  # Пауза между загрузками
        
        print(f"✅ Успешно загружено: {success_count}/{len(md_files)} файлов")
        return success_count > 0

    def setup_workspace_settings(self, workspace_slug):
        """Настраивает параметры рабочего пространства"""
        try:
            # Системный промпт для дизайн-систем
            system_prompt = """Вы - эксперт по UI/UX дизайну и современным дизайн-системам. У вас есть глубокие знания по:

- Material Design 3 (Google)
- Bootstrap 5 
- Ant Design

При ответах на вопросы о UI компонентах:

1. **Ссылайтесь на конкретные компоненты** из загруженных дизайн-систем
2. **Предоставляйте практические примеры** кода и реализации
3. **Учитывайте принципы accessibility** и best practices
4. **Объясняйте различия** между подходами разных дизайн-систем
5. **Предлагайте наиболее подходящие решения** для конкретных задач

Всегда стремитесь к созданию качественных, доступных и современных пользовательских интерфейсов. Если пользователь спрашивает о компоненте, покажите варианты из разных дизайн-систем и объясните, когда какой лучше использовать."""

            settings = {
                "systemPrompt": system_prompt,
                "openAiTemp": 0.7,
                "openAiHistory": 20,
                "similarityThreshold": 0.25,
                "topK": 4
            }
            
            response = self.session.post(
                f"{self.base_url}/api/workspace/{workspace_slug}/update-settings",
                json=settings
            )
            
            if response.status_code == 200:
                print("✅ Настройки workspace обновлены")
                return True
            else:
                print(f"❌ Ошибка обновления настроек: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Ошибка настройки workspace: {str(e)}")
            return False

def main():
    print("🚀 Автоматическая загрузка дизайн-систем в AnythingLLM RAG")
    
    uploader = AnythingLLMUploader()
    
    # Проверяем подключение
    if not uploader.check_connection():
        print("❌ Не удалось подключиться к AnythingLLM")
        print("Убедитесь что:")
        print("1. AnythingLLM запущен на http://localhost:3001")
        print("2. Контейнер работает: docker ps | grep anythingllm")
        return
    
    # Получаем существующие workspace или создаем новый
    workspaces = uploader.get_workspaces()
    
    workspace_slug = None
    if workspaces:
        # Ищем MyWorkspace
        for ws in workspaces:
            if ws.get('name') == 'MyWorkspace':
                workspace_slug = ws.get('slug')
                print(f"✅ Найден MyWorkspace: {workspace_slug}")
                break
    
    if not workspace_slug:
        print("📁 Создаю новый MyWorkspace...")
        workspace = uploader.create_workspace("MyWorkspace")
        if workspace:
            workspace_slug = workspace.get('workspace', {}).get('slug')
        
        if not workspace_slug:
            print("❌ Не удалось создать workspace")
            return
    
    # Настраиваем workspace
    print("⚙️ Настраиваю workspace...")
    uploader.setup_workspace_settings(workspace_slug)
    
    # Загружаем документы
    docs_folder = "design-systems-knowledge"
    if os.path.exists(docs_folder):
        print(f"📤 Загружаю документы из {docs_folder}...")
        success = uploader.upload_documents_from_folder(docs_folder, workspace_slug)
        
        if success:
            print("🎉 Загрузка завершена успешно!")
            print(f"🔗 Откройте AnythingLLM: http://localhost:3001")
            print(f"📁 Workspace: MyWorkspace ({workspace_slug})")
            print("\n🧪 Тестовые вопросы:")
            print("- 'Как использовать кнопки в Material Design?'")
            print("- 'Чем отличаются карточки в Bootstrap от Ant Design?'")
            print("- 'Покажи код формы с валидацией'")
        else:
            print("❌ Загрузка завершилась с ошибками")
    else:
        print(f"❌ Папка с документами не найдена: {docs_folder}")
        print("Сначала запустите: python simple-design-downloader.py")

if __name__ == "__main__":
    main()