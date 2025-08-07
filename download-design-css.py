#!/usr/bin/env python3
"""
Скрипт для скачивания CSS файлов дизайн-систем
Оптимизация RAG - вместо полного кода используем ссылки на готовые стили
"""

import requests
import os
import json
from urllib.parse import urljoin, urlparse

# Конфигурация дизайн-систем
DESIGN_SYSTEMS = {
    "material-design": {
        "name": "Material Design 3",
        "css_urls": [
            "https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css",
            "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        ],
        "classes": {
            "button": {
                "primary": "mdc-button mdc-button--filled",
                "secondary": "mdc-button mdc-button--outlined",
                "text": "mdc-button mdc-button--text"
            },
            "card": {
                "default": "mdc-card",
                "elevated": "mdc-card mdc-card--elevated"
            },
            "text-field": {
                "outlined": "mdc-text-field mdc-text-field--outlined",
                "filled": "mdc-text-field mdc-text-field--filled"
            }
        }
    },
    "bootstrap": {
        "name": "Bootstrap 5",
        "css_urls": [
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        ],
        "classes": {
            "button": {
                "primary": "btn btn-primary",
                "secondary": "btn btn-secondary",
                "success": "btn btn-success",
                "danger": "btn btn-danger"
            },
            "card": {
                "default": "card",
                "border": "card border-primary"
            },
            "form": {
                "control": "form-control",
                "select": "form-select"
            }
        }
    },
    "ant-design": {
        "name": "Ant Design",
        "css_urls": [
            "https://cdn.jsdelivr.net/npm/antd@5.0.0/dist/reset.css"
        ],
        "classes": {
            "button": {
                "primary": "ant-btn ant-btn-primary",
                "default": "ant-btn",
                "dashed": "ant-btn ant-btn-dashed"
            },
            "card": {
                "default": "ant-card",
                "bordered": "ant-card ant-card-bordered"
            },
            "input": {
                "default": "ant-input",
                "search": "ant-input ant-input-search"
            }
        }
    }
}

def download_css_file(url, filename):
    """Скачивает CSS файл"""
    try:
        print(f"📥 Скачиваю {url}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        print(f"✅ Сохранен: {filename}")
        return True
    except Exception as e:
        print(f"❌ Ошибка скачивания {url}: {e}")
        return False

def create_class_reference():
    """Создает справочник классов для RAG"""
    reference = {}
    
    for system_id, system in DESIGN_SYSTEMS.items():
        reference[system_id] = {
            "name": system["name"],
            "classes": system["classes"],
            "usage_examples": {}
        }
        
        # Добавляем примеры использования
        for component, variants in system["classes"].items():
            reference[system_id]["usage_examples"][component] = {}
            for variant, classes in variants.items():
                reference[system_id]["usage_examples"][component][variant] = {
                    "classes": classes,
                    "example": f'<{component} class="{classes}">Текст</{component}>'
                }
    
    return reference

def main():
    """Основная функция"""
    print("🎨 Скачиваю CSS файлы дизайн-систем...")
    
    # Создаем папку если не существует
    css_dir = "design-systems-css"
    os.makedirs(css_dir, exist_ok=True)
    
    # Скачиваем CSS файлы
    downloaded_files = {}
    
    for system_id, system in DESIGN_SYSTEMS.items():
        print(f"\n📦 {system['name']}:")
        system_dir = os.path.join(css_dir, system_id)
        os.makedirs(system_dir, exist_ok=True)
        
        downloaded_files[system_id] = []
        
        for i, url in enumerate(system["css_urls"]):
            filename = f"{system_id}-{i+1}.css"
            filepath = os.path.join(system_dir, filename)
            
            if download_css_file(url, filepath):
                downloaded_files[system_id].append(filepath)
    
    # Создаем справочник классов
    print("\n📚 Создаю справочник классов...")
    reference = create_class_reference()
    
    reference_file = os.path.join(css_dir, "class-reference.json")
    with open(reference_file, 'w', encoding='utf-8') as f:
        json.dump(reference, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Справочник сохранен: {reference_file}")
    
    # Создаем оптимизированный промпт для RAG
    optimized_prompt = """Используй готовые CSS классы вместо полного кода.

Доступные дизайн-системы:
- Material Design 3: mdc-* классы
- Bootstrap 5: btn-*, card, form-* классы  
- Ant Design: ant-* классы

Примеры:
- Кнопка Material Design: <button class="mdc-button mdc-button--filled">Текст</button>
- Кнопка Bootstrap: <button class="btn btn-primary">Текст</button>
- Карточка Ant Design: <div class="ant-card">Содержимое</div>

НЕ генерируй полный CSS код, используй готовые классы!"""
    
    prompt_file = os.path.join(css_dir, "rag-optimized-prompt.txt")
    with open(prompt_file, 'w', encoding='utf-8') as f:
        f.write(optimized_prompt)
    
    print(f"✅ Оптимизированный промпт сохранен: {prompt_file}")
    
    # Статистика
    print(f"\n📊 Статистика:")
    for system_id, files in downloaded_files.items():
        print(f"  {DESIGN_SYSTEMS[system_id]['name']}: {len(files)} файлов")
    
    print(f"\n🎯 Теперь RAG будет использовать готовые классы вместо полного CSS!")

if __name__ == "__main__":
    main() 