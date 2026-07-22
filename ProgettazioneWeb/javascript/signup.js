document.addEventListener("DOMContentLoaded", init);

function init() 
{
    document.getElementById("signup-btn").addEventListener("click", checkForm);
    document.getElementById("mostraPassword1").addEventListener("click", ()=>{
        let password = document.getElementById("password");
        password.type = (password.type == "text")?"password":"text";
    });
    document.getElementById("mostraPassword2").addEventListener("click", ()=>{
        let password = document.getElementById("ripetiPassword");
        password.type = (password.type == "text")?"password":"text";
    });
}

function checkForm(e)
{
    e.preventDefault();
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let ripeti_psw = document.getElementById("ripetiPassword");
    let usr_err = document.getElementById("usr-err");
    let psw_err1 = document.getElementById("psw-err1");
    let psw_err2 = document.getElementById("psw-err2");
    ii = username.value;
    usr_err.innerText = "";
    psw_err1.innerText = "";
    psw_err2.innerText = "";

//CONTROLLI LATO CLIENT
    //controlli username
    if(!ii.match(/^([a-z]|[A-Z])([a-z]|[A-Z]|[0-9]){2,15}$/))
    {
        usr_err.innerText = "L'username deve iniziare con una lettera e avere tra 3 e 16 caratteri alfanumerici";
        return false;
    }
    usr_err.innerText = "";

    //controlli password
    ii = password.value;

    if(!ii.match(/^([a-z]|[A-Z]|[0-9]){8,}$/))
    {
        psw_err1.innerText = "La password deve avere almeno 8 caratteri considerando solo lettere e numeri";
        return false;
    }

    if(!ii.match(/[A-Z]/))
    {
        psw_err1.innerText = "La password deve contenere almeno una lettera maiuscola";
        return false;
    }

    if(!ii.match(/[0-9]/))
    {
        psw_err1.innerText = "La password deve contenere almeno un numero";
        return false;
    }
    psw_err1.innerText = "";

    let jj = ripeti_psw.value;
    if(ii!=jj)
    {
        psw_err2.innerText = "Le password non combaciano";
        return false;
    }
    psw_err2.innerText = "";

//CONTROLLI LATO SERVER
    fetch("../php/gestioneSignup.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "username=" + encodeURIComponent(username.value) + "&password=" + encodeURIComponent(password.value)

    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) 
        {
            usr_err.innerText = data.message;
        } 
        else 
        {
            //FINE REGISTRAZIONE
            let signup = document.getElementById("signup");
            document.getElementById("form-signup").remove();
            document.getElementById("signup-btn").remove();

            let label = document.createElement("label");
            label.innerText = "REGISTRAZIONE AVVENUTA CON SUCCESSO!";
            label.id = "signup-complete";
            signup.appendChild(label);
            let p = document.createElement("p");
            p.innerHTML =   "Benvenuto <strong>" + username.value + "</strong>!<br>" +
                            "Adesso puoi effettuare il login.<br>" +
                            "Torna nella pagina di login e immetti le tue credenziali."; 
            signup.appendChild(p);
            signup.style.width = "fit-content";
        }
    });
    

}




