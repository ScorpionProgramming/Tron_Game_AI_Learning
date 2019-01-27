let tileSize = 16;
let canvasSize = 512;

let field = [];
for (let i = 0; i < canvasSize/tileSize; i++) {
    field[i] = [];
    for (let j = 0; j < canvasSize/tileSize; j++) {
        field[i][j] = 0;        
    }
}

//init array
field[canvasSize/tileSize];

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
    
    constructor(posX, posY, dir){
        this.posX = posX;
        this.posY = posY;
        this.dir = dir;
        this.x = this.posX*16;
        this.y = this.posY*16;

        console.log(this.posX + " " + this.posY + " " + this.dir + " " + this.x + " " + this.y);
    }

    moveUp(){
        if(this.dir !== "south") 
            this.dir = "north";
    }

    moveLeft(){
        if(this.dir !== "east") 
            this.dir = "west";
    }

    moveDown(){
        if(this.dir !== "north") 
            this.dir = "south";
    }

    moveRight(){
        if(this.dir !== "west") 
            this.dir = "east";
    }

    update(deltatime){

        let speed = 5 * 16 * deltatime; 
        //console.log(speed + " "+ deltatime);

        if(this.dir === "east"){
            this.x += speed;
        }
        if(this.dir === "west"){
            this.x -= speed;
        }
        if(this.dir === "south"){
            this.y += speed;
        }
        if(this.dir === "north"){
            this.y -= speed;
        }

        //gridmovement
        this.posX = parseInt(this.x / 16);
        this.posY = parseInt(this.y / 16);

        field[this.posX][this.posY] = 1;

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

var then = 0;
//starts the game -----------
gameLoop();



function input(){

}

function update(deltatime){
    
    //wired stuff happened
    if(deltatime > 1000){
        deltatime = 0;
    }

    //console.log(1/deltatime); //at the moment ~60 fps
    input();
    
    //....
    if(x > 512){
        factor = -1; 
    }else if(x < 0) {
        factor = 1;
    }
    
    x += 3 * 16 * deltatime * factor; //3 blöcke a 32 px pro sec

    posX = parseInt(x / 16)*16;

    p1.update(deltatime);
    //p2.update(deltatime);
    //p3.update(deltatime);
    //p4.update(deltatime);
}

//drawfunktionen und so ...
function render(){
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //....
    //if image is loaded than display it on canvas context
    if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
    
    ctx.fillStyle = "brown";
    for (let i = 0; i < canvasSize/tileSize; i++) {
        for (let j = 0; j < canvasSize/tileSize; j++) {
            if(field[i][j] === 1){
                ctx.fillRect(i*16, j*16, 16, 16);
            }
        }
    }
    
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0+posX, 16, 16);

    ctx.fillStyle = "green";
    ctx.fillRect(p1.posX*16, p1.posY*16, 16, 16);


}

//-----------------------------------------------------------------------------
// hier spielt die Musik nichts mehr hier dran anfassen
//-----------------------------------------------------------------------------
function gameLoop(){
    let now = Date.now();
    let delta = now - then;

    update(delta/1000);
    render();

    then = now;

    requestAnimationFrame(gameLoop);
}
//-----------------------------------------------------------------------------

function doKeyDown(e){
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

    if(key == 87){
        //console.log("W wurde gedrückt");
    }

    if(key = 65){
        
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