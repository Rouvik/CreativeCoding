class Planet extends SpaceElement {
    static G = 1;
    static MASS_RADIUS_MULTIPLIER = 0.2;

    static RANDOM_MOON_COUNT_MAX = 5;
    static MAX_MOON_STEP_ORBIT_DIST = 200;
    static MOON_ORBIT_GAP = 20;

    constructor(pos, vel = new vec2(0), acc = new vec2(0), radius, mass, effectRadius = 0) {
        super(pos, vel, acc, effectRadius);
        this.mass = mass || Global.randomX.rand() % 1000;
        this.radius = radius || mass * Planet.MASS_RADIUS_MULTIPLIER;

        this.color = "rgb(255, 0, 0)";

        this.trailPoints = [this._pos];
        this.trailCounter = 0;
    }

    createRandomMoons(moonCount = Global.randomX.rand() % 6) {
        let orbitRadius = this.radius + 220;
        for (let i = 0; i < moonCount; i++) {
            const moon = new Planet(
                this.pos.add(
                    new vec2(
                        Global.randWithinX(orbitRadius, orbitRadius + Planet.MAX_MOON_STEP_ORBIT_DIST),
                        Global.randWithinY(orbitRadius, orbitRadius + Planet.MAX_MOON_STEP_ORBIT_DIST)
                    )
                ),
                new vec2(0), new vec2(0), undefined, Global.randWithinY(50, this.mass / 2), 0
            );

            // calculate appropriate initial velocity for the moon to orbit the planet
            const distVec = moon.pos.sub(this.pos);
            const dist = moon.pos.sub(this.pos).mag();
            const normVelDir = distVec.norm().rotate(Math.PI / 2 * (Global.randWithinX(-1, 1)) || 1);
            const rP = this.radius + moon.radius; // edge to edge distance
            const initVel = Global.randWithinY(((Planet.G * this.mass / dist) * (2 * rP / (dist + rP))) ** 0.5 + 0.01, Math.floor((2 * Planet.G * this.mass / dist) ** 0.5));
            moon.vel = normVelDir.mulScalar(initVel);

            // add the latest aphelion to make sure the moons dont overlap
            orbitRadius += (2 * Planet.G * this.mass * dist / (2 * Planet.G * this.mass - initVel ** 2 * dist)) - dist + moon.radius + Planet.MOON_ORBIT_GAP;

            this.effectElements.push(moon);
        }
    }

    renderMoonInfo(rocketAdjustment, rocketPos)
    {
        Global.cxt.fillStyle = "rgb(255, 255, 255)";
        for (let i = 0; i < this.effectElements.length; i++) {
            // const adjustedPos = this.effectElements[i].pos.sub(rocketAdjustment).add(rocketPos);
            const adjustedPos = this.effectElements[i].pos.sub(this.pos)//.add(this.pos.sub(rocketAdjustment));
            Global.cxt.fillText(`Moon ${i + 1}: ${adjustedPos.x.toFixed(2)}, ${adjustedPos.y.toFixed(2)}`, 10, 100 + 20 * i);
        }
    }

    render(rocketPos) {
        Global.cxt.translate(-rocketPos.x, -rocketPos.y);
        Global.cxt.beginPath();
        Global.cxt.fillStyle = this.color;
        Global.cxt.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        Global.cxt.fill();
        Global.cxt.translate(rocketPos.x, rocketPos.y);
    }

    update() {
        super.update();

        for (const element of this.effectElements) {
            const relPos = this.pos.sub(element.pos);
            const gravityAcc = Planet.G * this.mass / relPos.magSq();
            element.acc = relPos.norm().mulScalar(gravityAcc);
        }
    }

    renderTrail(rocketPos)
    {
        if (this.trailCounter++ > 100) {
            this.trailPoints.push(this.pos);
            this.trailCounter = 0;
        }

        if (this.trailPoints.length > 100) {
            this.trailPoints.shift();
        }

        Global.cxt.translate(-rocketPos.x, -rocketPos.y);
        Global.cxt.beginPath();
        Global.cxt.strokeStyle = "rgb(0, 128, 255)";
        Global.cxt.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
        for (let i = 1; i < this.trailPoints.length; i++) {
            Global.cxt.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
        }
        Global.cxt.stroke();
        Global.cxt.translate(rocketPos.x, rocketPos.y);
    }
}