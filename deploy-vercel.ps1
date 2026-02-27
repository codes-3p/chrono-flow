# Deploy para Vercel - Chrono Flow
# Clique duas vezes neste arquivo para executar

$ErrorActionPreference = "Continue"

Write-Host "🚀 Fazendo deploy para Vercel..." -ForegroundColor Cyan

# Verificar se Vercel CLI está instalado
$vercelPath = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelPath) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Executar deploy
Write-Host "📤 Fazendo deploy..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Acesse seu projeto em: https://seu-projeto.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "Nota: Se for a primeira vez, pode precisar fazer 'vercel login' primeiro." -ForegroundColor Gray

Pause
