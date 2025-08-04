@echo off
REM 📥 Script para carregar imagem Docker no novo PC

echo 📥 Carregando imagem Docker...

REM Listar arquivos .tar disponíveis
echo 📋 Arquivos de imagem disponíveis:
dir *.tar /b 2>nul

if %errorlevel% neq 0 (
    echo ❌ Nenhum arquivo .tar encontrado!
    echo 📝 Certifique-se de ter copiado o arquivo da imagem
    pause
    exit /b 1
)

REM Pedir para usuário escolher arquivo
set /p "arquivo=Digite o nome do arquivo .tar: "

if not exist "%arquivo%" (
    echo ❌ Arquivo não encontrado: %arquivo%
    pause
    exit /b 1
)

echo 📦 Carregando imagem: %arquivo%
docker load -i "%arquivo%"

if %errorlevel% equ 0 (
    echo ✅ Imagem carregada com sucesso!
    echo 🚀 Agora você pode executar: docker-compose up -d
) else (
    echo ❌ Erro ao carregar imagem
)

pause
