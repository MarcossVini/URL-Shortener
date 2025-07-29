#!/bin/bash

echo "🚀 Configuração do URL Shortener - Setup Inicial"
echo "================================================="
echo ""

# Verificar se o Git está configurado
echo "1. Verificando configuração do Git..."
git_user=$(git config --global user.name)
git_email=$(git config --global user.email)

if [ -z "$git_user" ] || [ -z "$git_email" ]; then
    echo "❌ Git não está configurado globalmente."
    echo "Execute os comandos abaixo:"
    echo "git config --global user.name \"Seu Nome\""
    echo "git config --global user.email \"seu-email@exemplo.com\""
    echo ""
else
    echo "✅ Git configurado para: $git_user ($git_email)"
fi

# Verificar Node.js
echo "2. Verificando Node.js..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✅ Node.js $node_version instalado"
else
    echo "❌ Node.js não encontrado. Instale a versão 18+"
    exit 1
fi

# Verificar Docker
echo "3. Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado"
else
    echo "⚠️ Docker não encontrado (opcional para desenvolvimento)"
fi

# Instalar dependências
echo "4. Instalando dependências..."
if npm install; then
    echo "✅ Dependências instaladas"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Verificar arquivo .env
echo "5. Verificando configuração de ambiente..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Arquivo .env criado a partir do .env.example"
        echo "⚠️ Configure as variáveis no arquivo .env antes de continuar"
    else
        echo "❌ Arquivo .env.example não encontrado"
    fi
else
    echo "✅ Arquivo .env já existe"
fi

# Verificar configuração SSH do GitHub
echo "6. Verificando conectividade com GitHub..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH configurado para GitHub"
elif ssh -T git@github.com 2>&1 | grep -q "Permission denied"; then
    echo "❌ SSH não configurado para GitHub"
    echo "Siga as instruções no README.md para configurar SSH"
else
    echo "⚠️ Não foi possível verificar conexão SSH"
fi

echo ""
echo "📋 Próximos passos:"
echo "1. Configure o arquivo .env com suas credenciais"
echo "2. Configure SSH para GitHub (se não configurado)"
echo "3. Execute: npm run database (para iniciar o banco)"
echo "4. Execute: npm run prisma:dev (para migrações)"
echo "5. Execute: npm run dev (para iniciar o servidor)"

echo ""
echo "📚 Comandos úteis:"
echo "npm run dev          # Inicia servidor de desenvolvimento"
echo "npm run database     # Inicia banco PostgreSQL (Docker)"
echo "npm run test         # Executa testes"
echo "npm run lint         # Verifica qualidade do código"
echo "npm run format       # Formata código"

echo ""
echo "🎉 Setup inicial concluído!"
