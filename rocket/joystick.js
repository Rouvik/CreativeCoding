class Joystick {
    static MAX_RADIUS = 75;

    constructor(sc = Global.sc) {
        sc.addEventListener('mousedown', this.onMouseDown.bind(this));
        sc.addEventListener('mousemove', this.onMouseMove.bind(this));
        sc.addEventListener('mouseup', this.onMouseUp.bind(this));

        this.isPressed = false;

        this.stPos = new vec2(0);
        this.endPos = new vec2(0);
        this.mag = 0;

        this._cachedDir = new vec2(0);
        this._cachedMag = 0;

        this.updateCallback = () => {};
        this.joyStopCallback = () => {};
    }

    onMouseDown(evt) {
        this.stPos = new vec2(evt.clientX, evt.clientY);
        this.endPos = new vec2(evt.clientX, evt.clientY);
        this.isPressed = true;
    }

    onMouseMove(evt) {
        if (!this.isPressed) return;
        this.endPos = new vec2(evt.clientX, evt.clientY);

        this._cachedDir = this.endPos.sub(this.stPos);
        this._cachedMag = this._cachedDir.mag();
        this._cachedDir = this._cachedDir.norm();

        this.updateCallback(this._cachedDir, this._cachedMag);
    }

    onMouseUp() {
        this.stPos = new vec2(0);
        this.endPos = new vec2(0);
        this._cachedDir = new vec2(0);
        this._cachedMag = 0;

        this.isPressed = false;

        this.joyStopCallback();
    }

    renderJoystick()
    {
        Global.cxt.strokeStyle = 'rgb(0, 255, 0)';
        Global.cxt.beginPath();
        Global.cxt.arc(this.stPos.x, this.stPos.y, Math.min(this._cachedMag, Joystick.MAX_RADIUS), 0, 2 * Math.PI);
        Global.cxt.moveTo(this.stPos.x, this.stPos.y);
        const endPoint = this.stPos.add(this._cachedDir.mul(new vec2(Math.min(this._cachedMag, Joystick.MAX_RADIUS))));
        Global.cxt.lineTo(endPoint.x, endPoint.y);
        Global.cxt.stroke();
    }

    addUpdateCallback(callback)
    {
        if (typeof callback !== 'function') {
            throw Error("[Joystick Error] Bad joystick update callback: " + callback);
        }

        this.updateCallback = callback;       
    }
}