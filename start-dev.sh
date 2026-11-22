#!/bin/bash

echo "========================================="
echo "   TimeAdministrator - Desenvolvimento"
echo "========================================="
echo

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto TimeAdministrator"
    exit 1
fi

echo "🔧 Instalando Angular CLI globalmente..."
npm install -g @angular/cli@18.2.21

echo
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install --force

echo
echo "🚀 Iniciando frontend em modo desenvolvimento..."
echo "📱 Acesse: http://localhost:4200"
echo

ng serve --port 4200