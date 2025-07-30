# 🚀 Shortener API

API completa para encurtamento de URLs com autenticação JWT, gerenciamento de usuários e observabilidade integrada.

> ✅ **Status**: Deployment v1.2.0+ - Funcionando em produção no Vercel
>
> 🌐 **Live Demo**: [https://url-shortener-hazel-rho.vercel.app](https://url-shortener-hazel-rho.vercel.app)

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Configuração](#-configuração)
- [Uso da API](#-uso-da-api)
- [Endpoints](#-endpoints)
- [Documentação](#-documentação)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Observabilidade](#-observabilidade)
- [Contribuição](#-contribuição)

## ✨ Funcionalidades

- **🔐 Autenticação JWT**: Login seguro com tokens Bearer
- **✂️ Encurtamento de URLs**: Criação de links curtos de até 6 caracteres
- **🔄 Redirecionamento**: Redirecionamento automático para URLs originais
- **📊 Gerenciamento de URLs**: CRUD completo para usuários autenticados
- **📈 Contabilização de Cliques**: Rastreamento detalhado de acessos
- **🔍 Listagem Personalizada**: URLs do usuário com estatísticas
- **📚 Documentação Interativa**: Swagger UI integrada
- **📊 Observabilidade**: Logs estruturados, métricas e tracing
- **🛡️ Validação Robusta**: Validação de entrada com Zod
- **🔒 Soft Delete**: Exclusão lógica de registros
- **⚡ Serverless Ready**: Otimizado para deploy em Vercel

## 🛠️ Tecnologias

### Core Stack

- **Runtime**: Node.js 18+ com TypeScript 5.8+
- **Framework**: Express.js 4.19.2
- **ORM**: Prisma 6.12.0 com PostgreSQL
- **Autenticação**: JWT com bcrypt

### Qualidade e Desenvolvimento

- **Testes**: Vitest + Supertest
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Commits**: Commitlint (Conventional Commits)

### Observabilidade

- **Logs**: Winston com contexto estruturado
- **Métricas**: Coleta personalizada de métricas HTTP
- **Tracing**: OpenTelemetry com Jaeger
- **Documentação**: Swagger/OpenAPI 3.0

### Deploy e Infraestrutura

- **Produção**: Vercel (Serverless)
- **Banco**: Neon PostgreSQL (Serverless)
- **Desenvolvimento**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 📁 Estrutura do Projeto

```
src/
├── config/                     # Configurações
│   ├── env.ts                 # Variáveis de ambiente com validação
│   ├── swagger.ts             # Configuração OpenAPI/Swagger
│   └── tracing.ts             # OpenTelemetry setup
├── database/
│   └── prisma.ts              # Cliente Prisma configurado
├── features/                   # Funcionalidades por domínio
│   ├── auth/                  # Sistema de autenticação
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── useCases/          # Regras de negócio
│   │   └── routes/            # Rotas HTTP
│   ├── shorten/               # Encurtamento de URLs
│   │   ├── dto/               # Validações de entrada
│   │   ├── entities/          # Entidades de domínio
│   │   ├── repositories/      # Camada de dados
│   │   ├── useCases/          # Casos de uso
│   │   └── routes/            # Rotas da API
│   └── users/                 # Gerenciamento de usuários
├── shared/                     # Código compartilhado
│   ├── middlewares/           # Middlewares personalizados
│   ├── observability/         # Logs, métricas e tracing
│   ├── tests/                 # Testes integrados
│   └── utils/                 # Utilitários
└── server.ts                  # Servidor principal
```

## 🚀 Como Rodar Localmente

### Pré-requisitos

- **Node.js**: 18.0.0 ou superior
- **PNPM**: 8.0.0 ou superior (gerenciador de pacotes)
- **PostgreSQL**: 16+ ou Docker
- **Git**: Para clonagem do repositório

### 1. Clone o Repositório

```bash
git clone https://github.com/MarcossVini/URL-Shortener.git
cd URL-Shortener
```

### 2. Instale as Dependências

```bash
pnpm install
```

### 3. Configure o Banco de Dados

#### Opção A: Docker (Recomendado)

```bash
# Sobe PostgreSQL, Adminer e Jaeger
pnpm run database

# Ou individualmente
docker compose up -d postgres
```

#### Opção B: PostgreSQL Local

- Instale PostgreSQL localmente
- Crie um banco chamado `shortener`

### 4. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Banco de dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shortener"

# JWT
JWT_SECRET="sua-chave-super-secreta-de-pelo-menos-32-caracteres"

# Aplicação
PORT=3000
NODE_ENV=development
BASE_URL="http://localhost:3000"

# Logs (opcional)
LOG_LEVEL=info

# OpenTelemetry (opcional)
OTEL_SERVICE_NAME=shortener-api
OTEL_EXPORTER_JAEGER_ENDPOINT=http://localhost:14268/api/traces
```

### 5. Execute as Migrações

```bash
# Gera o cliente Prisma
pnpm prisma:generate

# Executa as migrações
pnpm prisma:dev

# Popula com dados de exemplo (opcional)
pnpm seed
```

### 6. Inicie o Servidor

```bash
# Desenvolvimento (com hot reload)
pnpm dev

# Produção
pnpm build
pnpm start
```

### 7. Acesse a Aplicação

- **API**: [http://localhost:3000](http://localhost:3000)
- **Documentação**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)
- **Métricas**: [http://localhost:3000/metrics](http://localhost:3000/metrics)
- **Adminer** (DB): [http://localhost:8080](http://localhost:8080)
- **Jaeger** (Tracing): [http://localhost:16686](http://localhost:16686)

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável       | Descrição                          | Exemplo                               | Obrigatória |
| -------------- | ---------------------------------- | ------------------------------------- | ----------- |
| `DATABASE_URL` | String de conexão PostgreSQL       | `postgresql://user:pass@host:5432/db` | ✅          |
| `JWT_SECRET`   | Chave secreta para JWT (32+ chars) | `sua-chave-secreta-muito-segura`      | ✅          |
| `BASE_URL`     | URL base da aplicação              | `http://localhost:3000`               | ✅          |
| `PORT`         | Porta do servidor                  | `3000`                                | ❌          |
| `NODE_ENV`     | Ambiente de execução               | `development`, `production`           | ❌          |
| `LOG_LEVEL`    | Nível de log                       | `error`, `warn`, `info`, `debug`      | ❌          |

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia com hot reload
pnpm build            # Compila TypeScript
pnpm start            # Inicia versão compilada

# Banco de dados
pnpm database         # Sobe containers Docker
pnpm database:down    # Para containers
pnpm prisma:dev       # Migrations desenvolvimento
pnpm prisma:generate  # Gera cliente Prisma
pnpm seed             # Popula dados de exemplo

# Qualidade
pnpm test             # Executa testes
pnpm test:coverage    # Testes com coverage
pnpm test:ui          # Interface visual dos testes
pnpm lint             # ESLint
pnpm format           # Prettier

# Git e Deploy
pnpm commit           # Commit com Commitizen
pnpm release          # Cria nova versão
```

## 📖 Uso da API

### 1. Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

### 2. Encurtar URL

```bash
# Com autenticação (URL fica associada ao usuário)
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "original_url": "https://www.google.com"
  }'

# Sem autenticação (URL anônima)
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "original_url": "https://www.google.com"
  }'
```

**Resposta:**

```json
{
  "short_url": "http://localhost:3000/aZbKq7",
  "original_url": "https://www.google.com"
}
```

### 3. Usar URL Encurtada

```bash
# Acesse diretamente no navegador ou via curl
curl -L http://localhost:3000/aZbKq7
# Redireciona automaticamente para https://www.google.com
```

### 4. Gerenciar Suas URLs

```bash
# Listar URLs do usuário com estatísticas
curl -X GET http://localhost:3000/user/urls \
  -H "Authorization: Bearer <seu-token>"

# Atualizar URL de destino
curl -X PATCH http://localhost:3000/user/urls/<url-id> \
  -H "Authorization: Bearer <seu-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "original_url": "https://novo-site.com"
  }'

# Deletar URL (soft delete)
curl -X DELETE http://localhost:3000/user/urls/<url-id> \
  -H "Authorization: Bearer <seu-token>"
```

## 🔗 Endpoints

### 🔐 Autenticação

- `POST /auth/login` - Fazer login e obter token JWT

### ✂️ Encurtamento

- `POST /shorten` - Criar URL encurtada (com/sem autenticação)
- `GET /{shortCode}` - Redirecionar para URL original

### 👤 Gerenciamento de URLs (Requer Autenticação)

- `GET /user/urls` - Listar URLs do usuário com estatísticas
- `PATCH /user/urls/{id}` - Atualizar URL de destino
- `DELETE /user/urls/{id}` - Deletar URL (soft delete)

### 🔧 Sistema

- `GET /health` - Health check da aplicação
- `GET /metrics` - Métricas da aplicação (Prometheus)
- `GET /` - Redireciona para documentação
- `GET /api-docs` - Documentação Swagger UI

## 📚 Documentação

### 🌐 Produção

**Swagger UI**: [https://url-shortener-hazel-rho.vercel.app/api-docs](https://url-shortener-hazel-rho.vercel.app/api-docs)

### 💻 Local

**Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### 📋 Recursos da Documentação

- ✅ **Interface interativa** para testar todos os endpoints
- ✅ **Autenticação JWT integrada** (botão "Authorize")
- ✅ **Exemplos de request/response** completos
- ✅ **Schemas detalhados** com validações
- ✅ **Códigos de erro** com descrições
- ✅ **Try it out** funcional para todos os endpoints

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
pnpm test

# Com coverage
pnpm test:coverage

# Interface visual (recomendado)
pnpm test:ui

# Apenas um arquivo
pnpm test auth.api.test.ts
```

### Cobertura Atual

- ✅ **Testes de API**: Endpoints completos
- ✅ **Testes de Validação**: DTOs e schemas
- ✅ **Testes de Observabilidade**: Logs e métricas
- ✅ **38 testes** passando
- ✅ **Cobertura > 80%**

### Tipos de Teste

```bash
src/shared/tests/
├── auth.api.test.ts          # Testes de autenticação
├── shorten.api.test.ts       # Testes de encurtamento
├── user.api.test.ts          # Testes de gerenciamento
├── dto.validation.test.ts    # Testes de validação
└── observability.test.ts     # Testes de observabilidade
```

## 🚀 Deploy

### 🌐 Produção

O projeto está deployado automaticamente na Vercel:

**🔗 URL Base**: [https://url-shortener-hazel-rho.vercel.app](https://url-shortener-hazel-rho.vercel.app)

**📖 Swagger**: [https://url-shortener-hazel-rho.vercel.app/api-docs](https://url-shortener-hazel-rho.vercel.app/api-docs)

### ⚙️ Configuração do Deploy

1. **Vercel**: Serverless deployment com CI/CD automático
2. **Neon PostgreSQL**: Banco de dados serverless na produção
3. **Git Tags**: Deploy automático em push de tags (v1.x.x)

### 🏷️ Versionamento

```bash
# Criar nova versão
git tag v1.2.1
git push origin v1.2.1

# Deploy automático será acionado
```

### 🌍 Variáveis de Produção

```env
NODE_ENV=production
DATABASE_URL="postgresql://..." # Neon DB
JWT_SECRET="production-secret"
BASE_URL="https://url-shortener-hazel-rho.vercel.app"
```

## 📊 Observabilidade

### 📈 Métricas

- **Endpoint**: `/metrics` (formato Prometheus)
- **Métricas disponíveis**:
  - Total de URLs criadas
  - Cliques por URL
  - Tempo de resposta das APIs
  - Status de saúde da aplicação

### 📝 Logs

```bash
# Visualizar logs
pnpm logs

# Logs estruturados com Winston
# Arquivos: logs/combined.log, logs/error.log
```

### 🔍 Tracing

- **OpenTelemetry** configurado
- **Jaeger** para tracing distribuído (opcional)
- **Correlação de requisições** com trace IDs

### 🏥 Health Check

```bash
# Status da aplicação
curl http://localhost:3000/health

# Resposta esperada
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

## 🐳 Docker

### 🔨 Build e Execução

```bash
# Build da imagem
docker build -t url-shortener .

# Executar com Docker Compose
docker-compose up -d

# Verificar status
docker-compose ps
```

### 📋 Serviços

O `docker-compose.yml` inclui:

- ✅ **Aplicação Node.js** (porta 3000)
- ✅ **PostgreSQL** (porta 5432)
- ✅ **Volumes persistentes** para dados
- ✅ **Rede interna** para comunicação

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev           # Servidor em modo desenvolvimento (watch)
pnpm build         # Build de produção
pnpm start         # Iniciar servidor de produção

# Banco de Dados
pnpm db:push       # Aplicar schema ao banco
pnpm db:migrate    # Executar migrations
pnpm db:studio     # Abrir Prisma Studio
pnpm db:seed       # Popular banco com dados de teste
pnpm db:reset      # Resetar banco completamente

# Testes
pnpm test          # Executar testes
pnpm test:ui       # Interface de testes (Vitest UI)
pnpm test:coverage # Testes com cobertura

# Qualidade de Código
pnpm lint          # ESLint
pnpm format        # Prettier
pnpm type-check    # TypeScript check

# Logs e Monitoramento
pnpm logs          # Visualizar logs
```

## 🤝 Contribuição

### 📋 Workflow

1. **Fork** do repositório
2. **Clone** seu fork localmente
3. **Branch** para sua feature: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Pull Request** no repositório principal

### 🔍 Padrões

- ✅ **Commits convencionais** (Commitlint)
- ✅ **Testes obrigatórios** (Husky pre-commit)
- ✅ **Linting automático** (ESLint + Prettier)
- ✅ **TypeScript strict mode**
- ✅ **Cobertura de testes > 80%**

### 📝 Documentação

- **Contribute**: Leia `CONTRIBUTING.md`
- **Checklist**: Veja `PROJECT_CHECKLIST.md`
- **Observabilidade**: `docs/OBSERVABILITY.md`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 👥 Equipe

- **Desenvolvedor Principal**: [Seu Nome]
- **Tecnologias**: Node.js, TypeScript, Express, Prisma, PostgreSQL
- **Deploy**: Vercel + Neon Database

---

## 🎯 Status do Projeto

✅ **Completo** - Todos os requisitos implementados  
🚀 **Produção** - Deploy ativo e funcional  
📊 **Monitorado** - Observabilidade completa  
🧪 **Testado** - 38 testes passando

**URL Demo**: [https://url-shortener-hazel-rho.vercel.app](https://url-shortener-hazel-rho.vercel.app)

````

## 🐳 Docker

### Desenvolvimento

```bash
# Iniciar banco de dados
pnpm run database

# Executar migrações
pnpm prisma:dev

# Iniciar aplicação
pnpm dev
````

### Produção

```bash
# Build da imagem
docker build -t shortener-api .

# Executar container
docker run -p 3000:3000 shortener-api
```

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor de desenvolvimento
pnpm build            # Compilar TypeScript
pnpm start            # Iniciar servidor de produção

# Banco de dados
pnpm prisma:dev       # Executar migrações
pnpm prisma:generate  # Gerar cliente Prisma
pnpm seed             # Popular banco com dados de teste

# Docker
pnpm run database     # Iniciar banco com Docker
pnpm run database:down # Parar containers

# Testes
pnpm test             # Executar testes
pnpm test:coverage    # Cobertura de testes
pnpm test:ui          # Interface de testes

# Qualidade de código
pnpm lint             # Linting
pnpm format           # Formatação
```

## 🚀 Deploy

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Railway

1. Conecte ao Railway
2. Configure PostgreSQL
3. Configure variáveis de ambiente

### AWS/DigitalOcean

1. Configure servidor
2. Configure PostgreSQL
3. Use PM2 para gerenciar processo

## 🔄 Git Workflow

Este projeto segue um fluxo de trabalho estruturado com Conventional Commits e automação via Husky.

### 📝 Padrão de Commits

Utilizamos **Conventional Commits** para manter um histórico limpo e semântico:

```bash
<tipo>(<escopo>): <descrição>

feat(auth): adiciona middleware de autenticação JWT
fix(shorten): corrige validação de URL inválida
docs(readme): atualiza documentação de instalação
```

#### Tipos disponíveis:

- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação (sem mudança de código)
- `refactor` - Refatoração
- `perf` - Melhoria de performance
- `test` - Testes
- `chore` - Tarefas de manutenção
- `ci` - Configurações de CI/CD
- `build` - Sistema de build
- `revert` - Reversão de commit

#### Escopos sugeridos:

- `auth` - Autenticação
- `shorten` - Encurtamento de URLs
- `user` - Gerenciamento de usuários
- `db` - Banco de dados
- `api` - API endpoints
- `config` - Configurações

### 🌿 Fluxo de Branches

```bash
main                    # Branch principal (produção)
├── feature/auth-jwt    # Nova funcionalidade
├── fix/url-validation  # Correção de bug
├── docs/api-guide     # Documentação
└── hotfix/critical-bug # Correção urgente
```

### 🔧 Automação com Husky

O projeto possui hooks automatizados:

- **pre-commit**: Executa lint-staged + testes
- **commit-msg**: Valida formato do commit
- **pre-push**: Executa todos os testes + build

### 📋 Comandos Úteis

```bash
# Commit interativo com template
git commit

# Formatação automática
npm run format

# Lint + fix
npm run lint

# Verificar se tudo está OK antes do commit
npm test && npm run build
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: support@shortener.com
- **Documentação**: http://localhost:3000/docs
- **Issues**: GitHub Issues

---

**Desenvolvido com ❤️ usando Node.js, TypeScript e Express**
