#!/bin/bash
# 🚀 Script para iniciantes - automatiza tudo!

echo "🐳 Iniciando Sistema de Gestão de Galinhas com Docker"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker Desktop primeiro!"
    exit 1
fi

echo "✅ Docker está rodando!"

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "📝 Crie o arquivo .env com suas credenciais do Supabase"
    echo "Exemplo:"
    echo "SUPABASE_URL=https://seu-projeto.supabase.co"
    echo "SUPABASE_ANON_KEY=sua_chave_aqui"
    exit 1
fi

echo "✅ Arquivo .env encontrado!"

# Parar containers antigos se existirem
echo "🧹 Limpando containers antigos..."
docker-compose down 2>/dev/null || true

# Construir e iniciar
echo "🔨 Construindo aplicação..."
docker-compose build

echo "🚀 Iniciando aplicação..."
docker-compose up -d

# Verificar se subiu
sleep 5
if docker-compose ps | grep -q "Up"; then
    echo "✅ Aplicação iniciada com sucesso!"
    echo "🌐 Acesse: http://localhost:3000"
    echo ""
    echo "📋 Para ver logs: docker-compose logs -f"
    echo "⏹️  Para parar: docker-compose down"
else
    echo "❌ Erro ao iniciar aplicação"
    echo "📋 Vendo logs:"
    docker-compose logs
fi
