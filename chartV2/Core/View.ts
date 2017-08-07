import d3 =require("d3")
import _ =require("lodash")
import {Evented} from "../Core/Evented"
import {Util} from "../Core/Util"
let styles=Util.d3Invoke("style")
let attrs=Util.d3Invoke("attr")
export interface IViewConfig{
    tagName?:string|Function,
    class?:string|Function
}
export interface DictionaryObj{
    [key:string]:any
}
export interface IViewConfigValue extends DictionaryObj{ 
    tagName?:string,
    class?:string
}
export class View extends Evented{
    constructor(conf?){
        super()
        this.setConfig(conf)
        this.initView()
    }
    setConfig(c:IViewConfigValue){
        this.config = _.extend(this.defaultConfig(),this.config,c)
        return this
    }
    defaultConfig():IViewConfigValue{
        return {tagName:"div",class:"layer"}
    }
    config:IViewConfigValue
    el:HTMLElement|SVGAElement|SVGSVGElement
    elD3:d3.Selection<Element,{},null,null>
    initView(){
        if(this.config.tagName=="svg"){
            this.el=document.createElementNS("http://www.w3.org/2000/svg","svg")
        }else{
            this.el=document.createElementNS("http://www.w3.org/1999/xhtml",this.config.tagName)
        }
        this.elD3=d3.select(this.el)
        this.elD3.classed(this.config.class,!!this.config.class)
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
    addClass(c){
        this.elD3.classed(c,true)
        return this
    }
    removeClass(c){
        this.elD3.classed(c,false)
        return this
    }
}