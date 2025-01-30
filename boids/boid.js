class Global {
    static cxt = null;
    static sc = null;
    static fpsFont = '15px Noto Sans';
    static fpsFontColor = 'rgb(255, 42, 113)';

    static showQuadtree = false;
    static showFPS = false;

    static setContext(cxt) {
        if (!cxt instanceof CanvasRenderingContext2D) {
            throw new Error('[Global Error] Bad Canvas rendering context: ' + cxt);
        }

        Global.cxt = cxt;
    }

    static setScreen(sc) {
        if (!cxt instanceof HTMLCanvasElement) {
            throw new Error('[Global Error] Bad Canvas: ' + sc);
        }

        Global.sc = sc;
    }

    static renderFPS(deltaT) {
        Global.cxt.font = Global.fpsFont;
        Global.cxt.fillStyle = Global.fpsFontColor;
        Global.cxt.fillText('FPS: ' + (1000 / deltaT).toFixed(2), 5, 20);
    }
}

// checks if the current device is a phone or a computer
function isPhone() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return true;
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return true;
    }
    return false;
};

class Boid {
    static boidCount = 100;
    
    static boidColor = 'rgb(255, 255, 255)';
    static qtree = null;
    static sepFactor = 0.5;
    static alignFactor = 0.5;
    static cohesionFactor = 0.5;
    static maxSpeed = 5;
    static maxForce = 0.2;

    static avoidMouse = true;
    static avoidDist = 100;

    static mousePos = new vec2(0, 0);

    constructor(pos, vel, acc) {
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
    }

    static setQtree(qtree) {
        if (!qtree instanceof Quadtree) {
            throw new Error('[Boid Error] Bad Quadtree: ' + qtree);
        }

        Boid.qtree = qtree;
    }

    static boidRenderFrame(boids) {
        Global.cxt.strokeStyle = Boid.boidColor;
        for (const boid of boids) {
            boid.render();
        }
        Global.cxt.stroke();
    }

    static setMouseListener() {
        if (isPhone()) {
            Global.sc.addEventListener('touchmove', (e) => {
                Boid.mousePos = new vec2(e.touches[0].clientX, e.touches[0].clientY);
            });
        }
        else {
            Global.sc.addEventListener('mousemove', (e) => {
                Boid.mousePos = new vec2(e.clientX, e.clientY - document.body.scrollTop);                
            });
        }
    }

    update() {
        this.vel = this.vel.add(this.acc).clamp(-Boid.maxSpeed, Boid.maxSpeed);
        this.pos = this.pos.add(this.vel);
        this.acc = new vec2(0);

        if (this.pos.x < 0) {
            this.pos.x = Global.sc.width - 5;
        } else if (this.pos.x > Global.sc.width) {
            this.pos.x = 5;
        }

        if (this.pos.y < 0) {
            this.pos.y = Global.sc.height - 5;
        } else if (this.pos.y > Global.sc.height) {
            this.pos.y = 5;
        }

        const neighbours = Boid.qtree.locateNeighbours(this);
        if (neighbours === null || neighbours.length <= 1) {
            return;
        }

        const sep = this.seperation(neighbours);
        const align = this.alignment(neighbours);
        const cohesion = this.cohesive(neighbours);

        // this.acc = new vec2(this.vel.norm().mul(new vec2(Boid.maxForce / 2)));
        this.acc = this.acc.add(align).add(cohesion).add(sep);

        if (Boid.avoidMouse) {
            const avoidance = this.avoidance();
            this.acc = this.acc.add(avoidance);
        }
    }

    seperation(neighbours) {
        let sep = new vec2(0);
        let neighbourCount = 0;
        for (const neighbour of neighbours) {
            if (neighbour == this) {
                continue;
            }

            neighbourCount++;
            const diff = this.pos.sub(neighbour.pos);
            sep = sep.add(diff.div(new vec2(diff.mag())));
        }

        return sep.div(new vec2(neighbourCount))
            .setMag(Boid.maxSpeed)
            .sub(this.vel)
            .clamp(-Boid.maxForce, Boid.maxForce)
            .mul(new vec2(Boid.sepFactor));
    }

    alignment(neighbours) {
        let align = new vec2(0);
        let neighbourCount = 0;
        for (const neighbour of neighbours) {
            if (neighbour == this) {
                continue;
            }

            neighbourCount++;
            align = align.add(neighbour.vel);
        }

        return align.div(new vec2(neighbourCount))
            .setMag(Boid.maxSpeed)
            .sub(this.vel)
            .clamp(-Boid.maxForce, Boid.maxForce)
            .mul(new vec2(Boid.alignFactor));
    }

    cohesive(neighbours) {
        let coh = new vec2(0);
        let neighbourCount = 0;
        for (const neighbour of neighbours) {
            if (neighbour == this) {
                continue;
            }

            neighbourCount++;
            coh = coh.add(neighbour.pos);
        }

        return coh.div(new vec2(neighbourCount))
            .sub(this.pos)
            .setMag(Boid.maxSpeed)
            .sub(this.vel)
            .clamp(-Boid.maxForce, Boid.maxForce)
            .mul(new vec2(Boid.cohesionFactor));
    }

    avoidance() {
        const diff = this.pos.sub(Boid.mousePos);
        const dist = diff.mag();
        if (dist < Boid.avoidDist) {
            return diff.norm().mul(new vec2(Boid.maxSpeed));
        }

        return new vec2(0);
    }

    render() {
        const dir = this.vel.norm();
        const norm = dir.rotate(Math.PI / 2).mul(new vec2(5));
        const p1 = this.pos.add(dir.mul(new vec2(20)));

        Global.cxt.moveTo(p1.x, p1.y);
        Global.cxt.lineTo(this.pos.x + norm.x, this.pos.y + norm.y);
        Global.cxt.lineTo(this.pos.x - norm.x, this.pos.y - norm.y);
        Global.cxt.closePath();
    }

    static renderMouse() {
        Global.cxt.fillStyle = 'rgb(255, 0, 0)';
        Global.cxt.arc(Boid.mousePos.x, Boid.mousePos.y, 5, 0, Math.PI * 2);
        Global.cxt.fill();
    }
}