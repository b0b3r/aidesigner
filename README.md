# AI Designer - Генератор дизайна веб-страниц

Веб-приложение для поэтапной генерации дизайна веб-страниц с помощью LLM (DeepSeek).

## Основные возможности

- **Интерфейс чата**: Взаимодействие с LLM для создания планов дизайна
- **Подтверждение этапов**: Поэтапное подтверждение каждого этапа создания дизайна
- **Wireframe генерация**: Создание базовых wireframe с пустыми блоками
- **Детализация блоков**: Генерация и редактирование содержимого каждого блока
- **Визуализация**: Интерактивный канвас для отображения дизайна

## Технологии

- **Frontend**: React, Fabric.js для канваса, Tailwind CSS
- **Backend**: FastAPI
- **LLM**: DeepSeek API
- **Стили**: Tailwind CSS

## Быстрый запуск

### Автоматический запуск (Windows)

1. Скопируйте файл `env.example` в `.env` и добавьте ваш DeepSeek API ключ:
```bash
copy env.example .env
```

2. Отредактируйте файл `.env` и добавьте ваш API ключ:
```
DEEPSEEK_API_KEY=your_actual_api_key_here
```

3. Запустите проект:
```bash
start.bat
```

Этот скрипт автоматически:
- Проверит наличие Python и Node.js
- Создаст файл .env если его нет
- Проверит конфигурацию
- Запустит backend на порту 8002
- Запустит frontend на порту 3000

Для остановки серверов используйте `stop.bat`

### Ручной запуск

1. **Установка зависимостей**:
```bash
# Python зависимости
pip install -r requirements.txt

# Node.js зависимости
cd frontend
npm install
cd ..
```

2. **Настройка переменных окружения**:
```bash
# Скопируйте пример файла
copy env.example .env

# Отредактируйте .env и добавьте ваш DeepSeek API ключ
```

3. **Запуск backend**:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8002 --reload
```

4. **Запуск frontend** (в новом терминале):
```bash
cd frontend
npm start
```

## Структура проекта

```
aidesigner/
├── backend/              # FastAPI сервер
│   └── main.py          # Основной файл сервера
├── frontend/            # React приложение
│   ├── public/          # Статические файлы
│   ├── src/             # Исходный код
│   │   ├── components/  # React компоненты
│   │   ├── AppWithReactFlow.js  # Главный компонент
│   │   └── index.js     # Точка входа
│   └── package.json     # Node.js зависимости
├── requirements.txt      # Python зависимости
├── package.json         # Корневой package.json
├── start.bat           # Скрипт запуска для Windows
└── README.md           # Документация
```

## Использование

### 1. Создание плана дизайна

1. Откройте вкладку "Чат"
2. Опишите, какой дизайн вы хотите создать
3. Система автоматически создаст план с этапами

### 2. Работа с этапами

1. Перейдите на вкладку "Этапы"
2. Подтвердите каждый этап по порядку
3. Генерируйте содержимое для каждого этапа
4. Редактируйте промпты при необходимости

### 3. Визуализация на канвасе

1. Перейдите на вкладку "Дизайн"
2. Взаимодействуйте с элементами на канвасе
3. Добавляйте новые блоки и текст
4. Экспортируйте результат в HTML

## API Endpoints

### Чат с LLM
- `POST /api/chat` - Основной endpoint для чата

### Планы дизайна
- `POST /api/design/plan` - Создание плана дизайна
- `GET /api/design/plans` - Получение всех планов
- `GET /api/design/plans/{plan_id}` - Получение конкретного плана

### Этапы дизайна
- `POST /api/design/plans/{plan_id}/steps/{step_id}/confirm` - Подтверждение этапа
- `POST /api/design/plans/{plan_id}/steps/{step_id}/generate` - Генерация содержимого этапа

## Конфигурация

### Переменные окружения

Создайте файл `.env` на основе `env.example`:

```env
# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Backend Configuration
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8002

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8002
```

### Получение DeepSeek API ключа

1. Зарегистрируйтесь на [DeepSeek](https://platform.deepseek.com/)
2. Перейдите в раздел API Keys
3. Создайте новый API ключ
4. Скопируйте ключ в файл `.env`

## Разработка

### Структура компонентов

- `ChatInterface` - Интерфейс чата с LLM
- `DesignCanvas` - Интерактивный канвас для дизайна
- `DesignSteps` - Управление этапами дизайна

### Добавление новых функций

1. Создайте новый компонент в `frontend/src/components/`
2. Добавьте соответствующий endpoint в `backend/main.py`
3. Обновите навигацию в `App.js`

## Устранение неполадок

### Backend не запускается
- Проверьте, что Python 3.7+ установлен
- Убедитесь, что все зависимости установлены: `pip install -r requirements.txt`
- Проверьте, что порт 8000 свободен

### Frontend не запускается
- Проверьте, что Node.js 14+ установлен
- Установите зависимости: `cd frontend && npm install`
- Проверьте, что порт 3000 свободен

### Ошибки API
- Проверьте правильность DeepSeek API ключа
- Убедитесь, что backend запущен на порту 8000
- Проверьте консоль браузера на ошибки CORS

## Лицензия

MIT License 