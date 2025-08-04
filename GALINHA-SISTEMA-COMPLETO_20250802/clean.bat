@echo off
REM 🧹 Script para limpeza

echo 🧹 Limpando Docker...

echo Parando todos os containers...
docker-compose down

echo Removendo imagens nao utilizadas...
docker image prune -f

echo Removendo containers parados...
docker container prune -f

echo ✅ Limpeza concluida!

pause
