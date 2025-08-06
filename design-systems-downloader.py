#!/usr/bin/env python3
"""
Универсальный загрузчик дизайн-систем для AnythingLLM RAG
Поддерживает: Material Design, Ant Design, Chakra UI, Bootstrap, Tailwind UI
"""

import requests
import os
import json
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import markdownify

class DesignSystemDownloader:
    def __init__(self, output_dir="design-systems-knowledge"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def download_material_design(self):
        """Загружает документацию Material Design 3"""
        print("🎨 Загружаем Material Design 3...")
        
        base_url = "https://m3.material.io"
        pages = [
            "/foundations/layout",
            "/foundations/color-system", 
            "/foundations/typography",
            "/foundations/motion",
            "/components/buttons",
            "/components/cards",
            "/components/navigation-bar",
            "/components/text-fields",
            "/components/chips",
            "/components/dialogs",
            "/components/menus",
            "/components/lists",
            "/components/tabs",
            "/components/top-app-bar",
            "/components/bottom-app-bar",
            "/components/navigation-drawer",
            "/components/bottom-sheets",
            "/components/snackbar",
            "/components/progress-indicators",
            "/components/sliders",
            "/components/switch",
            "/components/checkbox",
            "/components/radio-button"
        ]
        
        material_dir = self.output_dir / "material-design-3"
        material_dir.mkdir(exist_ok=True)
        
        for page in pages:
            self._download_page(base_url + page, material_dir, "material-design")
            time.sleep(1)  # Respectful scraping
    
    def download_ant_design(self):
        """Загружает документацию Ant Design"""
        print("🐜 Загружаем Ant Design...")
        
        base_url = "https://ant.design"
        pages = [
            "/docs/react/introduce",
            "/docs/react/getting-started",
            "/docs/spec/colors",
            "/docs/spec/typography", 
            "/docs/spec/layout",
            "/docs/spec/spacing",
            "/components/button",
            "/components/card",
            "/components/form",
            "/components/input",
            "/components/select",
            "/components/table",
            "/components/menu",
            "/components/navigation",
            "/components/layout",
            "/components/grid",
            "/components/typography",
            "/components/space",
            "/components/divider",
            "/components/modal",
            "/components/drawer",
            "/components/tabs",
            "/components/collapse",
            "/components/carousel",
            "/components/pagination",
            "/components/steps",
            "/components/breadcrumb"
        ]
        
        ant_dir = self.output_dir / "ant-design"
        ant_dir.mkdir(exist_ok=True)
        
        for page in pages:
            self._download_page(base_url + page, ant_dir, "ant-design")
            time.sleep(1)

    def download_chakra_ui(self):
        """Загружает документацию Chakra UI"""
        print("⚡ Загружаем Chakra UI...")
        
        base_url = "https://chakra-ui.com"
        pages = [
            "/docs/getting-started",
            "/docs/theming/theme",
            "/docs/theming/colors",
            "/docs/theming/typography",
            "/docs/theming/spacing",
            "/docs/components/button",
            "/docs/components/card",
            "/docs/components/input",
            "/docs/components/select",
            "/docs/components/textarea",
            "/docs/components/checkbox",
            "/docs/components/radio",
            "/docs/components/switch",
            "/docs/components/slider",
            "/docs/components/modal",
            "/docs/components/drawer",
            "/docs/components/menu",
            "/docs/components/tabs",
            "/docs/components/accordion",
            "/docs/components/alert",
            "/docs/components/toast",
            "/docs/components/tooltip",
            "/docs/components/popover",
            "/docs/layout/box",
            "/docs/layout/flex",
            "/docs/layout/grid",
            "/docs/layout/stack"
        ]
        
        chakra_dir = self.output_dir / "chakra-ui"
        chakra_dir.mkdir(exist_ok=True)
        
        for page in pages:
            self._download_page(base_url + page, chakra_dir, "chakra-ui")
            time.sleep(1)

    def download_bootstrap(self):
        """Загружает документацию Bootstrap"""
        print("🅱️ Загружаем Bootstrap...")
        
        base_url = "https://getbootstrap.com"
        pages = [
            "/docs/5.3/getting-started/introduction",
            "/docs/5.3/layout/breakpoints",
            "/docs/5.3/layout/containers",
            "/docs/5.3/layout/grid",
            "/docs/5.3/layout/columns",
            "/docs/5.3/layout/gutters",
            "/docs/5.3/utilities/colors",
            "/docs/5.3/utilities/spacing",
            "/docs/5.3/utilities/text",
            "/docs/5.3/components/buttons",
            "/docs/5.3/components/card",
            "/docs/5.3/forms/overview",
            "/docs/5.3/forms/form-control",
            "/docs/5.3/forms/select",
            "/docs/5.3/forms/checks-radios",
            "/docs/5.3/components/navbar",
            "/docs/5.3/components/nav-tabs",
            "/docs/5.3/components/modal",
            "/docs/5.3/components/offcanvas",
            "/docs/5.3/components/dropdown",
            "/docs/5.3/components/collapse",
            "/docs/5.3/components/accordion",
            "/docs/5.3/components/carousel",
            "/docs/5.3/components/alerts",
            "/docs/5.3/components/badge",
            "/docs/5.3/components/breadcrumb",
            "/docs/5.3/components/pagination",
            "/docs/5.3/components/progress",
            "/docs/5.3/components/spinners",
            "/docs/5.3/components/toasts",
            "/docs/5.3/components/tooltips"
        ]
        
        bootstrap_dir = self.output_dir / "bootstrap"
        bootstrap_dir.mkdir(exist_ok=True)
        
        for page in pages:
            self._download_page(base_url + page, bootstrap_dir, "bootstrap")
            time.sleep(1)

    def _download_page(self, url, output_dir, system_name):
        """Загружает и конвертирует страницу в markdown"""
        try:
            print(f"  📄 Загружаем: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Удаляем ненужные элементы
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                element.decompose()
            
            # Извлекаем основной контент
            main_content = self._extract_main_content(soup, system_name)
            
            if main_content:
                # Конвертируем в markdown
                markdown_content = markdownify.markdownify(
                    str(main_content), 
                    heading_style="ATX",
                    bullets="-"
                )
                
                # Добавляем метаданные
                page_title = soup.find('title')
                title = page_title.text if page_title else url.split('/')[-1]
                
                full_content = f"""# {title}

**Источник:** {url}
**Дизайн-система:** {system_name.title()}
**Дата загрузки:** {time.strftime('%Y-%m-%d %H:%M:%S')}

---

{markdown_content}
"""
                
                # Сохраняем файл
                filename = self._generate_filename(url)
                filepath = output_dir / f"{filename}.md"
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(full_content)
                
                print(f"  ✅ Сохранено: {filepath}")
                
        except Exception as e:
            print(f"  ❌ Ошибка при загрузке {url}: {str(e)}")

    def _extract_main_content(self, soup, system_name):
        """Извлекает основной контент в зависимости от дизайн-системы"""
        selectors = {
            'material-design': ['main', '.content', 'article', '.markdown-body'],
            'ant-design': ['.markdown', 'article', 'main', '.content'],
            'chakra-ui': ['main', '.chakra-ui-markdown', 'article', '.content'],
            'bootstrap': ['.bd-content', 'main', '.content', 'article']
        }
        
        for selector in selectors.get(system_name, ['main', 'article', '.content']):
            content = soup.select_one(selector)
            if content:
                return content
        
        # Fallback - возвращаем body без nav/footer
        return soup.find('body')

    def _generate_filename(self, url):
        """Генерирует имя файла из URL"""
        path = urlparse(url).path
        filename = path.strip('/').replace('/', '_').replace('-', '_')
        if not filename:
            filename = "index"
        return filename

    def create_index_file(self):
        """Создает индексный файл со списком всех загруженных документов"""
        index_content = """# Индекс дизайн-систем

Этот документ содержит ссылки на всю загруженную документацию дизайн-систем.

## Доступные дизайн-системы:

"""
        
        for system_dir in self.output_dir.iterdir():
            if system_dir.is_dir():
                system_name = system_dir.name.replace('-', ' ').title()
                index_content += f"\n### {system_name}\n\n"
                
                md_files = list(system_dir.glob("*.md"))
                for md_file in sorted(md_files):
                    title = md_file.stem.replace('_', ' ').title()
                    index_content += f"- [{title}](./{system_dir.name}/{md_file.name})\n"
        
        index_content += f"""

## Использование

1. Загрузите все файлы в AnythingLLM workspace
2. Настройте системный промпт для работы с дизайн-системами
3. Задавайте вопросы о компонентах, паттернах и best practices

**Общее количество документов:** {len(list(self.output_dir.rglob("*.md")))}
**Дата создания индекса:** {time.strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        with open(self.output_dir / "INDEX.md", 'w', encoding='utf-8') as f:
            f.write(index_content)

def main():
    downloader = DesignSystemDownloader()
    
    print("🚀 Запуск загрузки дизайн-систем...")
    
    # Выбор дизайн-систем для загрузки
    systems = {
        '1': ('Material Design 3', downloader.download_material_design),
        '2': ('Ant Design', downloader.download_ant_design), 
        '3': ('Chakra UI', downloader.download_chakra_ui),
        '4': ('Bootstrap', downloader.download_bootstrap),
        '5': ('Все системы', lambda: [
            downloader.download_material_design(),
            downloader.download_ant_design(),
            downloader.download_chakra_ui(),
            downloader.download_bootstrap()
        ])
    }
    
    print("\nВыберите дизайн-системы для загрузки:")
    for key, (name, _) in systems.items():
        print(f"{key}. {name}")
    
    choice = input("\nВведите номер (по умолчанию 5 - все): ").strip() or '5'
    
    if choice in systems:
        name, func = systems[choice]
        print(f"\n📥 Загружаем: {name}")
        func()
    else:
        print("❌ Неверный выбор")
        return
    
    # Создаем индексный файл
    print("\n📋 Создаем индексный файл...")
    downloader.create_index_file()
    
    print(f"\n✅ Загрузка завершена!")
    print(f"📁 Файлы сохранены в: {downloader.output_dir.absolute()}")
    print(f"📊 Загружено документов: {len(list(downloader.output_dir.rglob('*.md')))}")
    print("\n🔧 Следующие шаги:")
    print("1. Загрузите все .md файлы в AnythingLLM workspace")
    print("2. Настройте системный промпт")
    print("3. Протестируйте RAG систему")

if __name__ == "__main__":
    main()