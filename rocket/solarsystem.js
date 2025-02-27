class SolarSystem extends SpaceElement {
    static MAX_STARMASS = 10000;
    static MIN_STARMASS = 500;
    static STARMASS_RANGE = SolarSystem.MAX_STARMASS - SolarSystem.MIN_STARMASS;
    constructor(pos, vel, acc, effectRadius) {
        super(pos, vel, acc);
        this.effectRadius = effectRadius;

        this.star = null;
        this.planets = [];
    }

    createPlanets() {
        this.star = new Planet(this.pos, new vec2(0), new this.vec2(0), Math.random() * SolarSystem.STARMASS_RANGE + SolarSystem.MIN_STARMASS, this.effectRadius);
        // let prevRadius = 
        for (let i = 0; i < Math.random() * 10; i++) {

        }
    }
}