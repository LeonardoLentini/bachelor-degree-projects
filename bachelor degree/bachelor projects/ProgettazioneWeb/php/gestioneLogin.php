<?php
require 'connessione.php'; 

header("Content-Type: application/json"); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Controlla se l'username è presente nel database
    $stmt = $conn->prepare("SELECT user_id 
                            FROM utenti 
                            WHERE BINARY username = :username");
    $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() == 0) 
    {
        echo json_encode(["success" => false, "message" => "Utente non trovato"]);
        exit;
    }

    // Controlla se la password è corretta per l'username inserito
    $stmt = $conn->prepare("SELECT password_hash 
                            FROM utenti 
                            WHERE username = :username");
    $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    $stmt->execute();


    if (!password_verify($password, $stmt->fetchColumn())) 
    {
        echo json_encode(["success" => false, "message" => "Password errata"]);
        exit;
    }
    else
    {
        echo json_encode(["success" => true, "message" => "Login avvenuto con successo!"]);
    } 
    
}
?>
