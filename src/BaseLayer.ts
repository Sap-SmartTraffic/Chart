import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
export class BaseLayer extends Evented{
    constructor(conf?){
        super()
        this.setConfig(conf)
    }
    addTo(c:BaseChart){
        this.chart=c
        this.chart.addLayer(this)
        return this
    }
    setConfig(c){
        if(!this.config){
            this.config={}
        }
        _.each(c,(v,k)=>{
            this.config[k]=v
        })
    }
    el:any
    id:string
    style:{
        left:number,right:number,top:number,bottom:number,width:number,height:number,zIndex:number
    }
    setStyle(s){
        this.style=s
    }
    config:{
        
    }
    calculateStyle(){
        return this
    }
    updateStyle(){
        let el=d3.select(this.el).style("position","relative")
        if(this.style){
            _.each(this.style,(v,k)=>{
                el.style(k,v)
            })

        }
    }
    render(){
        if(this.el){
            this.el.parentNode.removeChild(this.el)
        }
        this.el=this.renderer()
        this.calculateStyle().updateStyle()
        d3.select(this.chart.getContainer()).node().appendChild(this.el)
        return this
    }
    chart:BaseChart
    renderer(){
        
    }
}