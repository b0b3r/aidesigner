#!/usr/bin/env python3
"""
Простой загрузчик дизайн-систем для AnythingLLM RAG
"""

import requests
import os
import json
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

class SimpleDesignDownloader:
    def __init__(self, output_dir="design-systems-knowledge"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def download_material_design_json(self):
        """Загружает JSON данные о компонентах Material Design"""
        print("🎨 Загружаем Material Design компоненты...")
        
        # Создаем документацию на основе известных компонентов
        components = {
            "buttons": {
                "title": "Material Design Buttons",
                "description": "Кнопки позволяют пользователям выполнять действия и делать выбор одним нажатием.",
                "variants": ["Filled", "Outlined", "Text", "Elevated", "Tonal"],
                "states": ["Default", "Hovered", "Focused", "Pressed", "Disabled"],
                "sizes": ["Small", "Medium", "Large"],
                "usage": "Используйте filled кнопки для основных действий, outlined для вторичных",
                "accessibility": "Добавляйте aria-label для иконочных кнопок"
            },
            "cards": {
                "title": "Material Design Cards", 
                "description": "Карточки содержат контент и действия по одной теме.",
                "variants": ["Elevated", "Filled", "Outlined"],
                "components": ["Header", "Content", "Actions", "Media"],
                "usage": "Используйте карточки для группировки связанной информации",
                "accessibility": "Обеспечьте логическую структуру заголовков"
            },
            "text-fields": {
                "title": "Material Design Text Fields",
                "description": "Текстовые поля позволяют пользователям вводить и редактировать текст.",
                "variants": ["Filled", "Outlined"],
                "states": ["Default", "Focused", "Error", "Disabled"],
                "components": ["Label", "Input", "Helper text", "Error text"],
                "usage": "Используйте outlined для форм, filled для поиска",
                "accessibility": "Связывайте labels с inputs через for/id"
            },
            "navigation": {
                "title": "Material Design Navigation",
                "description": "Компоненты навигации помогают пользователям перемещаться по приложению.",
                "types": ["Bottom navigation", "Navigation drawer", "Tabs", "Top app bar"],
                "usage": "Bottom navigation для 3-5 основных разделов",
                "accessibility": "Используйте role='navigation' и aria-labels"
            }
        }
        
        material_dir = self.output_dir / "material-design-3"
        material_dir.mkdir(exist_ok=True)
        
        for component_key, component_data in components.items():
            content = self._create_component_doc(component_data, "Material Design 3")
            filepath = material_dir / f"{component_key}.md"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✅ Создано: {filepath}")

    def download_bootstrap_components(self):
        """Создает документацию Bootstrap компонентов"""
        print("🅱️ Создаем Bootstrap документацию...")
        
        components = {
            "buttons": {
                "title": "Bootstrap Buttons",
                "description": "Bootstrap включает несколько предопределенных стилей кнопок.",
                "variants": ["Primary", "Secondary", "Success", "Danger", "Warning", "Info", "Light", "Dark"],
                "sizes": ["Small (.btn-sm)", "Default", "Large (.btn-lg)"],
                "states": ["Active", "Disabled"],
                "classes": [".btn", ".btn-primary", ".btn-outline-primary"],
                "usage": "Используйте .btn-primary для основных действий"
            },
            "cards": {
                "title": "Bootstrap Cards",
                "description": "Гибкий и расширяемый контейнер контента.",
                "components": ["Card header", "Card body", "Card footer", "Card image"],
                "classes": [".card", ".card-header", ".card-body", ".card-footer"],
                "usage": "Используйте карточки для группировки связанного контента"
            },
            "forms": {
                "title": "Bootstrap Forms",
                "description": "Компоненты форм для создания различных элементов ввода.",
                "components": ["Form controls", "Select", "Checkboxes", "Radios", "Switches"],
                "classes": [".form-control", ".form-select", ".form-check"],
                "validation": "Используйте .is-valid и .is-invalid для валидации"
            },
            "grid": {
                "title": "Bootstrap Grid System",
                "description": "Мощная система сетки на основе flexbox.",
                "breakpoints": ["xs", "sm", "md", "lg", "xl", "xxl"],
                "classes": [".container", ".row", ".col", ".col-md-6"],
                "usage": "Используйте .container > .row > .col для создания макетов"
            }
        }
        
        bootstrap_dir = self.output_dir / "bootstrap"
        bootstrap_dir.mkdir(exist_ok=True)
        
        for component_key, component_data in components.items():
            content = self._create_component_doc(component_data, "Bootstrap 5")
            filepath = bootstrap_dir / f"{component_key}.md"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✅ Создано: {filepath}")

    def download_ant_design_components(self):
        """Создает документацию Ant Design компонентов"""
        print("🐜 Создаем Ant Design документацию...")
        
        components = {
            "button": {
                "title": "Ant Design Button",
                "description": "Кнопка используется для запуска действия.",
                "types": ["Primary", "Default", "Dashed", "Text", "Link"],
                "sizes": ["Large", "Middle", "Small"],
                "states": ["Loading", "Disabled"],
                "props": ["type", "size", "loading", "disabled", "onClick"],
                "usage": "Используйте type='primary' для основных действий"
            },
            "card": {
                "title": "Ant Design Card",
                "description": "Простой прямоугольный контейнер.",
                "components": ["Title", "Extra", "Cover", "Actions"],
                "props": ["title", "extra", "cover", "actions", "bordered"],
                "usage": "Используйте для отображения краткой информации"
            },
            "form": {
                "title": "Ant Design Form",
                "description": "Высокопроизводительные компоненты подписки для сбора, проверки и отправки данных.",
                "components": ["Form", "Form.Item", "Input", "Select", "Button"],
                "validation": "Встроенная валидация с правилами",
                "usage": "Используйте Form.Item для каждого поля ввода"
            },
            "table": {
                "title": "Ant Design Table",
                "description": "Таблица отображает строки данных.",
                "features": ["Сортировка", "Фильтрация", "Пагинация", "Выбор строк"],
                "props": ["dataSource", "columns", "pagination", "rowSelection"],
                "usage": "Определите columns для настройки отображения данных"
            }
        }
        
        ant_dir = self.output_dir / "ant-design"
        ant_dir.mkdir(exist_ok=True)
        
        for component_key, component_data in components.items():
            content = self._create_component_doc(component_data, "Ant Design")
            filepath = ant_dir / f"{component_key}.md"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✅ Создано: {filepath}")

    def _create_component_doc(self, data, system_name):
        """Создает markdown документ для компонента"""
        content = f"""# {data['title']}

**Дизайн-система:** {system_name}
**Дата создания:** {time.strftime('%Y-%m-%d %H:%M:%S')}

## Описание

{data['description']}

"""
        
        if 'variants' in data:
            content += "## Варианты\n\n"
            for variant in data['variants']:
                content += f"- {variant}\n"
            content += "\n"
        
        if 'types' in data:
            content += "## Типы\n\n"
            for type_item in data['types']:
                content += f"- {type_item}\n"
            content += "\n"
        
        if 'sizes' in data:
            content += "## Размеры\n\n"
            for size in data['sizes']:
                content += f"- {size}\n"
            content += "\n"
        
        if 'states' in data:
            content += "## Состояния\n\n"
            for state in data['states']:
                content += f"- {state}\n"
            content += "\n"
        
        if 'components' in data:
            content += "## Компоненты\n\n"
            for component in data['components']:
                content += f"- {component}\n"
            content += "\n"
        
        if 'classes' in data:
            content += "## CSS классы\n\n"
            for cls in data['classes']:
                content += f"- `{cls}`\n"
            content += "\n"
        
        if 'props' in data:
            content += "## Свойства (Props)\n\n"
            for prop in data['props']:
                content += f"- `{prop}`\n"
            content += "\n"
        
        if 'usage' in data:
            content += f"## Использование\n\n{data['usage']}\n\n"
        
        if 'accessibility' in data:
            content += f"## Доступность\n\n{data['accessibility']}\n\n"
        
        return content

    def create_index_file(self):
        """Создает индексный файл"""
        index_content = f"""# Индекс дизайн-систем для AnythingLLM RAG

**Дата создания:** {time.strftime('%Y-%m-%d %H:%M:%S')}

Этот индекс содержит документацию по популярным дизайн-системам для использования в RAG системе.

## Доступные дизайн-системы

"""
        
        total_docs = 0
        for system_dir in self.output_dir.iterdir():
            if system_dir.is_dir():
                system_name = system_dir.name.replace('-', ' ').title()
                index_content += f"\n### {system_name}\n\n"
                
                md_files = list(system_dir.glob("*.md"))
                total_docs += len(md_files)
                
                for md_file in sorted(md_files):
                    title = md_file.stem.replace('_', ' ').replace('-', ' ').title()
                    index_content += f"- {title}\n"
        
        index_content += f"""

## Статистика

- **Всего дизайн-систем:** {len([d for d in self.output_dir.iterdir() if d.is_dir()])}
- **Всего документов:** {total_docs}

## Как использовать

1. Загрузите все .md файлы в ваш AnythingLLM workspace
2. Настройте системный промпт:

```
Вы - эксперт по UI/UX дизайну и дизайн-системам. У вас есть знания по:
- Material Design 3
- Bootstrap 5  
- Ant Design

При ответах:
- Ссылайтесь на конкретные компоненты и их свойства
- Предоставляйте примеры кода
- Учитывайте принципы accessibility
- Объясняйте best practices для каждой дизайн-системы

Помогайте создавать качественные, доступные пользовательские интерфейсы.
```

3. Задавайте вопросы о компонентах, паттернах и реализации
"""
        
        with open(self.output_dir / "INDEX.md", 'w', encoding='utf-8') as f:
            f.write(index_content)

def main():
    print("🚀 Создание базы знаний дизайн-систем для AnythingLLM")
    
    downloader = SimpleDesignDownloader()
    
    # Создаем документацию для всех дизайн-систем
    downloader.download_material_design_json()
    downloader.download_bootstrap_components()
    downloader.download_ant_design_components()
    
    # Создаем индексный файл
    print("\n📋 Создаем индексный файл...")
    downloader.create_index_file()
    
    print(f"\n✅ База знаний создана!")
    print(f"📁 Файлы сохранены в: {downloader.output_dir.absolute()}")
    print(f"📊 Создано документов: {len(list(downloader.output_dir.rglob('*.md')))}")
    
    print("\n🔧 Следующие шаги:")
    print("1. Откройте AnythingLLM: http://localhost:3001")
    print("2. Перейдите в MyWorkspace")
    print("3. Загрузите все .md файлы из папки design-systems-knowledge")
    print("4. Настройте системный промпт (см. INDEX.md)")
    print("5. Протестируйте RAG систему!")

if __name__ == "__main__":
    main()