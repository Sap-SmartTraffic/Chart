export class Evented{
    constructor(){
        this.events={};
    }
    private events:any;
    on(t:string,fn: Function, ctx ?:Object){
       
        var st=t.split(" ");
        st.forEach((t)=>{
            let  obj :any={};
            obj.fn=fn;
            obj.ctx=ctx;
            if(!this.events[t]){
                this.events[t]=[];
            }
            this.events[t].push(obj);
        })
        
        return this;
    }
    _off(t:string,fn:Function,ctx ?:Object){

        if(!this.events[t]){
            return this;
        }else{
            let nEs=[];
            this.events[t].forEach(o => {
                if(o.fn != fn && o.ctx != ctx){
                    nEs.push(o);
                }
            });
            this.events=nEs;
        }
        return this;
    }
    off(t:string,fn:Function,ctx ?:Object){

        if(!this.events[t]){
            return this;
        }else{
            let nEs=[];
            this.events[t].forEach(o => {
                if(o.fn != fn && o.ctx != ctx){
                    nEs.push(o);
                }
            });
            this.events=nEs;
        }
        return this;
    }
    fire(t:string,obj?:any){
        if(!this.events[t]){
            return this;
        }else{
            this.events[t].forEach((o)=>o.fn.call(o.ctx,obj));
            return this;
        }
    }
}