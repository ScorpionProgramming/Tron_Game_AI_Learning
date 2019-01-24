// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 512;

class Player {
    constructor(posX, posY, dir){
        this.posX = posX;
        this.posY = posY;
        this.dir = dir;
        this.x = posX;
        this.y = posY;

        console.log(this.posX + " " + this.posY + " " + this.dir + " " + this.x + " " + this.y);
    }

    moveUp(){
        dir = "north";
    }

    moveLeft(){
        dir = "west"
    }

    moveDown(){
        dir = "south"
    }

    moveRight(){
        dir = "east"
    }

    update(deltatime){

        let speed = 3 * 16 * deltatime;

        if(this.dir === "north"){
            this.x += speed;
        }
        if(this.dir === "south"){
            this.x -= speed;
        }
        if(this.dir === "west"){
            this.y += speed;
        }
        if(this.dir === "east"){
            this.y -= speed;
        }

        //gridmovement
        this.posX = parseInt(this.x / 16)*16;
        this.posY = parseInt(this.y / 16)*16;

        //auf position des objekts mappen
        this.posX = this.x;
        this.posY = this.y;
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

var then = 0;
//starts the game -----------
gameLoop();



function input(){

}

function update(deltatime){
    //console.log(1/deltatime); //momentan ~60 fps
    input();
    x += 3 * 16 * deltatime; //3 blöcke a 32 px pro sec
    //....
    if(x > 512){
        x = 0;
    }

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
    //bild is loaded than display it on canvas context
    if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0+posX, 16, 16);
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
    console.log(e.keyCode)
    //player1 rot
    //Keys: W A S D
    //Keycodes: 87 65 83 68

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