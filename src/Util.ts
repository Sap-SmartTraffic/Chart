import _ =require("underscore")
export =Util
module Util{
export function isEndWith(s:any,ed:string){
    let ss= s.toString();
    let matcher= new RegExp(ed+"$")
    return matcher.test(ss);
  }
export function toPixel(s:string,ctx?:string){
    if(isEndWith(s,"px")){
        return parseFloat(s)
    }
    if(isEndWith(s,"rem")){
         let font=window.getComputedStyle(document.body).getPropertyValue('font-size')||"16px"
         return parseFloat(s) * parseFloat(font)
    }
    if(isEndWith(s,"%")){
        return parseFloat(s)* toPixel(ctx)/100
    }
        return 0
}
export function isBeginWith(s:any,bs:string){
    let ss= s.toString();
    let matcher= new RegExp("^"+bs)
    return matcher.test(ss);
  }
export function isContaint(s,ss){
    let matcher= new RegExp(ss)
    return matcher.test(s.toString());
  }

export function max (nums:any [],key?){
       let n=Number.MIN_VALUE;
       if(key){
           nums=nums.map(n=>n[key])
       }
       nums.forEach((num)=>{
            n=isNaN(num)?n: n>num? n:num;
       })
       n= n==Number.MIN_VALUE?0:n;
       return n;
    }
export function min (ns:any [],key?){
       let n=Number.MAX_VALUE;
       if(key){
           ns=ns.map(n=>n[key])
       }
       ns.forEach((num)=>{
            n=isNaN(num)?n: n<num? n:num;
       })
       n= n == Number.MAX_VALUE?0:n;
       return n;
    }
export let d3Invoke = curry((method?,obj?)=>{
    return (d3Selection)=>{
        _.each(obj,(v,k)=>{
            d3Selection[method](k,v)
        })
        return d3Selection
    }
})

// var stringCache={cla:null,font_size:0,length:0,r:{width:0,height:0}} 
export function getStringRect(str:string, cla ?:string,font_size?:number){
        let d= window.document.createElement("div");
        let p = window.document.createElement("span");
        let r ={width:0,height:0};
        d.style.transform="translate3d(0, 0, 0)";
        d.style.visibility="hidden";
        d.className="getStringRect"
        p.innerHTML= str;
        if(cla){
            p.className=cla;
        }
        if(font_size){
            p.style["font-size"]=font_size+"px"
        }
        if(!str){
            return r;
        }
        p.style.display="inline-block";
        d.appendChild(p);
        window.document.body.appendChild(d);
        let rec=p.getBoundingClientRect()
        r.width=rec.width;
        r.height=rec.height;
        d.remove();
        return r;
    }
export function CacheAble(fn:any,keyFn?){
    let _key=function(){
        return  arguments2Array(arguments).join("-")
    }
    let cache={}
    _key=keyFn?keyFn:_key
    return function(){
        let args=arguments2Array(arguments)
       
        if(cache[_key.apply(null,args)]){
            return cache[_key.apply(null,args)]
        }else{
             console.log("not cached",args)
             return cache[_key.apply(null,args)]=fn.apply(null,args)  
        }
    }
}
export function curry(f) {
        var arity = f.length;
        return function f1(r1?,r2?,r3?) {
            var args = Array.prototype.slice.call(arguments, 0);
            if(args.length < arity) {
                var f2= function() {
                    var args2 = Array.prototype.slice.call(arguments, 0); // parameters of returned curry func
                    return f1.apply(null, args.concat(args2)); // compose the parameters for origin func f
                }
                return f2;
            } else {
                return f.apply(null, args); //all parameters are provided call the origin function
            }
        }
    }
function arguments2Array(args){
    let r=[]
    for(let i=0;i<args.length;++i){
        r.push(args[i])
    }
    return r
}
export function enableAutoResize(dom:any,fn){
       function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            }
            if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            }

            return element.style[prop];
        }
        if (getComputedStyle(dom, 'position') == 'static') {
                dom.style.position = 'relative';
        }
        for(let i=0;i<dom.childNodes.length;++i){
            if(dom.childNodes[i].className =="autoResier"){
                dom.removeChild(dom.childNodes[i])
            }
        }
        let oldWidth=dom.offsetWidth,oldHeight=dom.offsetHeight,refId=0
        let d1= window.document.createElement("div")
        let d2=window.document.createElement("div")
        let d3=window.document.createElement("div")
        d1.className="autoResier"
        
        d1.setAttribute("style"," position: absolute; left: 0; top: 0; right: 0; overflow:hidden; visibility: hidden; bottom: 0; z-index: -1")
        d2.setAttribute("style","position: absolute; left: 0; top: 0; right: 0; overflow:scroll; bottom: 0; z-index: -1")
        d3.setAttribute("style","position: absolute; left: 0; top: 0; transition: 0s ;height: 100000px;width:100000px")
        d2.appendChild(d3)
        d1.appendChild(d2)
        dom.appendChild(d1)
        d2.scrollLeft=100000
        d2.scrollTop=100000
        d2.onscroll=(e)=>{
            d2.scrollLeft=100000;
            d2.scrollTop=100000;
            if((dom.offsetHeight!= oldHeight || dom.offsetWidth!=oldWidth) &&refId===0){
                refId= requestAnimationFrame(onresize) 
            }
        }
        function onresize(){
           refId=0
           if(fn){
               fn({oldHeight:oldHeight,oldWidth:oldWidth,height:dom.offsetHeight,width:dom.offsetWidth})
           }
            oldWidth=dom.offsetWidth,oldHeight=dom.offsetHeight
        }
    }
}