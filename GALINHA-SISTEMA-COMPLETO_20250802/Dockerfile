# 🐳 Dockerfile Simples para Iniciantes
# Este arquivo diz ao Docker como criar nossa aplicação

# Usar Node.js como base (como instalar Node no container)
FROM node:18-alpine

# Criar pasta para nossa aplicação dentro do container
WORKDIR /app

# Copiar arquivos de dependências primeiro (package.json)
COPY package*.json ./

# Instalar dependências (como npm install)
RUN npm install

# Copiar todo o resto do código
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Dizer qual porta nossa aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
