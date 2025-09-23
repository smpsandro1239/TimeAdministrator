# Dockerfile para Frontend Angular
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine AS production

# Copiar configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados do Angular
COPY --from=builder /app/dist/time-administrator-frontend /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]