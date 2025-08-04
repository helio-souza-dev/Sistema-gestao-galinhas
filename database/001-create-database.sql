-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS galinha_gestao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE galinha_gestao;

-- Criar tabela de galinhas
CREATE TABLE IF NOT EXISTS galinhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    raca VARCHAR(50) NOT NULL,
    idade INT NOT NULL,
    status ENUM('ativa', 'doente', 'vendida') DEFAULT 'ativa',
    producao_semanal INT DEFAULT 0,
    data_aquisicao DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo_barras (codigo_barras),
    INDEX idx_status (status)
);

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('gasto', 'ganho') NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_data (data)
);
