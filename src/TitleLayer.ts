import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseLayer} from "BaseLayer"
export class TitleLayer extends BaseLayer{
    constructor(id?,conf?){
        super(id,conf)
        this.setConfig(conf)
    }
    config:{
        value: string,
        className: string,
        textAlign: string
    }
    renderer(){
       let conf=this.chart.config
       let fragment=document.createDocumentFragment()
       return  d3.select(fragment).append("xhtml:p").text(this.config.value).classed(this.config.className,()=>!!this.config.className).style("text-align",this.config.textAlign).node()
    }
    updateDom(){
        d3.select(this.el).text(this.config.value).classed(this.config.className,()=>!!this.config.className)
    }
    getTitleRect(){
        return this.chart.getStringRect(this.config.value,this.config.className)
    }

}