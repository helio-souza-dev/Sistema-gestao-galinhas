# 🐳 Sistema de Gestão de Galinhas - Docker

## 📋 Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Credenciais do Supabase

## 🚀 Como usar

### 1. Configuração inicial
\`\`\`bash
# Clonar/copiar o projeto
git clone <seu-repositorio>
cd galinha-gestao-sistema

# Dar permissão aos scripts
chmod +x scripts/*.sh

# Executar setup
./scripts/setup.sh
\`\`\`

### 2. Configurar Supabase
\`\`\`bash
# Editar arquivo .env
nano .env

# Adicionar suas credenciais:
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima
\`\`\`

### 3. Executar aplicação
\`\`\`bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
\`\`\`

## 🔧 Comandos úteis

\`\`\`bash
# Construir apenas a aplicação
docker build -t galinha-gestao .

# Executar sem docker-compose
docker run -p 3000:3000 --env-file .env galinha-gestao

# Ver status dos containers
docker-compose ps

# Reiniciar aplicação
docker-compose restart galinha-app

# Atualizar aplicação
./scripts/deploy.sh

# Criar backup
./scripts/backup.sh
\`\`\`

## 📦 Transferir para outro PC

### Método 1: Backup completo
\`\`\`bash
# No PC original
./scripts/backup.sh

# Copiar arquivo .tar.gz para o novo PC
# No novo PC
tar -xzf galinha-gestao-YYYYMMDD_HHMMSS.tar.gz
cd backup_YYYYMMDD_HHMMSS
./scripts/setup.sh
\`\`\`

### Método 2: Docker Hub (recomendado)
\`\`\`bash
# No PC original - fazer push
docker tag galinha-gestao seu-usuario/galinha-gestao
docker push seu-usuario/galinha-gestao

# No novo PC - fazer pull
docker pull seu-usuario/galinha-gestao
docker run -p 3000:3000 --env-file .env seu-usuario/galinha-gestao
\`\`\`

## 🌐 Acessos

- **Aplicação**: http://localhost:3000
- **Nginx (se habilitado)**: http://localhost

## 🔍 Troubleshooting

\`\`\`bash
# Ver logs detalhados
docker-compose logs galinha-app

# Entrar no container
docker-compose exec galinha-app sh

# Reiniciar tudo
docker-compose down && docker-compose up -d

# Limpar cache do Docker
docker system prune -a
