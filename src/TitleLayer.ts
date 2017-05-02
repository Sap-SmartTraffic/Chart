import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {Chart} from "Chart"
import {BaseLayer} from "BaseLayer"
export class TitleLayer extends BaseLayer{
    renderer(){
        let conf=this.chart.config
        let fragment=document.createDocumentFragment()
       return  d3.select(fragment).append("xhtml:p").text("haha").node()
      
    }
}