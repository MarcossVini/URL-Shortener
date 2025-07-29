# URL Shortener - Setup para Windows
# Execute este script no PowerShell

Write-Host "🚀 Configuração do URL Shortener - Setup Inicial" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Git está configurado
Write-Host "1. Verificando configuração do Git..." -ForegroundColor Yellow
$gitUser = git config --global user.name
$gitEmail = git config --global user.email

if (-not $gitUser -or -not $gitEmail) {
    Write-Host "❌ Git não está configurado globalmente." -ForegroundColor Red
    Write-Host "Execute os comandos abaixo:" -ForegroundColor White
    Write-Host 'git config --global user.name "Seu Nome"' -ForegroundColor Gray
    Write-Host 'git config --global user.email "seu-email@exemplo.com"' -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "✅ Git configurado para: $gitUser ($gitEmail)" -ForegroundColor Green
}

# Verificar Node.js
Write-Host "2. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale a versão 18+" -ForegroundColor Red
    exit 1
}

# Verificar Docker
Write-Host "3. Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker instalado" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Docker não encontrado (opcional para desenvolvimento)" -ForegroundColor Yellow
}

# Instalar dependências
Write-Host "4. Instalando dependências..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependências instaladas" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

# Verificar arquivo .env
Write-Host "5. Verificando configuração de ambiente..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Arquivo .env criado a partir do .env.example" -ForegroundColor Green
        Write-Host "⚠️ Configure as variáveis no arquivo .env antes de continuar" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Arquivo .env.example não encontrado" -ForegroundColor Red
    }
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

# Instruções para SSH
Write-Host "6. Configuração SSH para GitHub..." -ForegroundColor Yellow
Write-Host "Para configurar SSH no Windows:" -ForegroundColor White
Write-Host "1. Abra PowerShell como Administrador" -ForegroundColor Gray
Write-Host "2. Execute: ssh-keygen -t ed25519 -C `"seu-email@exemplo.com`"" -ForegroundColor Gray
Write-Host "3. Execute: Get-Service ssh-agent | Set-Service -StartupType Manual" -ForegroundColor Gray
Write-Host "4. Execute: Start-Service ssh-agent" -ForegroundColor Gray
Write-Host "5. Execute: ssh-add ~/.ssh/id_ed25519" -ForegroundColor Gray
Write-Host "6. Execute: Get-Content ~/.ssh/id_ed25519.pub | clip" -ForegroundColor Gray
Write-Host "7. Cole a chave em: GitHub > Settings > SSH Keys" -ForegroundColor Gray

Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure o arquivo .env com suas credenciais" -ForegroundColor White
Write-Host "2. Configure SSH para GitHub" -ForegroundColor White
Write-Host "3. Execute: npm run database (para iniciar o banco)" -ForegroundColor White
Write-Host "4. Execute: npm run prisma:dev (para migrações)" -ForegroundColor White
Write-Host "5. Execute: npm run dev (para iniciar o servidor)" -ForegroundColor White

Write-Host ""
Write-Host "📚 Comandos úteis:" -ForegroundColor Cyan
Write-Host "npm run dev          # Inicia servidor de desenvolvimento" -ForegroundColor Gray
Write-Host "npm run database     # Inicia banco PostgreSQL (Docker)" -ForegroundColor Gray
Write-Host "npm run test         # Executa testes" -ForegroundColor Gray
Write-Host "npm run lint         # Verifica qualidade do código" -ForegroundColor Gray
Write-Host "npm run format       # Formata código" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 Setup inicial concluído!" -ForegroundColor Green

# Perguntar se quer configurar SSH agora
$configurarSSH = Read-Host "Deseja configurar SSH para GitHub agora? (s/n)"
if ($configurarSSH -eq "s" -or $configurarSSH -eq "S") {
    Write-Host "Abrindo instruções de SSH..." -ForegroundColor Yellow
    Start-Process "https://docs.github.com/pt/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key"
}
