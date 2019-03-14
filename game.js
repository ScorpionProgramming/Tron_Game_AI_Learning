class TRONGame {

    constructor() {
        this.gameLoop = this.gameLoop.bind(this);

        let fps = 1;
        this.interval = 1000 / fps;
        this.then = Date.now();

        this.tileSize = 16;
        this.canvasSize = 512;
        this.players = [];

        this.field = [];

        const { tileSize, canvasSize, field } = this;
        for (let i = 0; i < canvasSize / tileSize; i++) {
            field[i] = [];
            for (let j = 0; j < canvasSize / tileSize; j++) {
                field[i][j] = { placed: 0, color: "lightgrey", val: 0 };
            }
        }
        //init array
        field[canvasSize / tileSize];

        // Create the canvas
        let canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        document.body.appendChild(canvas);
    }

    addPlayer(color) {
        let p1 = new Player(2, 2, "south", this.field, color);
        return this.players.push(p1) - 1;
    }

    getPlayer(i) {
        return this.players[i];
    }

    start() {

        //let p2 = new Player(canvas.height-2, 2, "north");
        //let p3 = new Player(2, canvas.height-2,  "west");
        //let p4 = new Player(canvas.height-2, canvas.height-2, "EAST");

        // Background image
        var bgReady = false;
        var bgImage = new Image();
        bgImage.onload = function () {
            bgReady = true;
        };
        bgImage.src = "images/background.png";


        //test
        /*  let posX = 0;
         let x = 0;
         let factor = 1; */

        //var then = 0;
        //starts the game -----------


        this.render();
        this.gameLoop();
    }

    /**
 * Positions data = data on GRID = canvas.size / tilesize
 * x y are the pixel on the canvas
 */



    calcdistance() {
        const p1 = this.players[0];
        for (let x = 0; x < this.canvasSize / this.tileSize; x++) {
            for (let y = 0; y < this.canvasSize / this.tileSize; y++) {

                this.field[x][y].val = Math.abs(x - p1.posX) + Math.abs(y - p1.posY);
            }
        }
    }
    update(deltatime) {
        //console.log(deltatime);

        //wired stuff happened
        /* if (deltatime > interval) {
            deltatime = 0;
        } */

        //console.log(1/deltatime); //at the moment ~60 fps


        //....
        /* if (x > 512) {
            factor = -1;
        } else if (x < 0) {
            factor = 1;
        }

        x += this.tileSize * factor; //3 blöcke a 32 px pro sec

        posX = parseInt(x / this.tileSize) * this.tileSize; */

        this.calcdistance();

        this.players.forEach(p => p.update(deltatime))
        //p1.update(deltatime);
        //p2.update(deltatime);
        //p3.update(deltatime);
        //p4.update(deltatime);
    }

    //drawfunktionen und so ...
    render() {
        const { tileSize, field, canvasSize } = this;

        this.ctx.clearRect(0, 0, canvasSize, canvasSize);
        //....
        //if image is loaded than display it on canvas context
        /*  if (bgReady) {
             this.ctx.drawImage(bgImage, 0, 0);
         } */

        this.ctx.fillStyle = "brown";
        for (let i = 0; i < canvasSize / tileSize; i++) {
            for (let j = 0; j < canvasSize / tileSize; j++) {
                //if (field[i][j].placed === 1) {
                this.ctx.fillStyle = field[i][j].color;
                this.ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
                //}
            }
        }

        /* this.ctx.fillStyle = "red";
        this.ctx.fillRect(0, 0 + posX, tileSize, tileSize); */

        this.players.forEach(p => {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(p.posX * tileSize, p.posY * tileSize, tileSize/2, tileSize/2)
        });
    }

    //-----------------------------------------------------------------------------
    // hier spielt die Musik nichts mehr hier dran anfassen
    //-----------------------------------------------------------------------------

    gameLoop() {
        let now = Date.now();
        let delta = now - this.then;


        if (delta >= this.interval) {
            /* console.timeEnd("render");
            console.time("render"); */
            this.update(delta);

            this.render();
            this.then = now;

        }

        requestAnimationFrame(this.gameLoop);
    }
    //-----------------------------------------------------------------------------

    /* doKeyDown(e) {
        let key = e.keyCode;
        console.log(key);
        //player1 rot
        //Keys: W A S D
        //Keycodes: 87 65 83 68
        const p1 = this.players[0];
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
    } */
}




class Player {

    constructor(posX, posY, dir, field, color) {
        this.posX = posX;
        this.posY = posY;
        this.dir = dir;
        this.nextDir;
        this.field = field;
        this.color = color;
        /*   this.x = this.posX;
          this.y = this.posY; */

        console.log(this.posX + " " + this.posY + " " + this.dir);//+ " " + this.x + " " + this.y);
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

        if (this.field[nextPosX] != undefined && this.field[nextPosX][nextPosY] != undefined &&
            this.field[nextPosX][nextPosY].placed !== 1) {

            console.log("moving");

            this.field[this.posX][this.posY].placed = 1;
            this.field[this.posX][this.posY].color = this.color;

            this.posX = nextPosX;
            this.posY = nextPosY;

            // f
        } else { // here collision
            console.log("BOOOOOOOM");
        }

        //auf position des objekts mappen
        //this.posX = parseInt(this.x);
        //this.posY = parseInt(this.y);


        //console.log(this.posX + "  " + this.posY + "  " + this.x + "  " + this.y + "  " + speed);
    }


}