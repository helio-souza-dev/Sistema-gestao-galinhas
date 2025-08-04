#!/bin/bash
# ⏹️ Script para parar tudo

echo "⏹️ Parando Sistema de Gestão de Galinhas..."

docker-compose down

echo "✅ Sistema parado!"
echo "🔍 Para ver status: docker-compose ps"
