const sc = document.getElementById('screen');
const cxt = sc.getContext('2d', { alpha: false });

const xnumElem = document.getElementById('numx');
const ynumElem = document.getElementById('numy');

function resize() {
    sc.width = window.innerWidth;
    sc.height = window.innerHeight * 0.94;
}

window.addEventListener('resize', resize);
resize();

Global.setCanvas(sc);
Global.setContext(cxt);

let cloth = null;

function regenerateCloth() {
    cloth = new Cloth(+xnumElem.value, +ynumElem.value, new vec2(30, 30), new vec2(sc.width - 30, sc.height - 30));
}


regenerateCloth();

let tprev = 0;

cxt.font = '20px Consolas';

function animate(t) {
    cxt.clearRect(0, 0, sc.width, sc.height);

    cloth.update();
    cloth.render();

    cxt.fillText(`FPS: ${~~(1000 / (t - tprev))}`, 10, sc.height - 10);
    tprev = t;

    requestAnimationFrame(animate);
}

animate();