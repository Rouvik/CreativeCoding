class Cloth {
    // basic parameters
    static PARTICLE_RADIUS = 5;
    static GRAVITY = new vec2(0, 0.1);
    static CELL_GAP = 10;
    static _CELL_SKIP = 9;
    static CONSTRAIN_TOP = true;

    constructor(xnum, ynum, boundStart, boundEnd) {
        this.xnum = xnum;
        this.ynum = ynum;

        // the viewing position to start display from
        this.translation = boundStart;

        this.boundEnd = boundEnd.sub(boundStart);

        // the particle being held by the mouse
        this.holdParticle = null;

        // I know this is dumb and a terible mistake, but I am too lazy to fix it
        Cloth.CELL_GAP = this.boundEnd.x / this.xnum;

        // the array of particles being animated
        this.particles = Array.from(Array(this.ynum), () => new Array(this.xnum));
        this.setPointAccelerations();

        // setup mouse events
        this.mouseEvents();
    }

    static set CELL_SKIP(val) {
        Cloth._CELL_SKIP = val <= 0 ? 1 : val;
    }

    static get CELL_SKIP() {
        return Cloth._CELL_SKIP;
    }

    // set the indivitual point accelerations (and positions) for initiating the system
    setPointAccelerations() {
        for (let i = 0; i < this.ynum; i++) {
            for (let j = 0; j < this.xnum; j++) {
                this.particles[i][j] = {
                    pos: new vec2(0),
                    ppos: new vec2(0),
                    acc: new vec2(Cloth.GRAVITY)
                };
                this.particles[i][j].pos = new vec2(j * Cloth.CELL_GAP, i * Cloth.CELL_GAP);
                this.particles[i][j].ppos = new vec2(this.particles[i][j].pos);
            }
        }
    }

    // sets the mouse events for the cloth vertex handling
    mouseEvents() {
        Global.sc.addEventListener('mousedown', (e) => {
            const mpos = new vec2(e.clientX, e.clientY).sub(this.translation);

            for (let i = 0; i < this.ynum; i++) {
                for (let j = 0; j < this.xnum; j++) {
                    if (this.particles[i][j].pos.sub(mpos).magSq(mpos) <= Cloth.PARTICLE_RADIUS * Cloth.PARTICLE_RADIUS * 1.5) {
                        this.holdParticle = this.particles[i][j];
                    }
                }
            }
        });

        Global.sc.addEventListener('mousemove', (e) => {
            if (this.holdParticle) {
                this.holdParticle.pos.x = e.clientX - this.translation.x;
                this.holdParticle.pos.y = e.clientY - this.translation.y;
            }
        });

        Global.sc.addEventListener('mouseup', () => {
            this.holdParticle = null;
        });
    }

    // renders the cloth
    render() {
        Global.cxt.translate(this.translation.x, this.translation.y);
        Global.cxt.fillStyle = 'rgb(255, 255, 255)';
        Global.cxt.strokeStyle = 'rgb(255, 255, 255)';

        Global.cxt.beginPath();

        // render the particles
        if (Cloth.PARTICLE_RADIUS > 0) {
            for (let i = 0; i < this.ynum; i++) {
                for (let j = 0; j < this.xnum; j++) {
                    Global.cxt.moveTo(this.particles[i][j].pos.x, this.particles[i][j].pos.y);
                    Global.cxt.arc(this.particles[i][j].pos.x, this.particles[i][j].pos.y, Cloth.PARTICLE_RADIUS, 0, Math.PI * 2);
                }
            }
        }

        // render the horizontal connections
        for (let i = 0; i < this.ynum - 1; i++) {
            for (let j = 0; j < this.xnum; j++) {
                Global.cxt.moveTo(this.particles[i][j].pos.x, this.particles[i][j].pos.y);
                Global.cxt.lineTo(this.particles[i + 1][j].pos.x, this.particles[i + 1][j].pos.y);
            }
        }

        // render the vertical connections
        for (let i = 0; i < this.ynum; i++) {
            for (let j = 0; j < this.xnum - 1; j++) {
                Global.cxt.moveTo(this.particles[i][j].pos.x, this.particles[i][j].pos.y);
                Global.cxt.lineTo(this.particles[i][j + 1].pos.x, this.particles[i][j + 1].pos.y);
            }
        }

        Global.cxt.stroke();
        Global.cxt.fill();
        Global.cxt.translate(-this.translation.x, -this.translation.y);
    }

    // updates the cloth
    update() {
        // first constrain distances
        this.constrainDist();

        // if the top is constrained, then set the top particles to their original positions
        if (Cloth.CONSTRAIN_TOP) {
            for (let i = 0; i < this.xnum; i += Cloth.CELL_SKIP) {
                this.particles[0][i].pos.x = i * Cloth.CELL_GAP;
                this.particles[0][i].pos.y = 0;
            }
        }

        for (let i = 0; i < this.ynum; i++) {
            for (let j = 0; j < this.xnum; j++) {
                // verlet integration
                const temp = new vec2(this.particles[i][j].pos);
                this.particles[i][j].pos = this.particles[i][j].pos.mulScalar(2).sub(this.particles[i][j].ppos).add(this.particles[i][j].acc);
                this.particles[i][j].ppos = temp;

                // collision with walls
                this.particles[i][j].pos.clampX(-this.translation.x, Global.sc.width - this.translation.x - Cloth.PARTICLE_RADIUS);
                this.particles[i][j].pos.clampY(-this.translation.y, Global.sc.height - this.translation.y - Cloth.PARTICLE_RADIUS);
            }
        }
    }

    // constrains the distance between the particles
    constrainDist() {
        // simply find the midpoint of each particles for x axis connections and make the particles cap to Cloth.CELL_GAP / 2
        for (let i = 0; i < this.ynum; i++) {
            for (let j = 0; j < this.xnum - 1; j++) {
                const mid = this.particles[i][j].pos.add(this.particles[i][j + 1].pos).divScalar(2);
                const dir1 = this.particles[i][j].pos.sub(mid);
                const dir2 = this.particles[i][j + 1].pos.sub(mid);
                if (dir1.magSq() > (Cloth.CELL_GAP / 2) ** 2) {
                    this.particles[i][j].pos = dir1.norm().mulScalar(Cloth.CELL_GAP / 2).add(mid);
                }

                if (dir2.magSq() > (Cloth.CELL_GAP / 2) ** 2) {
                    this.particles[i][j + 1].pos = dir2.norm().mulScalar(Cloth.CELL_GAP / 2).add(mid);
                }
            }
        }

        // simply find the midpoint of each particles for y axis connections and make the particles cap to Cloth.CELL_GAP / 2
        for (let i = 0; i < this.ynum - 1; i++) {
            for (let j = 0; j < this.xnum; j++) {
                const mid = this.particles[i][j].pos.add(this.particles[i + 1][j].pos).divScalar(2);
                const dir1 = this.particles[i][j].pos.sub(mid);
                const dir2 = this.particles[i + 1][j].pos.sub(mid);
                if (dir1.magSq() > (Cloth.CELL_GAP / 2) ** 2) {
                    this.particles[i][j].pos = dir1.norm().mulScalar(Cloth.CELL_GAP / 2).add(mid);
                }

                if (dir2.magSq() > (Cloth.CELL_GAP / 2) ** 2) {
                    this.particles[i + 1][j].pos = dir2.norm().mulScalar(Cloth.CELL_GAP / 2).add(mid);
                }
            }
        }
    }
}