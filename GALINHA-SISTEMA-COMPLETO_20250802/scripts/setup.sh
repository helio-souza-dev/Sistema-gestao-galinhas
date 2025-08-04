#!/bin/bash

# Script de setup para Docker
echo "🐳 Configurando Sistema de Gestão de Galinhas com Docker"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais do Supabase!"
fi

# Construir e executar os containers
echo "🔨 Construindo containers..."
docker-compose build

echo "🚀 Iniciando aplicação..."
docker-compose up -d

echo "✅ Sistema iniciado com sucesso!"
echo "🌐 Acesse: http://localhost"
echo "📊 Aplicação: http://localhost:3000"

# Mostrar logs
echo "📋 Logs da aplicação:"
docker-compose logs -f galinha-app
