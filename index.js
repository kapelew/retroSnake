const numOfRows = 12;
const numOfColm = 12;
const startButton = document.getElementById("startButton");
const snakeCage = document.getElementById("snakeCage");
let gamePause = false;
let direction = "down";
let isAppleOnBoard = false;
let isMoving = false;
let currentSnake = [{ x: 4, y: 5 }];

for (let i = 0; i < numOfColm; i++){
    const column = document.createElement("div");
    column.id = `snakeColumn${i}`;
    snakeCage.appendChild(column);
    for (let j = 0; j < numOfRows; j++){
        const row = document.createElement("div");
        row.id = `snakeColumn${i}Row${j}`;
        row.classList.add(`snakeSquare`);
        column.appendChild(row);
    }
}

startButton.addEventListener("click", () =>{
    startButton.style.animation = "none";
    startButton.classList.remove("highlight");
    if(startButton.textContent === "PRESS TO PLAY"){
        startButton.innerHTML = "<span id=\"easy\" class='highlight' >EASY</span>/<span id=\"medium\" class='highlight'>MEDIUM</span>/<span id=\"hard\" class='highlight'>HARD</span>";
    }

});

function playSound(name) {
    const audio = new Audio("./sounds/" + name + ".wav");
    audio.play().catch(error => {
        console.error("Failed to play sound:", error);
    });
}

document.addEventListener("click", (event) => {
    switch (event.target.id) {
        case "easy":
        case "medium":
        case "hard":
            playGame(event.target.id);
            break;
        case 'playAgain':
            location.reload();
            break;
        case 'close':
            window.location.href = 'https://www.youtube.com/watch?v=0tOXxuLcaog';
            break;
    }
})

document.addEventListener("keydown", (event) =>{
    if (!isMoving) {
        switch(event.key){
            case 'ArrowUp':
                if(direction != "down") direction = 'up';
                isMoving = true;
                break;
            case 'ArrowDown':
                if (direction != "up") direction = 'down';
                isMoving = true;
                break;
            case 'ArrowRight':
                if (direction != "left") direction = "right";
                isMoving = true;
                break;
            case 'ArrowLeft':
                if (direction != "right") direction = "left";
                isMoving = true;
                break;
        }
    }
})
async function animateSnakeCage(color){
    for(let i = 0; i < numOfColm; i++){
        for(let j = 0; j < numOfRows; j++){
            document.getElementById(`snakeColumn${i}Row${j}`).style.backgroundColor = color;
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }
}

function moveSnake(){
    startButton.innerHTML = `Score: ${currentSnake.length}`;
    let newHead;
    switch(direction){
        case 'up':
            newHead = { x: currentSnake[0].x, y: currentSnake[0].y - 1 };
            break;
        case 'down':
            newHead = { x: currentSnake[0].x, y: currentSnake[0].y + 1 };
            break;
        case 'right':
            newHead = { x: currentSnake[0].x + 1, y: currentSnake[0].y };
            break;
        case 'left':
            newHead = { x: currentSnake[0].x - 1, y: currentSnake[0].y };
            break;
    }
    if (newHead.x < 0 || newHead.x >= numOfColm || newHead.y < 0 || newHead.y >= numOfRows) {
        pauseGame();
    }
    currentSnake.unshift(newHead);
    const newHeadElement = document.getElementById(`snakeColumn${newHead.x}Row${newHead.y}`);
    if ((newHeadElement.classList.contains("snake"))){
        pauseGame();
    }else if(newHeadElement.classList.contains("apple")){
        playSound("score");
        newHeadElement.classList.remove("apple");
        newHeadElement.classList.add("snake");
        isAppleOnBoard = false;
        isMoving = false;
        generateApple();
    }else{
        const tail = currentSnake.pop();
        document.getElementById(`snakeColumn${tail.x}Row${tail.y}`).classList.remove('snake');
        newHeadElement.classList.add("snake");
        isMoving = false;
    }

}

function generateApple(){
    if (!isAppleOnBoard){
        let appleX = Math.floor(Math.random() * numOfColm);
        let appleY = Math.floor(Math.random() * numOfRows);
        let appleElement = document.getElementById(`snakeColumn${appleY}Row${appleX}`);
        if (appleElement.classList.contains("snake")){
            generateApple()
            return;
        }else{
            appleElement.classList.add("apple");
            isAppleOnBoard = true;
        }
    }
}

function playGame(difficulty){
    if (!gamePause) {
        generateApple();
        switch(difficulty){
            case "easy":
                difficulty = 400;
                break;
            case "medium":
                difficulty = 250;
                break;
            case "hard":
                difficulty = 150;
                break;
        }
        gameInterval = setInterval(moveSnake, difficulty);
    }
}


function pauseGame(){
    playSound("gameOver");
    clearInterval(gameInterval);
    document.querySelectorAll(".snakeSquare").forEach(element =>{
        element.classList.remove("snake");
        element.classList.remove("apple");
    })
    animateSnakeCage('darkred');
    document.getElementById("startButton").innerHTML="Play again [<span id='playAgain' class='highlight'>Y</span>/<span id='close' class='highlight'>N</span>]";
    document.getElementById("startButton").style.visibility = "visible";

}


