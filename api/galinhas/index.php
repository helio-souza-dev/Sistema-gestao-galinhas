<?php
// Headers CORS mais permissivos para desenvolvimento
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir arquivos necessários
$config_path = '../config/database.php';
$model_path = '../models/Galinha.php';

if (!file_exists($config_path)) {
    http_response_code(500);
    echo json_encode(array("message" => "Arquivo de configuração não encontrado: $config_path"));
    exit();
}

if (!file_exists($model_path)) {
    http_response_code(500);
    echo json_encode(array("message" => "Arquivo do modelo não encontrado: $model_path"));
    exit();
}

include_once $config_path;
include_once $model_path;

// Testar conexão com banco
try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Falha na conexão com o banco de dados");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Erro de conexão com banco de dados",
        "error" => $e->getMessage(),
        "debug" => array(
            "host" => "localhost",
            "database" => "galinha_gestao",
            "user" => "root"
        )
    ));
    exit();
}

$galinha = new Galinha($db);
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            if(isset($_GET['codigo_barras'])) {
                // Buscar por código de barras
                $stmt = $galinha->findByBarcode($_GET['codigo_barras']);
                $num = $stmt->rowCount();
                
                if($num > 0) {
                    $row = $stmt->fetch();
                    echo json_encode($row);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Galinha não encontrada."));
                }
            } elseif(isset($_GET['next_code'])) {
                // Gerar próximo código
                $nextCode = $galinha->getNextCode();
                echo json_encode(array("codigo" => $nextCode));
            } else {
                // Listar todas
                $stmt = $galinha->read();
                $num = $stmt->rowCount();
                
                if($num > 0) {
                    $galinhas_arr = array();
                    
                    while ($row = $stmt->fetch()) {
                        // Converter tipos para garantir consistência
                        $row['id'] = (int)$row['id'];
                        $row['idade'] = (int)$row['idade'];
                        $row['producao_semanal'] = (int)$row['producao_semanal'];
                        $galinhas_arr[] = $row;
                    }
                    
                    echo json_encode($galinhas_arr);
                } else {
                    echo json_encode(array());
                }
            }
            break;
            
        case 'POST':
            $input = file_get_contents("php://input");
            $data = json_decode($input);
            
            if(json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(array("message" => "JSON inválido: " . json_last_error_msg()));
                break;
            }
            
            if(!empty($data->codigo_barras) && !empty($data->nome) && !empty($data->raca)) {
                $galinha->codigo_barras = $data->codigo_barras;
                $galinha->nome = $data->nome;
                $galinha->raca = $data->raca;
                $galinha->idade = $data->idade;
                $galinha->status = $data->status ?? 'ativa';
                $galinha->producao_semanal = $data->producao_semanal ?? 0;
                $galinha->data_aquisicao = $data->data_aquisicao;
                
                if($galinha->create()) {
                    http_response_code(201);
                    echo json_encode(array(
                        "message" => "Galinha criada com sucesso.",
                        "id" => $galinha->id,
                        "codigo_barras" => $galinha->codigo_barras
                    ));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Não foi possível criar a galinha."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array(
                    "message" => "Dados incompletos.",
                    "received" => $data
                ));
            }
            break;
            
        case 'PUT':
            $input = file_get_contents("php://input");
            $data = json_decode($input);
            
            if(json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(array("message" => "JSON inválido: " . json_last_error_msg()));
                break;
            }
            
            if(!empty($data->id)) {
                $galinha->id = $data->id;
                $galinha->nome = $data->nome;
                $galinha->raca = $data->raca;
                $galinha->idade = $data->idade;
                $galinha->status = $data->status;
                $galinha->producao_semanal = $data->producao_semanal;
                $galinha->data_aquisicao = $data->data_aquisicao;
                
                if($galinha->update()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Galinha atualizada com sucesso."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Não foi possível atualizar a galinha."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "ID não fornecido."));
            }
            break;
            
        case 'DELETE':
            $input = file_get_contents("php://input");
            $data = json_decode($input);
            
            if(json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(array("message" => "JSON inválido: " . json_last_error_msg()));
                break;
            }
            
            if(!empty($data->id)) {
                $galinha->id = $data->id;
                
                if($galinha->delete()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Galinha removida com sucesso."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Não foi possível remover a galinha."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "ID não fornecido."));
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Método não permitido: $method"));
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Erro interno do servidor",
        "error" => $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ));
}
?>
