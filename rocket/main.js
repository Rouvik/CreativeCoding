const sc = document.getElementById("screen");
const cxt = sc.getContext("2d", { alpha: false });

const fps_val = document.getElementById("fps_val");

Global.setScreen(sc);
Global.setContext(cxt);

window.addEventListener("resize", resize);
function resize() {
    sc.width = window.innerWidth;
    sc.height = window.innerHeight - 4;

    Environment.stars = [];
    Environment.renderStars(new vec2(0));
    Environment.renderStars(new vec2(0));
    Environment.renderStars(new vec2(0));
}
resize();

Environment.renderStars(new vec2(0));
Environment.renderStars(new vec2(0));
Environment.renderStars(new vec2(0));

let starDir = new vec2(0);

const rocket = new Rocket();
const joy = new Joystick();

rocket.setWindowAdjustment();
rocket.setKeyBindings();

Global.attachEventListeners();

joy.addUpdateCallback((dir, mag) => {
    // rocket.dir = rocket.dir.rotate(rocket.dir.dot(dir) - Math.PI / 2);

    rocket.dir = dir;
    rocket.acc = dir.mul(new vec2(mag / 750));
    rocket.isAccelerating = true;
});

joy.joyStopCallback = () => {
    rocket.acc = new vec2(0);
    rocket.isAccelerating = false;
};

// const planet = new SpaceElement(new vec2(sc.width - 200, sc.height - 200));
const planet1 = new Planet(new vec2(sc.width - 200, sc.height - 200));
const planet2 = new Planet(new vec2(sc.width - 250, sc.height - 200));

/*
NOTE:
To calculate the ideal tangential velocity for a circular orbit, use the formula:
v = sqrt(G * M / r)

To calculate the limiting condition where the periapsis doesnot collide with the parent planet use the formula:
v <= sqrt((GM / d) * (2(r + R) / d + r + R))
*/

planet1.mass = 300;
planet1.color = "rgb(0, 255, 0)";
planet1.radius = 20;
planet2.vel = new vec2(0, -(6 ** 0.5) - 0.5)//-(4.5 ** 0.5));
planet2.radius = 10;

planet1.effectElements.push(planet2);

let tprev = 0;
function animate(t) {
    cxt.clearRect(0, 0, sc.width, sc.height);

    rocket.update();

    rocket.overspeed();

    PersistentText.render();

    Environment.renderStars(rocket.vel.mulScalar(-1));
    planet1.update();
    planet2.update();

    cxt.fillText(`Planet 2: ${planet2.acc.x.toFixed(2)}, ${planet2.acc.y.toFixed(2)}`, 10, 100);

    planet1.render(rocket.pos);
    planet2.render(rocket.pos);
    // planet2.renderTrail(rocket.pos);
    
    rocket.render();
    joy.renderJoystick();

    rocket.overspeedRestore();

    Global.renderFPS(t);

    requestAnimationFrame(animate);
}

animate();