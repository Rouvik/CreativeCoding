class EventEmitter {
    constructor() {
        this._events = {};
    }

    on(event, listener) {
        if (typeof listener !== 'function') {
            throw new Error("[EventEmitter Error] Bad listener: " + listener);
        }

        if (!this._events[event]) {
            this._events[event] = [];
        }

        this._events[event].push(listener);
    }

    emit(event, ...args) {
        if (!this._events[event]) {
            return;
        }

        this._events[event].forEach(listener => {
            listener.apply(this, args);
        });
    }
}

class Global {
    static cxt = null;
    static sc = null;

    static RENDER_FPS = false;
    static _tprev = 0;
    static FPS_COLOR = "rgb(0, 255, 0)";

    static keys = [];
    static keyEvent = new EventEmitter();

    static randomX = new PseudoRandom(583818);
    static randomY = new PseudoRandom(263588);

    static setScreen(sc) {
        if (!sc instanceof HTMLCanvasElement) {
            throw new Error("[GLOBAL ERROR] Bad canvas element: " + sc);
        }

        Global.sc = sc;
    }

    static setContext(cxt) {
        if (!cxt instanceof HTMLCanvasElement) {
            throw new Error("[GLOBAL ERROR] Bad canvas element: " + cxt);
        }

        Global.cxt = cxt;
    }

    static attachEventListeners() {
        window.addEventListener("keydown", (event) => {
            // event.preventDefault();
            Global.keys[event.key] = true;

            Global._handleKeyEvents(event);
            Global.keyEvent.emit('keypress', event);
        });

        window.addEventListener("keyup", (event) => {
            Global.keys[event.key] = false;
        });
    }

    static _handleKeyEvents(event) {
        if (Global.keys["Control"] && Global.keys["f"]) {
            event.preventDefault();
            Global.RENDER_FPS = !Global.RENDER_FPS;
        }
    }

    static renderFPS(t) {
        if (!Global.RENDER_FPS) return;

        Global.cxt.fillStyle = Global.FPS_COLOR;
        Global.cxt.font = '20px Consolas, monospace';
        Global.cxt.fillText(`FPS: ${~~(1000 / (t - Global._tprev))}`, 5, Global.sc.height - 10);
        Global._tprev = t;
    }

    static randWithinX(min, max)
    {
        return Global.randomX.rand() % (max - min) + min;
    }

    static randWithinY(min, max)
    {
        return Global.randomY.rand() % (max - min) + min;
    }
}