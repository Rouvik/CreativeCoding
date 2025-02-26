class Global {
    static cxt = null;
    static sc = null;

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
}