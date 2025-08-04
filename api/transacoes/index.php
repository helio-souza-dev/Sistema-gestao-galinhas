<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Transacao.php';

$database = new Database();
$db = $database->getConnection();
$transacao = new Transacao($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $transacao->read();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $transacoes_arr = array();
            
            while ($row = $stmt->fetch()) {
                $transacoes_arr[] = $row;
            }
            
            echo json_encode($transacoes_arr);
        } else {
            echo json_encode(array());
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->tipo) && !empty($data->categoria) && !empty($data->valor)) {
            $transacao->tipo = $data->tipo;
            $transacao->categoria = $data->categoria;
            $transacao->valor = $data->valor;
            $transacao->descricao = $data->descricao ?? '';
            $transacao->data = $data->data;
            
            if($transacao->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Transação criada com sucesso.",
                    "id" => $transacao->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Não foi possível criar a transação."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Dados incompletos."));
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->id)) {
            $transacao->id = $data->id;
            
            if($transacao->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Transação removida com sucesso."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Não foi possível remover a transação."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID não fornecido."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método não permitido."));
        break;
}
?>
