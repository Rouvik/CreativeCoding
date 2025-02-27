class Planet extends SpaceElement {
    static G = 1;
    static MASS_RADIUS_MULTIPLIER = 0.2;

    constructor(pos, vel = new vec2(0), acc = new vec2(0), radius, mass, effectRadius) {
        super(pos, vel, acc);
        this.mass = mass;
        this.radius = radius || mass * Planet.MASS_RADIUS_MULTIPLIER;

        this.color = "rgb(255, 0, 0)";

        this.effectRadius = effectRadius;
        this.effectElements = [];

        // this.trailPoints = [];
        // this._pointCounter = 100;
    }

    render(rocketPos)
    {
        Global.cxt.translate(-rocketPos.x, -rocketPos.y);
        Global.cxt.beginPath();
        Global.cxt.fillStyle = this.color;
        Global.cxt.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        Global.cxt.fill();
        Global.cxt.translate(rocketPos.x, rocketPos.y);
    }

    update()
    {
        super.update();
        
        // if (this._pointCounter-- < 0) {
        //     this.trailPoints.push(this.pos);
        //     this._pointCounter = 100;
        //     if (this.trailPoints.length > 10) {
        //         this.trailPoints.shift();
        //     }
        // }

        for (const element of this.effectElements) {
            const relPos = this.pos.sub(element.pos);
            const gravityAcc = Planet.G * this.mass / relPos.magSq();            
            element.acc = relPos.norm().mulScalar(gravityAcc);
        }
    }

    // renderTrail(rocketPos)
    // {
    //     if (this.trailPoints.length == 0) {
    //         return;
    //     }

    //     Global.cxt.translate(-rocketPos.x, -rocketPos.y);
    //     Global.cxt.beginPath();
    //     Global.cxt.strokeStyle = 'rgb(255, 0, 0)';
    //     Global.cxt.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
    //     for (const point of this.trailPoints) {
    //         Global.cxt.lineTo(point.x, point.y);
    //     }
    //     Global.cxt.stroke();
    //     Global.cxt.translate(rocketPos.x, rocketPos.y);
    // }
}