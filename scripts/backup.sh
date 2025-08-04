#!/bin/bash

# Script para backup do sistema
echo "💾 Criando backup do sistema..."

# Criar diretório de backup
mkdir -p backups
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/backup_$BACKUP_DATE"

# Criar backup
mkdir -p $BACKUP_DIR

# Copiar arquivos importantes
cp -r . $BACKUP_DIR/
rm -rf $BACKUP_DIR/node_modules
rm -rf $BACKUP_DIR/.next
rm -rf $BACKUP_DIR/backups

# Criar arquivo tar.gz
tar -czf "backups/galinha-gestao-$BACKUP_DATE.tar.gz" -C backups "backup_$BACKUP_DATE"
rm -rf $BACKUP_DIR

echo "✅ Backup criado: backups/galinha-gestao-$BACKUP_DATE.tar.gz"
