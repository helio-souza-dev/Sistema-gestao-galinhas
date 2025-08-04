@echo off
REM 🎒 Script para criar backup completo do projeto

echo 🎒 Criando backup completo do Sistema de Galinhas...

REM Criar pasta de backup com data
set "data=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%"
set "data=%data: =0%"
set "backup_folder=backup_galinha_%data%"

echo 📁 Criando pasta: %backup_folder%
mkdir "%backup_folder%"

REM Copiar arquivos importantes (excluir node_modules e .next)
echo 📋 Copiando arquivos do projeto...
xcopy /E /I /H /Y *.* "%backup_folder%" /EXCLUDE:exclude.txt

REM Criar arquivo com instruções
echo 📝 Criando arquivo de instruções...
(
echo # 🐔 Sistema de Gestão de Galinhas - Backup
echo.
echo ## 📋 Como usar este backup:
echo.
echo 1. Instalar Docker Desktop no novo PC
echo 2. Copiar esta pasta para o novo PC
echo 3. Editar arquivo .env com suas credenciais
echo 4. Duplo clique em start.bat
echo.
echo ## 🔧 Arquivos importantes:
echo - Dockerfile: Configuração do container
echo - docker-compose.yml: Orquestração
echo - .env: Suas credenciais ^(EDITE NO NOVO PC^)
echo - start.bat: Iniciar aplicação
echo - stop.bat: Parar aplicação
echo.
echo ## 🌐 Acesso:
echo http://localhost:3000
) > "%backup_folder%\LEIA-ME.txt"

REM Criar arquivo de exclusão para próximos backups
(
echo node_modules\
echo .next\
echo .git\
echo backup_*\
echo *.log
) > exclude.txt

echo ✅ Backup criado em: %backup_folder%
echo 📦 Copie esta pasta para o outro PC!

pause
