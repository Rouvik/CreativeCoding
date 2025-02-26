const sc = document.getElementById("screen");
const cxt = sc.getContext("2d", { alpha: false });

const fps_val = document.getElementById("fps_val");

Global.setScreen(sc);
Global.setContext(cxt);

window.addEventListener("resize", resize);
function resize() {
    sc.width = window.innerWidth;
    sc.height = window.innerHeight - 30;

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

const planet = new SpaceElement(new vec2(sc.width - 200, sc.height - 200));

let tprev = 0;
function animate(t) {
    cxt.clearRect(0, 0, sc.width, sc.height);

    rocket.update();

    rocket.overspeed();

    PersistentText.render();

    Environment.renderStars(rocket.vel.mulScalar(-1));
    planet.render(rocket.pos);
    rocket.render();
    joy.renderJoystick();

    rocket.overspeedRestore();

    fps_val.value = ~~(1000 / (t - tprev));
    tprev = t;

    requestAnimationFrame(animate);
}

animate();