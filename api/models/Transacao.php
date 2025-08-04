<?php
class Transacao {
    private $conn;
    private $table_name = "transacoes";

    public $id;
    public $tipo;
    public $categoria;
    public $valor;
    public $descricao;
    public $data;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Listar todas as transações
    function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY data DESC, created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Criar nova transação
    function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET tipo=:tipo, categoria=:categoria, valor=:valor, 
                      descricao=:descricao, data=:data";

        $stmt = $this->conn->prepare($query);

        // Sanitizar dados
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));
        $this->categoria = htmlspecialchars(strip_tags($this->categoria));
        $this->valor = htmlspecialchars(strip_tags($this->valor));
        $this->descricao = htmlspecialchars(strip_tags($this->descricao));
        $this->data = htmlspecialchars(strip_tags($this->data));

        // Bind dos parâmetros
        $stmt->bindParam(":tipo", $this->tipo);
        $stmt->bindParam(":categoria", $this->categoria);
        $stmt->bindParam(":valor", $this->valor);
        $stmt->bindParam(":descricao", $this->descricao);
        $stmt->bindParam(":data", $this->data);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Deletar transação
    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }
}
?>
