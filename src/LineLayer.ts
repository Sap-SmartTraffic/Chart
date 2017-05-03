import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
export class LineLayer extends BaseLayer{
    constructor(conf?){
        super(conf)
    }
    config:{
        className:string
    }
    init(){
        
    }
    renderer(){
       let conf=this.chart.config
       let fragment=document.createDocumentFragment()
       let svg=d3.select(fragment).append("svg").classed(this.config.className,()=>!!this.config.className)
       svg.append("svg:g")
       return
    }
}