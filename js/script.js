class Card{
    constructor(value, name, imgUrl){
        this.value = value;
        this.name = name;
        this.imgUrl = imgUrl;
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const cards = []; //objects of the class card

cards[0] = new Card(0,"Skull","./images/skull.png");
cards[1] = new Card(1,"Key","./images/key.png");
cards[2] = new Card(2,"Duck","./images/duck.png");
cards[3] = new Card(3,"Apple","./images/apple.png");
cards[4] = new Card(4,"Clover","./images/clover.png");
cards[5] = new Card(5,"Hammer","./images/hammer.png");
cards[6] = new Card(6,"Medikit","./images/medikit.png");
cards[7] = new Card(7,"Pizza","./images/Pizza.png");
cards[8] = new Card(8,"Bow","./images/bow.png");
cards[9] = new Card(9,"Cigar","./images/cigar.png");
cards[10] = new Card(10,"Light Bulb","./images/lightbulb.png");
cards[11] = new Card(11,"Telescope","./images/telescope.png");
cards[12] = new Card(12,"Sword","./images/sword.png");
cards[13] = new Card(13,"Crystal Sphere","./images/crystalsphere.png");
cards[14] = new Card(14,"Grimoire","./images/grimoire.png");
cards[15] = new Card(15,"Cat","./images/cat.png");
cards[16] = new Card(16,"Coin","./images/coin.png");
cards[17] = new Card(17,"Brain","./images/icon.png");

var points1 = 0, points2 = 0;
var turn = Math.floor(Math.random() * 2) + 1;

var boardCards = []; //the cards which values are going to be displayed on the board

var tiles = []; //div elements of all cards

var usernamePlayerOne, usernamePlayerTwo;

function createBoard(){
    const board = document.getElementById("board");
    boardCards = getBoardArray();
    let boardStyle = turn == 1 ? "first-player" : "second-player";

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("div");
        row.classList.add("d-flex","flex-row");
        for (let j = 0; j < 6; j++) {
            //card container
            let card = document.createElement("div");
            card.classList.add("flip-card","flip-card-animation");
            let id = i*6 + j;
            card.setAttribute("onclick","selectCard(" + id + ")");
            card.id = id;
            //card content
            let inner = document.createElement("div");
            inner.classList.add("flip-card-inner");
            //front face of the card (used later on)
            let front = document.createElement("div");
            front.classList.add("flip-card-front", "border-" + boardStyle, "d-flex","flex-column", "justify-content-center");
            let frontSymbol = document.createElement("i");
            frontSymbol.classList.add("bi","bi-question-circle","text-brown");
            front.appendChild(frontSymbol);
            //back face of the card
            let back = document.createElement("div");
            back.classList.add("flip-card-back", "border-" + boardStyle, "text-" + boardStyle);
            let cardImg = document.createElement("img");
            cardImg.src = boardCards[id].imgUrl;
            cardImg.alt = boardCards[id].name;
            back.appendChild(cardImg);
            //building the card
            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);
            row.appendChild(card);
            tiles.push(card);
        }
        board.appendChild(row);
    }
    const button = document.createElement("i");
    button.classList.add("bi","bi-arrow-counterclockwise","text-brown","replay");
    button.setAttribute("onclick","playAgain()");
    board.appendChild(button);
}

const selected = [];
var shaking = false;

function selectCard(id){
    const card = document.getElementById(id);
    const inner = card.firstChild;

    if(shaking ||inner.classList.contains("flipped") || shuffling){
        return;
    }

    card.classList.remove("flip-card-animation");
    inner.classList.add("flipped");
    selected.push(id);
    if(selected.length == 2){
        if(boardCards[selected[0]].value == boardCards[selected[1]].value){
            card.classList.add("correct");
            document.getElementById(selected[0]).classList.add("correct");
            if (turn == 1) {
                points1++;
            }
            else{
                points2++;
            }

            refreshPoints();

            if(points1 + points2 == 18){
                win(points1,points2);
            }
        }
        else{
            shaking = true;
            markWrong(selected[0]);
            markWrong(selected[1]);
            const wrong = async () => {
                await sleep(680);
                console.log("wrong");
                changeTurn();
            }
            wrong();
        }
        selected.length = 0;
    }
}

function refreshPoints() {
    let points = document.getElementById("playerOneScore");
    points.innerHTML = points1;
    points = document.getElementById("playerTwoScore");
    points.innerHTML = points2;
}

function win(a,b) {
    //TODO
    let winner = "";
    let winnerClass = "";
    if(a > b){
        winner = usernamePlayerOne + " Wins!";
        winnerClass = "text-first-player";
    }
    else if(a < b){
        winner = usernamePlayerTwo + " Wins!";
        winnerClass = "text-second-player";
    }
    else{
        winner = "It's a Draw!";
        winnerClass = "text-draw";
    }

    const winMessage = document.getElementById("winner");
    winMessage.classList.add(winnerClass);
    winMessage.innerHTML = winner;
    winMessage.classList.remove("d-none");
}

function changeTurn(){
    turn = turn == 1 ? 2 : 1;

    changeColors(turn);
}

function markWrong(id){
    const card = tiles[id];
    const inner = card.firstChild;
    const back = inner.lastChild;
    const shakeAnimation = async () => {
        await sleep(680);
        
        if(!shuffling){
            back.classList.add("border","border-danger");
            card.classList.add("shaking");
        }
        
        await sleep(1000);
        back.classList.remove("border","border-danger");
        card.classList.remove("shaking");
        restoreCard(id);
        shaking = false;
    }
    shakeAnimation();
}

function flipAll(){
    for (let i = 0; i < 36; i++) {
        const card = tiles[i];
        const inner = card.firstChild;
        card.classList.toggle("flip-card-animation");
        inner.classList.toggle("flipped");
    }
}

function restoreCard(id){
    const card = tiles[id];
    const inner = card.firstChild;
    card.classList.add("flip-card-animation");
    inner.classList.remove("flipped");
}

function getBoardArray(){
    const array = [];
    for (let i = 0; i < cards.length; i++) {
        array.push(cards[i]);
        array.push(cards[i]);
    }

    const boardArray = shuffle(array);

    return boardArray;
}

function changeColors(n){
    let current = n == 1 ? "first" : "second";
    let past = n == 1 ? "second" : "first";
    for (let i = 0; i < tiles.length; i++) {
        const card = tiles[i];
        const inner = card.firstChild;
        const front = inner.firstChild;
        const back = inner.lastChild;
        if(!card.classList.contains("correct")){
            front.classList.add("border-"+current+"-player");
            front.classList.remove("border-"+past+"-player");
            back.classList.add("border-"+current+"-player");
            back.classList.remove("border-"+past+"-player");
            back.classList.add("text-"+current+"-player");
            back.classList.remove("text-"+past+"-player");
        }
        
    }
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex > 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  var shuffling = false;

  function playAgain(){
    selected.length = 0;
    shaking = false;
    shuffling = true;
    points1 = 0;
    points2 = 0;
    refreshPoints();
    const newBoard = shuffle(boardCards);
    const winnerText = document.getElementById("winner");
    winnerText.className = "";
    winnerText.classList.add("d-none");

    for (let i = 0; i < 36; i++) {
        const card = tiles[i];
        const inner = card.firstChild;
        card.classList.remove("shaking");
        card.classList.remove("correct");
        restoreCard(i);
    }

    turn = Math.floor(Math.random() * 2) + 1;
    changeColors(turn);

    const replay = async () => {
        await sleep(680);
        for (let i = 0; i < 36; i++) {
            const card = tiles[i];
            const inner = card.firstChild;
            const back = inner.lastChild;
            const img = back.firstChild;
            img.src = newBoard[i].imgUrl;
            img.alt = newBoard[i].name;
        }
        shuffling = false;
    }
    replay();
  }

  function startGame(){
    let playerOne = document.getElementById("playerOneUsername").value;
    let playerTwo = document.getElementById("playerTwoUsername").value;
    let warning = document.getElementById("errorMessage");

    if(playerOne == "" || playerOne == null || playerTwo == "" || playerTwo == null){
        warning.innerHTML = "Player nicknames must not be empty!";
        warning.classList.remove("d-none");
    }
    else{
        usernamePlayerOne = playerOne;
        usernamePlayerTwo = playerTwo;
        document.getElementById("playerone").innerHTML = usernamePlayerOne;
        document.getElementById("playertwo").innerHTML = usernamePlayerTwo;
        warning.remove();
        document.getElementById("nicknameForm").remove();
        let body = document.getElementById("body");
        body.classList.remove("form-body");
        body.id = "";
        document.getElementById("title").classList.remove("d-none");
        document.getElementById("gameboard").classList.remove("d-none");
        createBoard();
    }
  }
