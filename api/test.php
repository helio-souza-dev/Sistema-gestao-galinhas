<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Teste básico da API
$response = array(
    "status" => "success",
    "message" => "API está funcionando!",
    "timestamp" => date('Y-m-d H:i:s'),
    "server_info" => array(
        "php_version" => phpversion(),
        "server_software" => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconhecido',
        "document_root" => $_SERVER['DOCUMENT_ROOT'] ?? 'Desconhecido'
    )
);

// Testar conexão com banco
try {
    include_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        $response["database"] = array(
            "status" => "connected",
            "message" => "Conexão com banco de dados OK"
        );
        
        // Testar se as tabelas existem
        $tables = array('galinhas', 'transacoes');
        foreach ($tables as $table) {
            $stmt = $db->prepare("SHOW TABLES LIKE ?");
            $stmt->execute([$table]);
            if ($stmt->rowCount() > 0) {
                $response["database"]["tables"][$table] = "exists";
            } else {
                $response["database"]["tables"][$table] = "missing";
            }
        }
    } else {
        $response["database"] = array(
            "status" => "error",
            "message" => "Falha na conexão com banco de dados"
        );
    }
} catch (Exception $e) {
    $response["database"] = array(
        "status" => "error",
        "message" => $e->getMessage()
    );
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
