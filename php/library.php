<?php
class library
{
    public $mysqli;

    /**
     * costruttore
     */
    public function __construct()
    {
        $this->mysqli = new mysqli("localhost", "root", "", "scanner");
    }

    public function saveExpense($total, $date) {
        // Prepara la query per l'inserimento dei dati della bicicletta
        $query = "INSERT INTO scontrini (totale, data) VALUES (?, ?)";
        
        // Prepara lo statement
        $stmt = $this->mysqli->prepare($query);
        
        // Verifica se lo statement è stato preparato correttamente
        if ($stmt === false) {
            die("Errore durante la preparazione dello statement: " . $this->mysqli->error);
        }
        
        // Bind dei parametri
        $stmt->bind_param("ds", $total, $date);
        
        // Esegui lo statement
        $result = $stmt->execute();
        
        // Verifica se l'esecuzione dello statement è avvenuta con successo
        if ($result === false) {
            die("Errore durante l'esecuzione dello statement: " . $stmt->error);
        }
        
        // Chiudi lo statement
        $stmt->close();
        
        // Restituisci true se l'inserimento è avvenuto con successo
        return true;
    }
}