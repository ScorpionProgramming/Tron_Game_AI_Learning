const game = new TRONGame();
//game.setup();

const id1 = game.addPlayer("green");
const id2 = game.addPlayer("red");

//game.start();

window.addEventListener("keydown", doKeyDown, true);
function doKeyDown(e) {
    let key = e.keyCode;
    console.log(key);
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

