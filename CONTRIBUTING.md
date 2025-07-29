# 🤝 Guia de Contribuição

Obrigado por contribuir com o Shortener API! Este guia explica como contribuir de forma efetiva.

## 📋 Índice

- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Fluxo de Trabalho](#-fluxo-de-trabalho)
- [Padrão de Commits](#-padrão-de-commits)
- [Branches](#-branches)
- [Pull Requests](#-pull-requests)
- [Testes](#-testes)
- [Qualidade de Código](#-qualidade-de-código)

## 🛠 Configuração do Ambiente

### Pré-requisitos

- Node.js >= 18.0.0
- Docker e Docker Compose
- Git

### Instalação

```bash
# 1. Clone o repositório
git clone <repository-url>
cd shortener

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o banco de dados
npm run database

# 5. Execute as migrações
npm run prisma:dev

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

## 🔄 Fluxo de Trabalho

### 1. Criando uma Feature

```bash
# Crie uma nova branch a partir da main
git checkout main
git pull origin main
git checkout -b feature/nome-da-feature
```

### 2. Desenvolvendo

```bash
# Faça suas alterações
# Adicione testes se necessário
# Execute os testes
npm test

# Verifique a qualidade do código
npm run lint
npm run format
```

### 3. Commitando

O projeto usa **Conventional Commits** com hooks automatizados:

```bash
# Os hooks do Husky executarão automaticamente:
# - pre-commit: lint-staged + testes
# - commit-msg: validação da mensagem

git add .
git commit -m "feat(auth): adiciona middleware de autenticação JWT"
```

### 4. Fazendo Push

```bash
# O hook pre-push executará todos os testes + build
git push origin feature/nome-da-feature
```

## 📝 Padrão de Commits

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos Obrigatórios

| Tipo       | Descrição               | Exemplo                                         |
| ---------- | ----------------------- | ----------------------------------------------- |
| `feat`     | Nova funcionalidade     | `feat(auth): adiciona login com JWT`            |
| `fix`      | Correção de bug         | `fix(shorten): corrige validação de URL`        |
| `docs`     | Documentação            | `docs(readme): atualiza guia de instalação`     |
| `style`    | Formatação/estilo       | `style: aplica prettier em todos os arquivos`   |
| `refactor` | Refatoração             | `refactor(user): extrai validação para service` |
| `perf`     | Melhoria de performance | `perf(db): otimiza consulta de URLs`            |
| `test`     | Testes                  | `test(auth): adiciona testes do middleware`     |
| `chore`    | Manutenção              | `chore: atualiza dependências`                  |
| `ci`       | CI/CD                   | `ci: adiciona workflow do GitHub Actions`       |
| `build`    | Build                   | `build: configura Docker para produção`         |
| `revert`   | Reversão                | `revert: desfaz commit abc123`                  |

### Escopos Sugeridos

- `auth` - Autenticação
- `shorten` - Encurtamento de URLs
- `user` - Gerenciamento de usuários
- `db` - Banco de dados
- `api` - Endpoints da API
- `config` - Configurações
- `middleware` - Middlewares
- `validation` - Validações

### Regras

- ✅ Use o imperativo: "adiciona" não "adicionado"
- ✅ Primeira linha até 100 caracteres
- ✅ Corpo e rodapé até 100 caracteres por linha
- ✅ Descreva o "o quê" e o "porquê", não o "como"

## 🌿 Branches

### Convenção de Nomenclatura

```bash
feature/descricao-da-feature    # Nova funcionalidade
fix/descricao-do-bug           # Correção de bug
docs/descricao-da-doc          # Documentação
hotfix/descricao-urgente       # Correção urgente
```

### Exemplos

```bash
feature/auth-jwt-middleware
fix/url-validation-error
docs/api-documentation
hotfix/critical-security-patch
```

## 📥 Pull Requests

### Template

Use o template abaixo para seus PRs:

```markdown
## 📋 Descrição

Breve descrição das alterações realizadas.

## 🔄 Tipo de Mudança

- [ ] 🆕 Nova funcionalidade (feat)
- [ ] 🐛 Correção de bug (fix)
- [ ] 📚 Documentação (docs)
- [ ] 🎨 Estilo/formatação (style)
- [ ] ♻️ Refatoração (refactor)
- [ ] ⚡ Performance (perf)
- [ ] ✅ Testes (test)
- [ ] 🔧 Manutenção (chore)

## 🧪 Testes

- [ ] Testes passando localmente
- [ ] Novos testes adicionados (se aplicável)
- [ ] Cobertura de código mantida/melhorada

## 📝 Checklist

- [ ] Código revisado e testado
- [ ] Mensagens de commit seguem Conventional Commits
- [ ] Documentação atualizada (se necessário)
- [ ] Branch atualizada com a main
```

### Processo de Review

1. **Automated Checks**: CI/CD deve passar
2. **Code Review**: Pelo menos 1 aprovação
3. **Testing**: Testes manuais se necessário
4. **Merge**: Squash and merge preferível

## 🧪 Testes

### Executando Testes

```bash
# Todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Interface gráfica dos testes
npm run test:ui
```

### Escrevendo Testes

- **Unitários**: Para lógica de negócio isolada
- **Integração**: Para fluxos completos da API
- **E2E**: Para cenários críticos do usuário

Exemplo:

```typescript
describe('CreateShortUrlUseCase', () => {
  it('should create a short URL successfully', async () => {
    // Arrange
    const input = { original_url: 'https://example.com' };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.short_code).toHaveLength(6);
    expect(result.original_url).toBe(input.original_url);
  });
});
```

## 🔍 Qualidade de Código

### Ferramentas Automatizadas

O projeto possui hooks do Husky que executam automaticamente:

- **pre-commit**: lint-staged + testes rápidos
- **commit-msg**: validação do formato de commit
- **pre-push**: todos os testes + build

### Comandos Manuais

```bash
# Lint e correção automática
npm run lint

# Formatação de código
npm run format

# Verificação de tipos TypeScript
npm run type-check

# Build da aplicação
npm run build
```

### Padrões de Código

- **ESLint**: Regras de qualidade e estilo
- **Prettier**: Formatação consistente
- **TypeScript**: Tipagem estática
- **Arquitetura Limpa**: Separação de responsabilidades

## 🆘 Dúvidas?

- 📖 Leia a [documentação completa](README.md)
- 🐛 Abra uma [issue](../../issues/new)
- 💬 Entre em contato com a equipe

---

**Obrigado por contribuir! 🚀**
