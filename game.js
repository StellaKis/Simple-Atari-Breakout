const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameStarted = false;
let keyLeft = false;
let keyRight = false;

const palica = {
    width: 150,
    height: 15,
    speed: 15,
    x: 0,
    y: 0,
    color: "white"
};

const loptica = {
    width: 15,
    height: 15,
    x: 0,
    y: 0,
    color: "white",
    speed: 5,
    dx: 0,
    dy: 0  
};

let cigle = [];

let score = 0;
let bestScore = 0;

if (localStorage.getItem("bestScore")) {
    bestScore = parseInt(localStorage.getItem("bestScore"));
}

// Iscrtavanje početnog ekrana
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 36px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "BREAKOUT",
        canvas.width / 2,
        canvas.height / 2 
    );

    ctx.font = "bold italic 18px Helvetica";

    ctx.fillText(
        "Press SPACE to begin",
        canvas.width / 2,
        canvas.height / 2 + 18 + 10
    );

    drawScore();

    // Postavljanje sjene koja se dodaje na objekte pri njihovom iscrtavanju
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.shadowOffsetX = 3;                
    ctx.shadowOffsetY = 3;

    initCigle();
    drawCigle();

    // Postavljanje palice
    palica.x = (canvas.width - palica.width) / 2;
    palica.y = canvas.height - palica.height - 5;

    // // Postavljanje loptice
    loptica.x = palica.x + palica.width / 2 - loptica.width / 2; 
    loptica.y = palica.y - loptica.height;

    drawPalica();
    drawLoptica();
}

// Inicijalizacija podataka o svakoj cigli potrebnih za njihovo iscrtavanje i detekciju sudara
function initCigle() {
    const rows = 5;
    const cols = 10;
    const brickWidth = 70;
    const brickHeight = 25;
    const horizontalPadding = 30;
    const verticalPadding = 15;
    const offsetTop = 60;
    const offsetLeft = 15;
    const rowColors = [
        "rgb(153, 51, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 153, 204)",
        "rgb(0, 255, 0)",
        "rgb(255, 255, 153)"
    ]; 

    cigle = [];

    for (let row = 0; row < rows; row++) {
        cigle[row] = [];
        for (let col = 0; col < cols; col++) {
            cigle[row][col] = {
                x: offsetLeft + col * (brickWidth + horizontalPadding),
                y: offsetTop + row * (brickHeight + verticalPadding),
                width: brickWidth,
                height: brickHeight,
                color: rowColors[row],
                alive: true
            };
        }
    }
}


function startGame() {
    gameStarted = true;

    score = 0;

    // Random smjer početnog odbijanja loptice pod 45°
    let angle = 0;
    if (Math.random() < 0.5) {
        angle = 45;
    } else {
        angle = 135;
    }
    const rad = angle * Math.PI / 180;
    loptica.dx = loptica.speed * Math.cos(rad);
    loptica.dy = -loptica.speed * Math.sin(rad);

    initCigle();

    // Postavljanje palice
    palica.x = (canvas.width - palica.width) / 2;
    palica.y = canvas.height - palica.height - 5;

    // // Postavljanje loptice
    loptica.x = palica.x + palica.width / 2 - loptica.width / 2; 
    loptica.y = palica.y - loptica.height;

    // Pokretanje animacije
    requestAnimationFrame(update);
}

// Funkcije za iscrtavanje cigli
function drawCigle() {
    for (let row = 0; row < cigle.length; row++) {
        for (let col = 0; col < cigle[row].length; col++) {
            const brick = cigle[row][col]; 
            if (!brick.alive) continue; // uništene cigle (alive=false) se ne iscrtavaju

            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
    }

    return;
}

// Funkcije za iscrtavanje palice
function drawPalica() {
    ctx.fillStyle = palica.color;
    ctx.fillRect(palica.x, palica.y, palica.width, palica.height);
    return;
}

// Funkcije za iscrtavanje loptice
function drawLoptica() {
    loptica.x += loptica.dx;
    loptica.y += loptica.dy;

    ctx.fillStyle = loptica.color;
    ctx.fillRect(loptica.x, loptica.y, loptica.width, loptica.height);
    return;
}

// Funkcija za iscrtavanje rezultata
function drawScore() {
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Current score: " + score, 20, 20);

    ctx.textAlign = "right";
    ctx.fillText("Best score: " + bestScore, canvas.width - 100, 20);
}

// Funkcija za spremanje najboljeg rezultata u localStorage
function saveBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
    }
    drawScore();
}

// Glavna petlja igre
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // Pomicanje palice korisničkim inputom (tipke lijevo/desno) uz padding 5 od rubova platna
    if (keyLeft) {
        if (palica.x > 5) palica.x -= palica.speed;
    }
    if (keyRight) {
        if (palica.x + palica.width < canvas.width - 5) palica.x += palica.speed;
    }

    // Dodavanje sjene na objekte 
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.shadowOffsetX = 3;                
    ctx.shadowOffsetY = 3;

    // Iscrtavanje objekata
    drawCigle();
    drawPalica();
    drawLoptica();


    // Provjera uvjeta pobjedu
    if (score == 50) {
        gameStarted = false;

        ctx.shadowColor = "transparent"; 
        ctx.fillStyle = "yellow";
        ctx.font = "bold 40px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            "YOU WIN!", 
            canvas.width / 2, 
            canvas.height / 2
        );

        saveBestScore();
        return; // prekid update petlje = pobjeda
    }

    // Odbijanje od zidova
    if (loptica.x <= 0 || loptica.x + loptica.width >= canvas.width) {
        loptica.dx *= -1; // odbijanje lijevo-desno
    }
    if (loptica.y <= 0) {
        loptica.dy *= -1; // odbijanje gore-dolje
    }

    // Odbijanje od palice
    let lopticaDonjiRub =loptica.y + loptica.height
    let lopticaLijeviRub = loptica.x;
    let lopticaDesniRub = loptica.x + loptica.width;
    let lopticaGornjiRub = loptica.y;
    let palicaGornjiRub = palica.y;
    let palicaLijeviRub = palica.x;
    let palicaDesniRub = palica.x + palica.width;
    // Provjera nalazi li se loptica na visini palice (po y) i unutar njenih rubova (po x)
    if ( lopticaDonjiRub > palicaGornjiRub && lopticaDesniRub > palicaLijeviRub && lopticaLijeviRub < palicaDesniRub) {
        loptica.dy *= -1;
    }

    // Ako je loptica dotaknula donji rub platna ispisuje se poruka GAME OVER i osvježava se best score ako je premašen
    if (loptica.y + loptica.height >= canvas.height) {
        gameStarted = false;
        
        ctx.shadowColor = "transparent"; 
        ctx.fillStyle = "yellow";
        ctx.font = "bold 40px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            "GAME OVER", 
            canvas.width / 2, 
            canvas.height / 2
        );

        ctx.font = "bold italic 20px Helvetica";
        ctx.fillText(
            "Press SPACE to play again",
            canvas.width / 2,
            canvas.height / 2 + 20 + 10
        );

        saveBestScore();
        return; // prekid update petlje = zavrsetak igre
    }

    // Iscrtavanje rezultata 
    drawScore();

    // Provjera je li loptica pogodila neku od cigli
    for (let row = 0; row < cigle.length; row++) {
        for (let col = 0; col < cigle[row].length; col++) {

            const brick = cigle[row][col];
            if (!brick.alive) continue; // preskakanje uništenih cigli

            // Izdračun rubova cigle
            const ciglaLijeviRub = brick.x;
            const ciglaDesniRub = brick.x + brick.width;
            const ciglaGornjiRub = brick.y;
            const ciglaDonjiRub = brick.y + brick.height;

            // Provjera sudara loptice i cigle
            if (lopticaDesniRub >= ciglaLijeviRub && lopticaLijeviRub <= ciglaDesniRub && lopticaDonjiRub >= ciglaGornjiRub && lopticaGornjiRub < ciglaDonjiRub) {

                // Cigla se uništava i povećava se rezultat za 1
                brick.alive = false;
                score += 1;

                // Odbijanje loptice od cigle 
                // Provjera je li loptica prije sudara s ciglom bila iznad/ispod cigle (if) ili lijevo/desno od cigle (else)
                // Promjena smjera kretanja loptice po y odnosno po x te promjena brzine loptice
                if (lopticaDonjiRub - loptica.dy <= ciglaGornjiRub ||
                    lopticaGornjiRub - loptica.dy >= ciglaDonjiRub) {
                    loptica.dy *= (-1 * 1.02);
                    loptica.dx *= 1.02; 
                } else {
                    loptica.dx *= (-1 * 1.02);
                    loptica.dy *= 1.02; 
                }

                break; // prekid pretrage (for petlji) 
            }
        }
    }


    // Nastavak animacije
    requestAnimationFrame(update);
}

// Event listeneri za tipke space, lijevo i desno
document.addEventListener("keydown", function (e) {
    if (!gameStarted && e.code === "Space") {
        startGame();
    }
    if (e.code === "ArrowLeft") keyLeft = true;
    if (e.code === "ArrowRight") keyRight = true;
});

document.addEventListener("keyup", function(e) {
    if (e.code === "ArrowLeft") keyLeft = false;
    if (e.code === "ArrowRight") keyRight = false;
});

drawStartScreen();
