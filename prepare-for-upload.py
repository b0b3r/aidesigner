#!/usr/bin/env python3
"""
Подготовка файлов для загрузки в AnythingLLM
Собирает все markdown файлы в одну папку для удобной загрузки
"""

import os
import shutil
from pathlib import Path

def prepare_upload_folder():
    """Создает папку с файлами готовыми для загрузки в AnythingLLM"""
    
    source_dir = Path("design-systems-knowledge")
    upload_dir = Path("anythingllm-upload")
    
    # Создаем папку для загрузки
    if upload_dir.exists():
        shutil.rmtree(upload_dir)
    upload_dir.mkdir()
    
    print(f"📁 Создана папка: {upload_dir.absolute()}")
    
    if not source_dir.exists():
        print(f"❌ Исходная папка не найдена: {source_dir}")
        print("Сначала запустите: python simple-design-downloader.py")
        return
    
    # Собираем все markdown файлы
    md_files = list(source_dir.rglob("*.md"))
    
    if not md_files:
        print("❌ Markdown файлы не найдены")
        return
    
    print(f"📄 Найдено файлов: {len(md_files)}")
    
    # Копируем файлы с префиксами для удобства
    file_mapping = {}
    
    for md_file in md_files:
        relative_path = md_file.relative_to(source_dir)
        
        # Создаем понятные имена файлов
        if md_file.name == "INDEX.md":
            new_name = "00_INDEX.md"
        elif "material-design" in str(relative_path):
            new_name = f"01_Material_Design_{md_file.name}"
        elif "bootstrap" in str(relative_path):
            new_name = f"02_Bootstrap_{md_file.name}"
        elif "ant-design" in str(relative_path):
            new_name = f"03_Ant_Design_{md_file.name}"
        else:
            new_name = md_file.name
        
        # Копируем файл
        dest_file = upload_dir / new_name
        shutil.copy2(md_file, dest_file)
        file_mapping[str(relative_path)] = new_name
        
        print(f"  ✅ {relative_path} → {new_name}")
    
    # Создаем инструкцию по загрузке
    instructions = f"""# 📋 Инструкция по загрузке в AnythingLLM

## Файлы готовы к загрузке!

В этой папке ({upload_dir.absolute()}) находятся {len(md_files)} файлов дизайн-систем.

## Порядок загрузки:

1. **Откройте AnythingLLM**: http://localhost:3001
2. **Перейдите в MyWorkspace** → Documents
3. **Нажмите "Upload Documents"** → "Upload Files"
4. **Выберите все файлы** из этой папки
5. **Дождитесь завершения** индексации

## Файлы в порядке приоритета:

"""
    
    # Добавляем список файлов
    sorted_files = sorted(upload_dir.glob("*.md"))
    for i, file_path in enumerate(sorted_files, 1):
        file_size = file_path.stat().st_size
        instructions += f"{i:2d}. `{file_path.name}` ({file_size} bytes)\n"
    
    instructions += f"""

## Системный промпт

После загрузки файлов настройте системный промпт в workspace:

```
Вы - эксперт по UI/UX дизайну и современным дизайн-системам. У вас есть глубокие знания по:

- Material Design 3 (Google)
- Bootstrap 5 
- Ant Design

При ответах на вопросы о UI компонентах:

1. Ссылайтесь на конкретные компоненты из загруженных дизайн-систем
2. Предоставляйте практические примеры кода и реализации
3. Учитывайте принципы accessibility и best practices
4. Объясняйте различия между подходами разных дизайн-систем
5. Предлагайте наиболее подходящие решения для конкретных задач

Всегда стремитесь к созданию качественных, доступных и современных пользовательских интерфейсов.
```

## Тестовые вопросы

После настройки протестируйте систему:

- "Как использовать кнопки в Material Design?"
- "Чем отличаются карточки в Bootstrap от Ant Design?"
- "Покажи код формы с валидацией в Ant Design"
- "Какую дизайн-систему выбрать для мобильного приложения?"

## Готово! 🎉

Общий размер базы знаний: {sum(f.stat().st_size for f in sorted_files)} bytes
Дата подготовки: {Path(__file__).stat().st_mtime}
"""
    
    # Сохраняем инструкцию
    instructions_file = upload_dir / "README_UPLOAD.md"
    with open(instructions_file, 'w', encoding='utf-8') as f:
        f.write(instructions)
    
    print(f"\n📋 Создана инструкция: {instructions_file}")
    print(f"\n🎯 Все готово к загрузке!")
    print(f"📂 Папка: {upload_dir.absolute()}")
    print(f"📄 Файлов: {len(md_files)}")
    print(f"💾 Общий размер: {sum(f.stat().st_size for f in sorted_files)} bytes")
    
    print(f"\n🚀 Следующие шаги:")
    print(f"1. Откройте AnythingLLM: http://localhost:3001")
    print(f"2. Загрузите все файлы из папки: {upload_dir}")
    print(f"3. Настройте системный промпт")
    print(f"4. Тестируйте RAG систему!")

if __name__ == "__main__":
    print("🔧 Подготовка файлов для загрузки в AnythingLLM...")
    prepare_upload_folder()