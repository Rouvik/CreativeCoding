const sc = document.getElementById('screen');
const cxt = sc.getContext('2d', { alpha: false });

function resize() {
    sc.width = sc.height = Math.min(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resize);
resize();

Global.setCanvas(sc);
Global.setContext(cxt);

const cloth = new Cloth(2, 1, new vec2(30, 30), new vec2(sc.width - 10, sc.height - 10));

function animate(t) {
    cxt.clearRect(0, 0, sc.width, sc.height);    

    cloth.update();
    cloth.render();

    requestAnimationFrame(animate);
}

animate();