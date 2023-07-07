let keyStopper = false;

document.addEventListener('keyup', function(event) {keyStopper = false;});

document.addEventListener('keydown', function(event) {
    if (keyStopper) {
        return;
    }
    keyStopper = true;
    switch (event.code) {
        case "ArrowUp":
            if (Character.characters.get("player1").action) {Character.characters.get("player1").move_up();}
            break;
        case "ArrowDown":
            if (Character.characters.get("player1").action) {Character.characters.get("player1").move_down();}
            break;
        case "ArrowLeft":
            if (Character.characters.get("player1").action) {Character.characters.get("player1").move_left();}
            break;
        case "ArrowRight":
            if (Character.characters.get("player1").action) {Character.characters.get("player1").move_right();}
            break;
        case 'Space':
            Character.characters.get("player1").bomb();
            break;
        default:
            break;
    } 
});

document.addEventListener('death', function (event) {
    let character = event.detail.data;
    character.die()
    if (Character.num_player == 0) {
        end("lose");
    }
    else if (Character.num_enemy == 0) {
        end("win");
    }
});

/* IA */

document.addEventListener('bomb', function (event) {
    let position = new Array();
    position.push(event.detail.pos);
    for (let row = 0; row < event.detail.blasts.length; row++) {
        for (let column = 0; column < event.detail.blasts[row].length; column++) {
            position.push([event.detail.blasts[row][column].get_row(), event.detail.blasts[row][column].get_column()])
        }
    }
    for (let item of Enemy.enemies.values()) {
        for (let i = 0; i < position.length; i++) {
            if (item.get_row() == position[i][0] & item.get_column() == position[i][1]) {
                item.dodge_bomb(position);
            }
        }
    }
});