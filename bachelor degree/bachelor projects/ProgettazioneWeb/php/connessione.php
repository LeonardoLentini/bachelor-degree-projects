<?php
    $host = "localhost"; 
    $dbname = "prato_fiorito_db"; 
    $username = "root"; 
    $password = "root"; 

    try 
    {
        $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } 
    catch (PDOException $e) 
    {
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false, 
            "message" => "Errore database: " . $e->getMessage()
        ]);
        exit;
    }
?>
