# Prato Fiorito Web App

## 📋 Descrizione del Progetto
Questa applicazione web è un'implementazione full-stack del classico gioco **Prato Fiorito**, sviluppata come progetto per il corso di **Progettazione Web**. 

Il sistema offre:
* **Tre livelli di difficoltà:** Facile (10x10, 15 fiori), Medio (15x15, 50 fiori) e Difficile (20x20, 85 fiori).
* **Sistema di Account:** Registrazione e Login con gestione sicura delle credenziali tramite hashing.
* **Classifiche e Statistiche:** Monitoraggio dei migliori tempi globali e delle prestazioni personali per ogni categoria.
* **Logica di Gioco Ottimizzata:** Algoritmi di espansione ricorsiva (Flood Fill) per la scoperta automatica delle celle vuote.

## 🛠️ Stack Tecnologico
* **Frontend:** HTML5, CSS3, JavaScript.
* **Backend:** PHP.
* **Database:** MySQL.
* **Ambiente Server:** XAMPP.

---

## 🚀 Guida all'Installazione (Localhost con XAMPP)

Per far funzionare il progetto (il cui zip è scaricabile nella sezione release) sul proprio computer, è necessario configurare un ambiente server locale.

### 1. Preparazione dell'Ambiente
1.  Scaricare e installare [XAMPP](https://www.apachefriends.org/it/index.html).
2.  Avviare il **XAMPP Control Panel**.
3.  Cliccare su **Start** in corrispondenza dei moduli **Apache** e **MySQL**.

### 2. Configurazione dei File
1.  Navigare nella cartella di installazione di XAMPP (solitamente `C:\xampp\htdocs` su Windows).
2.  Clonare la repository o estrarre i file all'interno di una cartella nominata `ProgettazioneWeb`.
    * *Percorso finale atteso:* `C:\xampp\htdocs\ProgettazioneWeb\index.html`.

### 3. Configurazione del Database
1.  Aprire il browser e accedere a [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
2.  Creare un nuovo database cliccando su **Nuovo** e nominarlo esattamente: `prato_fiorito_db`.
3.  Selezionare il database `prato_fiorito_db` dalla colonna di sinistra.
4.  Cliccare sulla scheda **Importa** nel menu superiore.
5.  Cliccare su **Scegli file** e selezionare il file presente in: `/sql/prato_fiorito_db.sql`.
6.  Scorrere in fondo e cliccare su **Esegui**.

### 4. Verifica Connessione PHP
Il file `php/connessione.php` è preconfigurato per le impostazioni di default di XAMPP:
* **Host:** `localhost`
* **User:** `root`
* **Password:** `root` (Se la tua configurazione di XAMPP non prevede password per l'utente root, apri il file e imposta `$password = "";`).

### 5. Avvio del Gioco
Una volta configurato il database e i moduli Apache/MySQL, digita nel browser:
`http://localhost/ProgettazioneWeb/index.html`.

---

## ⚠️ Troubleshooting: Conflitti di Porta

Se disponi già di un'istanza **MySQL/MariaDB** standalone in esecuzione (es. MySQL 9.5), il modulo MySQL di XAMPP non potrà avviarsi sulla porta di default `3306` a causa di un conflitto di socket. 

In questo scenario, hai due opzioni:

### Opzione 1: Utilizzare l'istanza esistente
È la scelta ideale se preferisci non modificare le impostazioni di XAMPP.
1. Importa il database `prato_fiorito_db` tramite **MySQL Workbench** o la CLI di MySQL utilizzando il file presente in `sql/prato_fiorito_db.sql`.
2. Verifica che le credenziali nel file `php/connessione.php` corrispondano a quelle della tua istanza locale (Host, User, Password).

### Opzione 2: Modificare la porta in XAMPP
Se preferisci usare il MySQL integrato in XAMPP, devi spostare l'intero ambiente sulla porta **`3307`** seguendo questi passaggi:

#### 1. Configurazione del Server (my.ini)
Nel pannello di controllo XAMPP, clicca su **Config** (accanto a MySQL) e seleziona **`my.ini`**:
* Cerca la stringa `port=3306`.
* Modificala in **`port=3307`** in tutte le sue occorrenze (solitamente nelle sezioni `[client]` e `[mysqld]`).
* Salva il file e avvia il modulo MySQL dal pannello XAMPP.

#### 2. Configurazione di phpMyAdmin (config.inc.php)
Per permettere all'interfaccia web di gestione di trovare il database sulla nuova porta:
* Vai nella cartella di installazione di XAMPP, solitamente `C:\xampp\phpMyAdmin\`.
* Apri il file **`config.inc.php`**.
* Individua la riga: `$cfg['Servers'][$i]['host'] = '127.0.0.1';` (o `'localhost'`).
* Modificala includendo la porta esplicita: **`$cfg['Servers'][$i]['host'] = '127.0.0.1:3307';`**
* Salva e ricarica la pagina `http://localhost/phpmyadmin/`.

#### 3. Configurazione dell'Applicazione (connessione.php)
Infine, istruisci il gioco a comunicare attraverso il nuovo "canale":
* Apri il file `php/connessione.php`.
* Modifica la stringa di connessione DSN includendo il parametro della porta:
  ```php
  $conn = new PDO("mysql:host=$host;port=3307;dbname=$dbname;charset=utf8", $username, $password);

---

## 📂 Struttura della Repository
```text
/
├── css/            # Definizione del layout e dell'estetica
├── html/           # Strutture statiche delle pagine di gioco e utility
├── immagini/       # Asset grafici (fiori, icone di sistema)
├── javascript/     # Engine di gioco e gestione eventi client-side
├── php/            # Logica di business e gestione sessioni utente
├── sql/            # Script di inizializzazione del database MySQL
└── index.html      # Punto di ingresso dell'applicazione
