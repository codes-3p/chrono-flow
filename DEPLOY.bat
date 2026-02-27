@echo off
chcp 65001 >nul
echo ==========================================
echo   DEPLOY CHRONO-FLOW PARA VERCEL
echo ==========================================
echo.

echo [1/3] Fazendo build e deploy...
echo.

npx vercel --prod --yes

echo.
echo ==========================================
echo   DEPLOY CONCLUIDO!
echo ==========================================
echo.
echo Acesse: https://seu-projeto.vercel.app/demo
echo.
pause
