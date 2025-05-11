<?php
// Includi il file della classe library
include_once("library.php");

// Verifica se è stata ricevuta una richiesta POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Controlla se tutti i parametri sono stati ricevuti correttamente
    if (isset($_POST["total"]) && isset($_POST["date"])) {
        // Crea una nuova istanza della classe gestioneDB
        $library = new library();

        // Ottieni i valori dei parametri dalla richiesta POST
        $total = $_POST["total"];
        $date = $_POST["date"];

        // Chiamata al metodo per inserire la bicicletta nel database
        $inserimento = $library->saveExpense($total, $date);
        if($inserimento == true) {
            echo "successo";
        }
    }
}
?>