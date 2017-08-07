import d3 = require("d3")
import _ = require("lodash")
import { Util } from "./Util";
import { BaseChart } from "./BaseChart";
import { View, IViewConfig, IViewConfigValue } from "./View";
type measure = {
    id: string | number,
    data: any,
    name?: string | number
}
type baseLayerConfig = {
    id: string | number
    width: number | Function | string,
    height: number | Function | string,
    top: number | Function | string,
    bottom: number | Function | string,
    left: number | Function | string,
    right: number | Function | string,
    tagName: string
    //xScale:d3.ScaleContinuousNumeric<Number,Number>|Function
    //yScale:d3.ScaleContinuousNumeric<Number,Number>|Function
    // xDomainMin:number|Function|string,
    // xDomainMax:number|Function|string,
    // yDomainMin:number|Function|string,
    // yDomainMax:number|Function|string,
    // y2DomainMin:number|Function|string,
    // y2DomainMax:number|Function|string,
    // zoomX:number|Function|string,
    // zoomY:number|Function|string,
    // transformX:number|Function|string,
    // transformY:number|Function|string,

}
export type EvaluableValueString=(c:BaseChart,l:BaseLayer)=>string
export type EvaluableValueNumber=(c:BaseChart,l:BaseLayer)=>number
export interface IBaseLayerConfig extends IViewConfig {
    width?: number | EvaluableValueNumber | string,
    height?: number | EvaluableValueNumber | string,
    top?: number | EvaluableValueNumber | string,
    bottom?: number | EvaluableValueNumber | string,
    left?: number | EvaluableValueNumber | string,
    right?: number | EvaluableValueNumber | string,
}
export interface IBaseLayerConfigValue extends IViewConfigValue{
    width?: number 
    height?: number 
    top?: number 
    bottom?: number
    left?: number 
    right?: number 
}
export class BaseLayer extends View {
    constructor(conf?:IBaseLayerConfig) {
        super(conf)
    }
    updateStyle(){
        let styleObj=_.chain(this.config).pick("width","height","top","bottom","left","right").mapValues((v)=>{
            if(v!=null&&v!=undefined){
                return v+"px"
            }else{
                return undefined
            }
        }).value()
        this.style(styleObj)
    }
    defaultConfig():IBaseLayerConfigValue{
        return _.extend(super.defaultConfig(),{
            width:200,height:200,top:0,bottom:null,left:0,right:null
        })
    }
    config:IBaseLayerConfigValue
    chart: BaseChart
    addTo(c: BaseChart) {
        this.chart = c
        c.addLayer(this)
    }
    onAddToChart(c:BaseChart) {
        c.whenReady(()=>{
            this.config=Util.evaluteObj(this.config,this.chart,this)
            this.updateStyle()
            c.el.appendChild(this.el)
            this.render()
        })
    }
    render() {
        return this
    }
}

