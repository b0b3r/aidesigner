@echo off
chcp 65001 >nul
title AI Designer - Тестовый запуск нового интерфейса
echo ========================================
echo AI Designer - Тестовый запуск
echo ========================================

echo ✅ Проверяем структуру frontend (новый интерфейс)...
if exist "frontend\src\AppWithReactFlow.js" (
    echo ✅ AppWithReactFlow.js найден
) else (
    echo ❌ AppWithReactFlow.js не найден
)

if exist "frontend\src\components\CanvasFlow.js" (
    echo ✅ CanvasFlow.js найден
) else (
    echo ❌ CanvasFlow.js не найден
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