class Rocket {
    static WIDTH = 5;
    static HEIGHT = 20;
    static FLAME_WIDTH = 5;

    static MAX_SPEED = 40;
    static MAX_SPEED_SQ = Rocket.MAX_SPEED ** 2;

    static STAT_COLOR = 'rgb(128, 255, 0)';
    static OVERSPEED_RANGE = { range: 10, min: 5 };
    static OVERSPEED_BARRIER = Rocket.MAX_SPEED_SQ - 5;

    static ROTATION_RATE = 0.08;

    constructor(pos = new vec2(0)) {
        this.pos = pos;
        this.posAdjs = new vec2(0);
        this.vel = new vec2(0);
        this._dir = new vec2(1, -1);
        this.target_dir = new vec2(1, -1);
        this.acc = new vec2(0);

        this.isAccelerating = false;

        this.winDimentions = new vec2(Global.sc.width, Global.sc.height);

        this.keyboard = {};
    }

    set dir(val) {
        this._dir = val.x == 0 && val.y == 0 ? this._dir : val;
    }

    get dir() {
        return this._dir;
    }

    setWindowAdjustment() {
        window.addEventListener('resize', () => {
            this.pos = this.pos.sub(new vec2((Global.sc.width - this.winDimentions.x) / 2, (Global.sc.height - this.winDimentions.y) / 2));
            this.winDimentions = new vec2(Global.sc.width, Global.sc.height);
        });
    }

    setKeyBindings()
    {
        Global.keyEvent.on('keypress', (event) => {
            if (Global.keys['Control'] && Global.keys['p']) {
                event.preventDefault();
                new PersistentText('Position reset', new vec2(10, Global.sc.height - 30), 100, 'rgb(0, 128, 0)', '20px Consolas, monospace');
                this.posAdjs = this.pos;
            }
        });
    }

    update() {
        this.vel = this.vel.add(this.acc);
        if (this.vel.magSq() > Rocket.MAX_SPEED_SQ) {
            this.vel = this.vel.norm().mulScalar(Rocket.MAX_SPEED);
        }
        this.pos = this.vel.add(this.pos);

        this.dir = this._dir.add(this.target_dir.sub(this._dir).mulScalar(Rocket.ROTATION_RATE));
    }

    render() {
        const rckt_pos = new vec2(Global.sc.width / 2, Global.sc.height / 2);

        const dir = this.dir.norm();
        const norm = dir.rotate(Math.PI / 2).mul(new vec2(Rocket.WIDTH));
        const p1 = rckt_pos.add(dir.mul(new vec2(Rocket.HEIGHT)));

        if (this.isAccelerating) {
            Global.cxt.fillStyle = "rgb(255, 128, 0)";
            Global.cxt.beginPath();
            Global.cxt.arc(rckt_pos.x - dir.x * Rocket.FLAME_WIDTH, rckt_pos.y - dir.y * Rocket.FLAME_WIDTH, Rocket.FLAME_WIDTH, 0, Math.PI * 2);
            Global.cxt.fill();
            Global.cxt.beginPath();
            Global.cxt.fillStyle = "rgb(255, 0, 0)";
            Global.cxt.arc(rckt_pos.x - dir.x * Rocket.FLAME_WIDTH / 2, rckt_pos.y - dir.y * Rocket.FLAME_WIDTH / 2, Rocket.FLAME_WIDTH / 2, 0, Math.PI * 2);
            Global.cxt.fill();
        }

        Global.cxt.fillStyle = "rgb(255, 255, 255)";
        Global.cxt.beginPath();

        Global.cxt.moveTo(p1.x, p1.y);
        Global.cxt.lineTo(rckt_pos.x + norm.x, rckt_pos.y + norm.y);
        Global.cxt.lineTo(rckt_pos.x - norm.x, rckt_pos.y - norm.y);
        Global.cxt.fill();

        Global.cxt.strokeStyle = Rocket.STAT_COLOR;
        Global.cxt.fillStyle = Rocket.STAT_COLOR;
        Global.cxt.font = Global.FONT_STYLE_20px;
        Global.cxt.lineWidth = 2;
        Global.cxt.strokeRect(5, 2, 350, 65);
        Global.cxt.lineWidth = 1;

        const printPos = this.pos.sub(this.posAdjs);
        Global.cxt.fillText(`Position: <${printPos.x.toFixed(2)}, ${printPos.y.toFixed(2)}>`, 10, 20);
        Global.cxt.fillText(`Velocity: <${this.vel.x.toFixed(2)}, ${this.vel.y.toFixed(2)}>`, 10, 40);
        Global.cxt.fillText(`Acceleration: <${this.acc.x.toFixed(2)}, ${this.acc.y.toFixed(2)}>`, 10, 60);
    }

    overspeed() {
        if (this.vel.magSq() > Rocket.OVERSPEED_BARRIER) {
            Global.cxt.save();
            Global.cxt.translate(Math.random() * Rocket.OVERSPEED_RANGE.range - Rocket.OVERSPEED_RANGE.min, Math.random() * Rocket.OVERSPEED_RANGE.range - Rocket.OVERSPEED_RANGE.min);
            Rocket.STAT_COLOR = 'rgb(255, 0, 0)';
        }
    }

    overspeedRestore() {
        Global.cxt.restore();
        Rocket.STAT_COLOR = 'rgb(128, 255, 0)';
    }
}