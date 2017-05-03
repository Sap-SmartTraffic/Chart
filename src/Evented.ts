import _ = require("underscore")
export class Evented {
    constructor() {
        this.events = {};
    }
    private events: any
    private parent: Evented
    on(t: string, fn: Function, ctx ? : Object) {

        var st = t.split(" ");
        st.forEach((tt) => {
            this._on(tt,fn,ctx)
        })
        return this;
    }
    private _on(t: string, fn: Function, ctx ? : Object) {
        if (this.events[t]) {
            if (_.some(this.events[t], (e: any) => e.fn == fn && e.ctx == ctx)) {
                return
            } else {
                let obj: any = {};
                obj.fn = fn;
                obj.ctx = ctx;
                this.events[t].push(obj);
            }
        } else {
            this.events[t] = [];
            let obj: any = {};
            obj.fn = fn;
            obj.ctx = ctx;
            this.events[t].push(obj);
        }
    }
    private _off(t: string, fn ? : Function, ctx ? ) {
        if (!this.events[t]) {
            return this;
        } else {
            let nEs = [];
            if (fn) {
                this.events[t].forEach(o => {
                    if (o.fn != fn && o.ctx != ctx) {
                        nEs.push(o);
                    }
                });
            }
            this.events[t] = nEs;
        }
    }
    off(t: string, fn: Function) {
        var st = t.split(" ");
        st.forEach(s => this._off(s, fn))
        return this;
    }
    fire(t: string, obj ? : any) {
        if (this.events[t]) {
            this.events[t].forEach((o) => o.fn.call(o.ctx, obj));
        }
        let p = this.parent
        p.fire(t, obj)
        return this
    }
    listenTo(e: Evented) {
        e.parent = this
        return this
    }
}