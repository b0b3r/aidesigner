@echo off
chcp 65001 >nul
title AI Designer - Запуск серверов
echo ========================================
echo AI Designer - Запуск серверов
echo ========================================

REM Проверяем, что мы в правильной директории
if not exist "backend\main.py" (
    echo ❌ Ошибка: Файл backend\main.py не найден!
    echo Убедитесь, что вы запускаете скрипт из корневой папки проекта
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Ошибка: Файл frontend\package.json не найден!
    echo Убедитесь, что вы запускаете скрипт из корневой папки проекта
    pause
    exit /b 1
)

REM Проверяем наличие Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ошибка: Python не установлен или не добавлен в PATH
    pause
    exit /b 1
)

REM Проверяем наличие Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ошибка: Node.js не установлен или не добавлен в PATH
    pause
    exit /b 1
)

REM Проверяем наличие .env файла
if not exist ".env" (
    echo ⚠️  Внимание: Файл .env не найден!
    echo Создаем .env файл из env.example...
    copy env.example .env >nul
    echo.
    echo ⚠️  ВАЖНО: Откройте файл .env и добавьте ваш DeepSeek API ключ!
    echo Нажмите любую клавишу для продолжения...
    pause > nul
)

echo 🔧 Проверяем конфигурацию...
python -c "from config import validate_config; errors = validate_config(); print('✅ Конфигурация корректна' if not errors else '❌ Ошибки конфигурации: ' + ', '.join(errors))"
if errorlevel 1 (
    echo ❌ Ошибка при проверке конфигурации!
    pause
    exit /b 1
)

echo.
echo 🚀 Запускаем Backend сервер на порту 8002...
start "AI Designer Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8002 --reload"

echo ⏳ Ждем 3 секунды для запуска backend...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Запускаем Frontend сервер на порту 3000...
start "AI Designer Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo ✅ Серверы запущены!
echo ========================================
echo 🔗 Backend:  http://127.0.0.1:8002
echo 🔗 Frontend: http://localhost:3000
echo 🔗 Health:   http://127.0.0.1:8002/api/health
echo ========================================
echo.
echo 💡 Для остановки серверов используйте stop.bat
echo    или нажмите Ctrl+C в каждом окне
echo.
pause