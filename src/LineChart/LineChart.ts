import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import{TitleLayer}from "TitleLayer"
import{LineLayer} from"LineLayer"
export class LineChart extends BaseChart{
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer("title",{value:"hehe"})
        this.lineLayer=new LineLayer()
        this.addLayer(this.mainTitle)
        this.addLayer(this.lineLayer)
        this.init()
    }
    init(){
        this.mainTitle.setStyle({width:this.style.width,height:"30px"})
        this.lineLayer.setStyle({top:"30px",width:this.style.width,height:"200px"})
    }
    mainTitle:TitleLayer
    lineLayer:LineLayer
}