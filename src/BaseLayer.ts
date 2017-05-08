import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"

export class BaseLayer extends Evented{
    constructor(id?,conf?){
        super()
        this.id=id||_.uniqueId("layer")
        this.setConfig(conf)
    }
    addTo(c:BaseChart){
        this.chart=c
        this.chart.addLayer(this)
        this.chart.on("calculateStyleDone",this.updateStyle.bind(this))
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
        left:string,right:string,top:string,bottom:string,width:string,height:string,zIndex:string
    }
    setStyle(s){
        this.style=s
        return this
    }
    config:{
        
    }

    updateStyle(){
        let el=d3.select(this.el).style("position","absolute")
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
        d3.select(this.chart.getContainer()).node().appendChild(this.el)
        return this
    }
    chart:BaseChart
    renderer(){
        
    }
}