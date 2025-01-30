// Screen setup -----------------------------
const sc = document.getElementById('screen');
const cxt = sc.getContext('2d', {alpha: false});

function screenResize() {
    sc.width = window.innerWidth;
    sc.height = window.innerHeight * 0.95;
};

window.addEventListener('resize', screenResize);
screenResize();


// Screen setup end --------------------------

function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

Global.setScreen(sc);
Global.setContext(cxt);

let boids;
const qtree = new Quadtree(boids, new vec2(0, 0), new vec2(sc.width, sc.height));

function restartBoids() {
    boids = [];
    for (let i = 0; i < Boid.boidCount; i++) {
        boids.push(
            new Boid(
                new vec2(randRange(0, sc.width), randRange(0, sc.height)),
                new vec2(Math.random() * 2 - 1, Math.random() * 2 - 1),
                new vec2(0)
            )
        );
    }

    qtree.points = boids;
}

restartBoids();

window.addEventListener('resize', () => {
    qtree.dim = new vec2(sc.width, sc.height);
});

Boid.setQtree(qtree);
Boid.setMouseListener();

let tprev = performance.now();

function animate(t) {
    Global.cxt.clearRect(0, 0, sc.width, sc.height);
    Global.cxt.beginPath();
    
    qtree.subdivide();
    if (Global.showQuadtree) {
        qtree.renderQuads();
    }

    for (const boid of boids) {
        boid.update();
    }
    Boid.boidRenderFrame(boids);

    if (Boid.avoidMouse) {
        Global.cxt.beginPath();
        Boid.renderMouse();
    }

    if (Global.showFPS) {
        Global.renderFPS(t - tprev);
        tprev = t;
    }
    
    
    requestAnimationFrame(animate);
}

animate();
