document.addEventListener("DOMContentLoaded", init);

let user = localStorage.username;

function init() 
{
    document.getElementById("home-btn").addEventListener("click", function () {
        window.location.href = "home.html";
    });
    document.getElementById("facile-btn").addEventListener("click", caricaTempi);
    document.getElementById("medio-btn").addEventListener("click", caricaTempi);
    document.getElementById("difficile-btn").addEventListener("click", caricaTempi);
    caricaStats();
}

function caricaStats() 
{
    let totalGame = document.getElementById("game-glb");

    getTotalGame().then(partiteTotali => 
        {
            totalGame.innerText = partiteTotali;
    })
    .catch(error => {
        console.error("Errore nel caricamento delle partite:", error);
    });

    let diff = ["facile", "medio", "difficile"];
    
    diff.forEach(difficulty => {
        fetch("../php/caricaStatisticheLivelli.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "username=" + encodeURIComponent(user) + "&diff=" + encodeURIComponent(difficulty)
        })
        .then(response => response.json())
        .then(data => {
            if(!data.success || data.data.length === 0) 
            {
                console.log("Errore per " + difficulty +": " +data.message);
                document.getElementById("stats-" + difficulty).innerHTML = "Dati non disponibili.";
                return;
            }

            let partite = data.data[0].num_partite;
            let secondi = Number(data.data[0].miglior_tempo);

            let minuti = Math.floor(secondi / 60);
            let sec = secondi % 60;
            let tempo = (secondi>0)?
                        ((minuti < 10 ? "0" : "") + minuti + ":" + (sec < 10 ? "0" : "") + sec):"/"

            let stringa = "Partite completate: " +partite +"<br><br>Miglior tempo: "+ tempo+ "<br><br>";
            document.getElementById("stats-" + difficulty).innerHTML = stringa;
        })
        .catch(error => console.error("Errore nel recupero delle statistiche per" + difficulty + "," + error));
    });
}


function caricaTempi(e) 
{
    e.preventDefault();
    let [diff] = String(e.target.id).split('-');

    fetch("../php/caricaTempiLivelli.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "username=" + encodeURIComponent(user) + "&diff=" + encodeURIComponent(diff)
    })
    .then(response => response.json())
    .then( data =>{
        if(!data.success) 
        {
            console.log("Errore per " + diff +": " +data.message);
            return;
        }
        else if(data.data.length>0)
        {
            let posti = ["primo", "secondo", "terzo", "quarto", "quinto"];
            let i;
            for(i=0; i <data.data.length; i++)
            {
                let cell = document.getElementById(posti[i]);
                secondi = data.data[i].tempo; 
                let minuti = Math.floor(secondi / 60);
                let sec = secondi % 60;
                cell.innerText = (minuti < 10 ? "0" : "") + minuti + ":" + (sec < 10 ? "0" : "") + sec;
            }
            for(let j = i; j<5; j++)
            {
                let cell = document.getElementById(posti[j]);
                cell.innerText = "/"; 
            }
        }
        else
        {
            let posti = ["primo", "secondo", "terzo", "quarto", "quinto"];
            for(let j = 0; j<5; j++)
            {
                let cell = document.getElementById(posti[j]);
                cell.innerText = "/"; 
            }
        }
    });
}

function getTotalGame() 
{
    return (fetch("../php/gestionePartiteTotali.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "username=" + encodeURIComponent(user)
    })
    .then(response => response.json())
    .then(data => {
        if(!data.success) 
        {
            console.log("error");
            usr_err.innerText = data.message;
            return 0; 
        } 
        else 
        {
            return Number(data.message); 
        }
    }));
}   
