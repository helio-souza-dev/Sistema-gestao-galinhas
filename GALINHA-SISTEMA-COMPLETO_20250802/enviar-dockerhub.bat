@echo off
REM 🌐 Script para enviar para Docker Hub

echo 🌐 Enviando para Docker Hub...

REM Pedir credenciais do Docker Hub
set /p "usuario=Digite seu usuário do Docker Hub: "

if "%usuario%"=="" (
    echo ❌ Usuário não pode estar vazio
    pause
    exit /b 1
)

echo 🔑 Fazendo login no Docker Hub...
docker login

if %errorlevel% neq 0 (
    echo ❌ Erro no login
    pause
    exit /b 1
)

REM Construir imagem se necessário
echo 🔨 Construindo imagem...
docker-compose build

REM Obter ID da imagem
for /f "tokens=*" %%i in ('docker-compose images -q galinha-app') do set IMAGE_ID=%%i

REM Criar tag
set "tag=%usuario%/galinha-gestao:latest"
echo 🏷️ Criando tag: %tag%
docker tag %IMAGE_ID% %tag%

REM Enviar para Docker Hub
echo 📤 Enviando para Docker Hub...
docker push %tag%

if %errorlevel% equ 0 (
    echo ✅ Enviado com sucesso!
    echo 🌐 Imagem disponível em: %tag%
    echo.
    echo 📋 Para usar no outro PC:
    echo docker pull %tag%
    echo docker run -p 3000:3000 --env-file .env %tag%
) else (
    echo ❌ Erro ao enviar
)

pause
