document.addEventListener("DOMContentLoaded", init);

function init() 
{
    document.getElementById("home-btn").addEventListener("click", function () {
        window.location.href = "home.html";
    });
    let diff = ["facile", "medio", "difficile"];
    diff.forEach(creaTabelle);
    diff.forEach(difficolta => {
        fetch("../php/caricaClassifiche.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "diff=" + encodeURIComponent(difficolta)
        })
        .then(response => response.json())
        .then(data => {
            if(!data.success) 
            {
                console.log("Errore per " + difficolta + ": " + data.message);
                return;
            }
    
            for(let i = 0; i < data.data.length; i ++)
            {
                let nome = document.getElementById((i+1) +"-nome-" + difficolta);
                nome.innerText = data.data[i].username;
                let tempo = document.getElementById((i+1) +"-tempo-" + difficolta);
                secondi = data.data[i].tempo; 
                let minuti = Math.floor(secondi / 60);
                let sec = secondi % 60;
                tempo.innerText = (minuti < 10 ? "0" : "") + minuti + ":" + (sec < 10 ? "0" : "") + sec; 
            }
        })
        .catch(error => console.error("Errore fetch " + difficolta+ ": " + error));
    });
}

function creaTabelle(livello)
{
    let div = document.getElementById(livello);
    let table = document.createElement("table");

    for(let i = 1; i <= 20; i++) 
    {
        let tr = document.createElement("tr");
        let pos = document.createElement("td");
        pos.innerText = i;

        let nome = document.createElement("td");
        nome.id = i+"-nome-"+livello;
        nome.innerText = "///";

        let tempo = document.createElement("td");
        tempo.id = i+"-tempo-"+livello;
        tempo.innerText = "/";

        tr.appendChild(pos);
        tr.appendChild(nome);
        tr.appendChild(tempo);

        table.appendChild(tr);
    }

    div.appendChild(table);
}