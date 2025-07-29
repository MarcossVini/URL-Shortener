# 🚀 Shortener API

API completa para encurtamento de URLs com autenticação JWT e gerenciamento de usuários.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Documentação](#-documentação)
- [Testes](#-testes)
- [Deploy](#-deploy)

## ✨ Funcionalidades

- **🔐 Autenticação JWT**: Login seguro com tokens
- **✂️ Encurtamento de URLs**: Criação de links curtos
- **🔄 Redirecionamento**: Redirecionamento automático para URLs originais
- **📊 Gerenciamento de URLs**: CRUD completo para usuários autenticados
- **📈 Contabilização**: Rastreamento de cliques e acessos
- **📚 Documentação Interativa**: Swagger UI para testes

## 🛠️ Tecnologias

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Banco**: PostgreSQL
- **Autenticação**: JWT
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker + Docker Compose

## 📁 Estrutura do Projeto

```
src/
├── config/                 # Configurações
│   ├── env.ts             # Variáveis de ambiente
│   └── swagger.ts         # Configuração Swagger
├── features/              # Funcionalidades por domínio
│   ├── auth/              # Autenticação
│   │   ├── dto/
│   │   ├── useCases/
│   │   └── routes/
│   └── shorten/           # Encurtamento de URLs
│       ├── dto/
│       ├── entities/
│       ├── useCases/
│       └── routes/
├── shared/                # Código compartilhado
│   ├── middlewares/       # Middlewares
│   └── utils/             # Utilitários
└── server.ts              # Servidor principal
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Passos

1. **Clone o repositório**

```bash
git clone <repository-url>
cd shortener
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o banco de dados**

```bash
# Com Docker (recomendado)
pnpm run database

# Ou configure um PostgreSQL local
```

5. **Execute as migrações**

```bash
pnpm prisma:dev
```

6. **Popule o banco com dados de teste**

```bash
pnpm seed
```

7. **Inicie o servidor**

```bash
pnpm dev
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shortener"
JWT_SECRET="your-super-secret-jwt-key-with-at-least-32-characters"
BASE_URL="http://localhost:3000"
ENABLE_OBSERVABILITY=false
LOG_LEVEL=info
```

### Usuários de Teste

Após executar `pnpm seed`, você terá acesso a:

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## 📖 Uso

### 1. Autenticação

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

### 2. Encurtar URL

```bash
# Com autenticação
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{"original_url": "https://www.google.com"}'

# Sem autenticação
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://www.google.com"}'
```

### 3. Redirecionamento

```bash
curl -L http://localhost:3000/shorten/<short-code>
```

### 4. Gerenciar URLs

```bash
# Listar URLs do usuário
curl -X GET http://localhost:3000/user/urls \
  -H "Authorization: Bearer <seu-token>"

# Atualizar URL
curl -X PATCH http://localhost:3000/user/urls/<url-id> \
  -H "Authorization: Bearer <seu-token>" \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://novo-site.com"}'

# Deletar URL
curl -X DELETE http://localhost:3000/user/urls/<url-id> \
  -H "Authorization: Bearer <seu-token>"
```

## 🔗 API Endpoints

### Autenticação

- `POST /auth/login` - Login de usuário

### Encurtamento

- `POST /shorten` - Criar URL encurtada
- `GET /shorten/{shortCode}` - Redirecionar para URL original

### Gerenciamento (Autenticado)

- `GET /user/urls` - Listar URLs do usuário
- `PATCH /user/urls/{id}` - Atualizar URL
- `DELETE /user/urls/{id}` - Deletar URL

### Sistema

- `GET /health` - Health check
- `GET /docs` - Documentação Swagger

## 📚 Documentação

A documentação interativa está disponível em:

**🌐 Swagger UI**: http://localhost:3000/docs

### Recursos da Documentação

- ✅ **Interface interativa** para testar endpoints
- ✅ **Exemplos de request/response**
- ✅ **Autenticação JWT integrada**
- ✅ **Schemas completos**
- ✅ **Códigos de erro detalhados**

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Cobertura de testes
pnpm test:coverage

# Interface de testes
pnpm test:ui
```

## 🐳 Docker

### Desenvolvimento

```bash
# Iniciar banco de dados
pnpm run database

# Executar migrações
pnpm prisma:dev

# Iniciar aplicação
pnpm dev
```

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
