@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "scanner.ps1"