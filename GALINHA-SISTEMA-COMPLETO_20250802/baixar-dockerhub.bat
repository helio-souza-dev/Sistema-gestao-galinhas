@echo off
REM 📥 Script para baixar do Docker Hub

echo 📥 Baixando do Docker Hub...

set /p "imagem=Digite o nome da imagem (usuario/galinha-gestao): "

if "%imagem%"=="" (
    echo ❌ Nome da imagem não pode estar vazio
    pause
    exit /b 1
)

echo 📦 Baixando imagem: %imagem%
docker pull %imagem%

if %errorlevel% equ 0 (
    echo ✅ Imagem baixada com sucesso!
    echo.
    echo 📋 Para executar:
    echo 1. Certifique-se de ter o arquivo .env
    echo 2. Execute: docker run -p 3000:3000 --env-file .env %imagem%
    echo 3. Ou use docker-compose up -d
) else (
    echo ❌ Erro ao baixar imagem
)

pause
