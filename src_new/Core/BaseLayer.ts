import d3 =require("d3")
import _ = require('lodash');
import {BaseChart} from "./BaseChart"
import {Util} from './Util'
import {View,IViewConfig} from"./View"
export class BaseLayer extends View{
    constructor(id?,conf?){
        super(conf)
        this.id= id==undefined?_.uniqueId("layer"):id
        this.updateStyle()
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
                    zindex:0,
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
        this.render()
        return this
    }
    setStyle(s) {
        this.config.style = _.extend(this.config.style,s)
        this.updateStyle()
    }
    evaluateStyle():ILayerStyle {
        return {
            top:Util.toPixel(this.config.style.top)+"px",
            left:Util.toPixel(this.config.style.left)+"px",
            bottom:Util.toPixel(this.config.style.bottom)+"px",
            right:Util.toPixel(this.config.style.right)+"px",
            width:Util.toPixel(this.config.style.width)+"px",
            height:Util.toPixel(this.config.style.height)+"px",
            zindex:this.config.style.zindex,
            position:this.config.style.position
        }
    }
    updateStyle() {
        let s = this.evaluateStyle()
        s["z-index"] = s.zindex
        this.style(s)
    }
    addTo(c:BaseChart){
        c.addLayer(this)
        return this
    }
    _onAdd(c:BaseChart){
        this.chart=c
        this.chart.whenReady(this.renderAtMap,this)
        this.fire("addToChart",{map:c})
    }
    render(){
        this.el.innerHTML=""
        return this
    }
    renderAtMap(dom:Element|HTMLElement|SVGAElement){
       this.chart.getLayerContainer().append(this.el)
       this.render()
    }
    clear(){
        this.el.remove()
        this.el=null;
        super.off("*")
    }
    getNode() {
        return this.el
    }
    update(){
        this.updateStyle()
        this.render()
    }
}

export interface ILayerConfig extends IViewConfig{
        className?:string,
        tagName?:string,
        style?:ILayerStyle   
}

export interface ILayerStyle {
    top?:string|undefined|null,
    right?:string|undefined|null,	
    bottom?:string|undefined|null,
    left?:string|undefined|null,	
    width?:string,
    height?:string,
    zindex?:number,
    position?:string	              
}