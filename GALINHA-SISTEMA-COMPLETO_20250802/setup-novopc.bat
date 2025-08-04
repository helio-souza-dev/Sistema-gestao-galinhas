@echo off
REM 🆕 Script COMPLETO para configurar no novo PC
REM Este script faz TUDO automaticamente!

echo.
echo ========================================
echo 🐔 SISTEMA DE GESTAO DE GALINHAS
echo 🆕 Configuracao Automatica - Novo PC
echo ========================================
echo.

REM Passo 1: Verificar Docker Desktop
echo 🔍 [1/8] Verificando Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop NAO esta instalado!
    echo.
    echo 📥 SOLUCAO:
    echo 1. Baixe em: https://www.docker.com/products/docker-desktop/
    echo 2. Instale o Docker Desktop
    echo 3. Reinicie o PC
    echo 4. Execute este script novamente
    echo.
    pause
    exit /b 1
)
echo ✅ Docker Desktop encontrado!

REM Passo 2: Verificar se Docker está rodando
echo 🔍 [2/8] Verificando se Docker esta rodando...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop NAO esta rodando!
    echo.
    echo 🐳 SOLUCAO:
    echo 1. Procure o icone da baleia na barra de tarefas
    echo 2. Se nao estiver la, abra "Docker Desktop"
    echo 3. Aguarde o icone ficar AZUL (pode demorar 2-3 minutos)
    echo 4. Execute este script novamente
    echo.
    pause
    exit /b 1
)
echo ✅ Docker esta rodando!

REM Passo 3: Verificar arquivos do projeto
echo 🔍 [3/8] Verificando arquivos do projeto...
set "arquivos_ok=1"

if not exist "package.json" (
    echo ❌ package.json nao encontrado!
    set "arquivos_ok=0"
)

if not exist "Dockerfile" (
    echo ❌ Dockerfile nao encontrado!
    set "arquivos_ok=0"
)

if not exist "docker-compose.yml" (
    echo ❌ docker-compose.yml nao encontrado!
    set "arquivos_ok=0"
)

if not exist "app" (
    echo ❌ Pasta 'app' nao encontrada!
    set "arquivos_ok=0"
)

if "%arquivos_ok%"=="0" (
    echo.
    echo ❌ ARQUIVOS DO PROJETO INCOMPLETOS!
    echo 📁 Certifique-se de estar na pasta correta do backup
    echo 📋 A pasta deve conter: package.json, Dockerfile, app/, etc.
    echo.
    pause
    exit /b 1
)
echo ✅ Todos os arquivos encontrados!

REM Passo 4: Configurar arquivo .env
echo 🔍 [4/8] Configurando credenciais (.env)...
if not exist ".env" (
    echo ⚠️ Arquivo .env nao encontrado! Criando...
    (
    echo # 🔐 CONFIGURE SUAS CREDENCIAIS DO SUPABASE
    echo # Substitua pelos valores reais do seu projeto
    echo.
    echo SUPABASE_URL=https://seu-projeto.supabase.co
    echo SUPABASE_ANON_KEY=sua_chave_anonima_aqui
    echo.
    echo # Exemplo:
    echo # SUPABASE_URL=https://abcd1234.supabase.co
    echo # SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ) > .env
    
    echo ✅ Arquivo .env criado!
    echo.
    echo ⚠️ IMPORTANTE: Voce precisa editar o arquivo .env AGORA!
    echo 📝 Substitua pelas suas credenciais reais do Supabase
    echo.
    set /p "continuar=Deseja abrir o arquivo .env para editar? (S/N): "
    if /i "%continuar%"=="S" (
        notepad .env
        echo.
        echo ✅ Arquivo .env editado!
        echo ⚠️ Certifique-se de ter salvado as credenciais corretas
        pause
    )
) else (
    echo ✅ Arquivo .env ja existe!
    
    REM Verificar se tem credenciais reais
    findstr "seu-projeto.supabase.co" .env >nul
    if %errorlevel% equ 0 (
        echo ⚠️ ATENCAO: Arquivo .env parece ter credenciais de exemplo!
        echo.
        set /p "editar=Deseja editar o arquivo .env? (S/N): "
        if /i "%editar%"=="S" (
            notepad .env
            echo ✅ Arquivo .env editado!
        )
    )
)

REM Passo 5: Limpar containers antigos (se existirem)
echo 🧹 [5/8] Limpando containers antigos...
docker-compose down 2>nul
docker system prune -f >nul 2>&1
echo ✅ Limpeza concluida!

REM Passo 6: Construir aplicação
echo 🔨 [6/8] Construindo aplicacao (pode demorar alguns minutos)...
echo ⏳ Aguarde... Baixando dependencias e construindo imagem...
docker-compose build
if %errorlevel% neq 0 (
    echo ❌ ERRO ao construir aplicacao!
    echo.
    echo 🔧 POSSIVEIS SOLUCOES:
    echo 1. Verificar conexao com internet
    echo 2. Reiniciar Docker Desktop
    echo 3. Executar: docker system prune -a
    echo 4. Tentar novamente
    echo.
    pause
    exit /b 1
)
echo ✅ Aplicacao construida com sucesso!

REM Passo 7: Iniciar aplicação
echo 🚀 [7/8] Iniciando aplicacao...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ ERRO ao iniciar aplicacao!
    echo 📋 Vendo logs para diagnostico...
    docker-compose logs
    pause
    exit /b 1
)
echo ✅ Aplicacao iniciada!

REM Passo 8: Verificar se está funcionando
echo 🔍 [8/8] Verificando se aplicacao esta funcionando...
timeout /t 10 /nobreak >nul

docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ SUCESSO! APLICACAO CONFIGURADA!
    echo ========================================
    echo.
    echo 🌐 Acesse: http://localhost:3000
    echo 📱 Sistema de Gestao de Galinhas esta rodando!
    echo.
    echo 📋 COMANDOS UTEIS:
    echo - Ver logs: docker-compose logs -f
    echo - Parar: docker-compose down
    echo - Reiniciar: docker-compose restart
    echo.
    echo 🎯 PROXIMOS PASSOS:
    echo 1. Abra http://localhost:3000 no navegador
    echo 2. Teste o sistema
    echo 3. Configure suas galinhas e transacoes
    echo.
) else (
    echo ❌ ERRO: Aplicacao nao esta rodando corretamente
    echo.
    echo 📋 DIAGNOSTICO:
    docker-compose ps
    echo.
    echo 📋 LOGS:
    docker-compose logs
    echo.
    echo 🔧 TENTE:
    echo 1. docker-compose down
    echo 2. docker-compose up -d
)

echo.
echo Pressione qualquer tecla para continuar...
pause >nul
