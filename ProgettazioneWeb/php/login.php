<?php session_start();?>
<!DOCTYPE html>
<html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link type="text/css" rel="stylesheet" href="../css/login.css">
        <script src="../javascript/login.js"></script>
    </head>
    <body>
        <h1 id="titolo">PRATO FIORITO</h1>
            <div id="login">
                <form id="form-login">
                    <label for="username">Username:</label> 
                    <input type="text" id="username" placeholder="username" required> 
                    <label for="password">Password:</label> 
                    <input type="password" id="password" placeholder="password" required> 
                    <label for="mostraPassword"><input type="checkbox" id="mostraPassword">Mostra password </label>
                
                    <span id="err"></span>
                    <button id="login-btn">LOGIN</button>
                </form>
                <button id="signup-btn">REGISTRATI</button>
            </div>
    </body>
</html>