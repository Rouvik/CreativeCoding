class Environment {
    static stars = [];
    static NUM_STARS = 100;
    static MAX_STAR_SIZE = 1.5;
    static MIN_STAR_SIZE = 0.5;

    static ENABLE_STARGLOW = false;
    static GLOW_MULTIPLIER = 1.5;

    static renderStars(relDisp = new vec2(0)) {
        Global.cxt.fillStyle = "rgb(255, 255, 255)";
        for (let i = 0; i < Environment.NUM_STARS - this.stars.length; i++) {
            if (relDisp.x == 0 && relDisp.y == 0) {
                Environment.stars.push({
                    x: Math.random() * Global.sc.width,
                    y: Math.random() * Global.sc.height,
                    size: Math.random() * Environment.MAX_STAR_SIZE + Environment.MIN_STAR_SIZE
                });
            }
            else {
                for (let i = 0; i < ~~Math.max(sc.width / sc.height, 1); i++) {
                    if (relDisp.y > 0) {
                        Environment.stars.push({
                            x: Math.random() * Global.sc.width,
                            y: Math.random() * 3,
                            size: Math.random() * Environment.MAX_STAR_SIZE + Environment.MIN_STAR_SIZE
                        });
                    }
                    else {
                        Environment.stars.push({
                            x: Math.random() * Global.sc.width,
                            y: Math.random() * 3 + Global.sc.height,
                            size: Math.random() * Environment.MAX_STAR_SIZE + Environment.MIN_STAR_SIZE
                        });
                    }
                }
                if (relDisp.x > 0) {
                    Environment.stars.push({
                        x: Math.random() * 3,
                        y: Math.random() * Global.sc.height,
                        size: Math.random() * Environment.MAX_STAR_SIZE + Environment.MIN_STAR_SIZE
                    });
                }
                else {
                    Environment.stars.push({
                        x: Math.random() * 3 + Global.sc.width,
                        y: Math.random() * Global.sc.height,
                        size: Math.random() * Environment.MAX_STAR_SIZE + Environment.MIN_STAR_SIZE
                    });
                }
            }

        }

        Global.cxt.beginPath();
        for (let i = 0; i < this.stars.length; i++) {
            Environment.stars[i].x += relDisp.x;
            Environment.stars[i].y += relDisp.y;

            Global.cxt.moveTo(Environment.stars[i].x, Environment.stars[i].y);
            Global.cxt.arc(Environment.stars[i].x, Environment.stars[i].y, Environment.stars[i].size, 0, Math.PI * 2);

            if (Environment.stars[i].x < 0 || Environment.stars[i].x > Global.sc.width || Environment.stars[i].y < 0 || Environment.stars[i].y > Global.sc.height) {
                Environment.stars.splice(i, 1);
            }
        }
        Global.cxt.fill();

        if (Environment.ENABLE_STARGLOW) {
            Global.cxt.beginPath();
            Global.cxt.filter = 'blur(5px)';
            for (let i = 0; i < this.stars.length; i++) {
                Global.cxt.moveTo(Environment.stars[i].x, Environment.stars[i].y);
                Global.cxt.arc(Environment.stars[i].x, Environment.stars[i].y, Environment.stars[i].size * Environment.GLOW_MULTIPLIER, 0, Math.PI * 2);
            }

            Global.cxt.fill();
            Global.cxt.filter = 'none';
        }
    }
}