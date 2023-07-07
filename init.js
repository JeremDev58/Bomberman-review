function die_event(character) {
        document.dispatchEvent(new CustomEvent("death", {detail: {data: character}}));

}

function bomb_event(bomb, pos_bomb, pos_blast) {
        document.dispatchEvent(new CustomEvent("bomb", {detail: {bomb: bomb,
                                                                pos: pos_bomb,
                                                                blasts: pos_blast}}));
}

function init_game() {
        MapBlocks.clear();
        Character.clear();
        Player.clear();
        Enemy.clear();
}

function end(classEnd) {
        setTimeout(function() {
                init_game();
                document.getElementById("finish").className += " " + classEnd;
                document.getElementById("finish").style.display = "block";
        }, 2000);
}

// Gérer la vitesse de déplacement des joueur que ça fasse plus réélle
// Faire L'IA
// Ajouter un Modal gagner/perdu
// implémenter le 2eme joueur
// Ajouter une fenetre des stats des joueurs

