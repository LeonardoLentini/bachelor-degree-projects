<?php
require 'connessione.php'; 

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $username = trim($_POST['username'] ?? '');
    if(empty($username)) {
        echo json_encode(["success" => false, "message" => "Username non valido"]);
        exit;
    }
    $stmt = $conn->prepare("SELECT count(*) 
                            FROM partite p INNER JOIN utenti u ON p.utente_id = u.user_id 
                            WHERE p.utente_id = u.user_id AND u.username = :username");
    $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => $stmt->fetchColumn()]);
    exit;
}
?>
