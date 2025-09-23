# Dockerfile para Backend NestJS
FROM node:18-alpine AS builder

# Instalar NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

# Instalar dumb-init para gestão de processos
RUN apk add --no-cache dumb-init

# Criar utilizador não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar dependências do estágio builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Criar diretório para logs
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app/logs

# Mudar para utilizador não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]