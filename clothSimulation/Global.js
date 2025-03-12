class Global {
    static sc = null;
    static cxt = null;

    static setCanvas(sc)
    {
        if (!sc instanceof HTMLCanvasElement)
        {
            throw new Error('Global.setCanvas: sc must be an instance of HTMLCanvasElement');
        }

        Global.sc = sc;
    }

    static setContext(cxt)
    {
        if (!cxt instanceof CanvasRenderingContext2D)
        {
            throw new Error('Global.setContext: cxt must be an instance of CanvasRenderingContext2D');
        }

        Global.cxt = cxt;
    }

    static isPhone() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return true;
        }
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return true;
        }
        return false;
    };
}