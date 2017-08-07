import { Evented } from "../Core/Evented";
import d3 = require("d3")
import _ = require("lodash")
import { Util } from "../Core/Util";
import { BaseLayer} from "./BaseLayer";
import { View, IViewConfig, IViewConfigValue } from "../Core/View";
let styles = Util.d3Invoke("style")
let attrs = Util.d3Invoke("attr")
export interface IChartConfig extends IViewConfig{
    width:string|Function,
    height:string|Function
}
export interface IChartConfigValue extends IViewConfigValue{
    width:number,height:number
}
export class BaseChart extends View {
    constructor(conf?) {
        super(conf)
        this.style({
            position:"relative"
        })
        this.style(_.pick(this.config,"width","height"))
        this.layers={}
    }
    isRender:boolean
    defaultConfig(){
        return {width:"300px",height:"300px",class:"",tagName:"div"}
    }
    config: IChartConfigValue
    layers:{
       [key:string]:BaseLayer
    }
    protected initLayer(l:BaseLayer){
        if(l instanceof BaseLayer){
            this.layers["base"]=l
        }
        return this
    }
    addLayer(l:BaseLayer){
        this.initLayer(l)
        l.onAddToChart(this)
        return this
    }
    whenReady(fn,ctx?){
        if(this.isRender){
            fn.call(ctx)
        }else{
            this.once("render",fn,ctx)
        }
        return this
    }
    appendAt(dom:HTMLElement|string){
        if(_.isString(dom)){
            let domElement:any=d3.select(dom).node()
            domElement.appendChild(this.el)
        }else{
            dom.appendChild(this.el)
        }
        this.fire("render")
    }
}