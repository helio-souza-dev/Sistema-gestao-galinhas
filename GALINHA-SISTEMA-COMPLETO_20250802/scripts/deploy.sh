#!/bin/bash

# Script para deploy em outro PC
echo "🚀 Deploy do Sistema de Gestão de Galinhas"

# Parar containers existentes
echo "⏹️  Parando containers existentes..."
docker-compose down

# Remover imagens antigas
echo "🧹 Limpando imagens antigas..."
docker image prune -f

# Construir nova versão
echo "🔨 Construindo nova versão..."
docker-compose build --no-cache

# Iniciar aplicação
echo "▶️  Iniciando aplicação..."
docker-compose up -d

# Verificar status
echo "🔍 Verificando status..."
docker-compose ps

echo "✅ Deploy concluído!"
echo "🌐 Sistema disponível em: http://localhost"
