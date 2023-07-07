class Object extends Block {
    constructor(parent) {
        super(0, 0, parent.get_row(), parent.get_column(), parent.get_tag());
        this.type = "object";
        this.tag.style.backgroundSize = 70 + "%";
        this.tag.style.zIndex = 2;
    }
}

class ObjectBomb extends Object {
    constructor(parent) {
        super(parent);
        this.name = "object flame up";
        this.tag.style.backgroundImage = "url('img/object/flame_up.png')";
    }
}

class ObjectSpeed extends Object {
    constructor(parent) {
        super(parent);
        this.name = "object speed up";
        this.tag.style.backgroundImage = "url('img/object/speed_up.png')";
    }
}

class ObjectFlame extends Object {
    constructor(parent) {
        super(parent);
        this.name = "object bomb up";
        this.tag.style.backgroundImage = "url('img/object/bomb_up.png')";
    }
}