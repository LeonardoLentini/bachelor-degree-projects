let inGame = false;
let numRighe = 10;
let numColonne = 10;
let numBombe = 15;
let difficulty = "Facile";
let stato = Array(numColonne * numRighe);
let timerid;
let secondi = 0;

document.addEventListener("DOMContentLoaded", init);

function init() 
{
    caricaTabella();
    document.getElementById("home-btn").addEventListener("click", function () {
        window.location.href = "home.html";
    });    
    document.getElementById("difficoltà").addEventListener("change", selectDifficulty);
}

function selectDifficulty() 
{
    clearInterval(timerid);
    timerid = null;
    secondi = 0;
    document.getElementById("tempo").innerText = "00:00";
    
    let selezione = document.getElementById("difficoltà");
    difficulty = selezione.value;
    switch (selezione.value) {
        case "Facile":            
            numRighe = 10;
            numColonne = 10;
            numBombe = 15;
            caricaTabella();
            break;
        case "Medio":
            numRighe = 15;
            numColonne = 15;
            numBombe = 50;
            caricaTabella();
            break;
        case "Difficile":
            numRighe = 20;
            numColonne = 20;
            numBombe = 85;
            caricaTabella();
            break;
    }
}

function caricaTabella() 
{
    inGame = false;
    let bombe = document.getElementById("numero_bombe");
    bombe.innerText = numBombe;
    let tabella = document.getElementById("tabella");
    let old_table = document.getElementById("table");
    if(old_table)
        old_table.remove();
    let table = document.createElement("table");
    table.id = "table";
    table.className = String(difficulty);
    stato = Array(numColonne * numRighe);
    let conta = true;
    for(let i = 0; i < numRighe; i++)
    {
        let tr = document.createElement("tr");
        for(let j = 0; j<numColonne; j++)
        {
            let td = document.createElement("td");
            td.id = i + "|" + j;
            if(j%2==0)
            {
                td.className = conta? "pari":"dispari";
            }
            else
            {
                td.className = conta? "dispari":"pari";
            }
            td.innerText = "";
            stato[i*numRighe + j] = 1;
            td.addEventListener("click", selezionaCasella);
            td.addEventListener("contextmenu", selezionaFiore);
            tr.appendChild(td);
        }
        table.appendChild(tr);
        conta = !conta;
    }
    tabella.appendChild(table);
}

function selezionaFiore(e) 
{
    if(!inGame)
        return false;
        
    let cella = e.target.closest("td");
    e.preventDefault();
    if(cella.className == "show_pari" || cella.className == "show_dispari" )
        return false;

    let fiori = document.getElementById("numero_bombe");
    if(cella.innerHTML === "") 
    {
        cella.innerHTML = "<img src='../immagini/fioreGameStats.png' class='fiori'>";
        cella.removeEventListener("click", selezionaCasella);
        numBombe--;
        fiori.innerText = numBombe;
    }
    else 
    {
        cella.addEventListener("click", selezionaCasella);
        cella.innerHTML = "";
        numBombe++;
        fiori.innerText = numBombe;
    }

    return false;
}

function aggiornaTimer() 
{
    let minuti = Math.floor(secondi / 60);
    let sec = secondi % 60;
    document.getElementById("tempo").innerText = (minuti < 10 ? "0" : "") + minuti + ":" + (sec < 10 ? "0" : "") + sec;
    secondi++;
}

function selezionaCasella(e) 
{
    e.preventDefault();
    let [i, j] = e.target.id.split("|");
    if(!inGame)
    {
        aggiornaTimer();
        caricaStatoCampo(i, j);
        timerid = setInterval(aggiornaTimer, 1000);
        inGame = true;
    }
    else
    {
        let result = aggiornaCaselle(i, j);
        if(result < 0)
            gestioneSconfitta(i, j);    
        if(controllaVittoria())
        {
            vittoria();
            aggiornaStatistiche();
        }
    }
}

function controllaVittoria()
{
    for(let h in stato)
    {
        let i = Math.floor(h/numColonne);
        let j = h%numColonne;
        let cella = document.getElementById(i + '|' + j);
        if(cella.className != "show_pari" && cella.className != "show_dispari" && stato[h]!=0)
        {
            return false;
        }
    }
    return true;
}

function vittoria() 
{
    //scopro tutti i fiori e rimuovo gli event dalle celle con i fiori
    for(let h = 0; h <stato.length; h++)
    {
        let i = Math.floor(h/numColonne);
        let j = h%numColonne;
        let cella = document.getElementById(i+'|'+j);
        if(stato[h] == "0")
        {
            if(cella.innerHTML === "")
            {
                cella.innerHTML = "<img src='../immagini/fioreGameStats.png' class='fiori'>";
            }
            cella.removeEventListener("contextmenu", selezionaFiore);
            cella.removeEventListener("click", selezionaCasella);
        }
    }

    //blocco il tempo e faccio apparire il riquadro di vittoria
    clearInterval(timerid);
    secondi--;
    
    let win = document.getElementById("finePartita");
    win.innerHTML= '<label id="clessidra">⌛</label><label id="tempoUtilizzato"></label><button id="newGame">Gioca ancora</button>';
    win.style.zIndex = 10;
    let minuti = Math.floor(secondi / 60);
    let sec = secondi % 60;
    document.getElementById("tempoUtilizzato").innerText = (minuti < 10 ? "0" : "") + minuti + ":" + (sec < 10 ? "0" : "") + sec;
    document.getElementById("newGame").addEventListener("click", function () {
        let win = document.getElementById("finePartita");
        win.style.zIndex = -1;
        selectDifficulty();
    });
}

function aggiornaStatistiche() 
{
    let username = localStorage.username;
    fetch("../php/aggiornaStatistiche.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "username=" + encodeURIComponent(username) + "&tempo=" + encodeURIComponent(secondi) + "&diff=" + encodeURIComponent(difficulty)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) 
        {
            console.log("failed to update: " + data.message);
        } 
    });
}

function gestioneSconfitta(i, j) 
{
    //scopro tutti i fiori e rimuovo gli event dalle celle 
    for(let h = 0; h <stato.length; h++)
    {
        let i = Math.floor(h/numColonne);
        let j = h%numColonne;
        let cella = document.getElementById(i+'|'+j);
        if(stato[h] === "0")
        {
            if(cella.innerHTML === "")
            {
                cella.innerHTML = "<img src='../immagini/fioreGameStats.png' class='fiori'>";
            }
        }
        else if(cella.innerHTML.includes("fioreGameStats.png"))
        {
            cella.style.backgroundColor = "lightcoral";
        }

        cella.removeEventListener("contextmenu", selezionaFiore);
        cella.removeEventListener("click", selezionaCasella);
    }

    //blocco il tempo e faccio apparire il riquadro di vittoria
    clearInterval(timerid);
    secondi--;
    
    let sconfitta = document.getElementById("finePartita");
    sconfitta.style.zIndex = 10;
    sconfitta.innerHTML = '<label id="endGame">GAME OVER</label><button id="newGame">Gioca ancora</button>';
    document.getElementById("newGame").addEventListener("click", function () {
        let win = document.getElementById("finePartita");
        win.style.zIndex = -1;
        selectDifficulty();
    });
}

function aggiornaCaselle(i, j) 
{
    let cella = document.getElementById(i + "|" + j);
    i = Number(i);
    j = Number(j);
    if(stato[(i*numColonne+j)] == "0")
    {
        return -1;
    }
    else if((stato[(i*numColonne+j)] != "/"))
    {
        cella.innerHTML = "";
        cella.innerText = stato[(i*numColonne+j)];
        cella.removeEventListener("click", selezionaCasella);
        cella.className = (cella.className == "pari")? "show_pari":"show_dispari";
        return 1;
    }
    else
    {
        cercaCelleLibere(i, j, "/", "\\");
        aggiornaStatoCampo();
        return 1;
    }
}

function aggiornaStatoCampo() 
{
    let altreCelle = false;
    for(let h = 0; h < stato.length; h++) 
    {
        let a = Math.floor(h / numColonne);
        let b = h % numColonne;
        if(stato[h] == "/" && nearZone(h, "\\")>0)
        {
            cercaCelleLibere(a, b, "/", "\\");
            altreCelle = true;
        }
        if(stato[h] == "\\" || nearZone(h, "\\")>0) 
        {
            let current = document.getElementById(a + '|' + b);
            if(current.className == "show_dispari" || current.className =="show_pari") 
            {
                continue; 
            }
            else
            {
                current.innerHTML = "";
                if(stato[h] !== "\\")
                {
                    current.innerText = stato[(a*numColonne+b)];
                }
                else
                    current.innerText = "";
                current.removeEventListener("click", selezionaCasella);
                current.className = (current.className == "pari")? "show_pari":"show_dispari";   
            }
        }
    }  
    if(altreCelle)
    {
        aggiornaStatoCampo();
    }  
}

//fa una ricerca in profondità cambiando oldchar in newchar
function cercaCelleLibere(x, y, oldChar, newChar) 
{
    let h = x * numColonne + y;
    
    let stack = [h]; 
    while(stack.length > 0) 
    {
        let current = stack.pop();
        if(stato[current] === oldChar) 
        {
            stato[current] = newChar; 

            let riga = Math.floor(current / numColonne);
            let colonna = current % numColonne;

            // Controlla le 4 direzioni (su, giù, sinistra, destra)
            let numRiga = riga - 1;
            let numColonna = colonna;
            if(numRiga >= 0 && stato[numRiga * numColonne + numColonna] === oldChar) 
            {
                stack.push(numRiga * numColonne + numColonna);
            }

            numRiga = riga + 1;
            numColonna = colonna;
            if(numRiga < numRighe && stato[numRiga * numColonne + numColonna] === oldChar) 
            {
                stack.push(numRiga * numColonne + numColonna);
            }

            numRiga = riga;
            numColonna = colonna - 1;
            if(numColonna >= 0 && stato[numRiga * numColonne + numColonna] === oldChar) 
            {
                stack.push(numRiga * numColonne + numColonna);
            }

            numRiga = riga; 
            numColonna = colonna + 1;
            if(numColonna < numColonne && stato[numRiga * numColonne + numColonna] === oldChar) 
            {
                stack.push(numRiga * numColonne + numColonna);
            }
        }
    }
}

function caricaStatoCampo(i, j) 
{
    i = Number(i);
    j = Number(j);
    let rmin = i, rmax = i, cmin = j, cmax = j;
    //imposto la safe zone iniziale 3x3
    if(i!=0)
        rmin = i-1;
    if(i!=(numRighe-1))
        rmax = i+1;
    if(j!=0)
        cmin = j-1;
    if(j!=(numColonne-1))
        cmax = j+1;
    
    for(let k = rmin; k<=rmax; k++)
    {
        for(let h = cmin; h<=cmax; h++)
        {
            stato[k*numColonne + h] = "/";
        }
    }

    for (let k = 0; k < numBombe; k++) 
    {
        let pos;
        do 
        {
            pos = Math.floor(Math.random() * stato.length);
        } while (stato[pos] == "0" || stato[pos] === "/"); 
        stato[pos] = "0";
    }
    
    while(true) 
    {
        let modified = 0; 
        for(let h = 0; h < stato.length; h++) 
        {
            if(stato[h] !== "0" && nearZone(h, "/")>0 && nearZone(h, "0") == 0) 
            {
                stato[h] = "/";
                modified++;
            }
        }
        if(modified === 0) 
            break; 
    }
    
    for(let h = 0; h < stato.length; h++) 
    {
        if(stato[h] === "/" || nearZone(h, "/")>0) 
        {
            if(stato[h] == "0")  
                continue;
            let trovate = nearZone(h, "0");
            if(trovate === 0)
                stato[h] = "/";
            else
                stato[h] = trovate;
        }
    }

    
    for(let h = 0; h < stato.length; h++) 
    {
        if(stato[h] === "/" || nearZone(h, "/")>0)
        {
            let cella = document.getElementById(Math.floor(h/numColonne) + '|' + h%numColonne);
            if(stato[h] !== "/")
            {
                cella.innerText = stato[h];
                cella.removeEventListener("click", selezionaCasella);
            }
            else
            {
                cella.innerText = "";
                cella.removeEventListener("click", selezionaCasella);
            }
            cella.className = (cella.className == "pari")? "show_pari":"show_dispari";
        }
    }
    
    //aggiorno i numeri di tutte le celle di stato senza mostrarle
    for(let h = 0; h < stato.length; h++) 
    {
        let trovate = nearZone(h, "0");
        if(trovate < 0)
            continue;
        if(trovate == 0)
            stato[h] = "/";
        else
            stato[h] = trovate;
    }
}

//dato l'indice h e il carattere da cercare, restituisce il numero di char vicini alla cella di indice h
function nearZone(h, char) 
{
    if(stato[h] == char)
        return -1;
    let rmin = Math.floor(h/numColonne), 
        rmax = Math.floor(h/numColonne), 
        cmin = h%numColonne, 
        cmax = h%numColonne;
    if(rmin > 0)
        rmin--;
    if(rmax<numRighe-1)
        rmax++;
    if(cmin>0)
        cmin--;
    if(cmax<numColonne-1)
        cmax++;
    
    let found = 0;
    for(let i = rmin; i<=rmax; i++)
    {
        for(let j = cmin; j<=cmax; j++)
        {
            if(stato[i*numColonne + j] == char)
            {
                found ++;
            }
        }
    }
    return found;
}
