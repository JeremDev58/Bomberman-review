function start() {
    let num_row = parseInt(document.getElementById("listbox-map").value.split(" ")[0])
    new MapBlocks(document.getElementById("map"), num_row);
    
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            new Player(MapBlocks.start_block[i]);
        }
        else {
            new Enemy(MapBlocks.start_block[i])
        }
    }
    document.getElementById("menu").style.display = "none";
}

function again() {
    start();
    document.getElementById("finish").style.display = "none";
}

function menu() {
    document.getElementById("finish").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

    