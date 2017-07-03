import _ = require("underscore")
export interface IEvented{
    on:(t:string ,fn:Function,ctx?:object)=>this
    off:(t:string ,fn:Function)=>this
    fire:(t: string, obj ? : any)=>this
    listen:(o:IEvented,estr:string,fn:Function)=>this
    clear:()=>void
}
export class Evented implements IEvented{
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
        if(p){
            p.fire(t, obj)
        }
        if(t!="*"){
            this.fire("*",obj)
        }
        return this
    }
    listen(o:IEvented,estr:string,fn:Function){
        o.on(estr,fn)
        return this
    }
    listenTo(e: Evented) {
        e.parent = this
        return this
    }
    clear(){
        this.events={}
        this.parent=null
    }
    proxyEvents(obj:IEvented,...args) {
        _.each(args,(k)=>{
            obj.on(k,(...objs)=>{
                this.fire.apply(this,[k].concat(objs))
            })
        })
    }
}