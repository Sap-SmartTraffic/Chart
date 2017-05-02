import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {Chart} from "Chart"
export class BaseLayer extends Evented{
    constructor(){
        super()
    }
    addTo(c:Chart){
        this.chart=c
        this.chart.addLayer(this)
        return this
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
    updateStyle(){
        let el=d3.select(this.el).style("position","relative")
        if(this.style){
             el.style("left",this.style.left)
              el.style("right",this.style.right)
               el.style("bottom",this.style.bottom)
                el.style("top",this.style.top)
                 el.style("width",this.style.width)
                  el.style("height",this.style.height)
        }
    }
    render(){
        if(this.el){
            this.el.parentNode.removeChild(this.el)
        }
        this.el=this.renderer()
        this.updateStyle()
        d3.select(this.chart.getContainer()).node().appendChild(this.el)
        return this
    }
    chart:Chart
    renderer(){
        
    }
}