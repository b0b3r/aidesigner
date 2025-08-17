# Настройка AnythingLLM с DeepSeek

## ✅ Установка завершена

AnythingLLM успешно запущен в Docker контейнере:
- **URL**: http://localhost:3001
- **Контейнер**: anythingllm
- **Порт**: 3001
- **Хранилище**: ./anythingllm-storage

## 📋 Следующие шаги

### 1. Первоначальная настройка
1. Откройте браузер и перейдите на http://localhost:3001
2. Создайте администраторский аккаунт
3. Установите название рабочего пространства

### 2. Настройка DeepSeek API

#### В разделе LLM Provider:
- **Provider**: OpenAI (generic)
- **Base URL**: `https://api.deepseek.com/v1`
- **API Key**: `ваш_deepseek_api_ключ`
- **Model Name**: `deepseek-chat`

#### В разделе Embedding Provider:
- **Provider**: OpenAI (generic) 
- **Base URL**: `https://api.deepseek.com/v1`
- **API Key**: `ваш_deepseek_api_ключ`
- **Model**: `text-embedding-ada-002` (или другая доступная модель)

### 3. Создание рабочего пространства (Workspace)

1. Создайте новое рабочее пространство с названием "AI Designer RAG"
2. Настройте системный промпт для контекста проекта:

```
Вы - AI ассистент для проекта AI Designer. Это веб-приложение для создания UI компонентов с помощью искусственного интеллекта.

Основные компоненты проекта:
- Frontend: React с React Flow для канваса
- Backend: FastAPI с Python
- LLM: DeepSeek API для генерации кода
- Особенности: Visual Editor, планирование задач, умная маршрутизация сообщений

При ответах учитывайте контекст проекта и предоставляйте конкретные, практичные решения для разработки UI компонентов.
```

### 4. Загрузка документации

Загрузите следующие файлы в рабочее пространство:
- `README.md` - общее описание проекта
- `frontend/REACT_FLOW_DEMO.md` - документация по React Flow
- `frontend/VISUAL_EDITOR_README.md` - документация по Visual Editor
- Ключевые файлы компонентов (App.js, CanvasFlow.js и др.)

### 5. Тестирование

После настройки протестируйте систему:
1. Задайте вопрос о проекте
2. Проверьте, использует ли система загруженные документы
3. Убедитесь, что ответы релевантны контексту проекта

## 🔧 Управление контейнером

### Основные команды:
```bash
# Проверить статус
docker ps

# Посмотреть логи
docker logs anythingllm

# Остановить контейнер
docker stop anythingllm

# Запустить контейнер
docker start anythingllm

# Перезапустить контейнер
docker restart anythingllm

# Удалить контейнер (данные сохранятся)
docker rm anythingllm
```

### Обновление:
```bash
# Остановить и удалить контейнер
docker stop anythingllm && docker rm anythingllm

# Загрузить новую версию
docker pull mintplexlabs/anythingllm:master

# Запустить с теми же настройками
docker run -d -p 3001:3001 --cap-add SYS_ADMIN \
  -v "${PWD}/anythingllm-storage:/app/server/storage" \
  -v "${PWD}/anythingllm-storage/.env:/app/server/.env" \
  -e STORAGE_DIR="/app/server/storage" \
  --name anythingllm \
  mintplexlabs/anythingllm:master
```

## 🔗 API Integration

После настройки AnythingLLM будет доступен API для интеграции:
- **Base URL**: http://localhost:3001/api
- **Документация**: http://localhost:3001/api/docs
- **Чат API**: `/api/v1/workspace/{slug}/chat`

## 📁 Структура данных

Все данные сохраняются в `./anythingllm-storage/`:
- `anythingllm.db` - основная база данных
- `documents/` - загруженные документы
- `vector-cache/` - кэш векторных индексов
- `uploads/` - временные файлы