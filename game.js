class TRONGame {

    /**
     *
     * @param {boolean} noConstantUpdates
     */
    constructor(noConstantUpdates, onGameEnd) {
        this.gameLoop = this.gameLoop.bind(this);
        this.buildField = this.buildField.bind(this);

        this.noConstantUpdates = noConstantUpdates;
        let fps = 5;
        this.interval = 1000 / fps;
        this.then = Date.now();

        this.tileSize = 32;
        this.canvasSize = 512;
        this.players = [];
        this.hasEnded = false;

        this.field = [];
        this.buildField();
        this.onGameEnd = onGameEnd;
        const { canvasSize } = this;


        // Create the canvas
        let canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        document.body.appendChild(canvas);
    }

    addPlayer(color) {

        const positions = [{ x: 0, y: 0, dir: "east" }, { x: 15, y: 15, dir: "west" }];
        let position = {};
        const { field } = this;

        //for (let i = 0; i < positions.length; i++) {
        //let pos = positions[i];
        positions.some(pos => {
            if (field[pos.x][pos.y].placed === 0) {
                position = pos;
                return true;
            }
            return false;
        });

        let p1 = new Player(position.x, position.y, position.dir, this.field, color);
        const id = this.players.push(p1) - 1;
        p1.id = id;
        return id;
    }

    buildField() {
        this.field = [];

        const { tileSize, canvasSize } = this;
        for (let i = 0; i < canvasSize / tileSize; i++) {
            this.field[i] = [];
            for (let j = 0; j < canvasSize / tileSize; j++) {
                this.field[i][j] = { placed: 0, color: "lightgrey", val: 0 };
            }
        }
    }

    reset() {
        this.buildField();
        const oldPlayers = [...this.players];
        this.players = [];
        oldPlayers.forEach(p => {
            this.addPlayer(p.color);
        });
        this.render();
        this.hasEnded = false;

    }

    getPlayer(i) {
        if (this.players[i])
            return this.players[i];
    }

    start() {
        //this.field = [];
        this.reset();
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
        var collision = false;
        this.players.forEach(p => {
            collision = p.update();
        });

        //this.checkWinCondition();
    }

    nextUpdate() {
        if (this.noConstantUpdates) {
            this.updateEachPlayer();
        }
    }

    checkWinCondition() {
        let alivePlayers = [];
        this.players.forEach(p => {
            if (p.alive) {
                alivePlayers.push(p);
            }
        });

        switch (alivePlayers.length) {
            case 0:
                this.endGame(0, null);
                break;
            case 1:
                this.endGame(1, alivePlayers[0]);
        }
    }

    endGame(count, player) {
        this.hasEnded = true;
        if (count === 0) {
            //window.alert("Ein Unentschieden!");
            this.onGameEnd(-1);
            return;
        }
        else {
            //window.alert("Spieler " + player.color + " gewinnt!!");
            this.onGameEnd(player.id);
            return;
        }
    };



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

        if (!this.hasEnded)
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

        for (let i = 0; i < canvasSize / tileSize; i++) {
            for (let j = 0; j < canvasSize / tileSize; j++) {
                if (field[i][j].placed) {
                    this.ctx.fillStyle = field[i][j].color;
                    this.ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
                }
            }
        }

        // Köpfe Malen
        this.players.forEach(p => {
            this.ctx.fillStyle = "grey";
            const x = p.posX * tileSize + (tileSize / 4);
            const y = p.posY * tileSize + (tileSize / 4);
            const w = tileSize / 2
            this.ctx.fillRect(x, y, w, w);
        });
    }


    //-----------------------------------------------------------------------------


    getBoard(id) {
        let tileCount = this.canvasSize / this.tileSize;
        let exportField = new Array(tileCount * tileCount);
        for (let i = 0; i < tileCount; i++) {
            for (let n = 0; n < tileCount; n++) {
                exportField[tileCount * i + n] = this.field[n][i].placed;
            }
        }
        const player = this.players.find(p => p.id == id);
        if (player) {
            let pos = [player.posX / (tileCount - 1), player.posY / (tileCount - 1)];
            exportField.push(...pos);
        } else {
            throw "no ID";
        }
        return exportField;
    }


    /* getBoard(id) {
        //get the playing field as a 1D-Array
        let tileCount = this.canvasSize / this.tileSize;
        let exportField = new Array((tileCount + 2) * (tileCount + 2)).map(v => 1);
 
        //Loop over playing field
        for (let i = 0; i < tileCount + 2; i++) {
            for (let n = 0; n < tileCount + 2; n++) {
                if (n == tileCount + 1 || i == tileCount + 1 || i == 0 || n == 0) {
 
                    exportField[(tileCount + 2) * i + n] = 1;
                } else {
 
                    exportField[(tileCount + 2) * i + n] = this.field[n - 1][i - 1].placed;
                }
            }
        }
 
        const player = this.players.find(p => p.id == id);
        if (player) {
            let pos = [player.posX / (tileCount-1), player.posY / (tileCount-1)];
            exportField.push(...pos);
        } else {
            throw "no ID";
        }
 
        //console.log(exportField);
        return exportField;
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
        this.alive = true;
        this.id = -1;
        field[posX][posY].placed = 1;
        field[posX][posY].color = color;
        //console.log(this.posX + " " + this.posY + " " + this.dir);
    }

    logMove(direction) {
        console.log(this.id, this.color, direction);
    }

    moveUp() {
        //if (this.dir !== "south")
        this.nextDir = "north";
        this.logMove(this.nextDir);

    }

    moveLeft() {
        //if (this.dir !== "east")
        this.nextDir = "west";
        this.logMove(this.nextDir);

    }

    moveDown() {
        //if (this.dir !== "north")
        this.nextDir = "south";
        this.logMove(this.nextDir);

    }

    moveRight() {
        //if (this.dir !== "west")
        this.nextDir = "east";
        this.logMove(this.nextDir);
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

    //returns true if collision occured
    update() {
        if (!this.alive) {
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

            //console.log("moving");

            this.field[nextPosX][nextPosY].placed = 1;
            this.field[nextPosX][nextPosY].color = this.color;
            this.field[nextPosX][nextPosY].playerId = this.id;

            this.posX = nextPosX;
            this.posY = nextPosY;

            return false;

        } else { // here collision
            this.alive = false;
            //console.log(this.color + "BOOOOOOOM");
            return true;
        }



        //console.log(this.posX + "  " + this.posY + "  " + this.x + "  " + this.y + "  " + speed);
    }


}