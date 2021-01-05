let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');


//#region Dependencies

//Source settings

//Backround image
const backgroundImage = new Image();
backgroundImage.src = "https://cdn130.picsart.com/245485586017202.jpg?type=webp&to=min&r=640";

//Ball sound
const ballSound = new Audio("./Sounds/ball.mp3");

//Brick sound
const brickSound = new Audio("./Sounds/brick.mp3");

//Game Over sound
const gameOverSound = new Audio("./Sounds/gameOver.mp3");

//Fall sound
const fallSound = new Audio("./Sounds/fall.mp3");

//#endregion

//Player variables
const playerWidth = 50;
const playerHeight = 5;
const distanceFromBottom = 5;
const colorStroke = '#0000';
let left = false;
let right = false;
let start = true;

//Ball variable
const ballRadius = 4;

//Bricks variables
const colorGreen = '#20fc03';
const colorYellow = '#fcf803';
const colorRed = '#fc0303';
let bricks = [];

//Game variables
const scorePoints = 5;
let score = 0;
let level = 1;
let gameOver = false;

//#region Player Configurations

//Player Settings

//Settings of the player

const player = {
    x: canvas.width / 2 - playerWidth / 2,
    y: canvas.height - distanceFromBottom - playerHeight,
    width: playerWidth,
    height: playerHeight,
    life: 3,
    velocity: 4
}

const drawPlayer = () => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.strokeStyle = colorStroke;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
}

const movePlayer = () => {
    if (left && player.x > 0) {

        player.x -= player.velocity;
    }
    else if (right && (player.x + player.width) < canvas.width) {
        player.x += player.velocity;
    }
}

//Controllers settings

document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
        left = true;
    }
    else if (event.key == 'ArrowRight') {
        right = true;
    }
    if (event.key == ' ' && start) {
        ball.mY = 1;
        start = false;
    }

})

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowLeft') {
        left = false;
    }
    else if (event.key == 'ArrowRight') {
        right = false;
    }
})

//#endregion

//#region Ball Configuration

//Ball Settings


const ball = {
    radius: ballRadius,
    x: canvas.width / 2,
    y: player.y - ballRadius - 2,
    speed: 1.5,
    mX: 0,
    mY: 0

    //M is like the pendant of a line in mathematics, it's the direction it will take with the velocity of movements in X or Y
}

//Collision detections

const ballCollision = () => {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.mX = -ball.mX;
    }
    else if (ball.y - ball.radius < 0) {
        ball.mY = -ball.mY;
    }
    else if (ball.y + ballRadius > canvas.height) {

        player.life -= 1;
        player.life === 0 ? gameOverSound.play() : fallSound.play();
        resetBall();
    }
}

const ballPlayer = () => {
    if (ball.x < player.x + player.width && ball.y > player.y && ball.x > player.x && player.y < player.y + player.height) {

        ballSound.play();
        let collision = ball.x - (player.x + player.width / 2);
        collision = collision / (player.width / 2);
        let angle = collision * Math.PI / 3;
        ball.mX = ball.speed * Math.sin(angle);
        ball.mY = - ball.speed * Math.cos(angle);
    }
}
const resetBall = () => {
    ball.x = canvas.width / 2;
    ball.y = player.y - ballRadius - 2;
    ball.mX = 0;
    ball.mY = 0;
    start = true;
}
const drawBall = () => {

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

const moveBall = () => {
    ball.x += ball.mX;
    ball.y += ball.mY;
}

//#endregion

//#region Bricks configuration

//Brick Settings

const brick = {
    row: 5,
    column: 4,
    width: 47,
    height: 5,
    paddingLeft: 10,
    paddingTop: 10,
    marginTop: 1,
}

const createBricks = () => {
    for (i = 0; i < brick.row; i++) {
        bricks[i] = [];
        for (k = 0; k < brick.column; k++) {
            bricks[i][k] = {
                x: i * (brick.paddingLeft + brick.width) + brick.paddingLeft,
                y: k * (brick.paddingTop + brick.height) + brick.paddingTop + brick.marginTop,
                broked: false,
                typeBrick: Math.floor(Math.random() * 3) + 1
            }
        }
    }
}


const drawBricks = () => {


    for (i = 0; i < brick.row; i++) {
        for (k = 0; k < brick.column; k++) {
            if (bricks[i][k].broked != true) {
                switch (bricks[i][k].typeBrick) {
                    case 1:
                        ctx.fillStyle = colorGreen;
                        ctx.fillRect(bricks[i][k].x, bricks[i][k].y, brick.width, brick.height);
                        break;
                    case 2:
                        ctx.fillStyle = colorYellow;
                        ctx.fillRect(bricks[i][k].x, bricks[i][k].y, brick.width, brick.height);
                        break;
                    case 3:
                        ctx.fillStyle = colorRed;
                        ctx.fillRect(bricks[i][k].x, bricks[i][k].y, brick.width, brick.height);
                        break;

                }
            }
        }
    }
}

const ballBricks = () => {

    for (i = 0; i < brick.row; i++) {
        for (k = 0; k < brick.column; k++) {
            if (bricks[i][k].broked != true) {

                if (ball.x + ball.radius > bricks[i][k].x && ball.x - ball.radius < bricks[i][k].x + brick.width && ball.y + ball.radius > bricks[i][k].y
                    && ball.y - ball.radius < bricks[i][k].y + brick.height) {
                    ball.mY = - ball.mY;
                    score += scorePoints;
                    brickSound.play();
                    switch (bricks[i][k].typeBrick) {
                        case 1:
                            bricks[i][k].broked = true;

                            break;
                        case 2:
                            ctx.fillStyle = colorGreen;
                            ctx.fillRect(bricks[i][k].x, bricks[i][k].y, brick.width, brick.height);
                            bricks[i][k].typeBrick = 1;
                            break;
                        case 3:
                            ctx.fillStyle = colorYellow;
                            ctx.fillRect(bricks[i][k].x, bricks[i][k].y, brick.width, brick.height);
                            bricks[i][k].typeBrick = 2;
                            break;

                    }

                }



            }
        }
    }

}

//#endregion


//#region Game Settings

const isGameOver = () => {
    if (player.life === 0) return gameOver = true;
}

//Show some text like lives, score, gameover...

const stats = (text, x, y, value, vX, vY) => {

    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';
    ctx.fillText(text, x, y);

    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';
    ctx.fillText(value, vX, vY);

}

const nextLevel = () => {
    let completed = true;
    for (i = 0; i < brick.row; i++) {
        for (k = 0; k < brick.column; k++) {
            completed = completed && bricks[i][k].broked;
        }
    }

    if (completed) {
        if (level === 10) {
            isGameOver();
        }
        resetBall()
        level++
        createBricks();
    }

}

const levelSetings = () => {

    switch (level) {
        case 1:
            ball.speed = 1.5;
            player.velocity = 3;
            break;

        case 2:
            ball.speed = 2;
            player.velocity = 4;
            break;

        case 3:
            ball.speed = 2.5;
            player.velocity = 5;
            break;

        case 4:
            ball.speed = 2;
            player.velocity = 6;
            break;

        case 5:
            ball.speed = 2.5;
            player.velocity = 7;
            break;

        case 6:
            ball.speed = 3;
            player.velocity = 8;
            break;

        case 7:
            ball.speed = 3.5;
            player.velocity = 9;
            break;

        case 8:
            ball.speed = 4;
            player.velocity = 9;
            break;

        case 9:
            ball.speed = 4.5;
            player.velocity = 9;
            break;

        case 10:
            ball.speed = 5;
            player.velocity = 9;
            break;


    }
}

const draw = () => {

    drawBall();
    drawPlayer();
    drawBricks();

    stats('Score', 10, 9, score, 50, 9);

    stats('Lives', canvas.width - 60, canvas.height, player.life, canvas.width - 30, canvas.height);
    
    levelSetings();
    
    if (gameOver) {
        stats('Game Over', canvas.width / 2 - 20, canvas.height / 2, score, canvas.width / 2, canvas.height / 2 + 20);
    }

}

const update = () => {
    movePlayer();
    moveBall();
    ballCollision();
    ballPlayer();
    ballBricks();
    nextLevel();
    isGameOver();
}

//#endregion

//Game Loop

const gameLoop = () => {


    ctx.drawImage(backgroundImage, 0, 0); //Image that will refresh and don't need a ctx.clean

    draw();

    if (!gameOver) {
        requestAnimationFrame(gameLoop)
    }

    update();

}

//Start functions

createBricks();
gameLoop();
