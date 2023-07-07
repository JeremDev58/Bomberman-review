class MapBlocks{
    static map_blocks = new Array();
    static size_block = 0;
    static parent_tag = null;
    static start_block = new Array();
    constructor(parent, map_size, num_player = 1, num_enemy = 3) {
        this.num_block = map_size;
        this.origin_x = 0;
        this.origin_y = 0;
        this.max_x = window.innerWidth;
        this.max_y = window.innerHeight;
        let ref = this.max_x > this.max_y ? this.max_y : this.max_x;
        MapBlocks.size_block = parseInt((ref / map_size));
        let rows = parseInt(this.max_y / MapBlocks.size_block), columns = parseInt(this.max_x / MapBlocks.size_block);
        this.rows = rows % 2 == 0 ? rows -1 : rows;
        this.columns = columns % 2 == 0 ? columns -1 : columns;
        MapBlocks.parent_tag = parent;
        for (let i = 0; i < this.rows; i++) {
            MapBlocks.map_blocks.push(new Array());
        }
        this.grass_block = new Array();
        this.generate_map();
        this.generate_start_block(num_player, num_enemy)
        this.generate_blocks();
    }
    
    generate_map(){
        var block = null, posX = 0, posY = 0;

        for (var row = 0; row < this.rows; row++) {
            posY = 0;
            for (var column = 0; column < this.columns; column++) {
                if (row == 0 || row == (this.rows - 1)){
                    block = new Indestructible(posX, posY, row, column);
                }
                else if (row % 2 == 0) {
                    if (column % 2 == 0) {
                        block = new Indestructible(posX, posY, row, column);
                    }
                    else {
                        block = new Grass(posX, posY, row, column);
                    }
                }
                else {
                    if (column == 0 || column == (this.columns - 1)) {
                        block = new Indestructible(posX, posY, row, column);
                    }
                    else {
                        block = new Grass(posX, posY, row, column);
                    }
                }
                posY += MapBlocks.size_block;
                MapBlocks.map_blocks[row].push(block);
                if (block.get_name() == "grass") {
                    this.grass_block.push(block)
                }
            }
            posX += MapBlocks.size_block;
        }
    }

    generate_start_block(num_player, num_enemy) {
        MapBlocks.map_blocks[1][1].set_start_block();
        MapBlocks.map_blocks[1][2].set_start_block();
        MapBlocks.map_blocks[2][1].set_start_block();
        MapBlocks.start_block.push(MapBlocks.map_blocks[1][1]);
        let num_spawn = num_player == 1 ? num_enemy : 1 + num_enemy;
        let len_rows = MapBlocks.map_blocks.length-1, len_columns = MapBlocks.map_blocks[0].length-1;
        let spawn_center = MapBlocks.map_blocks[parseInt(len_rows / 2)][parseInt(len_columns / 2)].get_name() == "grass" ? MapBlocks.map_blocks[parseInt(len_rows / 2)][parseInt(len_columns / 2)] : MapBlocks.map_blocks[parseInt(len_rows / 2)][(parseInt(len_columns / 2) + 1)];
        let avail_spawn = new Array(MapBlocks.map_blocks[1][len_columns - 1],
                                    MapBlocks.map_blocks[len_rows - 1][1],
                                    MapBlocks.map_blocks[len_rows - 1][len_columns - 1],
                                    spawn_center);
        for (let i = 0; i < num_spawn; i++) {
            let rand = MapBlocks.random_int(0, 4);
            if (avail_spawn[rand].get_start_block()) {
                i--;
            }
            else {
                let row = avail_spawn[rand].get_row(), column = avail_spawn[rand].get_column();
                MapBlocks.map_blocks[row][column].set_start_block();
                MapBlocks.start_block.push(MapBlocks.map_blocks[row][column])
                if (MapBlocks.map_blocks[row + 1][column].get_name() == "grass") {
                    MapBlocks.map_blocks[row + 1][column].set_start_block();
                }
                if (MapBlocks.map_blocks[row - 1][column].get_name() == "grass") {
                    MapBlocks.map_blocks[row - 1][column].set_start_block();
                }
                if (MapBlocks.map_blocks[row][column + 1].get_name() == "grass") {
                    MapBlocks.map_blocks[row][column + 1].set_start_block();
                }
                if (MapBlocks.map_blocks[row][column - 1].get_name() == "grass") {
                    MapBlocks.map_blocks[row][column - 1].set_start_block();
                }
            }
        }
    }

    generate_blocks() {
        var blocks_available = new Array();
        for (var i = 0; i < this.grass_block.length; i++) {
            if (!(this.grass_block[i].get_start_block())) {
                blocks_available.push(this.grass_block[i]);
            }
        }

        let max_objects = MapBlocks.random_int(4, parseInt(blocks_available.length / 3));
        let type_object = 1;
        for (var i = 0; i < max_objects; i++) {
            var block = blocks_available[MapBlocks.random_int(0, blocks_available.length - 1)];
            if (block.is_object()) {
                i--;
            }
            else if (type_object == 1) {
                MapBlocks.map_blocks[block.get_row()][block.get_column()].create_object_flame();
                type_object = 2;
            }
            else if (type_object == 2) {
                MapBlocks.map_blocks[block.get_row()][block.get_column()].create_object_speed();
                type_object = 3;
            }
            else {
                MapBlocks.map_blocks[block.get_row()][block.get_column()].create_object_bomb();
                type_object = 1;
            }
        }

        var num_block_destructible = MapBlocks.random_int(parseInt(blocks_available.length / 2), blocks_available.length) - 1;
        for (var i = 0; i < num_block_destructible; i++) {
            var block = blocks_available[MapBlocks.random_int(0, blocks_available.length - 1)];
            if (block.is_destructible()) {
                i--;
            }
            else {
                MapBlocks.map_blocks[block.get_row()][block.get_column()].create_block_destructible();
            }
        }
    }

    static clear() {
        while (MapBlocks.parent_tag.lastChild) {
            MapBlocks.parent_tag.removeChild(MapBlocks.parent_tag.lastChild);
        }
        while (MapBlocks.map_blocks.length > 0) {
            MapBlocks.map_blocks.pop();
        }
        MapBlocks.map_blocks = new Array();
        MapBlocks.size_block = 0;
        MapBlocks.parent_tag = null;
        MapBlocks.start_block = new Array();
    }

    static random_int(min, max) { 
        return parseInt(Math.random() * (max - min) + min);
    } 
}

