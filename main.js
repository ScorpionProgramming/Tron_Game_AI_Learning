const game = new TRONGame(true, onGameEnd);

const id1 = game.addPlayer("green");
const id2 = game.addPlayer("red");
let idSpieler = [];

idSpieler[id1] = playerBrain();
idSpieler[id2] = playerBrain();

let element = document.getElementById("info");

var do_count = true;

var train = true;

var p1_win = 0;
var p2_win = 0;

let rounds = 0; 

function onGameEnd(id) {
    if(id === 0){
        p1_win++;
    }else{
        p2_win++;
    }

    if (id != -1) {

        if(rounds - 1500 > 0 && rounds % 100 === 0){
            let reward = Math.abs(p1_win - p2_win);
            console.clear();
            if(p1_win > p2_win){
                console.log("Round " + rounds + ": p1_win = " + p1_win + " | Reward = " + reward);
                idSpieler[1].value_net = idSpieler[0].value_net;
            }else{
                console.log("Round " + rounds + ": p2_win = " + p2_win + " | Reward = " + reward);
                idSpieler[0].value_net = idSpieler[1].value_net;
            }

            p1_win = 0;
            p2_win = 0;
        }

        idSpieler[id].backward(WIN_REWARD);
        idSpieler.forEach((s,i) => {
            if (i != id)
                idSpieler[i].backward(LOSS_PUNISH);
        })
        idSpieler[id].visSelf(element);
    } else {
        idSpieler.forEach((s,i) => {

            idSpieler[i].backward(DRAW_PUNISH);
        })
    }

    rounds++;
    game.reset();

}

// saves a Network from specific player (id) 
function saveNet(id){
    var json    = idSpieler[id].value_net.toJSON();
    var string  = JSON.stringify(json);

    document.getElementById('tt').value = string;
}

//loads a Network for specific player (id) 
function loadNet(id){
    var string = document.getElementById('tt').value;
    var json   = JSON.parse(string);

    idSpieler[id].value_net.fromJSON(json);    
}

function startLearn() {
    train = true;
     idSpieler.forEach((s,i) => {
        idSpieler[i].learning = true;
        do_count = true;
    })
}

function stopLearn() {
    train = false;
    idSpieler.forEach((s,i) => {
        idSpieler[i].learning = false;
        do_count = false;
    })
}

game.start();


const movePlayer = (id, action) => {
    switch (action) {
        case 0: 
            game.getPlayer(id).moveUp(); break;
            idSpieler[id].forward(ALIVE_REWARD);
        case 1: 
            game.getPlayer(id).moveLeft(); break;
            idSpieler[id].forward(ALIVE_REWARD);
        case 2: 
            game.getPlayer(id).moveDown(); break;
            idSpieler[id].forward(ALIVE_REWARD);
        case 3:
            game.getPlayer(id).moveRight(); break;
            idSpieler[id].forward(ALIVE_REWARD);
        default: break;
    }
}

const mainLoop = () => {
    const board1 = game.getBoard_new(id1, 5);
    const board2 = game.getBoard_new(id2, 5);
    const action1 = idSpieler[id1].forward(board1);
    const action2 = idSpieler[id2].forward(board2);
    //console.log("actions", action1, action2);

    movePlayer(id1, action1);
    movePlayer(id2, action2);
    game.nextUpdate();
    requestAnimationFrame(mainLoop);
}


mainLoop();



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
}

