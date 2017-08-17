import d3 =require("d3")
import _ = require('lodash');
import {Evented} from "./Evented"
import {Util} from "./Util"
let styles=Util.d3Invoke("style")
let attrs=Util.d3Invoke("attr")
export class View extends Evented{
    constructor(conf){
        super()
        this.config=Util.deepExtend(this.defaultConfig(),conf)
        this.initView()
    }
    defaultConfig():IViewConfig{
        return {tagName:"div",className:"view"}
    }
    setConfig(c){
        this.config = _.extend(this.defaultConfig(),this.config,c)
        return this
    }

    config:IViewConfig
    // config:{
    //     tagName:string |null|undefined,
    //     className:string |null|undefined
    // }
    el:any
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
    append(element) {
        this.el.appendChild(element)
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
export interface IViewConfig{
        tagName?:string |null|undefined,
        className?:string |null|undefined,
    }