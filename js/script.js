class Card{
    constructor(value, name, imgUrl){
        this.value = value;
        this.name = name;
        this.imgUrl = imgUrl;
    }
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const cards = [];

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

var boardCards = [];

function createBoard(){
    const board = document.getElementById("board");
    board.innerHTML = "";
    boardCards = getBoardArray();
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
            front.classList.add("flip-card-front", "d-flex","flex-column","justify-content-center");
            let frontSymbol = document.createElement("i");
            frontSymbol.classList.add("bi","bi-question-circle","text-brown");
            front.appendChild(frontSymbol);
            //back face of the card
            let back = document.createElement("div");
            back.classList.add("flip-card-back","text-brown");
            let cardImg = document.createElement("img");
            cardImg.src = boardCards[id].imgUrl;
            cardImg.alt = boardCards[id].name;
            back.appendChild(cardImg);
            //building the card
            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);
            row.appendChild(card);
        }
        board.appendChild(row);
    }
}

const selected = [];
var shaking = false;

function selectCard(id){
    const card = document.getElementById(id);
    const inner = card.firstChild;

    if(shaking ||inner.classList.contains("flipped")){
        return;
    }

    card.classList.remove("flip-card-animation");
    inner.classList.add("flipped");
    selected.push(id);
    if(selected.length == 2){
        if(boardCards[selected[0]].value == boardCards[selected[1]].value){
            inner.classList.add("correct");
            document.getElementById(selected[0]).firstChild.classList.add("correct");
        }
        else{
            shaking = true;
            markWrong(selected[0]);
            markWrong(selected[1]);
        }
        selected.length = 0;
    }
}

function markWrong(id){
    const card = document.getElementById(id);
    const inner = card.firstChild;
    const back = inner.lastChild;
    const shakeAnimation = async () => {
        back.classList.add("border","border-danger");
        card.classList.add("shaking");
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
        const card = document.getElementById(i);
        const inner = card.firstChild;
        card.classList.toggle("flip-card-animation");
        inner.classList.toggle("flipped");
    }
}

function restoreCard(id){
    const card = document.getElementById(id);
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