@echo off
chcp 65001 >nul
title AI Designer - Установка зависимостей
echo ========================================
echo AI Designer - Установка зависимостей
echo ========================================

REM Проверяем наличие Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ошибка: Python не установлен или не добавлен в PATH
    echo Установите Python 3.8+ с https://python.org
    pause
    exit /b 1
)

REM Проверяем наличие Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ошибка: Node.js не установлен или не добавлен в PATH
    echo Установите Node.js 16+ с https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Python версия:
python --version

echo ✅ Node.js версия:
node --version

echo.
echo 📦 Устанавливаем Python зависимости...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Ошибка при установке Python зависимостей
    pause
    exit /b 1
)

echo.
echo 📦 Устанавливаем Node.js зависимости...
cd frontend
npm install
if errorlevel 1 (
    echo ❌ Ошибка при установке Node.js зависимостей
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Все зависимости установлены успешно!
echo.
echo 💡 Следующие шаги:
echo 1. Скопируйте env.example в .env: copy env.example .env
echo 2. Отредактируйте .env и добавьте ваш DeepSeek API ключ
echo 3. Запустите проект: start.bat
echo.
pause