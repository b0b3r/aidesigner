@echo off
chcp 65001 >nul
title AI Designer - Остановка серверов
echo ========================================
echo AI Designer - Остановка серверов
echo ========================================

echo 🛑 Останавливаем Backend сервер (порт 8002)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8002') do (
    taskkill /f /pid %%a 2>nul
)

echo 🛑 Останавливаем Frontend сервер (порт 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /f /pid %%a 2>nul
)

echo 🛑 Останавливаем процессы Backend...
taskkill /f /im python.exe /fi "WINDOWTITLE eq AI Designer Backend*" 2>nul

echo 🛑 Останавливаем процессы Frontend...
taskkill /f /im node.exe /fi "WINDOWTITLE eq AI Designer Frontend*" 2>nul

echo.
echo ✅ Серверы остановлены!
echo.
pause