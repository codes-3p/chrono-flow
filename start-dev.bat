@echo off
cd /d "c:\programas\Criador de PPTX\chrono-flow"
setlocal
set SCRIPT_TMP=%TEMP%\ps-bypass-%RANDOM%.ps1
echo Set-ExecutionPolicy Bypass -Scope Process > "%SCRIPT_TMP%"
echo cd "c:\programas\Criador de PPTX\chrono-flow" >> "%SCRIPT_TMP%"
echo npx vite >> "%SCRIPT_TMP%"
powershell -ExecutionPolicy Bypass -File "%SCRIPT_TMP%"
del "%SCRIPT_TMP%"
endlocal
