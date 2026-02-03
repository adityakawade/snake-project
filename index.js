const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-reset");
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time")



const blockHeight = 50;
const blockWidth = 50;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerHTML = highScore

let time = `00-00`;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);


let blocks = [];

let snake = [
    { x: 3, y: 3 }

]

let direction = 'down';
let timeIntervalId = null;
let intervalId = null;

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };







for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row}-${col}`;
        blocks[`${row}-${col}`] = block
    }

}


function selfCollision(head) {
    return snake.some((segment, index) => {
        // skip current head
        if (index === 0) return false;

        return segment.x === head.x && segment.y === head.y;
    });
}


function randomFood() {
    // remove old food
    blocks[`${food.x}-${food.y}`].classList.remove("food");;
    // generate new food
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    // draw new food
    blocks[`${food.x}-${food.y}`].classList.add("food");

}

function render() {

    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }
    else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    // wall collision logic
    if (head.x < 0 || head.y < 0 || head.x > rows - 1 || head.y > cols - 1) {
        clearInterval(intervalId);

        modal.style.display = "flex"
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    // self collision
    if (selfCollision(head)) {
        clearInterval(intervalId);

        modal.style.display = "flex"
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    // food consume logic
    if (head.x === food.x && head.y === food.y) {
        randomFood();
        snake.unshift(head);
        score += 10;
        scoreElement.innerHTML = score;
        if (highScore < score) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString())
        }


    }

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    snake.unshift(head);
    snake.pop()


    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })


}


startButton.addEventListener("click", () => {
    modal.style.display = "none"
    intervalId = setInterval(() => {

        render();
    }, 300)


      timeIntervalId = setInterval(() => {
        let [minutes, seconds] = time.split("-").map(Number);
        
        if (seconds == 59) {
            minutes += 1;
            seconds = 0;
        } else {
            seconds += 1;
        }

        time = `${minutes}-${seconds}`
        timeElement.innerHTML = time
    },1000)

})



restartButton.addEventListener("click", restartGame)

function restartGame() {
    score = 0;
    time = `00-00`
    scoreElement.innerHTML = score;
    timeElement.innerHTML = time;
    highScoreElement.innerHTML = highScore

    // remove snake
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    // remove food
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    modal.style.display = "none";

    direction = "down"

    //  generate new snake
    snake = [
        { x: 3, y: 3 }

    ]


    // generate new food
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

    intervalId = setInterval(() => {

        render();
    }, 300)



}

// addEventListener("keydown", (event) => {
//     if (event.key === "ArrowUp") {
//         direction = "up";
//     }
//     else if (event.key === "ArrowRight") {
//         direction = "right";
//     }
//     else if (event.key === "ArrowDown") {
//         direction = "down";
//     }
//     else if (event.key === "ArrowLeft") {
//         direction = "left";
//     }

// })


addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (event.key === "ArrowRight" && direction !== "left") direction = "right";
    else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    else if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
});




