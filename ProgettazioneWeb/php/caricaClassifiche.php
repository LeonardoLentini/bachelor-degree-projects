<?php
require 'connessione.php'; 

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $diff = trim($_POST['diff'] ?? '');
    
    if (empty($diff)) {
        echo json_encode(["success" => false, "message" => "Livello di difficoltà non valido"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT u.username, p.tempo 
                            FROM partite p
                            JOIN utenti u ON p.utente_id = u.user_id
                            WHERE p.difficolta = :diff
                            ORDER BY p.tempo ASC
                            LIMIT 20");

    $stmt->bindValue(':diff', $diff, PDO::PARAM_STR);
    $stmt->execute();
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $result]);

    exit;
}
?>
