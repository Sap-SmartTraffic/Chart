import d3 =require("d3")
import _ =require("underscore")
import {BaseChart} from "./BaseChart"
import Util=require("./Util")
import {View} from"./View"
export class BaseLayer extends View{
    constructor(conf?){
        super(_.extend({tagName:"svg",className:"layer"},conf))
        this.config=Util.deepExtend(this.config,{
            width:300,
            height:300,
            position:{
            top:"0px",
            left:"0px",
            position:"absolute",
            width:"300px",
            height:"300px",
            "z-index":0
        }},conf)
        this.style(this.config.position)
        this.id=conf&&conf.id!=undefined? conf.id:_.uniqueId("layer")
    }
    id:string
    rendered:boolean=false
    chart:BaseChart
    
    config:ILayerConfig
    setConfig(c){
        this.config=Util.deepExtend(this.config,c)
        this.style(this.config.position)
        return this
    }
    setPosition(s){
        this.config.position=Util.deepExtend(this.config.position,s)
        this.style(this.config.position)
        return this
    }
    addTo(c:BaseChart){
        this.chart=c
        this.chart.addLayer(this)
        return this
    }
    render(){
        this.el.innerHTML=""
        return this
    }
    renderAt(dom:Element|HTMLElement|SVGAElement){
       dom.appendChild(this.el)
       this.render()
    }
    clear(){
        this.el.remove()
        this.el=null;
        super.clear();
    }

}
export interface ILayerConfig{
        className:string,
        tagName:string,
        position:{
            top:string|undefined|null,
            right:string|undefined|null,
            bottom:string|undefined|null,
            left:string|undefined|null,
            width:string,
            height:string,
            zIndex:number,
            position:string
        },
        height:number
        width:number
}