# ✅ CHECKLIST - Configurar no Novo PC

## 📋 ANTES de executar setup-novo-pc-completo.bat:

### ✅ Pré-requisitos:
- [ ] Windows 10/11 instalado
- [ ] Conexão com internet funcionando
- [ ] Pasta do backup copiada completamente
- [ ] Credenciais do Supabase em mãos

### ✅ Instalar Docker Desktop:
- [ ] Baixar de: https://www.docker.com/products/docker-desktop/
- [ ] Executar instalador
- [ ] Reiniciar PC após instalação
- [ ] Abrir Docker Desktop
- [ ] Aguardar ícone da baleia ficar AZUL na barra de tarefas

### ✅ Preparar credenciais Supabase:
- [ ] URL do projeto: https://seu-projeto.supabase.co
- [ ] Chave anônima: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- [ ] (Encontre em: Supabase > Settings > API)

## 🚀 EXECUTAR:

### ✅ Passo a passo:
1. [ ] Abrir pasta do backup
2. [ ] Duplo clique em `setup-novo-pc-completo.bat`
3. [ ] Aguardar verificações automáticas
4. [ ] Editar arquivo .env quando solicitado
5. [ ] Aguardar construção da aplicação (5-10 min)
6. [ ] Ver mensagem "SUCESSO! APLICAÇÃO CONFIGURADA!"
7. [ ] Abrir http://localhost:3000

## 🔍 VERIFICAR SE FUNCIONOU:

### ✅ Testes:
- [ ] Página abre em http://localhost:3000
- [ ] Sistema mostra interface das galinhas
- [ ] Consegue adicionar nova galinha
- [ ] Consegue adicionar transação
- [ ] Status da conexão mostra "Conectado" ou "Demo"

## 🆘 SE DER PROBLEMA:

### ✅ Soluções rápidas:
- [ ] Executar `verificar-sistema.bat`
- [ ] Executar `solucionar-problemas.bat`
- [ ] Verificar se Docker Desktop está rodando
- [ ] Verificar credenciais no arquivo .env
- [ ] Tentar porta 3001 se 3000 estiver ocupada

## 📞 SUPORTE:
Se nada funcionar, execute `solucionar-problemas.bat` e escolha a opção adequada.
