<?php
class Galinha {
    private $conn;
    private $table_name = "galinhas";

    public $id;
    public $codigo_barras;
    public $nome;
    public $raca;
    public $idade;
    public $status;
    public $producao_semanal;
    public $data_aquisicao;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Listar todas as galinhas
    function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Criar nova galinha
    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET codigo_barras=:codigo_barras, nome=:nome, raca=:raca, 
                      idade=:idade, status=:status, producao_semanal=:producao_semanal, 
                      data_aquisicao=:data_aquisicao";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->codigo_barras = htmlspecialchars(strip_tags($this->codigo_barras));
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->raca = htmlspecialchars(strip_tags($this->raca));
        $this->idade = htmlspecialchars(strip_tags($this->idade));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->producao_semanal = htmlspecialchars(strip_tags($this->producao_semanal));
        $this->data_aquisicao = htmlspecialchars(strip_tags($this->data_aquisicao));

        // Bind dos parâmetros
        $stmt->bindParam(":codigo_barras", $this->codigo_barras);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":raca", $this->raca);
        $stmt->bindParam(":idade", $this->idade);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":producao_semanal", $this->producao_semanal);
        $stmt->bindParam(":data_aquisicao", $this->data_aquisicao);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Atualizar galinha
    function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET nome=:nome, raca=:raca, idade=:idade, status=:status, 
                      producao_semanal=:producao_semanal, data_aquisicao=:data_aquisicao 
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->raca = htmlspecialchars(strip_tags($this->raca));
        $this->idade = htmlspecialchars(strip_tags($this->idade));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->producao_semanal = htmlspecialchars(strip_tags($this->producao_semanal));
        $this->data_aquisicao = htmlspecialchars(strip_tags($this->data_aquisicao));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind dos parâmetros
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":raca", $this->raca);
        $stmt->bindParam(":idade", $this->idade);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":producao_semanal", $this->producao_semanal);
        $stmt->bindParam(":data_aquisicao", $this->data_aquisicao);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    // Deletar galinha
    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }

    // Buscar por código de barras
    function findByBarcode($codigo) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE codigo_barras = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $codigo);
        $stmt->execute();
        return $stmt;
    }

    // Gerar próximo código
    function getNextCode() {
        $query = "SELECT codigo_barras FROM " . $this->table_name . " ORDER BY codigo_barras DESC LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            $lastCode = $row['codigo_barras'];
            $number = intval(substr($lastCode, 3)) + 1;
            return 'GAL' . str_pad($number, 3, '0', STR_PAD_LEFT);
        }
        
        return 'GAL001';
    }
}
?>
