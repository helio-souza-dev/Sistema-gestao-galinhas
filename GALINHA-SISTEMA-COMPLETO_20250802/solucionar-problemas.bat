@echo off
REM 🔧 Script para solucionar problemas comuns

echo 🔧 Solucionador de Problemas - Sistema de Galinhas
echo.

echo Escolha o problema:
echo 1. Aplicacao nao abre (erro de porta)
echo 2. Docker nao esta rodando
echo 3. Erro de credenciais Supabase
echo 4. Aplicacao lenta ou travando
echo 5. Limpar tudo e recomecar
echo 0. Sair
echo.

set /p "opcao=Digite o numero da opcao: "

if "%opcao%"=="1" goto porta
if "%opcao%"=="2" goto docker
if "%opcao%"=="3" goto credenciais
if "%opcao%"=="4" goto performance
if "%opcao%"=="5" goto limpar
if "%opcao%"=="0" goto sair
goto menu

:porta
echo.
echo 🔧 Solucionando problema de porta...
echo Parando aplicacao...
docker-compose down
echo Mudando para porta 3001...
(
echo version: '3.8'
echo.
echo services:
echo   galinha-app:
echo     build: .
echo     ports:
echo       - "3001:3000"  # Mudou para 3001
echo     environment:
echo       - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
echo       - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
echo     restart: unless-stopped
) > docker-compose-3001.yml
echo Iniciando na porta 3001...
docker-compose -f docker-compose-3001.yml up -d
echo ✅ Aplicacao rodando em: http://localhost:3001
goto fim

:docker
echo.
echo 🔧 Verificando Docker Desktop...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker nao esta rodando!
    echo 1. Abra Docker Desktop
    echo 2. Aguarde icone ficar azul
    echo 3. Execute este script novamente
) else (
    echo ✅ Docker esta funcionando!
)
goto fim

:credenciais
echo.
echo 🔧 Verificando credenciais Supabase...
if exist ".env" (
    echo Arquivo .env encontrado. Abrindo para edicao...
    notepad .env
    echo ✅ Reiniciando aplicacao com novas credenciais...
    docker-compose down
    docker-compose up -d
) else (
    echo ❌ Arquivo .env nao encontrado!
    echo Execute setup-novo-pc-completo.bat primeiro
)
goto fim

:performance
echo.
echo 🔧 Otimizando performance...
echo Reiniciando containers...
docker-compose restart
echo Limpando cache...
docker system prune -f
echo ✅ Otimizacao concluida!
goto fim

:limpar
echo.
echo 🧹 Limpando tudo e recomecando...
echo ⚠️ Isso vai parar e remover todos os containers!
set /p "confirma=Tem certeza? (S/N): "
if /i "%confirma%"=="S" (
    docker-compose down
    docker system prune -a -f
    echo ✅ Limpeza concluida!
    echo 🚀 Execute setup-novo-pc-completo.bat para recomecar
)
goto fim

:sair
exit /b 0

:fim
echo.
pause
goto menu
