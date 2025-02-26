class PersistentText {
    static texts = [];

    constructor(msg, pos, ticks = 5000, color = 'rgb(255, 255, 255)', font = '30px Consolas, monospace') {
        this.msg = msg;
        this.pos = pos;
        this.color = color;
        this.font = font;
        this.ticks = ticks;
        this._renderedTicks = 0;

        PersistentText.texts.push(this);
    }

    static render()
    {
        for (let i = 0; i < PersistentText.texts.length; i++) {
            PersistentText.texts[i].render();
        }
    }

    render()
    {
        Global.cxt.fillStyle = this.color;
        Global.cxt.font = this.font;
        Global.cxt.fillText(this.msg, this.pos.x, this.pos.y);

        this._renderedTicks++;

        if (this._renderedTicks > this.ticks) {
            PersistentText.texts.splice(PersistentText.texts.indexOf(this), 1);
        }
    }
}