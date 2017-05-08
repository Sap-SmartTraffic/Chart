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
        value:string,
        className:string
    }
    init(){
        
    }
    renderer(){
       let conf=this.chart.config
       let fragment=document.createDocumentFragment()
       return  d3.select(fragment).append("xhtml:p").text(this.config.value).classed(this.config.className,true).node()
    }

}