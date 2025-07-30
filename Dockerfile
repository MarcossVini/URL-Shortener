FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema e pnpm
RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm@8

# Copiar arquivos de configuração e prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Gerar cliente Prisma 
# Nota: A DATABASE_URL real será fornecida via ARG no build ou ENV no runtime
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build
RUN pnpm run build

EXPOSE 3000

# A DATABASE_URL real será fornecida via environment no runtime
ENV NODE_ENV=production

CMD ["node", "dist/src/server.js"] 