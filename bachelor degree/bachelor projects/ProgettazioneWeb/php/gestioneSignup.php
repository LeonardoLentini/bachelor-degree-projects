<?php
require 'connessione.php'; 

header("Content-Type: application/json"); 

if($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Controlla se l'username è presente nel database
    $stmt = $conn->prepare("SELECT user_id 
                            FROM utenti 
                            WHERE BINARY username = :username");
    $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    if($stmt->rowCount() > 0) 
    {
        echo json_encode(["success" => false, "message" => "L'username è già stato scelto. Scegline un altro."]);
        exit;
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Inserisce il nuovo utente nel database
    $stmt = $conn->prepare("INSERT INTO utenti (username, password_hash) 
                            VALUES (:username, :password_hash)");
    $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    $stmt->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);

    if ($stmt->execute()) 
    {
        echo json_encode(["success" => true, "message" => "Registrazione avvenuta con successo!"]);
    } 
    else
    {
        echo json_encode(["success" => false, "message" => "Errore nella registrazione."]);
    }
}
?>
