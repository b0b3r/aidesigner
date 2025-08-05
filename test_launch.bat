@echo off
chcp 65001 >nul
title AI Designer - Тестовый запуск нового интерфейса
echo ========================================
echo AI Designer - Тестовый запуск
echo ========================================

echo ✅ Проверяем структуру frontend...
if exist "frontend\src\App.js" (
    echo ✅ App.js найден
) else (
    echo ❌ App.js не найден
)

if exist "frontend\src\components\ChatPanel.js" (
    echo ✅ ChatPanel.js найден
) else (
    echo ❌ ChatPanel.js не найден
)

if exist "frontend\src\components\DesignCanvas.js" (
    echo ✅ DesignCanvas.js найден
) else (
    echo ❌ DesignCanvas.js не найден
)

if exist "frontend\src\components\PropertiesPanel.js" (
    echo ✅ PropertiesPanel.js найден
) else (
    echo ❌ PropertiesPanel.js не найден
)

echo.
echo 🚀 Структура создана! Теперь можно запускать:
echo 1. start.bat - для полного запуска
echo 2. Или отдельно backend и frontend
echo.
pause