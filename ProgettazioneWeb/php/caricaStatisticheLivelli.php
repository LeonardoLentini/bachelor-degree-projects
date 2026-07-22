<?php
require 'connessione.php'; // Connessione al database

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $username = trim($_POST['username'] ?? '');
    $diff = trim($_POST['diff'] ?? '');
    if(empty($username)) {
        echo json_encode(["success" => false, "message" => "Username non valido"]);
        exit;
    }
    if(empty($diff)) {
        echo json_encode(["success" => false, "message" => "Livello di difficoltà non valido"]);
        exit;
    }
    $stmt = $conn->prepare("SELECT COUNT(p.id) AS num_partite, MIN(p.tempo) AS miglior_tempo 
                            FROM partite p JOIN utenti u ON p.utente_id = u.user_id 
                            WHERE u.username = :username AND p.difficolta = :diff");

    $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    $stmt->bindValue(':diff', $diff, PDO::PARAM_STR);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $result]);

    exit;
}
?>
