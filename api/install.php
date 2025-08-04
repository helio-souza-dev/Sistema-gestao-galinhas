<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$response = array();

try {
    // Tentar conectar ao MySQL sem especificar banco
    $pdo = new PDO("mysql:host=localhost;charset=utf8mb4", "root", "", array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ));
    
    $response["connection"] = "OK - Conectado ao MySQL";
    
    // Criar banco de dados se não existir
    $pdo->exec("CREATE DATABASE IF NOT EXISTS galinha_gestao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $response["database_creation"] = "OK - Banco 'galinha_gestao' criado/verificado";
    
    // Conectar ao banco específico
    $pdo->exec("USE galinha_gestao");
    
    // Criar tabela de galinhas
    $sql_galinhas = "
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
    )";
    
    $pdo->exec($sql_galinhas);
    $response["table_galinhas"] = "OK - Tabela 'galinhas' criada/verificada";
    
    // Criar tabela de transações
    $sql_transacoes = "
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
    )";
    
    $pdo->exec($sql_transacoes);
    $response["table_transacoes"] = "OK - Tabela 'transacoes' criada/verificada";
    
    // Inserir dados de exemplo se as tabelas estiverem vazias
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM galinhas");
    $count = $stmt->fetch()['count'];
    
    if ($count == 0) {
        $sql_seed_galinhas = "
        INSERT INTO galinhas (codigo_barras, nome, raca, idade, status, producao_semanal, data_aquisicao) VALUES
        ('GAL001', 'Galinha 1', 'Rhode Island Red', 8, 'ativa', 6, '2024-01-15'),
        ('GAL002', 'Galinha 2', 'Leghorn', 6, 'ativa', 7, '2024-02-01'),
        ('GAL003', 'Galinha 3', 'Sussex', 10, 'ativa', 5, '2024-01-20')
        ";
        
        $pdo->exec($sql_seed_galinhas);
        $response["seed_galinhas"] = "OK - Dados de exemplo inseridos na tabela 'galinhas'";
    } else {
        $response["seed_galinhas"] = "SKIP - Tabela 'galinhas' já contém dados";
    }
    
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM transacoes");
    $count = $stmt->fetch()['count'];
    
    if ($count == 0) {
        $sql_seed_transacoes = "
        INSERT INTO transacoes (tipo, categoria, valor, descricao, data) VALUES
        ('gasto', 'Ração', 150.00, 'Ração para 1 mês', '2024-12-01'),
        ('ganho', 'Ovos', 200.00, 'Venda de 100 ovos', '2024-12-05'),
        ('gasto', 'Medicamentos', 80.00, 'Vacinas e vermífugos', '2024-11-28'),
        ('ganho', 'Ovos', 180.00, 'Venda de 90 ovos', '2024-11-30')
        ";
        
        $pdo->exec($sql_seed_transacoes);
        $response["seed_transacoes"] = "OK - Dados de exemplo inseridos na tabela 'transacoes'";
    } else {
        $response["seed_transacoes"] = "SKIP - Tabela 'transacoes' já contém dados";
    }
    
    $response["status"] = "SUCCESS";
    $response["message"] = "Instalação concluída com sucesso!";
    
} catch (PDOException $e) {
    $response["status"] = "ERROR";
    $response["message"] = "Erro durante a instalação: " . $e->getMessage();
    $response["error_details"] = array(
        "code" => $e->getCode(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    );
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
