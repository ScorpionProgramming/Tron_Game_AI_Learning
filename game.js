let tileSize = 16;
let canvasSize = 512;

let field = [];
for (let i = 0; i < canvasSize / tileSize; i++) {
    field[i] = [];
    for (let j = 0; j < canvasSize / tileSize; j++) {
        field[i][j] = 0;
    }
}
//init array
field[canvasSize / tileSize];

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = canvasSize;
canvas.height = canvasSize;


/**
 * Positions data = data on GRID = canvas.size / tilesize
 * x y are the pixel on the canvas
 */
class Player {

    constructor(posX, posY, dir) {
        this.posX = posX;
        this.posY = posY;
        this.dir = dir;
        this.nextDir;
        this.x = this.posX * tileSize;
        this.y = this.posY * tileSize;

        console.log(this.posX + " " + this.posY + " " + this.dir + " " + this.x + " " + this.y);
    }


    moveUp() {
        //if (this.dir !== "south")
        this.nextDir = "north";
    }

    moveLeft() {
        //if (this.dir !== "east")
        this.nextDir = "west";
    }

    moveDown() {
        //if (this.dir !== "north")
        this.nextDir = "south";
    }

    moveRight() {
        //if (this.dir !== "west")
        this.nextDir = "east";
    }

    checkDirection() {
        switch (this.nextDir) {
            case "north":
                if (this.dir !== "south")
                    this.dir = "north";
                break;
            case "west":
                if (this.dir !== "east")
                    this.dir = "west";
                break;
            case "south":
                if (this.dir !== "north")
                    this.dir = "south";
                break;
            case "east":

                if (this.dir !== "west")
                    this.dir = "east";
                break;
            default:
                break;
        }
    }

    update(deltatime) {
        /* this.x = this.posX * tileSize;
        this.y = this.posY * tileSize; */
        this.checkDirection();
        // let speed = tileSize;//* deltatime;
        //console.log(speed + " "+ deltatime);

        let nX = 0, nY = 0;
        if (this.dir === "east") {
            nX = 1;
        }
        if (this.dir === "west") {
            nX = -1;
        }
        if (this.dir === "south") {
            nY = 1;
        }
        if (this.dir === "north") {
            nY = -1;
        }

        //gridmovement
        let nextPosX = this.posX + nX;
        let nextPosY = this.posY + nY;

        if (field[nextPosX] != undefined && field[nextPosX][nextPosY] != undefined &&
            field[nextPosX][nextPosY] !== 1) {

            console.log("moving");

            field[this.posX][this.posY] = 1;

            this.posX = nextPosX;
            this.posY = nextPosY;

            // }
        } else {
            console.log("BOOOOOOOM");
        }




        //auf position des objekts mappen
        //this.posX = parseInt(this.x);
        //this.posY = parseInt(this.y);


        //console.log(this.posX + "  " + this.posY + "  " + this.x + "  " + this.y + "  " + speed);
    }


}

let p1 = new Player(2, 2, "south");
//let p2 = new Player(canvas.height-2, 2, "north");
//let p3 = new Player(2, canvas.height-2,  "west");
//let p4 = new Player(canvas.height-2, canvas.height-2, "EAST");

document.body.appendChild(canvas);

window.addEventListener("keydown", doKeyDown, true);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";


//test
let posX = 0;
let x = 0;
let factor = 1;

//var then = 0;
//starts the game -----------
let fps = 5;
let interval = 1000 / fps;
let now;
let then = Date.now();
let delta;

render();
gameLoop();



function input() {

}

function update(deltatime) {
    //console.log(deltatime);

    //wired stuff happened
    /* if (deltatime > interval) {
        deltatime = 0;
    } */

    //console.log(1/deltatime); //at the moment ~60 fps
    input();

    //....
    if (x > 512) {
        factor = -1;
    } else if (x < 0) {
        factor = 1;
    }

    x += tileSize * factor; //3 blöcke a 32 px pro sec

    posX = parseInt(x / tileSize) * tileSize;

    p1.update(deltatime);
    //p2.update(deltatime);
    //p3.update(deltatime);
    //p4.update(deltatime);
}

//drawfunktionen und so ...
function render() {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //....
    //if image is loaded than display it on canvas context
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    ctx.fillStyle = "brown";
    for (let i = 0; i < canvasSize / tileSize; i++) {
        for (let j = 0; j < canvasSize / tileSize; j++) {
            if (field[i][j] === 1) {
                ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
            }
        }
    }

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0 + posX, tileSize, tileSize);

    ctx.fillStyle = "green";
    ctx.fillRect(p1.posX * tileSize, p1.posY * tileSize, tileSize, tileSize);


}

//-----------------------------------------------------------------------------
// hier spielt die Musik nichts mehr hier dran anfassen
//-----------------------------------------------------------------------------

function gameLoop() {
    now = Date.now();
    delta = now - then;


    if (delta >= interval) {
        /* console.timeEnd("render");
        console.time("render"); */
        update(delta);

        render();
        then = now;

    }

    requestAnimationFrame(gameLoop);
}
//-----------------------------------------------------------------------------

function doKeyDown(e) {
    let key = e.keyCode;
    console.log(key);
    //player1 rot
    //Keys: W A S D
    //Keycodes: 87 65 83 68
    switch (key) {
        case 87:
            console.log("W pressed");
            p1.moveUp();
            break;
        case 65:
            console.log("A pressed");
            p1.moveLeft();
            break;
        case 83:
            console.log("S pressed");
            p1.moveDown();
            break;
        case 68:
            console.log("D pressed");
            p1.moveRight();
            break;
        default:
            break;
    }

    if (key == 87) {
        //console.log("W wurde gedrückt");
    }

    if (key = 65) {

    }

    //player2 blau
    //keys: I J K L
    //keycodes:

    //player3 grün
    //keys: up left down right
    //keycodes: 38 37 40 39

    //player4 gelb
    //keys: kp_8 kp_4 kp_5 kp_6
    //keycodes: 104 100 101 102
}