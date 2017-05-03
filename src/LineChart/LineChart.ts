import d3 =require("d3")
import _ =require("underscore")
import {Evented} from "Evented"
import {BaseChart} from "BaseChart"
import{TitleLayer}from "TitleLayer"
export class LineChart extends BaseChart{
    constructor(conf?){
        super(conf)
        this.mainTitle=new TitleLayer({value:"hehe"})
        this.addLayer(this.mainTitle)
        this.init()
    }
    init(){
        this.mainTitle.setStyle({width:this.config.width,height:"30px"})
    }
    mainTitle:TitleLayer
}