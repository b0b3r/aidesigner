# AI Designer - Техническое описание проекта

## 🏗️ Архитектура системы

**AI Designer** - это веб-приложение для генерации UI/UX дизайна с использованием LLM и RAG (Retrieval-Augmented Generation).

### Основные компоненты:

- **Frontend**: React + React Flow (интерактивный канвас)
- **Backend**: FastAPI (Python)
- **LLM**: AnythingLLM с RAG + DeepSeek (резерв)
- **Дизайн-система**: Material Design 3 (MDC)

## 🔄 Принцип работы

1. **Пользователь** отправляет запрос через чат-интерфейс
2. **Backend** перенаправляет запрос в **AnythingLLM** с контекстом из RAG базы
3. **AnythingLLM** использует документацию дизайн-систем для генерации корректного HTML/CSS
4. **Frontend** отображает сгенерированный артефакт на интерактивном канвасе (React Flow)
5. **CSS-инжектор** автоматически применяет Material Design темизацию

## 🛠️ Технологический стек

### Frontend
- **React 18** - основной UI фреймворк
- **React Flow** - интерактивный канвас для артефактов
- **Material Design 3** - дизайн-система и компоненты
- **CSS Variables** - динамическая темизация (`--mdc-theme-*`)
- **DOMPurify** - безопасность при рендеринге HTML

### Backend
- **FastAPI** - современный Python веб-фреймворк
- **AnythingLLM Adapter** - интеграция с RAG системой
- **DeepSeek API** - резервный LLM провайдер
- **Pydantic** - валидация данных

### RAG система (AnythingLLM)
- **Локальная база знаний** - документация дизайн-систем
- **Векторный поиск** - релевантный контекст для LLM
- **Документы**: Material Design 3, Bootstrap, Ant Design
- **Эмбеддинги**: all-MiniLM-L6-v2 модель

## 🎨 Система темизации

### Material Design 3 интеграция:
- **CSS переменные**: `--mdc-theme-primary`, `--mdc-theme-surface`, etc.
- **Автоматическая инжекция** в артефакты через `cssInjector.js`
- **MDC классы**: `mdc-button--raised`, `mdc-card`, `mdc-typography--headline6`
- **Запрет hardcoded цветов** - только design tokens

## 📁 Ключевые файлы

### Frontend
- `src/components/CanvasFlow.js` - React Flow канвас с артефактами
- `src/utils/cssInjector.js` - инжекция CSS переменных
- `public/mdc-theme-custom.css` - кастомная MDC темизация

### Backend  
- `backend/main.py` - FastAPI сервер и API endpoints
- `anythingllm_adapter.py` - адаптер для RAG интеграции
- `config.py` - конфигурация и LLM промпты

### RAG база знаний
- `design-systems-knowledge/` - документация дизайн-систем
- `anythingllm-upload/` - подготовленные документы для RAG

## 🔧 Последние решённые проблемы

### 1. **Material Design цвета не отображались в артефактах**
**Проблема**: CSS переменные `--mdc-theme-*` не применялись внутри React Flow узлов

**Решение**: 
- Инжекция CSS переменных через `style` prop в `CanvasFlow.js`
- Использование spread оператора для корректной передачи CSS custom properties в React
- Изменение `background: white` на `background: transparent` в `.ui-flow-node`

### 2. **LLM генерировал неправильные MDC классы**
**Проблема**: Использование несуществующего класса `mdc-button--filled` вместо `mdc-button--raised`

**Решение**:
- Обновление RAG документации с корректными MDC классами
- Улучшение промптов в `anythingllm_adapter.py` с явным запретом неправильных классов
- Добавление примеров правильного использования MDC компонентов

### 3. **Конфликтующие системные промпты**
**Проблема**: Двойная отправка промптов (из `main.py` и `anythingllm_adapter.py`) ломала генерацию

**Решение**: 
- Удаление дублирующего промпта из `backend/main.py`
- Централизация всех инструкций в `anythingllm_adapter.py`
- Единый детализированный промпт с примерами и запретами

### 4. **Проблемы с Git и ветками**
**Проблема**: Случайное удаление файлов через `git clean -fd`, конфликты при merge

**Решение**:
- Восстановление из рабочей ветки `feature/smart-chat-routing` 
- Переименование в `main` через `git branch -M main`
- Очистка и консолидация всех изменений в основную ветку

## 🚀 Текущее состояние

✅ **Работает корректно**:
- Интеграция с AnythingLLM + RAG
- Material Design 3 темизация артефактов  
- Генерация корректных MDC компонентов
- Интерактивный React Flow канвас
- Все ветки объединены в `main`

🎯 **Готово к использованию**: Проект полностью функционален для генерации UI дизайна с правильной темизацией Material Design.
