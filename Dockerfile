FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema e pnpm
RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm@8

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar prisma
COPY prisma ./prisma/

# Gerar cliente Prisma
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build
RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/src/server.js"] 