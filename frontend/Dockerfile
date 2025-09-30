# Dockerfile para Frontend Angular
FROM node:20-alpine AS builder

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@18

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN ng build --configuration production

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
