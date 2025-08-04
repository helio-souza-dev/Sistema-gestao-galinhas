@echo off
REM 🚀 Script para Windows - Iniciar aplicação

echo 🐳 Iniciando Sistema de Gestao de Galinhas com Docker

REM Verificar se Docker está rodando
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker nao esta rodando. Inicie o Docker Desktop primeiro!
    echo 📱 Procure o icone da baleia na barra de tarefas
    pause
    exit /b 1
)

echo ✅ Docker esta rodando!

REM Verificar se arquivo .env existe
if not exist .env (
    echo ❌ Arquivo .env nao encontrado!
    echo 📝 Crie o arquivo .env com suas credenciais do Supabase
    echo Exemplo:
    echo SUPABASE_URL=https://seu-projeto.supabase.co
    echo SUPABASE_ANON_KEY=sua_chave_aqui
    pause
    exit /b 1
)

echo ✅ Arquivo .env encontrado!

REM Parar containers antigos
echo 🧹 Limpando containers antigos...
docker-compose down 2>nul

REM Construir e iniciar
echo 🔨 Construindo aplicacao...
docker-compose build

echo 🚀 Iniciando aplicacao...
docker-compose up -d

REM Aguardar um pouco
timeout /t 5 /nobreak >nul

REM Verificar se subiu
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Aplicacao iniciada com sucesso!
    echo 🌐 Acesse: http://localhost:3000
    echo.
    echo 📋 Para ver logs: docker-compose logs -f
    echo ⏹️  Para parar: stop.bat
) else (
    echo ❌ Erro ao iniciar aplicacao
    echo 📋 Vendo logs:
    docker-compose logs
)

pause
