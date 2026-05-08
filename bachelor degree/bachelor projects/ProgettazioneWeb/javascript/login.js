document.addEventListener("DOMContentLoaded", init);

function init() 
{
    document.getElementById("login-btn").addEventListener("click", checkFormLogin);
    document.getElementById("mostraPassword").addEventListener("click", ()=>{
        let password = document.getElementById("password");
        password.type = (password.type == "text")?"password":"text";
    });
    document.getElementById("signup-btn").addEventListener("click", ()=>{
        window.open("../html/signup.html", "_blank");
    });

}

function checkFormLogin(e)
{
    e.preventDefault();

    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let err = document.getElementById("err");
    ii = username.value;

//CONTROLLI LATO CLIENT
    //controlli username
    if(!ii.match(/^([a-z]|[A-Z])([a-z]|[A-Z]|[0-9]){2,15}$/))
    {
        err.innerText = "Credenziali inserite non valide";
        return false;
    }
    err.innerText = "";

    //controlli password
    ii = password.value;

    if(!ii.match(/^(?=.*[A-Z])(?=.*[0-9])([a-z]|[A-Z]|[0-9]){8,}$/))
    {
        err.innerText = "Credenziali inserite non valide";
        return false;
    }
    err.innerText = "";

//CONTROLLI LATO SERVER
    fetch("../php/gestioneLogin.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "username=" + encodeURIComponent(username.value) + "&password=" + encodeURIComponent(password.value)
    })
    .then(response => response.json())
    .then(data => {
        if(!data.success) 
        {
            err.innerText = data.message;
        } 
        else
        {
            if(typeof(localStorage)==="undefined" || typeof(sessionStorage) === "undefined")
            {
                alert("web storage is not supported on this browser...");
                window.close();
            }
            else
            {
                localStorage.setItem("username", username.value);
            }
            window.location.replace("../html/home.html");
        }
    });    
}