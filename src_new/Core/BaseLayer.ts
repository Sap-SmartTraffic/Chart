import d3 =require("d3")
import _ =require("underscore")
import {BaseChart} from "./BaseChart"
import {Util} from './Util'
import {View,IViewConfig} from"./View"
export class BaseLayer extends View{
    constructor(id?,...confs){
        super(confs)
        this.id= id==undefined?_.uniqueId("layer"):id
    }
    defaultConfig():ILayerConfig{
        return {
                tagName:"svg",
                className:"layer",
                style:{
                    top:"0px",
                    left:"0px",
                    bottom:null,
                    right:null,
                    position:"absolute",
                    "z-index":0,
                    width:"300px",
                    height:"300px",
                    }
            }
    }
    id:string
    rendered:boolean=false
    chart:BaseChart
    config:ILayerConfig
    setConfig(c){
        this.config=Util.deepExtend(this.config,c)
        this.style(this.config.style)
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
export interface ILayerConfig extends IViewConfig{
        className:string,
        tagName:string,
        style:{
            top:string|undefined|null,
            right:string|undefined|null,
            bottom:string|undefined|null,
            left:string|undefined|null,
            width:string,
            height:string,
            "z-index":number,
            position:string
        }
       
}