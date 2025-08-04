@echo off
REM 📦 Script para preparar pasta para transferência

echo 📦 Preparando pasta para transferencia...

REM Criar pasta final com nome claro
set "data=%date:~6,4%%date:~3,2%%date:~0,2%"
set "pasta_final=GALINHA-SISTEMA-COMPLETO_%data%"

echo 📁 Criando pasta: %pasta_final%
mkdir "%pasta_final%" 2>nul

REM Copiar arquivos essenciais
echo 📋 Copiando arquivos essenciais...
copy "package.json" "%pasta_final%\" >nul 2>&1
copy "Dockerfile" "%pasta_final%\" >nul 2>&1
copy "docker-compose.yml" "%pasta_final%\" >nul 2>&1
copy ".env" "%pasta_final%\" >nul 2>&1
copy "*.bat" "%pasta_final%\" >nul 2>&1
copy "*.md" "%pasta_final%\" >nul 2>&1
copy "next.config.js" "%pasta_final%\" >nul 2>&1
copy "tailwind.config.js" "%pasta_final%\" >nul 2>&1
copy "tsconfig.json" "%pasta_final%\" >nul 2>&1

REM Copiar pastas importantes
echo 📂 Copiando pastas do código...
xcopy /E /I /H /Y "app" "%pasta_final%\app\" >nul 2>&1
xcopy /E /I /H /Y "components" "%pasta_final%\components\" >nul 2>&1
xcopy /E /I /H /Y "hooks" "%pasta_final%\hooks\" >nul 2>&1
xcopy /E /I /H /Y "lib" "%pasta_final%\lib\" >nul 2>&1
xcopy /E /I /H /Y "scripts" "%pasta_final%\scripts\" >nul 2>&1

REM Criar arquivo de instruções
echo 📝 Criando instruções...
(
echo ========================================
echo 🐔 SISTEMA DE GESTAO DE GALINHAS
echo ========================================
echo.
echo 📋 COMO USAR NO NOVO PC:
echo.
echo 1. INSTALAR DOCKER DESKTOP:
echo    - Baixe: https://www.docker.com/products/docker-desktop/
echo    - Instale e reinicie o PC
echo    - Aguarde icone da baleia ficar AZUL
echo.
echo 2. CONFIGURAR SISTEMA:
echo    - Copie esta pasta para o novo PC
echo    - Duplo clique em: setup-novo-pc-completo.bat
echo    - Edite arquivo .env com suas credenciais
echo    - Aguarde instalacao automatica
echo.
echo 3. ACESSAR:
echo    - Abra: http://localhost:3000
echo.
echo 🆘 PROBLEMAS?
echo    - Execute: solucionar-problemas.bat
echo.
echo 📞 SUPORTE:
echo    - Verifique arquivo CHECKLIST-NOVO-PC.md
echo.
echo Data da criacao: %date% %time%
) > "%pasta_final%\LEIA-ME-PRIMEIRO.txt"

REM Mostrar tamanho da pasta
echo.
echo ✅ Pasta preparada: %pasta_final%
echo 📊 Calculando tamanho...
for /f "tokens=3" %%a in ('dir "%pasta_final%" /s /-c ^| findstr "bytes"') do set "tamanho=%%a"
echo 💾 Tamanho aproximado: %tamanho% bytes

echo.
echo 📦 PASTA PRONTA PARA TRANSFERENCIA!
echo 📁 Nome: %pasta_final%
echo.
echo 🚚 PROXIMOS PASSOS:
echo 1. Escolha um metodo de transferencia abaixo
echo 2. Copie a pasta %pasta_final% para o novo PC
echo 3. No novo PC, execute setup-novo-pc-completo.bat
echo.

pause
