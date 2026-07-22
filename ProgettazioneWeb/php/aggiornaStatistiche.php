<?php
require 'connessione.php'; 

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $username = trim($_POST['username'] ?? '');
    $secondi = $_POST['tempo'] ?? 0;
    $diff = trim($_POST['diff'] ?? '');

    try {
        $conn->beginTransaction(); 

        $stmt = $conn->prepare("SELECT user_id 
                                FROM utenti 
                                WHERE username = :username");
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $user_id = $stmt->fetchColumn();

        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Utente non trovato"]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO partite (utente_id, tempo, difficolta) 
                                VALUES (:utente_id, :tempo, :difficolta)");
        $stmt->bindValue(':utente_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':tempo', $secondi, PDO::PARAM_STR);
        $stmt->bindValue(':difficolta', $diff, PDO::PARAM_STR);
        $stmt->execute();

        $conn->commit(); 

        echo json_encode(["success" => true, "message" => "Partita registrata con successo!"]);
    } catch (Exception $e) {
        $conn->rollBack(); 
        echo json_encode(["success" => false, "message" => "Errore: " . $e->getMessage()]);
    }
}
?>
