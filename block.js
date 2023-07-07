class Block {
    static uid = 0;
    constructor(posX, posY, row, column, parent = MapBlocks.parent_tag) {
        Block.uid = Block.uid + 1;
        this.id = Block.uid;
        this.name = null;
        this.x = posX;
        this.y = posY;
        this.row = row;
        this.column = column;
        this.type = null;
        this.tag = null;
        this.parent = parent;
        this.start_block = false;
        this.create_bloc();
    }

    
    create_bloc() {
        this.tag = document.createElement("div");
        this.tag.className = "block";
        this.tag.style.width = MapBlocks.size_block + "px";
        this.tag.style.height = MapBlocks.size_block + "px";
        this.tag.style.top = this.x + "px";
        this.tag.style.left = this.y + "px";
        this.tag.setAttribute("id", this.id);
        this.parent.appendChild(this.tag);
    }

    get_name() {
        return this.name;
    }

    get_x() {
        return this.x;
    }

    get_y() {
        return this.y;
    }

    get_row() {
        return this.row;
    }

    get_column() {
        return this.column;
    }

    get_type() {
        return this.type;
    }

    get_tag() {
        return this.tag;
    }

    get_id() {
        return this.id;
    }

    get_parent() {
        return this.parent;
    }

    get_start_block() {
        return this.start_block;
    }

    set_start_block() {
        this.start_block = true;
    }
}

class Indestructible extends Block {
    constructor(posX, posY, row, column) {
        super(posX, posY, row, column);
        this.name = "indestructible";
        this.type = "block";
        this.tag.style.backgroundImage = "url('img/" + this.name + "/" + this.name + "_block.png')";
        this.tag.style.zIndex = 0;
    }
}

class Destructible extends Block {
    constructor(parent) {
        super(0, 0, parent.get_row(), parent.get_column(), parent.get_tag());
        this.name = "destructible";
        this.type = "block";
        this.tag.style.backgroundImage = "url('img/" + this.name + "/" + this.name + "_block.png')";
        this.tag.style.zIndex = 5;
    }
}

class Blast extends Block {
    constructor(block_ref, background) {
        super(block_ref.get_x(), block_ref.get_y(), block_ref.get_row(), block_ref.get_column());
        this.name = "blast";
        this.speed_interval = 150;
        this.tag.style.zIndex = 3;
        this.tag.style.backgroundImage = "url('img/" + this.name + "/" + this.name + "_" + background + "_1.png')";
        this.collision();
    }

    collision() {
        for (let item of Character.characters.values()) {
            if (item.get_row() == this.row & item.get_column() == this.column) {
                die_event(item);
            }
        }
        let block = MapBlocks.map_blocks[this.row][this.column]
        if (block.is_destructible()) {
            MapBlocks.map_blocks[this.row][this.column].rm_destructible();
        } else if (block.is_object()) {
            MapBlocks.map_blocks[this.row][this.column].rm_object();
        } else if (block.is_bomb()) {
            MapBlocks.map_blocks[this.row][this.column].bomb.bomb_explode();
        }
    }

    
    rm() {
        this.parent.removeChild(this.tag);
    }


    str_bg(count) {
        let edit = this.tag.style.backgroundImage.split("_");
        edit.pop();
        let string = "";
        for (let i = 0; i < edit.length; i++) {
            string += edit[i] + "_";
        }
        string = string.replace('"', "'")
        string += count + ".png')";
        return string;
    }

    reduction_blast() {
        let count = 2, self = this;
        let inter = setInterval(function() {
            self.tag.style.backgroundImage = self.str_bg(count);
            count++;
            if (count == 5) {
                clearInterval(inter);
                self.rm();
            }
        }, this.speed_interval)
    }
}

class Bomb extends Block {

    constructor(parent, power, character) {
        super(0, 0, parent.get_row(), parent.get_column(), parent.get_tag());
        this.name = "bomb";
        this.power = power;
        this.character = character;
        this.tag.style.backgroundImage = "url('img/" + this.name + "/" + this.name + ".png')";
        this.tag.style.zIndex = 4;
        this.tag.style.backgroundSize = 70 + "%";
        this.pos_blast = new Array();
        this.blast = new Array();
        this.bomb_exploding = null;
        this.end_explosion = false;
        this.add_pos_blast();
        bomb_event(this, [this.row, this.column], this.pos_blast)
        this.interval_bomb();
    }


    add_pos_blast() {
        for (let i = 0; i < 4; i++) { this.pos_blast.push(new Array()); }
        for (let i = 1; i < (this.power + 1); i++) {
            // HAUT
            if (MapBlocks.map_blocks[this.row + i][this.column] != undefined & MapBlocks.map_blocks[this.row + i][this.column].get_name() != "indestructible") {
                this.pos_blast[0].push(MapBlocks.map_blocks[this.row + i][this.column]);
            }
            else {
                i = this.power;    
            }
        }
        for (let i = 1; i < (this.power + 1); i++) {
            // BAS
            if (MapBlocks.map_blocks[this.row - i][this.column] != undefined & MapBlocks.map_blocks[this.row - i][this.column].get_name() != "indestructible") {
                this.pos_blast[1].push(MapBlocks.map_blocks[this.row - i][this.column]);
            }
            else {
                i = this.power;    
            }
        }
        for (let i = 1; i < (this.power + 1); i++) {
            // DROITE
            if (MapBlocks.map_blocks[this.row][this.column + i] != undefined & MapBlocks.map_blocks[this.row][this.column + i].get_name() != "indestructible") {
                this.pos_blast[2].push(MapBlocks.map_blocks[this.row][this.column + i]);
            }
            else {
                i = this.power;    
            }
        }
        for (let i = 1; i < (this.power + 1); i++) {
            // GAUCHE
            if (MapBlocks.map_blocks[this.row][this.column - i] != undefined & MapBlocks.map_blocks[this.row][this.column - i].get_name() != "indestructible") {
                this.pos_blast[3].push(MapBlocks.map_blocks[this.row][this.column - i]);
            }
            else {
                i = this.power;    
            }
        }
    }

    
    interval_bomb() {
        let count = 5, self = this, bg_size = parseInt(this.tag.style.backgroundSize.split("%")[0]);
        this.bomb_exploding = setInterval(function() {
            if (parseInt(self.tag.style.backgroundSize.split("%")[0]) == bg_size) {
                self.tag.style.backgroundSize = (bg_size - 20) + "%";
            } else {
                self.tag.style.backgroundSize = bg_size + "%";
            }
            count--;
            if (count == 0) {
                clearInterval(self.bomb_exploding);
                self.bomb_explode();
            }
        }, 500);
    }

    create_blast() {
        for (let side = 0; side < this.pos_blast.length; side++) {
            for (let num_blast = 0; num_blast < this.pos_blast[side].length; num_blast++) {
                let position;
                let block = MapBlocks.map_blocks[this.pos_blast[side][num_blast].get_row()][this.pos_blast[side][num_blast].get_column()];
                if (this.pos_blast[side].length != 0) {
                    if ((this.pos_blast[side].length - 1) == num_blast) {
                        if (side == 0) {
                            position = "bottom_end";
                        } else if (side == 1) {
                            position = "top_end";
                        } else if (side == 2) {
                            position = "right_end";
                        } else {
                            position = "left_end";
                        }
                        this.blast.push(new Blast(block, position));
                    } else {
                        if (side == 0 | side == 1) {
                            position = "top_bottom"
                        } else {
                            position = "left_right"
                        }
                        this.blast.push(new Blast(block, position));
                    }
                }
            }
        }

        for (let i = 0; i < this.blast.length; i++) {
            this.blast[i].reduction_blast()
        }
        this.rm();
    }

    rm() {
        let count = 4, self = this;
        let inter = setInterval(function() {
            if (count != 1) {
                self.tag.style.backgroundImage = "url('img/" + self.name + "/explode_" + count + ".png')";
                count--;
            } else {
                clearInterval(inter);
                self.parent.removeChild(self.tag);
                MapBlocks.map_blocks[self.row][self.column].bomb = null;
                self.character.bomb_up();
            }
        }, 120);
        this.end_explosion = true;
    }
    
    bomb_explode() {
        clearInterval(this.bomb_exploding)
        this.tag.style.backgroundSize = 100 + "%"
        let count = 1, self = this;
        let inter = setInterval(function() {
            if (count != 4) {
                self.tag.style.backgroundImage = "url('img/" + self.name + "/explode_" + count + ".png')";
                count++;
            } else {
                clearInterval(inter);
                self.create_blast();
                for (let item of Character.characters.values()) {
                    if (item.get_row() == self.row & item.get_column() == self.column) {
                        die_event(item);
                    }
                }
            }
        }, 100);
    }
}

class Grass extends Block {
    constructor(posX, posY, row, column) {
        super(posX, posY, row, column);
        this.name = "grass";
        this.type = "block";
        this.tag.style.backgroundImage = "url('img/" + this.name + "/" + this.name + "_block.png')";
        this.tag.style.zIndex = 1;
        this.destructible = null;
        this.object = null;
        this.bomb = null;
    }

    create_block_destructible() {
        this.destructible = new Destructible(this);
    }

    create_object_flame() {
        this.object = new ObjectFlame(this);
    }

    create_object_speed() {
        this.object = new ObjectSpeed(this);
    }

    create_object_bomb() {
        this.object = new ObjectBomb(this);
    }

    create_bomb(power, character) {
        this.bomb = new Bomb(this, power, character);
    }

    rm_destructible() {
        if (this.destructible != null) {
            document.getElementById(this.id).removeChild(this.destructible.get_tag());
            this.destructible = null;
        }
    }

    rm_object() {
        if (this.object != null) {
            document.getElementById(this.id).removeChild(this.object.get_tag());
            this.object = null;
        }
    }

    len_children() {
        return this.children.length;
    }

    get_children() {
        return this.children;
    }

    is_destructible() {
        return this.destructible != null ? true : false;
    }

    is_object() {
        return this.object != null ? true : false;
    }

    is_bomb() {
        return this.bomb != null ? true : false;
    }
}