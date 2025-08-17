# План интеграции AnythingLLM с AI Designer

## Цели
1. Установить AnythingLLM локально через Docker
2. Настроить DeepSeek API для работы с AnythingLLM
3. Создать базу знаний с документацией проекта
4. Интегрировать RAG API в AI Designer

## Этапы реализации

### Этап 1: Установка AnythingLLM
- [x] Создать ветку feature/anythingllm-rag
- [ ] Установить Docker и Docker Compose (если не установлены)
- [ ] Скачать и запустить AnythingLLM
- [ ] Настроить первоначальную конфигурацию

### Этап 2: Настройка DeepSeek
- [ ] Подключить DeepSeek API к AnythingLLM
- [ ] Протестировать соединение
- [ ] Настроить параметры модели

### Этап 3: База знаний
- [ ] Создать рабочее пространство (workspace)
- [ ] Загрузить документацию проекта:
  - README файлы
  - Код компонентов
  - Документация по React Flow
  - Документация по Visual Editor
- [ ] Настроить индексацию документов

### Этап 4: API интеграция
- [ ] Изучить AnythingLLM API
- [ ] Создать сервис для работы с RAG
- [ ] Интегрировать в существующий бэкенд
- [ ] Обновить фронтенд для работы с RAG

### Этап 5: Тестирование
- [ ] Протестировать RAG запросы
- [ ] Проверить качество ответов
- [ ] Оптимизировать настройки

## Команды для установки

```bash
# Создание рабочей директории
mkdir anythingllm-rag
cd anythingllm-rag

# Создание директории для данных
export STORAGE_LOCATION="$PWD/anythingllm-storage"
mkdir -p $STORAGE_LOCATION
touch "$STORAGE_LOCATION/.env"

# Запуск AnythingLLM
docker pull mintplexlabs/anythingllm:master
docker run -d -p 3001:3001 \
  --cap-add SYS_ADMIN \
  -v ${STORAGE_LOCATION}:/app/server/storage \
  -v ${STORAGE_LOCATION}/.env:/app/server/.env \
  -e STORAGE_DIR="/app/server/storage" \
  --name anythingllm \
  mintplexlabs/anythingllm:master
```

## Конфигурация DeepSeek

В AnythingLLM нужно будет настроить:
- LLM Provider: OpenAI (generic)
- Base URL: https://api.deepseek.com/v1
- API Key: ваш DeepSeek API ключ
- Model: deepseek-chat

## Структура интеграции

```
backend/
├── services/
│   └── rag_service.py          # Новый сервис для RAG
├── routes/
│   └── rag_routes.py           # API роуты для RAG
└── main.py                     # Обновить основной файл

frontend/src/
├── services/
│   └── ragService.js           # Клиентский сервис
└── components/
    └── RagChat.js              # Компонент для RAG чата
```

## Преимущества интеграции

1. **Контекстные ответы**: AI сможет отвечать на вопросы о проекте
2. **Документация в реальном времени**: Всегда актуальная информация
3. **Помощь в разработке**: Подсказки по коду и архитектуре
4. **Обучение пользователей**: Интерактивная помощь в интерфейсе

## Следующие шаги

1. Запустить AnythingLLM
2. Настроить DeepSeek
3. Загрузить документы
4. Создать API интеграцию