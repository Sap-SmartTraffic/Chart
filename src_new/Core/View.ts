import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "./Evented"
import Util=require("./Util")
let styles=Util.d3Invoke("style")
let attrs=Util.d3Invoke("attr")
export class View extends Evented{
    constructor(conf?){
        super()
        this.config=Util.deepExtend({tagName:"div"},conf)
        this.initView()
    }
    config:{
        tagName:string |null|undefined,
        className:string |null|undefined
    }
    el:Element
    elD3:d3.Selection<Element,{},null,null>
    initView(){
        if(this.config.tagName=="svg"){
            this.el=document.createElementNS("http://www.w3.org/2000/svg","svg")
        }else{
            this.el=document.createElementNS("http://www.w3.org/1999/xhtml",this.config.tagName)
        }
        this.elD3=d3.select(this.el)
        this.elD3.classed(this.config.className,true)
        return this
    }
    appendTo(dom:d3.Selection<Element,{},null,null>){
        dom.node().appendChild(this.el)
        return this
    }
    style(s){
        this.elD3.call(styles(s))
        return this
    }
    attr(a){
        this.elD3.call(attrs(a))
        return this
    }
    render(ctx?){
        return this
    }
    addClass(c){
        this.elD3.classed(c,true)
        return this
    }
    removeClass(c){
        this.elD3.classed(c,false)
        return this
    }
}