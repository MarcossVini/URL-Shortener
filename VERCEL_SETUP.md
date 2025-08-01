# Vercel Environment Variables Setup Guide

## 🔧 Required Environment Variables for Vercel

### 1. Database Configuration

```
DATABASE_URL=postgresql://username:password@host:5432/database_name?sslmode=require
```

### 2. JWT Configuration

```
JWT_SECRET=your-super-secret-jwt-key-with-at-least-32-characters-for-production
```

### 3. Application Configuration

```
NODE_ENV=production
BASE_URL=https://your-app-name.vercel.app
LOG_LEVEL=info
ENABLE_OBSERVABILITY=true
```

## 🚀 Como configurar no Vercel

### Opção 1: Via Dashboard Vercel

1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá para Settings > Environment Variables
4. Adicione cada variável listada acima

### Opção 2: Via CLI Vercel

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV
vercel env add BASE_URL
vercel env add LOG_LEVEL
vercel env add ENABLE_OBSERVABILITY
```

### Opção 3: Via arquivo .env (apenas para referência)

**NUNCA commite este arquivo no git!**

```env
# Production Environment Variables
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.postgres.vercel-storage.com/database_name?sslmode=require"
JWT_SECRET="production-jwt-secret-key-with-at-least-32-characters-very-secure"
NODE_ENV="production"
BASE_URL="https://your-app-name.vercel.app"
LOG_LEVEL="info"
ENABLE_OBSERVABILITY="true"
```

## 🗄️ Neon Database Connection

### Configuração Neon PostgreSQL:

1. Acesse https://neon.tech
2. Crie um novo projeto
3. Copie a connection string
4. Adicione como DATABASE_URL no Vercel

Exemplo de connection string Neon:

```
postgresql://username:password@ep-xxx-xxx.us-east-1.postgres.vercel-storage.com/neondb?sslmode=require
```

## 🔐 JWT Secret Generation

Para gerar um JWT secret seguro:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ou use este comando:

```bash
openssl rand -hex 64
```

## ✅ Verificação da Configuração

Após configurar as variáveis, acesse:

- `https://your-app.vercel.app/health` - Health check
- `https://your-app.vercel.app/api-docs` - Documentação Swagger
- `https://your-app.vercel.app/metrics` - Métricas da aplicação

## 🚨 Importante

- ✅ Use HTTPS em produção
- ✅ Configure CORS adequadamente
- ✅ Use secrets seguros (mínimo 32 caracteres)
- ✅ Configure SSL/TLS no banco de dados
- ❌ Nunca commite credenciais no código
- ❌ Nunca use dados de desenvolvimento em produção
