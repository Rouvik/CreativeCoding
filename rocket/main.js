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
    // rocket.dir = rocket.dir.add(dir.sub(rocket.dir).mulScalar(0.05));

    rocket.target_dir = dir;
    rocket.acc = dir.mul(new vec2(mag / 750));
    rocket.isAccelerating = true;
});

joy.joyStopCallback = () => {
    rocket.acc = new vec2(0);
    rocket.isAccelerating = false;
};

const planet1 = new Planet(new vec2(sc.width - 200, sc.height - 200));

/*
NOTE:
To calculate the ideal tangential velocity for a circular orbit, use the formula:
v = sqrt(G * M / r)

To calculate the limiting condition where the periapsis doesnot collide with the parent planet use the formula:
v <= sqrt((GM / d) * (2(r + R) / d + r + R))

To calculate the maximum distance or aphelion of the orbit use the formula:
X_max = [2GMd / (2GM - {v^2} * d)] - d
*/

planet1.mass = 500;
planet1.color = "rgb(255, 255, 128)";
planet1.radius = planet1.mass * Planet.MASS_RADIUS_MULTIPLIER;

planet1.createRandomMoons(8);

let tprev = 0;
function animate(t) {    
    cxt.clearRect(0, 0, sc.width, sc.height);
    rocket.update();
    rocket.overspeed();

    PersistentText.render();    
    
    Environment.renderStars(rocket.vel.mulScalar(-1));
    for (const element of SpaceElement.renderList) {
        element.update();
        element.renderTrail(rocket.pos);
        element.render(rocket.pos);
    }
    
    planet1.renderMoonInfo(rocket.posAdjs, rocket.pos);

    rocket.render();
    joy.renderJoystick();
    
    rocket.overspeedRestore();
    
    Global.renderFPS(t);

    requestAnimationFrame(animate);
}

animate();