#!/bin/bash
# Script de deploy para Vercel
# Uso: Executar no terminal na pasta do projeto

echo "🚀 Fazendo deploy para Vercel..."

# Instalar Vercel CLI se não existir
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Login (se necessário)
echo "🔐 Verificando autenticação..."
vercel link --yes 2>/dev/null || true

# Deploy
echo "📤 Fazendo deploy..."
vercel --prod

echo "✅ Deploy concluído!"
