
const game = new TRONGame(true, onRating);
let stopped = false;
let learning = true;
const id1 = game.addPlayer("green");
const id2 = game.addPlayer("red");
let idSpieler = [];

idSpieler[id1] = playerBrain();
idSpieler[id2] = playerBrain();

let element_p1 = document.getElementById("info_p1");
let element_p2 = document.getElementById("info_p2");


function onRating(state, id) {


    switch (state) {
        //unentschieden id = undefined
        case 0:
            console.log("DRAW");
            idSpieler.forEach((s, i) => {

                idSpieler[i].backward(DRAW_PUNISH);
            })
            break;

        //ein gewinner id = gewinner
        case 1:
            idSpieler[id].backward(WIN_REWARD);
            idSpieler.forEach((s, i) => {
                if (i != id)
                    idSpieler[i].backward(LOSS_PUNISH);
            })
            break;

        //es geht weiter id = undefined
        case 99:
            idSpieler.forEach((s, i) => {
                idSpieler[i].backward(ALIVE_REWARD);
            })
            break;

    }


    /* if (id != -1) {
        idSpieler[id].backward(WIN_REWARD);
        idSpieler.forEach((s, i) => {
            if (i != id)
                idSpieler[i].backward(LOSS_PUNISH);
        })
    } else {
        console.log("DRAW");

        idSpieler.forEach((s, i) => {

            idSpieler[i].backward(DRAW_PUNISH);
        })
    } */
    if (state == 0 || state == 1) {
        const p1 = idSpieler[id1];
        const p2 = idSpieler[id2];
        p1.visSelf(element_p1);
        p2.visSelf(element_p2);

        game.reset();
        console.clear();
    }
}
game.start();


const movePlayer = (id, action) => {
    switch (action) {
        case 0: game.getPlayer(id).moveUp(); break;
        case 1: game.getPlayer(id).moveLeft(); break;
        case 2: game.getPlayer(id).moveDown(); break;
        case 3: game.getPlayer(id).moveRight(); break;
        default: console.warn("WRONG INPUT", id); break;
    }
}

const mainLoop = () => {
    const p1 = idSpieler[id1];
    const p2 = idSpieler[id2];
    const action1 = p1.forward(game.getBoard(id1));
    const action2 = p2.forward(game.getBoard(id2));
    //console.log("actions", action1, action2);

    movePlayer(id1, action1);
    movePlayer(id2, action2);
    game.nextUpdate();



    if (!stopped)
        //requestAnimationFrame(mainLoop);
        setTimeout(mainLoop, learning ? 1 : 500);
}

const toggleLoop = () => {
    stopped = !stopped;
    (stopped ? {} : mainLoop());
}

const toggleLearning = () => {
    learning = !learning;
    idSpieler.forEach(s => s.learning = learning);
}

mainLoop();


/*
window.addEventListener("keydown", doKeyDown, true);
function doKeyDown(e) {
    let key = e.keyCode;
    //console.log(key);
    //player1 rot
    //Keys: W A S D
    //Keycodes: 87 65 83 68

    switch (key) {

        case 87:
            console.log("W pressed");
            game.getPlayer(id1).moveUp();
            break;
        case 65:
            console.log("A pressed");
            game.getPlayer(id1).moveLeft();
            break;
        case 83:
            console.log("S pressed");
            game.getPlayer(id1).moveDown();
            break;
        case 68:
            console.log("D pressed");
            game.getPlayer(id1).moveRight();
            break;

        //38 37 40 39

        case 38:
            game.getPlayer(id2).moveUp();
            break;
        case 37:
            game.getPlayer(id2).moveLeft();
            break;
        case 40:
            game.getPlayer(id2).moveDown();
            break;
        case 39:
            game.getPlayer(id2).moveRight();
            break;
        default:
            break;
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
}*/

