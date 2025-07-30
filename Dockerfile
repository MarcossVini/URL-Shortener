FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar todas as dependências (incluindo devDependencies)
RUN pnpm install --no-frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/dummy"
RUN pnpm prisma generate

# Build da aplicação
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"] 