class TRONGame {

    /**
     *
     * @param {boolean} noConstantUpdates
     */
    constructor(noConstantUpdates) {
        this.gameLoop = this.gameLoop.bind(this);

        this.noConstantUpdates = noConstantUpdates;
        let fps = 10;
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

        // Create the canvas
        let canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        document.body.appendChild(canvas);
    }

    addPlayer(color) {
        const positions = [{ x: 0, y: 0, dir: "east" }, { x: 31, y: 31, dir: "west" }];
        let position = {};
        if (this.field[positions[0].x][positions[0].y].placed === 0)
            position = positions[0];
        else
            position = positions[1];

        let p1 = new Player(position.x, position.y, position.dir, this.field, color);
        return this.players.push(p1) - 1;
    }

    getPlayer(i) {
        if (this.players[i])
            return this.players[i];
    }

    start() {
        //this.field = [];
        this.then = Date.now();

        // Background image
        var bgReady = false;
        var bgImage = new Image();
        bgImage.onload = function () {
            bgReady = true;
        };
        bgImage.src = "images/background.png";



        //starts the game -----------


        this.render();
        this.gameLoop();
    }

    /**
    * Positions data = data on GRID = canvas.size / tilesize
    * x y are the pixel on the canvas
    */




    update() {
        if (!this.noConstantUpdates)
            this.updateEachPlayer();

    }

    updateEachPlayer() {

        this.players.forEach(p => {
            p.update();


        });

        this.checkWinCondition();
    }

    nextUpdate() {
        if (this.noConstantUpdates) {
            this.updateEachPlayer();
        }
    }

    checkWinCondition() {
        let alivePlayers = [];
        this.players.forEach(p => {
            if (p.alive)
            alivePlayers.push(p);
        });

        // switch(alivePlayers.length){
        //     case 0: this.endGame(0, null);
        //             break;
        //     case 1: this.endGame(1, alivePlayers[0]);
        // }
    }

    //-----------------------------------------------------------------------------
    // hier spielt die Musik nichts mehr hier dran anfassen
    //-----------------------------------------------------------------------------

    gameLoop() {
        let now = Date.now();
        let delta = now - this.then;


        if (delta >= this.interval || this.noConstantUpdates) {
            this.update();

            this.render();
            this.then = now;
        }

        requestAnimationFrame(this.gameLoop);
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
                this.ctx.fillStyle = field[i][j].color;
                this.ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);

            }
        }

        this.players.forEach(p => {
            this.ctx.fillStyle = "grey";
            const x = p.posX * tileSize + (tileSize / 4);
            const y = p.posY * tileSize + (tileSize / 4);
            const w = tileSize / 2
            this.ctx.fillRect(x, y, w, w);
        });
    }


    //-----------------------------------------------------------------------------


    getBoard() {
        //get the playing field as a 1D-Array
        let tileCount = this.canvasSize / this.tileSize;
        let exportField = new Array(tileCount * tileCount);

        //Loop over playing field
        for (let i = 0; i < tileCount; i++) {
            for (let n = 0; n < tileCount; n++) {
                exportField[tileCount * i + n] = this.field[n][i].placed;
            }
        }
        console.log(exportField);
        return exportField;
    }
}




class Player {

    constructor(posX, posY, dir, field, color) {
        this.posX = posX;
        this.posY = posY;
        this.dir = dir;
        this.nextDir;
        this.field = field;
        this.color = color;
        this.alive = true;
        field[posX][posY].placed = 1;
        field[posX][posY].color = color;
        console.log(this.posX + " " + this.posY + " " + this.dir);
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

    update() {
        if (!this.alive){
            return;
        }

        this.checkDirection();

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

            this.field[nextPosX][nextPosY].placed = 1;
            this.field[nextPosX][nextPosY].color = this.color;

            this.posX = nextPosX;
            this.posY = nextPosY;


        } else { // here collision
            this.alive = false;
            console.log(this.color + "BOOOOOOOM");
        }



        //console.log(this.posX + "  " + this.posY + "  " + this.x + "  " + this.y + "  " + speed);
    }


}