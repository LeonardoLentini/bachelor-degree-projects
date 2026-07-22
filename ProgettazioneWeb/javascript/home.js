document.addEventListener("DOMContentLoaded", init);

function init() 
{
    document.getElementById("logout-btn").addEventListener("click", logout);
    document.getElementById("gioca").addEventListener("click", gioca);
    document.getElementById("classifiche").addEventListener("click", classifiche);
    document.getElementById("tutorial").addEventListener("click", tutorial);
    document.getElementById("statistiche").addEventListener("click", statistiche);
}


function logout() 
{
    localStorage.removeItem("username");    
    fetch("../php/logout.php", { method: "POST" }) 
    .then(() => {
        window.location.href = "../index.html"; 
    })
    .catch(error => console.error("Errore durante il logout:", error));
}

function gioca() 
{
    window.location.href = "game_home.html";
}

function classifiche() 
{
    window.location.href = "classifiche.html";}

function tutorial() 
{
    window.location.href = "tutorial.html";
}

function statistiche() 
{
    window.location.href = "statistiche.html";
}