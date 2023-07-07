class Character extends Block {
    static characters = new Map();
    static num_player = 0;
    static num_enemy = 0;
    constructor(block_start) {
        super(block_start.get_x(), block_start.get_y(), block_start.get_row(), block_start.get_column());
        this.action = true;
        this.num = 0;
        this.power = 1;
        this.num_bombs = 1;
        this.speed = 100;
        this.tag.style.zIndex = 4;
        this.tag.style.backgroundSize = 70 + "%";
    }

    set_x(value) {
        this.x = value;
    }

    set_y(value) {
        this.y = value;
    }

    set_row(value) {
        this.row = value;
    }

    set_column(value) {
        this.column = value;
    }

    power_up() {
        this.power++;
    }

    bomb_up() {
        this.num_bombs++;
    }

    speed_up() {
        if ( this.speed != 10) {this.speed -= 10;} 
    }

    bomb() {
        let block = MapBlocks.map_blocks[this.row][this.column];
        if (this.num_bombs != 0 & !(block.is_bomb())) {
            this.num_bombs--;
            block.create_bomb(this.power, this);
        }           
    }

    move(block, style, direction) {
        if (block.get_name() == "grass") {
            if (!(block.is_destructible()) & !(block.is_bomb())) {
                this.y = block.get_y()
                this.x = block.get_x()
                this.row = block.get_row()
                this.column = block.get_column()
                this.animate(style, direction, block);
                if (block.is_object()) {
                    if (block.object.get_name() == "object flame up") {this.power_up()}
                    else if (block.object.get_name() == "object speed up") {this.speed_up()}
                    else {this.bomb_up()}
                    MapBlocks.map_blocks[block.get_row()][block.get_column()].rm_object()
                }
            }
        }
    }

    move_up() {
        this.tag.style.backgroundImage = "url('img/" + this.name.slice(0, this.name.length - 1) + "/" + this.name + "_back.png')";
        this.move(MapBlocks.map_blocks[this.row - 1][this.column], "top", 1);
    }

    move_down() {
        this.tag.style.backgroundImage = "url('img/" + this.name.slice(0, this.name.length - 1) + "/" + this.name + "_front.png')";
        this.move(MapBlocks.map_blocks[this.row + 1][this.column], "top", 0);
    }

    move_left() {
        this.tag.style.backgroundImage = "url('img/" + this.name.slice(0, this.name.length - 1) + "/" + this.name + "_left.png')";
        this.move(MapBlocks.map_blocks[this.row][this.column - 1], "left", 1);
    }

    move_right() {
        this.tag.style.backgroundImage = "url('img/" + this.name.slice(0, this.name.length - 1) + "/" + this.name + "_right.png')";
        this.move(MapBlocks.map_blocks[this.row][this.column + 1], "left", 0);
    }

    animate(style, direction) {
        var from = parseFloat(this.tag.style[style].split("px")[0]);
        var to = direction == 0 ? from + MapBlocks.size_block : from - MapBlocks.size_block;
        let self = this;
        var start = new Date().getTime(), timer = setInterval(function() {
                self.action = false;
                var step = Math.min(1 ,(new Date().getTime() - start) / 50);
                self.tag.style[style] = (from + step * (to - from)) + "px";
                if( step == 1) {
                    clearInterval(timer);
                    self.action = true;
                }
            }, this.speed);
        this.tag.style[style] = from + "px";
    }

    static clear() {
        Character.characters = new Map();
        Character.num_player = 0;
        Character.num_enemy = 0;
    }
}

class Player extends Character {
    static num = 0;
    constructor(block_start) {
        super(block_start);
        Player.num++;
        Character.num_player++;
        this.name = "player" + Player.num;
        this.num = Player.num;
        Character.characters.set(this.name, this);
        this.tag.style.backgroundImage = "url('img/" + this.name.slice(0, this.name.length - 1) + "/" + this.name + ".png')";
        this.tag.focus()
    }

    die() {
        Character.num_player--;
        let count = 1, self = this;
        let inter_die = setInterval(function() {
            self.tag.style.backgroundImage = "url('img/" + self.name.slice(0, this.name.length - 1) + "/death/death_" + self.num + "_" + count + ".png')";
            if (count == 6) {
                clearInterval(inter_die);
                MapBlocks.parent_tag.removeChild(self.tag);
            } 
            else {
                count++;
            }
        }, 300);
    }

    static clear() {
        Player.num = 0;
    }
}

class IA extends Character {
    constructor(block_start) {
        super(block_start);
        this.avail_moves = new Array();
        this.count_path = 0;
        this.loopMove = false;

    }

    move_tab(pos) {
        if (pos.length > 1) {
            console.log("Probleme move_tab")
        } 
        if (pos[0] == this.row) {
            if (pos[1] == this.column + 1) {
                this.move_right();
            }
            if (pos[1] == this.column - 1) {
                this.move_left();
            }
        }
        else {
            if (pos[0] == this.row + 1) {
                this.move_down();
            }
            if (pos[0] == this.row - 1) {
                this.move_up();
            }
        }
    }

    move_int(side, isReverse = false) {
        if (side == 0) {
            if (isReverse) {
                this.move_down();
            }
            else {
                this.move_up();
            }
            
        }
        else if (side == 1) {
            if (isReverse) {
                this.move_up();
            }
            else {
                this.move_down();
            }
        }
        else if (side == 2) {
            if (isReverse) {
                this.move_right();
            }
            else {
                this.move_left();
            }
        }
        else {
            if (isReverse) {
                this.move_left();
            }
            else {
                this.move_right();
            }
        }
    }

    determinate_side_bomb(pos) {
        if (pos[0] == this.row) {
            if (pos[1] > this.column) {
                return 2;
            }
            else {
                return 3;
            }
        }
        else {
            if (pos[0] > this.row) {
                return 0;
            }
            else {
                return 1;
            }
        }
    }

    determinate_pos(side) {
        if (side == 0) {
            return [this.row - 1, this.column]
        } 
        else if (side == 1) {
            return [this.row + 1, this.column]
        } 
        else if (side == 2) {
            return [this.row, this.column - 1]
        } 
        else {
            return [this.row, this.column + 1]
        }
    }

    rm_same_value(arr, comp_arr) {
        let arr_return = [];
        
        arr.forEach(function(value, index) {
          let is_push = true;
            for (let i = 0; i < comp_arr.length; i++) {
            if (value[0] == comp_arr[i][0] & value[1] == comp_arr[i][1]) {
              is_push = false;
              break;
            }
          }
          
          if (is_push) {
            arr_return.push(value)
          }
          });
        
        return arr_return;
      }

    rand_sort(arr) {
        for (let i = arr.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * i)
            let k = arr[i]
            arr[i] = arr[j]
            arr[j] = k
          }
          return arr;
      }

    dodge_bomb(position) {
        let avail_move = this.avail_move();
        // Positionner sur la bombe
        if (position[0][0] == this.row & position[0][1] == this.column) {
            let side = MapBlocks.random_int(0, avail_move.length);
            this.move_tab(avail_move[side]);
            this.dodge_bomb(position);
        }
        while (!this.loopMove) {
            this.smart_move(position);
        }
        this.loopMove = false;
    }

    avail_move() {
        let avail_move = new Array();
        if (MapBlocks.map_blocks[this.row + 1][this.column].name == "grass" ) {
         if (!(MapBlocks.map_blocks[this.row + 1][this.column].is_destructible())) {
            avail_move.push([this.row + 1, this.column]);
            }
        }
        if (MapBlocks.map_blocks[this.row - 1][this.column].name == "grass") {
            if (!(MapBlocks.map_blocks[this.row - 1][this.column].is_destructible())) {
                avail_move.push([this.row - 1, this.column]);
            }
        }
        if (MapBlocks.map_blocks[this.row][this.column + 1].name == "grass") {
            if (!(MapBlocks.map_blocks[this.row][this.column + 1].is_destructible())) {
                avail_move.push([this.row, this.column + 1]);
            }
        }
        if (MapBlocks.map_blocks[this.row][this.column - 1].name == "grass") {
            if (!(MapBlocks.map_blocks[this.row][this.column - 1].is_destructible())) {
                avail_move.push([this.row, this.column - 1]);
            }
        }
        return avail_move;
    }

    smart_move(warning_pos, history_move = [], end_path = false) {
        if(this.action) {     
            history_move.push([this.row, this.column])
            let avail_move = this.avail_move(), safe_move = [];
            if (avail_move.length == 1) {
                end_path = true;
            } 
            else {
                safe_move = this.rm_same_value(avail_move, warning_pos);
                if (safe_move.length > 0) {
                    safe_move = this.rand_sort(safe_move)[0];
                }
            }
            console.log(avail_move)

            if (safe_move.length == 0) {
                // init end_path
                if (this.row == warning_pos[0][0] & this.column == warning_pos[0][1]) {
                    end_path = false;
                    let follow_path = [];
                    if (history_move.length != 0) {
                        while (follow_path.length == 0) {
                            let path_test = this.rand_sort(avail_move)
                            let last_pos = history_move[history_move.length - 1];
                            path_test = this.rm_same_value(path_test, last_pos)
                            if (path_test.length != 0) {
                                follow_path = path_test[0];
                            }
                        }
                    }
                    this.move_tab(follow_path)
                }
                // Aller vers la bombe
                if (end_path) {
                    this.move_int(this.determinate_side_bomb(warning_pos[0]), true);
                }
                // Fuir la bombe 
                else {
                    this.move_int(this.determinate_side_bomb(warning_pos[0]));
                }
                this.smart_move(warning_pos, history_move, end_path);
            }
            else {
                this.move_tab(safe_move);
                this.loopMove = true;
            }
        }
        else {
            setTimeout(this.smart_move(warning_pos, history_move, end_path), 100);
        }
    }
}

class Enemy extends IA {
    static num = 0;
    static enemies = new Map();
    constructor(block_start) {
        super(block_start);
        Enemy.num++;
        Character.num_enemy++;
        this.name = "enemy" + Enemy.num;
        this.num = Enemy.num;
        Character.characters.set(this.name, this);
        Enemy.enemies.set(this.name, this);
        this.tag.style.backgroundImage = "url('img/" + this.name.slice(0, this.name.length - 1) + "/" + this.name + ".png')";
        this.speed = 300;
    }

    die() {
        Character.num_enemy--;
        let count = 1, self = this;
        this.loopMove = false;
        let die = setInterval(function() {
            self.tag.style.backgroundImage = "url('img/" + self.name.slice(0, self.name.length - 1) + "/death/death_" + self.num + "_" + count + ".png')";
            if (count == 4) {
                clearInterval(die);
                MapBlocks.parent_tag.removeChild(self.tag);
            } 
            else {
                count++;
            }
        }, 300)
    }

    static clear() {
        Enemy.num = 0;
        Enemy.enemies = new Map();
    }
}