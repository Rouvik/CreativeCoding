class SpaceElement {
    static renderList = [];

    constructor(pos = new vec2(0), vel = new vec2(0), acc = new vec2(0), effectRadius = 0, effectElements = []) {
        this._pos = pos;
        this.vel = vel;
        this.acc = acc;

        this.effectElements = effectElements;
        this.effectRadius = effectRadius;

        SpaceElement.renderList.push(this);
    }

    set pos(val)
    {
        const trans = val.sub(this._pos);
        for (const elem of this.effectElements) {
            elem.pos = elem.pos.add(trans);
        }
        this._pos = val;
    }

    get pos()
    {
        return this._pos;
    }

    translate(deltaPos)
    {
        for (const elem of this.effectElements) {
            elem._pos = elem._pos.add(deltaPos);
        }
        this._pos = this._pos.add(deltaPos);
    }

    update()
    {
        this.vel = this.vel.add(this.acc);
        this.pos = this.pos.add(this.vel);
    }

    render(rocketPos)
    {
        const relPos = this.pos.sub(rocketPos);
        Global.cxt.beginPath();
        Global.cxt.fillStyle = 'rgb(255, 0, 0)';
        Global.cxt.arc(relPos.x, relPos.y, 10, 0, Math.PI * 2);
        Global.cxt.fill();
    }
}