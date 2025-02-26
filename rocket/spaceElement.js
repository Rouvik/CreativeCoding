class SpaceElement {
    constructor(pos = new vec2(0)) {
        this.pos = pos;
        this.vel = new vec2(0);
        this.acc = new vec2(0);
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