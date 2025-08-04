<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$response = array(
    "status" => "debug",
    "message" => "Teste de debug funcionando!",
    "timestamp" => date('Y-m-d H:i:s'),
    "endpoints_test" => array()
);

// Testar se os arquivos existem
$files_to_check = array(
    "config/database.php",
    "models/Galinha.php", 
    "models/Transacao.php",
    "galinhas/index.php",
    "transacoes/index.php"
);

foreach ($files_to_check as $file) {
    $full_path = __DIR__ . "/" . $file;
    $response["files"][$file] = file_exists($full_path) ? "EXISTS" : "MISSING";
}

// Testar conexão com banco
try {
    include_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        $response["database"] = "CONNECTED";
        
        // Testar se as tabelas existem
        $tables = array('galinhas', 'transacoes');
        foreach ($tables as $table) {
            $stmt = $db->prepare("SHOW TABLES LIKE ?");
            $stmt->execute([$table]);
            $response["tables"][$table] = $stmt->rowCount() > 0 ? "EXISTS" : "MISSING";
        }
    } else {
        $response["database"] = "FAILED";
    }
} catch (Exception $e) {
    $response["database"] = "ERROR: " . $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
